import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const WorkoutCard = ({ workout, onDelete }) => {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDelete = () => {
    if (window.confirm(t('workouts.deleteConfirm.message').replace('{name}', workout.name || formatDate(workout.workout_date)))) {
      onDelete(workout.id);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  };

  // Calculate total sets
  const totalSets = workout.workout_exercises?.reduce((sum, we) => {
    return sum + (we.exercise_sets?.length || 0);
  }, 0) || 0;

  // Calculate total volume (weight * reps)
  const totalVolume = workout.workout_exercises?.reduce((sum, we) => {
    const exerciseVolume = we.exercise_sets?.reduce((setSum, set) => {
      return setSum + ((set.weight_kg || 0) * (set.reps || 0));
    }, 0) || 0;
    return sum + exerciseVolume;
  }, 0) || 0;

  // Check if workout contains any PR (placeholder for future implementation)
  const hasPR = false; // TODO: Implement PR detection

  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className="dark-card"
      onClick={handleCardClick}
      style={{
        marginBottom: 'var(--space-3)',
        transition: 'all var(--transition-base)',
        cursor: 'pointer'
      }}
    >
      {/* Workout Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)', flexWrap: 'wrap' }}>
            {workout.workout_plan && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-1)',
                padding: '4px 8px',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-sm)',
                borderLeft: `3px solid ${workout.workout_plan.color || '#FF6B35'}`
              }}>
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: workout.workout_plan.color || '#FF6B35'
                  }}
                />
                <span style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-secondary)',
                  fontWeight: 'var(--font-medium)'
                }}>
                  {workout.workout_plan.name}
                </span>
              </div>
            )}
            {hasPR && (
              <span className="dark-badge" style={{
                background: 'var(--accent-gradient)',
                color: 'white',
                fontSize: 'var(--text-xs)'
              }}>
                🏆 PR
              </span>
            )}
          </div>

          <p style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)'
          }}>
            <span>📅 {formatDate(workout.workout_date)} • ⏰ {formatTime(workout.workout_date)}</span>
            <span style={{ marginLeft: 'auto', fontSize: 'var(--text-base)' }}>
              {isExpanded ? '▲' : '▼'}
            </span>
          </p>
        </div>
      </div>

      {/* Notes */}
      {workout.notes && (
        <p style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
          marginBottom: 'var(--space-3)',
          lineHeight: '1.5',
          fontStyle: 'italic'
        }}>
          📝 {workout.notes}
        </p>
      )}

      {/* Exercise List - Collapsible */}
      {isExpanded && workout.workout_exercises && workout.workout_exercises.length > 0 && (
        <div style={{ marginBottom: 'var(--space-3)' }}>
          {workout.workout_exercises
            .sort((a, b) => a.order_index - b.order_index)
            .map((we, index) => (
              <div
                key={we.id}
                style={{
                  padding: 'var(--space-2)',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: index < workout.workout_exercises.length - 1 ? 'var(--space-2)' : 0
                }}
              >
                <div style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-medium)',
                  color: 'var(--text-primary)',
                  marginBottom: 'var(--space-1)'
                }}>
                  🏋️ {we.exercise?.name || 'Unknown Exercise'}
                </div>

                {we.exercise_sets && we.exercise_sets.length > 0 && (
                  <div style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--text-tertiary)',
                    display: 'flex',
                    gap: 'var(--space-2)',
                    flexWrap: 'wrap'
                  }}>
                    {we.exercise_sets.map((set, setIndex) => (
                      <span key={set.id}>
                        {set.weight_kg ? `${set.weight_kg}kg` : ''}{set.weight_kg && set.reps ? ' × ' : ''}{set.reps ? `${set.reps}` : ''}
                        {set.duration_seconds ? `${set.duration_seconds}s` : ''}
                        {setIndex < we.exercise_sets.length - 1 ? ',' : ''}
                      </span>
                    ))}
                  </div>
                )}

                {we.notes && (
                  <div style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--text-secondary)',
                    marginTop: 'var(--space-1)',
                    fontStyle: 'italic'
                  }}>
                    💬 {we.notes}
                  </div>
                )}
              </div>
            ))}
        </div>
      )}

      {/* Stats */}
      <div style={{
        display: 'flex',
        gap: 'var(--space-4)',
        fontSize: 'var(--text-xs)',
        color: 'var(--text-tertiary)',
        marginBottom: 'var(--space-3)'
      }}>
        <span>💪 {workout.workout_exercises?.length || 0} {t('workouts.exercisesCount')}</span>
        <span>🔢 {totalSets} {t('workouts.setsCount')}</span>
        {totalVolume > 0 && (
          <span>⚡ {totalVolume.toFixed(0)}kg {t('workouts.volume')}</span>
        )}
      </div>

      {/* Action Button - Only visible when expanded */}
      {isExpanded && (
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            style={{
              flex: 1,
              padding: 'var(--space-2) var(--space-3)',
              background: 'transparent',
              border: '1px solid var(--danger)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--danger)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-medium)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--danger)';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = 'var(--danger)';
            }}
          >
            🗑️ {t('workouts.actions.delete')}
          </button>
        </div>
      )}
    </div>
  );
};

export default WorkoutCard;
