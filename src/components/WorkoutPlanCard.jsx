import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { formatLastWorkoutDate } from '../lib/dateUtils';

const WorkoutPlanCard = ({ plan, onEdit, onDelete, onSelect, onClone, lastWorkoutDate }) => {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleStartWorkout = (e) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(plan);
    }
  };

  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(plan);
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(plan);
    }
  };

  const handleCloneClick = (e) => {
    e.stopPropagation();
    if (onClone) {
      onClone(plan);
    }
  };

  return (
    <div
      className="dark-card"
      style={{
        marginBottom: 'var(--space-3)',
        transition: 'all var(--transition-base)',
        borderLeft: `4px solid ${plan.color || '#FF6B35'}`
      }}
    >
      {/* Header Section - Clickable */}
      <div
        onClick={handleCardClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          marginBottom: 'var(--space-2)',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        <div
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: plan.color || '#FF6B35'
          }}
        />
        <h4 style={{
          fontSize: 'var(--text-lg)',
          fontWeight: 'var(--font-semibold)',
          color: 'var(--text-primary)',
          margin: 0,
          flex: 1
        }}>
          {plan.name}
        </h4>
        {/* Expand/Collapse Indicator */}
        <span style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--text-tertiary)',
          transition: 'transform var(--transition-fast)',
          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
        }}>
          ▼
        </span>
      </div>

      {/* Description */}
      {plan.description && (
        <p style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
          marginBottom: 'var(--space-2)'
        }}>
          {plan.description}
        </p>
      )}

      {/* Stats and Last Workout Date */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-tertiary)',
        marginBottom: 'var(--space-3)',
        flexWrap: 'wrap'
      }}>
        <span style={{
          color: (plan.workout_plan_exercises?.length || 0) === 0 ? 'var(--danger)' : 'inherit'
        }}>
          💪 {plan.workout_plan_exercises?.length || 0} {t('plans.exercises')}
        </span>
        {plan.workout_plan_exercises && plan.workout_plan_exercises.length > 0 && (
          <span>
            📋 {plan.workout_plan_exercises.reduce((sum, e) => sum + (e.suggested_sets || 0), 0)} {t('plans.sets')}
          </span>
        )}
        <span style={{
          color: lastWorkoutDate ? 'var(--text-secondary)' : 'var(--text-tertiary)',
          fontStyle: lastWorkoutDate ? 'normal' : 'italic'
        }}>
          📅 {formatLastWorkoutDate(lastWorkoutDate, t)}
        </span>
      </div>

      {/* Start Training Button or Empty Message - Always Visible */}
      {plan.workout_plan_exercises?.length > 0 ? (
        <button
          onClick={handleStartWorkout}
          className="gradient-button"
          style={{
            width: '100%',
            marginBottom: 'var(--space-3)'
          }}
        >
          🏋️ {t('plans.startWorkout')}
        </button>
      ) : (
        <div style={{
          color: 'var(--text-secondary)',
          fontSize: 'var(--text-sm)',
          textAlign: 'center',
          padding: 'var(--space-3)',
          marginBottom: 'var(--space-3)',
          fontStyle: 'italic'
        }}>
          Aby rozpocząć trening najpierw dodaj ćwiczenia do planu
        </div>
      )}

      {/* Management Buttons - Always Visible */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
        <button
          onClick={handleEditClick}
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
          ✏️ {t('plans.edit')}
        </button>
        <button
          onClick={handleCloneClick}
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
          📋 {t('plans.clone')}
        </button>
        <button
          onClick={handleDeleteClick}
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
          🗑️ {t('plans.delete')}
        </button>
      </div>

      {/* Exercise List - Visible Only When Expanded */}
      {isExpanded && plan.workout_plan_exercises && plan.workout_plan_exercises.length > 0 && (
        <div style={{
          marginTop: 'var(--space-3)',
          paddingTop: 'var(--space-3)',
          borderTop: '1px solid var(--border-color)'
        }}>
          <h5 style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-semibold)',
            color: 'var(--text-secondary)',
            marginBottom: 'var(--space-2)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {t('plans.exerciseList')}
          </h5>
          {plan.workout_plan_exercises.map((planExercise, index) => (
            <div
              key={planExercise.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 'var(--space-2)',
                backgroundColor: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-sm)',
                marginBottom: 'var(--space-2)',
                fontSize: 'var(--text-sm)',
                color: 'var(--text-primary)'
              }}
            >
              <span>
                {index + 1}. {planExercise.exercise?.name || 'Unknown'}
              </span>
              <span style={{ color: 'var(--text-tertiary)' }}>
                {planExercise.suggested_sets || 3} {t('plans.sets')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkoutPlanCard;
