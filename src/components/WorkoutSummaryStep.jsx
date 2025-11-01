import { useLanguage } from '../context/LanguageContext';

const WorkoutSummaryStep = ({ workoutData, selectedExercises, onSave, saving, exerciseStatus = {} }) => {
  const { t } = useLanguage();

  // Calculate total sets
  const totalSets = Object.values(workoutData.exercises).reduce((sum, ex) => {
    return sum + (ex.sets?.length || 0);
  }, 0);

  // Calculate total volume
  const totalVolume = Object.values(workoutData.exercises).reduce((sum, ex) => {
    const exerciseVolume = ex.sets?.reduce((setSum, set) => {
      return setSum + ((parseFloat(set.weight_kg) || 0) * (parseInt(set.reps) || 0));
    }, 0) || 0;
    return sum + exerciseVolume;
  }, 0);

  return (
    <div style={{ paddingBottom: '100px' }}>
      {/* Success Header */}
      <div style={{
        padding: 'var(--space-6) var(--space-4)',
        background: 'var(--accent-gradient)',
        textAlign: 'center',
        color: 'white'
      }}>
        <div style={{ fontSize: '64px', marginBottom: 'var(--space-3)' }}>
          🎉
        </div>
        <h2 style={{
          fontSize: 'var(--text-2xl)',
          fontWeight: 'var(--font-bold)',
          margin: '0 0 var(--space-2) 0'
        }}>
          {t('newWorkout.step3.title')}
        </h2>
        <p style={{
          fontSize: 'var(--text-base)',
          opacity: 0.9,
          margin: 0
        }}>
          Great job! Ready to save?
        </p>
      </div>

      <div style={{ padding: 'var(--space-4)' }}>
        {/* Summary Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'var(--space-3)',
          marginBottom: 'var(--space-4)'
        }}>
          <div className="dark-card" style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--font-bold)',
              color: 'var(--accent-primary)',
              marginBottom: 'var(--space-1)'
            }}>
              {selectedExercises.length}
            </div>
            <div style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--text-secondary)'
            }}>
              Exercises
            </div>
          </div>

          <div className="dark-card" style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--font-bold)',
              color: 'var(--accent-primary)',
              marginBottom: 'var(--space-1)'
            }}>
              {totalSets}
            </div>
            <div style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--text-secondary)'
            }}>
              Total Sets
            </div>
          </div>

          <div className="dark-card" style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--font-bold)',
              color: 'var(--accent-primary)',
              marginBottom: 'var(--space-1)'
            }}>
              {totalVolume > 0 ? `${totalVolume.toFixed(0)}` : '0'}
            </div>
            <div style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--text-secondary)'
            }}>
              Volume (kg)
            </div>
          </div>
        </div>

        {/* Workout Name */}
        {workoutData.name && (
          <div className="dark-card" style={{ marginBottom: 'var(--space-4)' }}>
            <div style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--text-secondary)',
              marginBottom: 'var(--space-1)'
            }}>
              Workout Name
            </div>
            <div style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-semibold)',
              color: 'var(--text-primary)'
            }}>
              {workoutData.name}
            </div>
          </div>
        )}

        {/* Exercise Details */}
        <h3 style={{
          fontSize: 'var(--text-lg)',
          fontWeight: 'var(--font-semibold)',
          color: 'var(--text-primary)',
          marginBottom: 'var(--space-3)'
        }}>
          📋 Workout Details
        </h3>

        {selectedExercises.map((exercise, index) => {
          const exerciseData = workoutData.exercises[exercise.id];
          const sets = exerciseData?.sets || [];
          const isSkipped = exerciseStatus[exercise.id] === 'skipped';

          return (
            <div key={exercise.id} className="dark-card" style={{
              marginBottom: 'var(--space-3)',
              opacity: isSkipped ? 0.5 : 1
            }}>
              <div style={{
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-semibold)',
                color: isSkipped ? 'var(--text-tertiary)' : 'var(--text-primary)',
                marginBottom: isSkipped ? 0 : 'var(--space-2)',
                textDecoration: isSkipped ? 'line-through' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)'
              }}>
                {index + 1}. 🏋️ {exercise.name}
                {isSkipped && <span>⊘</span>}
              </div>

              {!isSkipped && sets.length > 0 && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-1)',
                  marginBottom: exerciseData.notes ? 'var(--space-2)' : 0
                }}>
                  {sets.map((set, setIndex) => {
                    const parts = [];
                    if (set.reps) parts.push(`${set.reps} reps`);
                    if (set.weight_kg) parts.push(`${set.weight_kg}kg`);
                    if (set.duration_seconds) parts.push(`${set.duration_seconds}s`);

                    return (
                      <div
                        key={setIndex}
                        style={{
                          fontSize: 'var(--text-sm)',
                          color: 'var(--text-secondary)',
                          padding: 'var(--space-2)',
                          background: 'var(--bg-tertiary)',
                          borderRadius: 'var(--radius-sm)'
                        }}
                      >
                        Set {setIndex + 1}: {parts.join(' × ') || 'No data'}
                      </div>
                    );
                  })}
                </div>
              )}

              {!isSkipped && exerciseData?.notes && (
                <div style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-tertiary)',
                  fontStyle: 'italic',
                  marginTop: 'var(--space-2)',
                  padding: 'var(--space-2)',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-sm)',
                  borderLeft: '3px solid var(--accent-primary)'
                }}>
                  💬 {exerciseData.notes}
                </div>
              )}
            </div>
          );
        })}
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
          onClick={onSave}
          disabled={saving}
          className="gradient-button"
          style={{
            width: '100%',
            padding: 'var(--space-4)',
            fontSize: 'var(--text-lg)',
            fontWeight: 'var(--font-bold)',
            opacity: saving ? 0.7 : 1,
            cursor: saving ? 'not-allowed' : 'pointer'
          }}
        >
          {saving ? '💾 Saving...' : '💾 Save Workout'}
        </button>
      </div>
    </div>
  );
};

export default WorkoutSummaryStep;
