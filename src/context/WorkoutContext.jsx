import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { loadOngoingWorkout, clearOngoingWorkout } from '../lib/workoutStorage';

const WorkoutContext = createContext();

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within WorkoutProvider');
  }
  return context;
};

export const WorkoutProvider = ({ children }) => {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeWorkout, setActiveWorkout] = useState(null);

  // Fetch workouts with exercises and sets
  const fetchWorkouts = async (limit = 20) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('workouts')
        .select(`
          *,
          workout_plan:workout_plans(id, name, color),
          workout_exercises(
            id,
            order_index,
            notes,
            exercise:exercises(id, name),
            exercise_sets(
              id,
              set_number,
              reps,
              weight_kg,
              duration_seconds,
              notes
            )
          )
        `)
        .order('workout_date', { ascending: false })
        .limit(limit);

      if (error) throw error;

      // Sort exercise_sets by set_number within each exercise
      const workoutsWithSortedSets = data.map(workout => ({
        ...workout,
        workout_exercises: workout.workout_exercises.map(we => ({
          ...we,
          exercise_sets: we.exercise_sets.sort((a, b) => a.set_number - b.set_number)
        }))
      }));

      setWorkouts(workoutsWithSortedSets || []);
    } catch (err) {
      console.error('Error fetching workouts:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete workout
  const deleteWorkout = async (id) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { error } = await supabase
        .from('workouts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Remove from local state
      setWorkouts(prev => prev.filter(w => w.id !== id));

      return { error: null };
    } catch (err) {
      console.error('Error deleting workout:', err);
      return { error: err.message };
    }
  };

  // Create new workout
  const createWorkout = async (workoutPayload) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      // 1. Create the workout
      const { data: workoutData, error: workoutError } = await supabase
        .from('workouts')
        .insert([{
          user_id: user.id,
          workout_plan_id: workoutPayload.workout_plan_id || null,
          name: workoutPayload.name,
          workout_date: workoutPayload.workout_date,
          notes: workoutPayload.notes
        }])
        .select()
        .single();

      if (workoutError) throw workoutError;

      // 2. Create workout_exercises with their sets
      for (const exercise of workoutPayload.exercises) {
        // Insert workout_exercise
        const { data: workoutExercise, error: exerciseError } = await supabase
          .from('workout_exercises')
          .insert([{
            workout_id: workoutData.id,
            exercise_id: exercise.exercise_id,
            order_index: exercise.order_index,
            notes: exercise.notes
          }])
          .select()
          .single();

        if (exerciseError) throw exerciseError;

        // Insert exercise_sets
        if (exercise.sets && exercise.sets.length > 0) {
          const setsToInsert = exercise.sets.map(set => ({
            workout_exercise_id: workoutExercise.id,
            set_number: set.set_number,
            reps: set.reps,
            weight_kg: set.weight_kg,
            duration_seconds: set.duration_seconds,
            notes: set.notes
          }));

          const { error: setsError } = await supabase
            .from('exercise_sets')
            .insert(setsToInsert);

          if (setsError) throw setsError;
        }
      }

      // 3. Refresh workouts list
      await fetchWorkouts();

      return { data: workoutData, error: null };
    } catch (err) {
      console.error('Error creating workout:', err);
      return { error: err.message };
    }
  };

  // Get Personal Records (PRs)
  const getPersonalRecords = () => {
    const prsMap = {};

    workouts.forEach(workout => {
      workout.workout_exercises?.forEach(we => {
        const exerciseId = we.exercise?.id;
        const exerciseName = we.exercise?.name;

        if (!exerciseId || !exerciseName) return;

        we.exercise_sets?.forEach(set => {
          if (!set.weight_kg || !set.reps) return;

          const weight = parseFloat(set.weight_kg);
          const reps = parseInt(set.reps);

          // Calculate estimated 1RM using Epley formula
          const calculated_max = weight * (1 + reps / 30);

          if (!prsMap[exerciseId] || calculated_max > prsMap[exerciseId].calculated_max) {
            prsMap[exerciseId] = {
              exercise_id: exerciseId,
              exercise_name: exerciseName,
              weight_kg: weight,
              reps: reps,
              calculated_max: calculated_max,
              workout_date: workout.workout_date,
              workout_id: workout.id
            };
          }
        });
      });
    });

    return Object.values(prsMap).sort((a, b) => b.calculated_max - a.calculated_max);
  };

  // Get week summary
  const getWeekSummary = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    const thisWeekWorkouts = workouts.filter(workout => {
      const workoutDate = new Date(workout.workout_date);
      return workoutDate >= startOfWeek;
    });

    const totalMinutes = thisWeekWorkouts.reduce((sum, workout) => {
      if (!workout.workout_exercises || workout.workout_exercises.length === 0) return sum;

      // Calculate duration from created_at to updated_at or estimate from sets
      const start = new Date(workout.created_at);
      const end = new Date(workout.updated_at);
      const diffMinutes = Math.round((end - start) / 1000 / 60);

      // If difference is reasonable (between 5 and 180 minutes), use it
      if (diffMinutes >= 5 && diffMinutes <= 180) {
        return sum + diffMinutes;
      }

      // Otherwise estimate: 3 minutes per exercise
      return sum + (workout.workout_exercises.length * 3);
    }, 0);

    return {
      count: thisWeekWorkouts.length,
      totalHours: (totalMinutes / 60).toFixed(1),
      workouts: thisWeekWorkouts
    };
  };

  // Get month summary (last 30 days)
  const getMonthSummary = () => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const thisMonthWorkouts = workouts.filter(workout => {
      const workoutDate = new Date(workout.workout_date);
      return workoutDate >= thirtyDaysAgo;
    });

    const totalMinutes = thisMonthWorkouts.reduce((sum, workout) => {
      if (!workout.workout_exercises || workout.workout_exercises.length === 0) return sum;

      // Calculate duration from created_at to updated_at or estimate from sets
      const start = new Date(workout.created_at);
      const end = new Date(workout.updated_at);
      const diffMinutes = Math.round((end - start) / 1000 / 60);

      // If difference is reasonable (between 5 and 180 minutes), use it
      if (diffMinutes >= 5 && diffMinutes <= 180) {
        return sum + diffMinutes;
      }

      // Otherwise estimate: 3 minutes per exercise
      return sum + (workout.workout_exercises.length * 3);
    }, 0);

    // Calculate total volume (weight × reps)
    const totalVolume = thisMonthWorkouts.reduce((sum, workout) => {
      if (!workout.workout_exercises) return sum;

      const workoutVolume = workout.workout_exercises.reduce((exerciseSum, we) => {
        if (!we.workout_sets) return exerciseSum;

        const setsVolume = we.workout_sets.reduce((setSum, set) => {
          const weight = parseFloat(set.weight_kg) || 0;
          const reps = parseInt(set.reps) || 0;
          return setSum + (weight * reps);
        }, 0);

        return exerciseSum + setsVolume;
      }, 0);

      return sum + workoutVolume;
    }, 0);

    return {
      count: thisMonthWorkouts.length,
      totalHours: (totalMinutes / 60).toFixed(1),
      totalVolume: Math.round(totalVolume),
      workouts: thisMonthWorkouts
    };
  };

  // Load active workout from localStorage on mount
  useEffect(() => {
    const ongoing = loadOngoingWorkout();
    setActiveWorkout(ongoing);
  }, []);

  // Fetch data when user changes
  useEffect(() => {
    if (user) {
      fetchWorkouts();
    } else {
      setWorkouts([]);
    }
  }, [user]);

  // Functions to manage active workout
  const loadActiveWorkout = () => {
    const ongoing = loadOngoingWorkout();
    setActiveWorkout(ongoing);
    return ongoing;
  };

  const clearActiveWorkout = () => {
    clearOngoingWorkout();
    setActiveWorkout(null);
  };

  const value = {
    workouts,
    loading,
    error,
    activeWorkout,
    createWorkout,
    deleteWorkout,
    getPersonalRecords,
    getWeekSummary,
    getMonthSummary,
    refetchWorkouts: fetchWorkouts,
    loadActiveWorkout,
    clearActiveWorkout
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
};
