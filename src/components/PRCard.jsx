import { useLanguage } from '../context/LanguageContext';

const PRCard = ({ pr }) => {
  const { t } = useLanguage();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  return (
    <div
      className="dark-card"
      style={{
        marginBottom: 'var(--space-3)',
        cursor: 'pointer',
        transition: 'all var(--transition-base)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <h4 style={{
            fontSize: 'var(--text-base)',
            fontWeight: 'var(--font-semibold)',
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-1)'
          }}>
            🏋️ {pr.exercise_name}
          </h4>

          <div style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)',
            marginBottom: 'var(--space-2)'
          }}>
            🗓️ {formatDate(pr.workout_date)}
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 'var(--space-2)'
          }}>
            <span style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--font-bold)',
              color: 'var(--accent-primary)'
            }}>
              {pr.weight_kg}kg
            </span>
            <span style={{
              fontSize: 'var(--text-base)',
              color: 'var(--text-secondary)'
            }}>
              {t('stats.prs.at')} {pr.reps} {t('stats.prs.reps')}
            </span>
          </div>

          {pr.calculated_max && (
            <div style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--text-tertiary)',
              marginTop: 'var(--space-1)'
            }}>
              Est. 1RM: {pr.calculated_max.toFixed(1)}kg
            </div>
          )}
        </div>

        <div style={{
          padding: 'var(--space-2) var(--space-3)',
          background: 'var(--accent-gradient)',
          borderRadius: 'var(--radius-md)',
          color: 'white',
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--font-bold)'
        }}>
          🏆 PR
        </div>
      </div>
    </div>
  );
};

export default PRCard;
