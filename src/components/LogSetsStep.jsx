import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useWorkout } from '../context/WorkoutContext';
import ConfirmModal from './ConfirmModal';

const LogSetsStep = ({ selectedExercises, workoutData, onUpdateWorkoutData, onBack, onFinish, onCancel, planName, currentExerciseIndex, onExerciseIndexChange, exerciseStatus, onExerciseStatusChange }) => {
  const { t } = useLanguage();
  const { getLastWorkoutForExercise, getPersonalRecords } = useWorkout();
  const exerciseNavRef = useRef(null);
  const exerciseButtonRefs = useRef([]);

  // Modal states
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [unfinishedExercisesCount, setUnfinishedExercisesCount] = useState(0);

  const currentExercise = selectedExercises[currentExerciseIndex];
  const exerciseSets = workoutData.exercises[currentExercise.id]?.sets || [{ reps: '', weight_kg: '', duration_seconds: '', notes: '' }];
  const currentStatus = exerciseStatus[currentExercise.id];

  // Calculate best set for current exercise
  const getBestSetForExercise = (exerciseId) => {
    const allPRs = getPersonalRecords();
    const exercisePRs = allPRs.filter(pr => pr.exercise_id === exerciseId);

    if (exercisePRs.length === 0) return null;

    // Find best set: reps × (weight || 1) × (duration || 1)
    let bestSet = null;
    let maxScore = 0;

    exercisePRs.forEach(pr => {
      const weight = pr.weight_kg || 1;
      const reps = pr.reps || 1;
      // For PRs, we don't have duration, so we'll need to look at workouts
      const score = reps * weight;

      if (score > maxScore) {
        maxScore = score;
        bestSet = pr;
      }
    });

    return bestSet;
  };

  const bestSet = getBestSetForExercise(currentExercise.id);

  // Auto-scroll to current exercise button when index changes
  useEffect(() => {
    if (exerciseButtonRefs.current[currentExerciseIndex] && exerciseNavRef.current) {
      const button = exerciseButtonRefs.current[currentExerciseIndex];
      const container = exerciseNavRef.current;

      // Scroll the button into view at the start of the container
      button.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start'
      });
    }
  }, [currentExerciseIndex]);

  const updateSet = (setIndex, field, value) => {
    const updatedSets = [...exerciseSets];
    updatedSets[setIndex] = { ...updatedSets[setIndex], [field]: value };

    // Force 0 for unused units
    if (!currentExercise.weight_units) {
      updatedSets[setIndex].weight_kg = 0;
    }
    if (!currentExercise.time_units) {
      updatedSets[setIndex].duration_seconds = 0;
    }

    onUpdateWorkoutData({
      ...workoutData,
      exercises: {
        ...workoutData.exercises,
        [currentExercise.id]: {
          exercise: currentExercise,
          notes: workoutData.exercises[currentExercise.id]?.notes || '',
          sets: updatedSets
        }
      }
    });
  };

  const addSet = () => {
    // Get the set number for the new set
    const newSetNumber = exerciseSets.length + 1;

    // Get last workout for this exercise (most recent, not best)
    const lastWorkout = getLastWorkoutForExercise(currentExercise.id);

    // Find the set with this set_number in the last workout
    const historicalSet = lastWorkout?.sets?.find(s => s.set_number === newSetNumber);

    // If this set number exists in last workout, use those values
    // Otherwise, use empty values
    const newSet = {
      reps: historicalSet?.reps ?? '',
      weight_kg: currentExercise.weight_units ? (historicalSet?.weight_kg ?? '') : 0,
      duration_seconds: currentExercise.time_units ? (historicalSet?.duration_seconds ?? '') : 0,
      notes: ''
    };

    onUpdateWorkoutData({
      ...workoutData,
      exercises: {
        ...workoutData.exercises,
        [currentExercise.id]: {
          exercise: currentExercise,
          notes: workoutData.exercises[currentExercise.id]?.notes || '',
          sets: [...exerciseSets, newSet]
        }
      }
    });
  };

  const removeSet = (setIndex) => {
    if (exerciseSets.length === 1) return; // Keep at least one set

    const updatedSets = exerciseSets.filter((_, index) => index !== setIndex);
    onUpdateWorkoutData({
      ...workoutData,
      exercises: {
        ...workoutData.exercises,
        [currentExercise.id]: {
          exercise: currentExercise,
          notes: workoutData.exercises[currentExercise.id]?.notes || '',
          sets: updatedSets
        }
      }
    });
  };

  const updateExerciseNotes = (notes) => {
    onUpdateWorkoutData({
      ...workoutData,
      exercises: {
        ...workoutData.exercises,
        [currentExercise.id]: {
          exercise: currentExercise,
          notes: notes,
          sets: exerciseSets
        }
      }
    });
  };

  const handleFinishExercise = () => {
    // Validate that all sets have at least 1 rep
    const hasInvalidSets = exerciseSets.some(set => {
      const reps = parseInt(set.reps) || 0;
      return reps < 1;
    });

    if (hasInvalidSets) {
      alert(t('newWorkout.step2.validationError') || 'Każda seria musi mieć co najmniej 1 powtórzenie');
      return;
    }

    // Mark exercise as completed (removes skipped status if present)
    onExerciseStatusChange({
      ...exerciseStatus,
      [currentExercise.id]: 'completed'
    });

    // Automatically go to next exercise
    if (currentExerciseIndex < selectedExercises.length - 1) {
      onExerciseIndexChange(currentExerciseIndex + 1);
    }
  };

  const handleSkipExercise = () => {
    // Mark exercise as skipped
    onExerciseStatusChange({
      ...exerciseStatus,
      [currentExercise.id]: 'skipped'
    });

    // Automatically go to next exercise
    if (currentExerciseIndex < selectedExercises.length - 1) {
      onExerciseIndexChange(currentExerciseIndex + 1);
    }
  };

  const handleResumeExercise = () => {
    // Remove completed or skipped status - exercise can be edited again
    const newStatus = { ...exerciseStatus };
    delete newStatus[currentExercise.id];
    onExerciseStatusChange(newStatus);
  };

  const handleCancelWorkout = () => {
    setShowCancelModal(true);
  };

  const confirmCancelWorkout = () => {
    setShowCancelModal(false);
    onCancel();
  };

  const handleFinishWorkout = () => {
    // Count completed and unfinished exercises
    const completedCount = selectedExercises.filter(ex => exerciseStatus[ex.id] === 'completed').length;
    const unfinishedCount = selectedExercises.filter(ex => !exerciseStatus[ex.id] || exerciseStatus[ex.id] === null).length;

    // If there are unfinished exercises, show confirmation
    if (unfinishedCount > 0) {
      setUnfinishedExercisesCount(unfinishedCount);
      setShowFinishModal(true);
      return;
    }

    // Proceed to finish (no unfinished exercises)
    onFinish();
  };

  const confirmFinishWorkout = () => {
    setShowFinishModal(false);

    // Auto-mark unfinished exercises as skipped
    const updatedStatus = { ...exerciseStatus };
    selectedExercises.forEach(exercise => {
      if (!updatedStatus[exercise.id] || updatedStatus[exercise.id] === null) {
        updatedStatus[exercise.id] = 'skipped';
      }
    });
    onExerciseStatusChange(updatedStatus);

    // Proceed to finish
    onFinish();
  };

  // Check if there's at least one completed exercise
  const hasCompletedExercises = selectedExercises.some(ex => exerciseStatus[ex.id] === 'completed');

  return (
    <div>
      {/* Header with Exercise Navigation */}
      <div style={{
        padding: 'var(--space-4)',
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <h2 style={{
          fontSize: 'var(--text-xl)',
          fontWeight: 'var(--font-bold)',
          color: 'var(--text-primary)',
          margin: '0 0 var(--space-3) 0',
          textAlign: 'center'
        }}>
          {planName}
        </h2>

        {/* Exercise Navigation */}
        {selectedExercises.length > 1 && (
          <div
            ref={exerciseNavRef}
            style={{
              display: 'flex',
              gap: 'var(--space-2)',
              overflowX: 'auto',
              paddingBottom: 'var(--space-2)',
              marginBottom: 'var(--space-3)',
              scrollBehavior: 'smooth'
            }}
          >
            {selectedExercises.map((exercise, index) => {
              const isCompleted = exerciseStatus[exercise.id] === 'completed';
              const isSkipped = exerciseStatus[exercise.id] === 'skipped';
              const isCurrent = index === currentExerciseIndex;

              return (
                <button
                  key={exercise.id}
                  ref={(el) => (exerciseButtonRefs.current[index] = el)}
                  onClick={() => onExerciseIndexChange(index)}
                  style={{
                    padding: 'var(--space-2) var(--space-3)',
                    background: isCompleted ? 'var(--success)' : isSkipped ? 'var(--text-tertiary)' : 'var(--bg-tertiary)',
                    border: isCurrent ? '2px solid var(--accent-primary)' : 'none',
                    borderRadius: 'var(--radius-md)',
                    color: isCompleted ? 'white' : isSkipped ? 'white' : 'var(--text-secondary)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-medium)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all var(--transition-fast)',
                    position: 'relative'
                  }}
                >
                  {index + 1}. {exercise.name}
                </button>
              );
            })}
          </div>
        )}

        {/* Progress Bar */}
        <div style={{
          display: 'flex',
          gap: '2px',
          height: '6px',
          borderRadius: 'var(--radius-sm)',
          overflow: 'hidden',
          background: 'var(--bg-tertiary)'
        }}>
          {selectedExercises.map((exercise, index) => {
            const isCompleted = exerciseStatus[exercise.id] === 'completed';
            const isSkipped = exerciseStatus[exercise.id] === 'skipped';

            return (
              <div
                key={exercise.id}
                style={{
                  flex: 1,
                  background: isCompleted ? 'var(--success)' : isSkipped ? 'var(--text-tertiary)' : 'var(--bg-tertiary)',
                  transition: 'background var(--transition-base)'
                }}
              />
            );
          })}
        </div>
      </div>

      <div style={{ padding: 'var(--space-4)', paddingBottom: '100px' }}>

        {/* Current Exercise */}
        <div className="dark-card" style={{ marginBottom: 'var(--space-4)' }}>
          <h3 style={{
            fontSize: 'var(--text-lg)',
            fontWeight: 'var(--font-bold)',
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-2)'
          }}>
            🏋️ {currentExercise.name}
          </h3>

          {/* Best Set Info */}
          {bestSet && (
            <div style={{
              marginBottom: 'var(--space-3)',
              fontSize: 'calc(var(--text-sm) * 1.2)',
              color: 'var(--text-secondary)'
            }}>
              🏆 Najlepsza seria w historii: {bestSet.reps}
              {currentExercise.weight_units && bestSet.weight_kg > 0 && ` × ${bestSet.weight_kg}kg`}
            </div>
          )}

          {/* Sets List */}
          {exerciseSets.map((set, setIndex) => (
            <div
              key={setIndex}
              className="dark-card"
              style={{
                background: 'var(--bg-tertiary)',
                marginBottom: 'var(--space-3)',
                padding: 'var(--space-3)'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--space-2)'
              }}>
                <span style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-semibold)',
                  color: 'var(--text-primary)'
                }}>
                  {t('newWorkout.step2.set').replace('{number}', setIndex + 1)}
                </span>
                {exerciseSets.length > 1 && currentStatus !== 'completed' && currentStatus !== 'skipped' && (
                  <button
                    onClick={() => removeSet(setIndex)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--danger)',
                      fontSize: 'var(--text-sm)',
                      cursor: 'pointer',
                      padding: '0'
                    }}
                  >
                    🗑️
                  </button>
                )}
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: currentExercise.weight_units && currentExercise.time_units
                  ? '1fr 1fr 1fr'
                  : currentExercise.weight_units || currentExercise.time_units
                    ? '1fr 1fr'
                    : '1fr',
                gap: 'var(--space-2)'
              }}>
                <div>
                  <label style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--text-tertiary)',
                    display: 'block',
                    marginBottom: 'var(--space-1)'
                  }}>
                    {t('newWorkout.step2.reps')}
                  </label>
                  <input
                    type="number"
                    className="dark-input"
                    placeholder="12"
                    value={set.reps}
                    onChange={(e) => updateSet(setIndex, 'reps', e.target.value)}
                    disabled={currentStatus === 'completed' || currentStatus === 'skipped'}
                    style={{
                      fontSize: 'calc(var(--text-base) * 1.2)',
                      padding: 'calc(var(--space-2) * 1.2)',
                      opacity: (currentStatus === 'completed' || currentStatus === 'skipped') ? 0.6 : 1,
                      cursor: (currentStatus === 'completed' || currentStatus === 'skipped') ? 'not-allowed' : 'text'
                    }}
                  />
                </div>

                {currentExercise.weight_units && (
                  <div>
                    <label style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--text-tertiary)',
                      display: 'block',
                      marginBottom: 'var(--space-1)'
                    }}>
                      {t('newWorkout.step2.weight')} (kg)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      className="dark-input"
                      placeholder="60"
                      value={set.weight_kg}
                      onChange={(e) => updateSet(setIndex, 'weight_kg', e.target.value)}
                      disabled={currentStatus === 'completed' || currentStatus === 'skipped'}
                      style={{
                        fontSize: 'calc(var(--text-base) * 1.2)',
                        padding: 'calc(var(--space-2) * 1.2)',
                        opacity: (currentStatus === 'completed' || currentStatus === 'skipped') ? 0.6 : 1,
                        cursor: (currentStatus === 'completed' || currentStatus === 'skipped') ? 'not-allowed' : 'text'
                      }}
                    />
                  </div>
                )}

                {currentExercise.time_units && (
                  <div>
                    <label style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--text-tertiary)',
                      display: 'block',
                      marginBottom: 'var(--space-1)'
                    }}>
                      {t('newWorkout.step2.duration')} (s)
                    </label>
                    <input
                      type="number"
                      className="dark-input"
                      placeholder="30"
                      value={set.duration_seconds}
                      onChange={(e) => updateSet(setIndex, 'duration_seconds', e.target.value)}
                      disabled={currentStatus === 'completed' || currentStatus === 'skipped'}
                      style={{
                        fontSize: 'calc(var(--text-base) * 1.2)',
                        padding: 'calc(var(--space-2) * 1.2)',
                        opacity: (currentStatus === 'completed' || currentStatus === 'skipped') ? 0.6 : 1,
                        cursor: (currentStatus === 'completed' || currentStatus === 'skipped') ? 'not-allowed' : 'text'
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Add Set Button */}
          {currentStatus !== 'completed' && currentStatus !== 'skipped' && (
            <button
              onClick={addSet}
              style={{
                width: '100%',
                padding: 'var(--space-3)',
                background: 'var(--bg-tertiary)',
                border: '1px dashed var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--accent-primary)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-semibold)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                marginBottom: 'var(--space-3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = 'var(--accent-primary)';
                e.target.style.background = 'rgba(255, 107, 53, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = 'var(--border-color)';
                e.target.style.background = 'var(--bg-tertiary)';
              }}
            >
              ➕ {t('newWorkout.step2.addSet')}
            </button>
          )}

          {/* Finish/Skip Exercise Buttons */}
          <div style={{
            display: 'flex',
            gap: 'var(--space-2)',
            marginBottom: 'var(--space-3)'
          }}>
            {/* Show Finish and Skip buttons only if exercise is not completed or skipped */}
            {currentStatus !== 'completed' && currentStatus !== 'skipped' && (
              <>
                <button
                  onClick={handleFinishExercise}
                  style={{
                    flex: 1,
                    padding: 'var(--space-3)',
                    background: 'var(--success)',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    color: 'white',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-semibold)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  ✓ {t('newWorkout.step2.finishExercise')}
                </button>
                <button
                  onClick={handleSkipExercise}
                  style={{
                    flex: 1,
                    padding: 'var(--space-3)',
                    background: 'transparent',
                    border: '1px solid var(--text-tertiary)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-tertiary)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-semibold)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  ⊘ {t('newWorkout.step2.skipExercise')}
                </button>
              </>
            )}

            {/* Show Resume button if exercise is completed or skipped */}
            {(currentStatus === 'completed' || currentStatus === 'skipped') && (
              <button
                onClick={handleResumeExercise}
                style={{
                  flex: 1,
                  padding: 'var(--space-3)',
                  background: 'transparent',
                  border: '1px solid var(--warning)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--warning)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-semibold)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {t('newWorkout.step2.resumeExercise') || 'Wznów ćwiczenie'}
              </button>
            )}
          </div>

          {/* Exercise Notes */}
          <div>
            <label style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--text-secondary)',
              display: 'block',
              marginBottom: 'var(--space-2)'
            }}>
              💬 {t('newWorkout.step2.exerciseNotes')}
            </label>
            <textarea
              className="dark-input"
              placeholder={t('newWorkout.step2.exerciseNotesPlaceholder')}
              value={workoutData.exercises[currentExercise.id]?.notes || ''}
              onChange={(e) => updateExerciseNotes(e.target.value)}
              rows={2}
              style={{
                fontSize: 'var(--text-sm)',
                resize: 'vertical'
              }}
            />
          </div>
        </div>
      </div>

      {/* Fixed Bottom Buttons */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 'var(--space-3)',
        background: 'var(--bg-primary)',
        borderTop: '1px solid var(--border-color)',
        zIndex: 10
      }}>
        <div style={{
          display: 'flex',
          gap: 'var(--space-2)',
          maxWidth: '100%'
        }}>
          {/* Cancel Workout Button */}
          <button
            onClick={handleCancelWorkout}
            style={{
              flex: 1,
              padding: 'var(--space-3)',
              background: 'transparent',
              border: '1px solid var(--danger)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--danger)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-semibold)',
              cursor: 'pointer'
            }}
          >
            {t('newWorkout.step2.cancel')}
          </button>

          {/* Finish Workout Button - Only show if at least 1 exercise is completed */}
          {hasCompletedExercises && (
            <button
              onClick={handleFinishWorkout}
              className="gradient-button"
              style={{
                flex: 1,
                padding: 'var(--space-3)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-semibold)'
              }}
            >
              {t('newWorkout.step2.finish')}
            </button>
          )}
        </div>
      </div>

      {/* Cancel Workout Confirmation Modal */}
      <ConfirmModal
        show={showCancelModal}
        title={t('newWorkout.step2.cancel')}
        message={t('newWorkout.step2.confirmCancel')}
        onConfirm={confirmCancelWorkout}
        onCancel={() => setShowCancelModal(false)}
        confirmText={t('common.confirm')}
        cancelText={t('common.cancel')}
        isDanger={true}
      />

      {/* Finish Workout with Skipped Exercises Confirmation Modal */}
      <ConfirmModal
        show={showFinishModal}
        title={t('newWorkout.step2.finish')}
        message={t('newWorkout.step2.confirmFinishWithSkipped').replace('{count}', unfinishedExercisesCount)}
        onConfirm={confirmFinishWorkout}
        onCancel={() => setShowFinishModal(false)}
        confirmText={t('common.confirm')}
        cancelText={t('common.cancel')}
        isDanger={false}
      />
    </div>
  );
};

export default LogSetsStep;
