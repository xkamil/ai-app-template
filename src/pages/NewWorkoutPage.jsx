import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useWorkout } from '../context/WorkoutContext';
import ExerciseSelectionStep from '../components/ExerciseSelectionStep';
import LogSetsStep from '../components/LogSetsStep';
import WorkoutSummaryStep from '../components/WorkoutSummaryStep';

const NewWorkoutPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { createWorkout } = useWorkout();

  const [step, setStep] = useState(1); // 1: Select Exercises, 2: Log Sets, 3: Summary
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [workoutData, setWorkoutData] = useState({
    name: '',
    notes: '',
    exercises: {} // { exerciseId: { exercise, notes, sets: [] } }
  });
  const [saving, setSaving] = useState(false);

  const handleToggleExercise = (exercise) => {
    setSelectedExercises(prev => {
      const exists = prev.some(ex => ex.id === exercise.id);
      if (exists) {
        // Remove exercise
        const updated = prev.filter(ex => ex.id !== exercise.id);
        // Also remove from workoutData
        const newExercises = { ...workoutData.exercises };
        delete newExercises[exercise.id];
        setWorkoutData({ ...workoutData, exercises: newExercises });
        return updated;
      } else {
        // Add exercise
        return [...prev, exercise];
      }
    });
  };

  const handleNextToLogSets = () => {
    // Initialize sets for selected exercises if not already done
    const newExercises = { ...workoutData.exercises };
    selectedExercises.forEach(exercise => {
      if (!newExercises[exercise.id]) {
        newExercises[exercise.id] = {
          exercise,
          notes: '',
          sets: [{ reps: '', weight_kg: '', duration_seconds: '', notes: '' }]
        };
      }
    });
    setWorkoutData({ ...workoutData, exercises: newExercises });
    setStep(2);
  };

  const handleBackToSelection = () => {
    setStep(1);
  };

  const handleFinishLogging = () => {
    setStep(3);
  };

  const handleSaveWorkout = async () => {
    setSaving(true);

    try {
      // Prepare workout data for API
      const workoutPayload = {
        name: workoutData.name || null,
        notes: workoutData.notes || null,
        workout_date: new Date().toISOString(),
        exercises: selectedExercises.map((exercise, index) => {
          const exerciseData = workoutData.exercises[exercise.id];
          return {
            exercise_id: exercise.id,
            order_index: index,
            notes: exerciseData.notes || null,
            sets: exerciseData.sets
              .filter(set => set.reps || set.weight_kg || set.duration_seconds) // Filter empty sets
              .map((set, setIndex) => ({
                set_number: setIndex + 1,
                reps: set.reps ? parseInt(set.reps) : null,
                weight_kg: set.weight_kg ? parseFloat(set.weight_kg) : null,
                duration_seconds: set.duration_seconds ? parseInt(set.duration_seconds) : null,
                notes: set.notes || null
              }))
          };
        })
      };

      const result = await createWorkout(workoutPayload);

      if (result.error) {
        alert(result.error);
        setSaving(false);
      } else {
        // Success! Navigate to workouts list
        navigate('/workouts');
      }
    } catch (error) {
      console.error('Error saving workout:', error);
      alert('Error saving workout');
      setSaving(false);
    }
  };

  return (
    <div className="page-container" style={{ padding: 0 }}>
      {step === 1 && (
        <ExerciseSelectionStep
          selectedExercises={selectedExercises}
          onToggleExercise={handleToggleExercise}
          onNext={handleNextToLogSets}
        />
      )}

      {step === 2 && (
        <LogSetsStep
          selectedExercises={selectedExercises}
          workoutData={workoutData}
          onUpdateWorkoutData={setWorkoutData}
          onBack={handleBackToSelection}
          onFinish={handleFinishLogging}
        />
      )}

      {step === 3 && (
        <WorkoutSummaryStep
          workoutData={workoutData}
          selectedExercises={selectedExercises}
          onSave={handleSaveWorkout}
          saving={saving}
        />
      )}
    </div>
  );
};

export default NewWorkoutPage;
