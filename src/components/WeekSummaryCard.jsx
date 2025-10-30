import { useLanguage } from '../context/LanguageContext';

const WeekSummaryCard = ({ summary }) => {
  const { t } = useLanguage();

  return (
    <div
      className="dark-card fade-in"
      style={{
        background: 'var(--accent-gradient)',
        marginBottom: 'var(--space-4)',
        border: 'none'
      }}
    >
      <h2 style={{
        fontSize: 'var(--text-xl)',
        fontWeight: 'var(--font-bold)',
        color: 'white',
        marginBottom: 'var(--space-3)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)'
      }}>
        📊 {t('workouts.weekSummary.title')}
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 'var(--space-3)'
      }}>
        {/* Workouts Count */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-3)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            fontSize: 'var(--text-sm)',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: 'var(--space-1)'
          }}>
            💪 {t('workouts.weekSummary.workouts')}
          </div>
          <div style={{
            fontSize: 'var(--text-3xl)',
            fontWeight: 'var(--font-bold)',
            color: 'white'
          }}>
            {summary.count}
          </div>
        </div>

        {/* Total Hours */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-3)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            fontSize: 'var(--text-sm)',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: 'var(--space-1)'
          }}>
            ⏱️ {t('workouts.weekSummary.hours')}
          </div>
          <div style={{
            fontSize: 'var(--text-3xl)',
            fontWeight: 'var(--font-bold)',
            color: 'white'
          }}>
            {summary.totalHours}
          </div>
        </div>
      </div>

      {/* Motivational Message */}
      {summary.count === 0 ? (
        <p style={{
          marginTop: 'var(--space-3)',
          fontSize: 'var(--text-sm)',
          color: 'rgba(255, 255, 255, 0.9)',
          textAlign: 'center',
          margin: 'var(--space-3) 0 0 0'
        }}>
          {t('workouts.weekSummary.noWorkouts')}
        </p>
      ) : (
        <p style={{
          marginTop: 'var(--space-3)',
          fontSize: 'var(--text-sm)',
          color: 'rgba(255, 255, 255, 0.9)',
          textAlign: 'center',
          margin: 'var(--space-3) 0 0 0'
        }}>
          {summary.count >= 3 ? '🔥 ' + t('workouts.weekSummary.keepGoing') : '💪 ' + t('workouts.weekSummary.greatStart')}
        </p>
      )}
    </div>
  );
};

export default WeekSummaryCard;
