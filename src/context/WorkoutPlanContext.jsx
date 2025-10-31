import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { useWorkout } from './WorkoutContext';

const WorkoutPlanContext = createContext();

export const useWorkoutPlan = () => {
  const context = useContext(WorkoutPlanContext);
  if (!context) {
    throw new Error('useWorkoutPlan must be used within WorkoutPlanProvider');
  }
  return context;
};

export const WorkoutPlanProvider = ({ children }) => {
  const { user } = useAuth();
  const { getPersonalRecords } = useWorkout();
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch workout plans with exercises
  const fetchWorkoutPlans = async () => {
    if (!user) {
      console.log('WorkoutPlanContext: No user found, skipping fetch');
      return;
    }

    console.log('WorkoutPlanContext: Fetching workout plans for user:', user.id, user.email);
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('workout_plans')
        .select(`
          *,
          workout_plan_exercises(
            id,
            exercise_id,
            order_index,
            suggested_sets,
            notes,
            exercise:exercises(id, name, description)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      console.log('WorkoutPlanContext: Query result:', { data, error });

      if (error) throw error;

      // Sort exercises by order_index within each plan
      const plansWithSortedExercises = data.map(plan => ({
        ...plan,
        workout_plan_exercises: plan.workout_plan_exercises.sort((a, b) => a.order_index - b.order_index)
      }));

      console.log('WorkoutPlanContext: Setting workout plans:', plansWithSortedExercises);
      setWorkoutPlans(plansWithSortedExercises || []);
    } catch (err) {
      console.error('Error fetching workout plans:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create new workout plan
  const createWorkoutPlan = async (planData) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      // 1. Create the workout plan
      const { data: planRecord, error: planError } = await supabase
        .from('workout_plans')
        .insert([{
          user_id: user.id,
          name: planData.name,
          color: planData.color || '#FF6B35',
          description: planData.description || null
        }])
        .select()
        .single();

      if (planError) throw planError;

      // 2. Add exercises to the plan
      if (planData.exercises && planData.exercises.length > 0) {
        const exercisesToInsert = planData.exercises.map((exercise, index) => ({
          workout_plan_id: planRecord.id,
          exercise_id: exercise.exercise_id,
          order_index: exercise.order_index !== undefined ? exercise.order_index : index,
          suggested_sets: exercise.suggested_sets || 3,
          notes: exercise.notes || null
        }));

        const { error: exercisesError } = await supabase
          .from('workout_plan_exercises')
          .insert(exercisesToInsert);

        if (exercisesError) throw exercisesError;
      }

      // 3. Refresh workout plans list
      await fetchWorkoutPlans();

      return { data: planRecord, error: null };
    } catch (err) {
      console.error('Error creating workout plan:', err);
      return { error: err.message };
    }
  };

  // Update workout plan
  const updateWorkoutPlan = async (planId, planData) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      // 1. Update the plan metadata
      const { error: planError } = await supabase
        .from('workout_plans')
        .update({
          name: planData.name,
          color: planData.color,
          description: planData.description || null
        })
        .eq('id', planId);

      if (planError) throw planError;

      // 2. Update exercises if provided
      if (planData.exercises !== undefined) {
        // Delete existing exercises
        const { error: deleteError } = await supabase
          .from('workout_plan_exercises')
          .delete()
          .eq('workout_plan_id', planId);

        if (deleteError) throw deleteError;

        // Insert new exercises
        if (planData.exercises.length > 0) {
          const exercisesToInsert = planData.exercises.map((exercise, index) => ({
            workout_plan_id: planId,
            exercise_id: exercise.exercise_id,
            order_index: exercise.order_index !== undefined ? exercise.order_index : index,
            suggested_sets: exercise.suggested_sets || 3,
            notes: exercise.notes || null
          }));

          const { error: insertError } = await supabase
            .from('workout_plan_exercises')
            .insert(exercisesToInsert);

          if (insertError) throw insertError;
        }
      }

      // 3. Refresh workout plans list
      await fetchWorkoutPlans();

      return { error: null };
    } catch (err) {
      console.error('Error updating workout plan:', err);
      return { error: err.message };
    }
  };

  // Delete workout plan
  const deleteWorkoutPlan = async (planId) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { error } = await supabase
        .from('workout_plans')
        .delete()
        .eq('id', planId);

      if (error) throw error;

      // Remove from local state
      setWorkoutPlans(prev => prev.filter(p => p.id !== planId));

      return { error: null };
    } catch (err) {
      console.error('Error deleting workout plan:', err);
      return { error: err.message };
    }
  };

  // Clone workout plan
  const clonePlan = async (plan) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      // 1. Create the cloned workout plan with modified name
      const { data: clonedPlan, error: planError } = await supabase
        .from('workout_plans')
        .insert([{
          user_id: user.id,
          name: `${plan.name} (kopia)`,
          color: plan.color || '#FF6B35',
          description: plan.description || null
        }])
        .select()
        .single();

      if (planError) throw planError;

      // 2. Clone all exercises from the original plan
      if (plan.workout_plan_exercises && plan.workout_plan_exercises.length > 0) {
        const exercisesToInsert = plan.workout_plan_exercises.map(pe => ({
          workout_plan_id: clonedPlan.id,
          exercise_id: pe.exercise_id,
          order_index: pe.order_index,
          suggested_sets: pe.suggested_sets || 3,
          notes: pe.notes || null
        }));

        const { error: exercisesError } = await supabase
          .from('workout_plan_exercises')
          .insert(exercisesToInsert);

        if (exercisesError) throw exercisesError;
      }

      // 3. Refresh workout plans list
      await fetchWorkoutPlans();

      return { data: clonedPlan, error: null };
    } catch (err) {
      console.error('Error cloning workout plan:', err);
      return { error: err.message };
    }
  };

  // Get suggested sets for an exercise based on PRs
  const getSuggestedSetsForExercise = (exerciseId, suggestedSetCount = 3) => {
    const personalRecords = getPersonalRecords();
    const exercisePR = personalRecords.find(pr => pr.exercise_id === exerciseId);

    if (!exercisePR) {
      // No PR found, return default empty sets
      return Array.from({ length: suggestedSetCount }, (_, i) => ({
        set_number: i + 1,
        reps: null,
        weight_kg: null,
        duration_seconds: null,
        notes: ''
      }));
    }

    // Generate sets based on PR with progressive overload pattern
    // Set 1: 90% of PR weight at PR reps
    // Set 2: 95% of PR weight at PR reps
    // Set 3: 100% of PR weight at PR reps
    // Additional sets: repeat 100%
    const prWeight = parseFloat(exercisePR.weight_kg);
    const prReps = parseInt(exercisePR.reps);

    return Array.from({ length: suggestedSetCount }, (_, i) => {
      let weight = prWeight;

      if (i === 0) {
        weight = prWeight * 0.90; // Warmup set
      } else if (i === 1) {
        weight = prWeight * 0.95; // Working set
      }
      // else: working set at 100%

      return {
        set_number: i + 1,
        reps: prReps,
        weight_kg: Math.round(weight * 10) / 10, // Round to 1 decimal
        duration_seconds: null,
        notes: ''
      };
    });
  };

  // Fetch data when user changes
  useEffect(() => {
    if (user) {
      fetchWorkoutPlans();
    } else {
      setWorkoutPlans([]);
    }
  }, [user]);

  const value = {
    workoutPlans,
    loading,
    error,
    createWorkoutPlan,
    updateWorkoutPlan,
    deleteWorkoutPlan,
    clonePlan,
    getSuggestedSetsForExercise,
    refetchWorkoutPlans: fetchWorkoutPlans
  };

  return (
    <WorkoutPlanContext.Provider value={value}>
      {children}
    </WorkoutPlanContext.Provider>
  );
};
