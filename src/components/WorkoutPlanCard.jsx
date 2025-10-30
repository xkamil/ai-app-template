import { useLanguage } from '../context/LanguageContext';

const WorkoutPlanCard = ({ plan, onEdit, onDelete, onSelect }) => {
  const { t } = useLanguage();

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(plan);
    }
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

  return (
    <div
      className="dark-card"
      onClick={handleCardClick}
      style={{
        marginBottom: 'var(--space-3)',
        cursor: onSelect ? 'pointer' : 'default',
        transition: 'all var(--transition-base)',
        borderLeft: `4px solid ${plan.color || '#FF6B35'}`
      }}
      onMouseEnter={(e) => {
        if (onSelect) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        }
      }}
      onMouseLeave={(e) => {
        if (onSelect) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        }
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
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
              margin: 0
            }}>
              {plan.name}
            </h4>
          </div>

          {plan.description && (
            <p style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--text-secondary)',
              marginBottom: 'var(--space-2)'
            }}>
              {plan.description}
            </p>
          )}

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-tertiary)'
          }}>
            <span>
              💪 {plan.workout_plan_exercises?.length || 0} {t('plans.exercises')}
            </span>
            {plan.workout_plan_exercises && plan.workout_plan_exercises.length > 0 && (
              <span>
                📋 {plan.workout_plan_exercises.reduce((sum, e) => sum + (e.suggested_sets || 0), 0)} {t('plans.sets')}
              </span>
            )}
          </div>
        </div>

        {(onEdit || onDelete) && (
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            {onEdit && (
              <button
                onClick={handleEditClick}
                style={{
                  padding: 'var(--space-2)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  fontSize: 'var(--text-lg)',
                  cursor: 'pointer',
                  transition: 'color var(--transition-fast)'
                }}
                onMouseEnter={(e) => e.target.style.color = 'var(--accent-primary)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
              >
                ✏️
              </button>
            )}
            {onDelete && (
              <button
                onClick={handleDeleteClick}
                style={{
                  padding: 'var(--space-2)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  fontSize: 'var(--text-lg)',
                  cursor: 'pointer',
                  transition: 'color var(--transition-fast)'
                }}
                onMouseEnter={(e) => e.target.style.color = 'var(--danger)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
              >
                🗑️
              </button>
            )}
          </div>
        )}
      </div>

      {/* Exercise List Preview */}
      {plan.workout_plan_exercises && plan.workout_plan_exercises.length > 0 && (
        <div style={{ marginTop: 'var(--space-3)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--border-color)' }}>
          {plan.workout_plan_exercises.slice(0, 3).map((planExercise, index) => (
            <div
              key={planExercise.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 'var(--space-1) 0',
                fontSize: 'var(--text-sm)',
                color: 'var(--text-secondary)'
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
          {plan.workout_plan_exercises.length > 3 && (
            <div style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--text-tertiary)',
              marginTop: 'var(--space-1)',
              textAlign: 'center'
            }}>
              +{plan.workout_plan_exercises.length - 3} {t('plans.more')}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkoutPlanCard;
