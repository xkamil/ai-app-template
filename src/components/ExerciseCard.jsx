import { useLanguage } from '../context/LanguageContext';
import { useWorkout } from '../context/WorkoutContext';
import { useMemo } from 'react';

const ExerciseCard = ({ exercise, onEdit, onDelete, onClone }) => {
  const { t } = useLanguage();
  const { workouts } = useWorkout();

  // Calculate how many workouts used this exercise
  const workoutsCount = useMemo(() => {
    return workouts.filter(workout =>
      workout.workout_exercises?.some(we => we.exercise?.id === exercise.id)
    ).length;
  }, [workouts, exercise.id]);

  const handleDelete = () => {
    if (window.confirm(t('exercises.deleteConfirm.message').replace('{name}', exercise.name))) {
      onDelete(exercise.id);
    }
  };

  return (
    <div
      className="dark-card"
      style={{
        marginBottom: 'var(--space-3)',
        cursor: 'pointer',
        transition: 'all var(--transition-base)'
      }}
    >
      {/* Exercise Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{
            fontSize: 'var(--text-lg)',
            fontWeight: 'var(--font-semibold)',
            color: 'var(--text-primary)',
            margin: 0
          }}>
            {exercise.name}
          </h3>
        </div>
      </div>

      {/* Description */}
      {exercise.description && (
        <p style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
          marginBottom: 'var(--space-3)',
          lineHeight: '1.5'
        }}>
          {exercise.description}
        </p>
      )}

      {/* Meta Info - Stats */}
      <div style={{
        display: 'flex',
        gap: 'var(--space-4)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-tertiary)',
        marginBottom: 'var(--space-3)'
      }}>
        <span>📊 {t('exercises.workoutsCount', { count: workoutsCount })}</span>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(exercise);
          }}
          style={{
            flex: 1,
            minWidth: '120px',
            padding: 'var(--space-2) var(--space-3)',
            background: 'transparent',
            border: '1px solid var(--accent-primary)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--accent-primary)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-semibold)',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'var(--accent-primary)';
            e.target.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.color = 'var(--accent-primary)';
          }}
        >
          ✏️ {t('exercises.actions.edit')}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onClone(exercise);
          }}
          style={{
            flex: 1,
            minWidth: '120px',
            padding: 'var(--space-2) var(--space-3)',
            background: 'transparent',
            border: '1px solid var(--text-secondary)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-secondary)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-semibold)',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'var(--text-secondary)';
            e.target.style.color = 'var(--bg-primary)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.color = 'var(--text-secondary)';
          }}
        >
          📋 {t('exercises.actions.clone')}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          style={{
            flex: 1,
            minWidth: '120px',
            padding: 'var(--space-2) var(--space-3)',
            background: 'transparent',
            border: '1px solid var(--danger)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--danger)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-semibold)',
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
          🗑️ {t('exercises.actions.delete')}
        </button>
      </div>
    </div>
  );
};

export default ExerciseCard;
