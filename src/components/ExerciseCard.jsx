import { useLanguage } from '../context/LanguageContext';
import { useWorkout } from '../context/WorkoutContext';
import { useMemo } from 'react';
import { getDaysSinceDate } from '../lib/dateUtils';

const ExerciseCard = ({ exercise, onEdit, onDelete, onClone }) => {
  const { t } = useLanguage();
  const { workouts } = useWorkout();

  // Format last used date for exercises
  const formatLastUsedDate = (date) => {
    if (!date) {
      return t('exercises.neverUsed');
    }

    const days = getDaysSinceDate(date);

    if (days === 0) {
      return t('exercises.lastUsedToday');
    }

    const daysLabel = days === 1 ? t('plans.day') : t('plans.days');
    return t('exercises.lastUsedDaysAgo', { count: days, days: daysLabel });
  };

  // Calculate how many workouts used this exercise
  const workoutsCount = useMemo(() => {
    return workouts.filter(workout =>
      workout.workout_exercises?.some(we => we.exercise?.id === exercise.id)
    ).length;
  }, [workouts, exercise.id]);

  // Find the last workout date for this exercise
  const lastUsedDate = useMemo(() => {
    const exerciseWorkouts = workouts.filter(workout =>
      workout.workout_exercises?.some(we => we.exercise?.id === exercise.id)
    );

    if (exerciseWorkouts.length === 0) return null;

    // Sort by workout_date descending and get the most recent
    const sortedWorkouts = exerciseWorkouts.sort((a, b) =>
      new Date(b.workout_date) - new Date(a.workout_date)
    );

    return sortedWorkouts[0].workout_date;
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
        marginBottom: 'var(--space-2)'
      }}>
        <span>📊 {t('exercises.workoutsCount', { count: workoutsCount })}</span>
      </div>

      {/* Last Used Date */}
      <div style={{
        fontSize: 'var(--text-sm)',
        color: lastUsedDate ? 'var(--text-secondary)' : 'var(--text-tertiary)',
        marginBottom: 'var(--space-2)',
        fontStyle: lastUsedDate ? 'normal' : 'italic'
      }}>
        📅 {formatLastUsedDate(lastUsedDate)}
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
