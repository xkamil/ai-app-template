import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const LogSetsStep = ({ selectedExercises, workoutData, onUpdateWorkoutData, onBack, onFinish }) => {
  const { t } = useLanguage();
  const [workoutName, setWorkoutName] = useState(workoutData.name || '');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

  const currentExercise = selectedExercises[currentExerciseIndex];
  const exerciseSets = workoutData.exercises[currentExercise.id]?.sets || [{ reps: '', weight_kg: '', duration_seconds: '', notes: '' }];

  const updateSet = (setIndex, field, value) => {
    const updatedSets = [...exerciseSets];
    updatedSets[setIndex] = { ...updatedSets[setIndex], [field]: value };

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
    const lastSet = exerciseSets[exerciseSets.length - 1];
    const newSet = {
      reps: lastSet?.reps || '',
      weight_kg: lastSet?.weight_kg || '',
      duration_seconds: '',
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

  const goToNextExercise = () => {
    if (currentExerciseIndex < selectedExercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    }
  };

  const goToPreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
    }
  };

  const handleFinish = () => {
    onUpdateWorkoutData({ ...workoutData, name: workoutName });
    onFinish();
  };

  return (
    <div>
      {/* Progress Indicator */}
      <div style={{
        padding: 'var(--space-4)',
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
          <button
            onClick={onBack}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--accent-primary)',
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--font-medium)',
              cursor: 'pointer',
              padding: 0
            }}
          >
            ← {t('newWorkout.back')}
          </button>
          <div style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--text-tertiary)'
          }}>
            {t('newWorkout.step2.progress')}
          </div>
        </div>

        <h2 style={{
          fontSize: 'var(--text-xl)',
          fontWeight: 'var(--font-bold)',
          color: 'var(--text-primary)',
          margin: '0 0 var(--space-3) 0'
        }}>
          {t('newWorkout.step2.title')}
        </h2>

        {/* Workout Name Input */}
        <div>
          <label style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)',
            display: 'block',
            marginBottom: 'var(--space-2)'
          }}>
            {t('newWorkout.step2.nameLabel')}
          </label>
          <input
            type="text"
            className="dark-input"
            placeholder={t('newWorkout.step2.namePlaceholder')}
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            style={{ fontSize: 'var(--text-base)' }}
          />
        </div>
      </div>

      <div style={{ padding: 'var(--space-4)', paddingBottom: '100px' }}>
        {/* Exercise Navigation */}
        {selectedExercises.length > 1 && (
          <div style={{
            display: 'flex',
            gap: 'var(--space-2)',
            marginBottom: 'var(--space-4)',
            overflowX: 'auto',
            paddingBottom: 'var(--space-2)'
          }}>
            {selectedExercises.map((exercise, index) => (
              <button
                key={exercise.id}
                onClick={() => setCurrentExerciseIndex(index)}
                style={{
                  padding: 'var(--space-2) var(--space-3)',
                  background: index === currentExerciseIndex ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  color: index === currentExerciseIndex ? 'white' : 'var(--text-secondary)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-medium)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {index + 1}. {exercise.name}
              </button>
            ))}
          </div>
        )}

        {/* Current Exercise */}
        <div className="dark-card" style={{ marginBottom: 'var(--space-4)' }}>
          <h3 style={{
            fontSize: 'var(--text-lg)',
            fontWeight: 'var(--font-bold)',
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-3)'
          }}>
            🏋️ {currentExercise.name}
          </h3>

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
                {exerciseSets.length > 1 && (
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
                gridTemplateColumns: '1fr 1fr 1fr',
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
                    style={{
                      fontSize: 'var(--text-base)',
                      padding: 'var(--space-2)'
                    }}
                  />
                </div>

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
                    style={{
                      fontSize: 'var(--text-base)',
                      padding: 'var(--space-2)'
                    }}
                  />
                </div>

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
                    style={{
                      fontSize: 'var(--text-base)',
                      padding: 'var(--space-2)'
                    }}
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Add Set Button */}
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

          {/* Exercise Notes */}
          <div>
            <label style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--text-secondary)',
              display: 'block',
              marginBottom: 'var(--space-2)'
            }}>
              💬 Notes
            </label>
            <textarea
              className="dark-input"
              placeholder="Exercise notes..."
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

        {/* Exercise Navigation Buttons */}
        {selectedExercises.length > 1 && (
          <div style={{
            display: 'flex',
            gap: 'var(--space-2)',
            marginBottom: 'var(--space-4)'
          }}>
            {currentExerciseIndex > 0 && (
              <button
                onClick={goToPreviousExercise}
                style={{
                  flex: 1,
                  padding: 'var(--space-3)',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--text-base)',
                  fontWeight: 'var(--font-semibold)',
                  cursor: 'pointer'
                }}
              >
                ← Previous
              </button>
            )}
            {currentExerciseIndex < selectedExercises.length - 1 && (
              <button
                onClick={goToNextExercise}
                style={{
                  flex: 1,
                  padding: 'var(--space-3)',
                  background: 'var(--accent-gradient)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  color: 'white',
                  fontSize: 'var(--text-base)',
                  fontWeight: 'var(--font-semibold)',
                  cursor: 'pointer'
                }}
              >
                Next →
              </button>
            )}
          </div>
        )}
      </div>

      {/* Fixed Bottom Button */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 'var(--space-4)',
        background: 'var(--bg-primary)',
        borderTop: '1px solid var(--border-color)',
        zIndex: 10
      }}>
        <button
          onClick={handleFinish}
          className="gradient-button"
          style={{
            width: '100%',
            padding: 'var(--space-4)',
            fontSize: 'var(--text-lg)',
            fontWeight: 'var(--font-bold)'
          }}
        >
          {t('newWorkout.step2.finish')}
        </button>
      </div>
    </div>
  );
};

export default LogSetsStep;
