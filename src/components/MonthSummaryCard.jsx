import { useLanguage } from '../context/LanguageContext';

const MonthSummaryCard = ({ summary }) => {
  const { t } = useLanguage();

  return (
    <div
      className="dark-card fade-in"
      style={{
        background: 'var(--accent-gradient)',
        marginBottom: 'var(--space-4)',
        border: 'none',
        padding: 'var(--space-3)'
      }}
    >
      <h3 style={{
        fontSize: 'var(--text-base)',
        fontWeight: 'var(--font-semibold)',
        color: 'white',
        marginBottom: 'var(--space-2)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)'
      }}>
        📊 {t('workouts.monthSummary.title')}
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 'var(--space-2)'
      }}>
        {/* Workouts Count */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          borderRadius: 'var(--radius-sm)',
          padding: 'var(--space-2)',
          backdropFilter: 'blur(10px)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: 'var(--text-xs)',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: 'var(--space-1)'
          }}>
            💪 {t('workouts.monthSummary.workouts')}
          </div>
          <div style={{
            fontSize: 'var(--text-xl)',
            fontWeight: 'var(--font-bold)',
            color: 'white'
          }}>
            {summary.count}
          </div>
        </div>

        {/* Total Hours */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          borderRadius: 'var(--radius-sm)',
          padding: 'var(--space-2)',
          backdropFilter: 'blur(10px)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: 'var(--text-xs)',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: 'var(--space-1)'
          }}>
            ⏱️ {t('workouts.monthSummary.hours')}
          </div>
          <div style={{
            fontSize: 'var(--text-xl)',
            fontWeight: 'var(--font-bold)',
            color: 'white'
          }}>
            {summary.totalHours}h
          </div>
        </div>

        {/* Total Volume */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          borderRadius: 'var(--radius-sm)',
          padding: 'var(--space-2)',
          backdropFilter: 'blur(10px)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: 'var(--text-xs)',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: 'var(--space-1)'
          }}>
            📦 Volume
          </div>
          <div style={{
            fontSize: 'var(--text-xl)',
            fontWeight: 'var(--font-bold)',
            color: 'white'
          }}>
            {summary.totalVolume || 0}kg
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthSummaryCard;
