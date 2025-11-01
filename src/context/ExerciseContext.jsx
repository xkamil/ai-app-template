import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const ExerciseContext = createContext();

export const useExercise = () => {
  const context = useContext(ExerciseContext);
  if (!context) {
    throw new Error('useExercise must be used within ExerciseProvider');
  }
  return context;
};

export const ExerciseProvider = ({ children }) => {
  const { user } = useAuth();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch exercises
  const fetchExercises = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .order('name');

      if (error) throw error;
      setExercises(data || []);
    } catch (err) {
      console.error('Error fetching exercises:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add new exercise
  const addExercise = async (exerciseData) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('exercises')
        .insert([{
          user_id: user.id,
          name: exerciseData.name,
          description: exerciseData.description || null
        }])
        .select('*');

      if (error) throw error;

      // Add to local state
      setExercises(prev => [...prev, data[0]].sort((a, b) => a.name.localeCompare(b.name)));

      return { data: data[0], error: null };
    } catch (err) {
      console.error('Error adding exercise:', err);
      return { error: err.message };
    }
  };

  // Update exercise
  const updateExercise = async (id, exerciseData) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('exercises')
        .update({
          name: exerciseData.name,
          description: exerciseData.description || null
        })
        .eq('id', id)
        .select('*');

      if (error) throw error;

      // Update local state
      setExercises(prev =>
        prev.map(ex => ex.id === id ? data[0] : ex).sort((a, b) => a.name.localeCompare(b.name))
      );

      return { data: data[0], error: null };
    } catch (err) {
      console.error('Error updating exercise:', err);
      return { error: err.message };
    }
  };

  // Delete exercise
  const deleteExercise = async (id) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { error } = await supabase
        .from('exercises')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Remove from local state
      setExercises(prev => prev.filter(ex => ex.id !== id));

      return { error: null };
    } catch (err) {
      console.error('Error deleting exercise:', err);
      return { error: err.message };
    }
  };

  // Clone exercise
  const cloneExercise = async (exercise) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('exercises')
        .insert([{
          user_id: user.id,
          name: `${exercise.name} (kopia)`,
          description: exercise.description || null
        }])
        .select('*');

      if (error) throw error;

      // Add to local state
      setExercises(prev => [...prev, data[0]].sort((a, b) => a.name.localeCompare(b.name)));

      return { data: data[0], error: null };
    } catch (err) {
      console.error('Error cloning exercise:', err);
      return { error: err.message };
    }
  };

  // Fetch data when user changes
  useEffect(() => {
    if (user) {
      fetchExercises();
    } else {
      setExercises([]);
    }
  }, [user]);

  const value = {
    exercises,
    loading,
    error,
    addExercise,
    updateExercise,
    deleteExercise,
    cloneExercise,
    refetchExercises: fetchExercises
  };

  return (
    <ExerciseContext.Provider value={value}>
      {children}
    </ExerciseContext.Provider>
  );
};
