import { useLanguage } from '../context/LanguageContext';
import { useWorkout } from '../context/WorkoutContext';
import { useWorkoutPlan } from '../context/WorkoutPlanContext';
import { useMemo, useState } from 'react';
import { getDaysSinceDate } from '../lib/dateUtils';
import ConfirmModal from './ConfirmModal';

const ExerciseCard = ({ exercise, onEdit, onDelete, onClone }) => {
  const { t } = useLanguage();
  const { workouts } = useWorkout();
  const { workoutPlans } = useWorkoutPlan();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

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

  // Format date for statistics
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Format duration in mm:ss format
  const formatDuration = (seconds) => {
    if (!seconds) return null;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

  // Find which plans contain this exercise
  const assignedPlans = useMemo(() => {
    return workoutPlans.filter(plan =>
      plan.workout_plan_exercises?.some(wpe => wpe.exercise_id === exercise.id)
    );
  }, [workoutPlans, exercise.id]);

  // Calculate statistics for this exercise
  const statistics = useMemo(() => {
    // Collect all sets for this exercise across all workouts
    const allSets = [];
    workouts.forEach(workout => {
      workout.workout_exercises?.forEach(we => {
        if (we.exercise?.id === exercise.id) {
          we.exercise_sets?.forEach(set => {
            allSets.push({
              ...set,
              workoutDate: workout.workout_date
            });
          });
        }
      });
    });

    if (allSets.length === 0) return null;

    // Find set with maximum reps
    const maxRepsSet = allSets.reduce((max, set) =>
      (set.reps || 0) > (max.reps || 0) ? set : max
    , allSets[0]);

    // Find set with maximum weight
    const maxWeightSet = allSets.reduce((max, set) =>
      (set.weight_kg || 0) > (max.weight_kg || 0) ? set : max
    , allSets[0]);

    return {
      totalSets: allSets.length,
      maxReps: {
        reps: maxRepsSet.reps,
        weight: maxRepsSet.weight_kg,
        duration: maxRepsSet.duration_seconds,
        date: maxRepsSet.workoutDate
      },
      maxWeight: {
        weight: maxWeightSet.weight_kg,
        reps: maxWeightSet.reps,
        date: maxWeightSet.workoutDate
      }
    };
  }, [workouts, exercise.id]);

  const handleDelete = () => {
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    onDelete(exercise.id);
    setShowConfirm(false);
  };

  return (
    <div
      className="dark-card"
      style={{
        marginBottom: 'var(--space-3)',
        cursor: 'pointer',
        transition: 'all var(--transition-base)'
      }}
      onClick={() => setIsExpanded(!isExpanded)}
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

      {/* Meta Info - All stats in one line */}
      <div style={{
        display: 'flex',
        gap: 'var(--space-3)',
        fontSize: 'var(--text-sm)',
        marginBottom: 'var(--space-2)',
        flexWrap: 'wrap'
      }}>
        <span style={{
          color: workoutsCount === 0 ? 'var(--danger)' : 'var(--text-tertiary)',
          fontStyle: workoutsCount === 0 ? 'italic' : 'normal'
        }}>
          📊 {t('exercises.workoutsCount', { count: workoutsCount })}
        </span>
        <span style={{
          color: assignedPlans.length === 0 ? 'var(--danger)' : 'var(--text-secondary)',
          fontStyle: assignedPlans.length === 0 ? 'italic' : 'normal'
        }}>
          📋 {assignedPlans.length > 0 ? assignedPlans.map(p => p.name).join(', ') : t('exercises.noPlan')}
        </span>
        <span style={{
          color: !lastUsedDate ? 'var(--danger)' : 'var(--text-secondary)',
          fontStyle: !lastUsedDate ? 'italic' : 'normal'
        }}>
          📅 {formatLastUsedDate(lastUsedDate)}
        </span>
      </div>

        {/* Action Buttons */}
        {isExpanded &&
            <div style={{display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap'}}>
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
        }
      {/* Statistics Section (Collapsible) */}
      {isExpanded && statistics && (
        <div style={{
          marginTop: 'var(--space-4)',
          paddingTop: 'var(--space-4)',
          borderTop: '1px solid var(--border-color)'
        }}>
          <h4 style={{
            fontSize: 'var(--text-base)',
            fontWeight: 'var(--font-semibold)',
            color: 'var(--text-primary)',
            margin: 0,
            marginBottom: 'var(--space-3)'
          }}>
            {t('exercises.statistics.title')}
          </h4>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2)',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)'
          }}>
            {/* Total Workouts */}
            <div>
              📊 {t('exercises.statistics.totalWorkouts')}: <strong style={{ color: 'var(--text-primary)' }}>{workoutsCount}</strong>
            </div>

            {/* Max Reps */}
            {statistics.maxReps.reps && (
              <div>
                🏆 {t('exercises.statistics.maxReps')}: <strong style={{ color: 'var(--text-primary)' }}>{statistics.maxReps.reps}</strong>
                {exercise.weight_units && statistics.maxReps.weight > 0 && <span> @ {statistics.maxReps.weight}kg</span>}
                {exercise.time_units && statistics.maxReps.duration > 0 && <span> ({formatDuration(statistics.maxReps.duration)})</span>}
                <span style={{ color: 'var(--text-tertiary)', marginLeft: 'var(--space-2)' }}>
                  📅 {formatDate(statistics.maxReps.date)}
                </span>
              </div>
            )}

            {/* Max Weight */}
            {exercise.weight_units && statistics.maxWeight.weight > 0 && (
              <div>
                💪 {t('exercises.statistics.maxWeight')}: <strong style={{ color: 'var(--text-primary)' }}>{statistics.maxWeight.weight}kg</strong>
                {statistics.maxWeight.reps && <span> ({statistics.maxWeight.reps} {t('exercises.statistics.reps')})</span>}
                <span style={{ color: 'var(--text-tertiary)', marginLeft: 'var(--space-2)' }}>
                  📅 {formatDate(statistics.maxWeight.date)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        show={showConfirm}
        title={t('exercises.deleteConfirm.title')}
        message={t('exercises.deleteConfirm.message').replace('{name}', exercise.name)}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowConfirm(false)}
        confirmText={t('exercises.deleteConfirm.confirm')}
        cancelText={t('exercises.deleteConfirm.cancel')}
      />
    </div>
  );
};

export default ExerciseCard;
