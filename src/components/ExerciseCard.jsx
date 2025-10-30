import { useLanguage } from '../context/LanguageContext';

const ExerciseCard = ({ exercise, onEdit, onDelete }) => {
  const { t } = useLanguage();

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
            margin: '0 0 var(--space-2) 0'
          }}>
            🏋️ {exercise.name}
          </h3>

          {/* Muscle Group Badge */}
          {exercise.muscle_group && (
            <span className="dark-badge" style={{ marginRight: 'var(--space-2)' }}>
              💪 {exercise.muscle_group.name}
            </span>
          )}
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

      {/* Meta Info - Placeholder for future stats */}
      <div style={{
        display: 'flex',
        gap: 'var(--space-4)',
        fontSize: 'var(--text-xs)',
        color: 'var(--text-tertiary)',
        marginBottom: 'var(--space-3)'
      }}>
        <span>📊 0 {t('exercises.workoutsCount').replace('{count}', '0')}</span>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(exercise);
          }}
          style={{
            flex: 1,
            padding: 'var(--space-2) var(--space-3)',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-medium)',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'var(--accent-primary)';
            e.target.style.borderColor = 'var(--accent-primary)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'var(--bg-tertiary)';
            e.target.style.borderColor = 'var(--border-color)';
          }}
        >
          📝 {t('exercises.actions.edit')}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          style={{
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
          🗑️
        </button>
      </div>
    </div>
  );
};

export default ExerciseCard;
