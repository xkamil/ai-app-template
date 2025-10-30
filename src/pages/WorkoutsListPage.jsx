import { useLanguage } from '../context/LanguageContext';
import { useWorkout } from '../context/WorkoutContext';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import WeekSummaryCard from '../components/WeekSummaryCard';
import WorkoutCard from '../components/WorkoutCard';

const WorkoutsListPage = () => {
  const { t } = useLanguage();
  const { workouts, loading, deleteWorkout, getWeekSummary } = useWorkout();
  const navigate = useNavigate();

  const weekSummary = getWeekSummary();

  const handleDelete = async (id) => {
    const result = await deleteWorkout(id);
    if (result.error) {
      alert(result.error);
    }
  };

  const handleNewWorkout = () => {
    navigate('/plans');
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="page-title">
              {t('workouts.title')}
            </h1>
            <p className="page-subtitle">
              {t('workouts.subtitle')}
            </p>
          </div>
          <button
            onClick={handleNewWorkout}
            style={{
              background: 'var(--accent-gradient)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-3) var(--space-4)',
              color: 'white',
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-semibold)',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all var(--transition-base)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = 'var(--shadow-md)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'var(--shadow-sm)';
            }}
          >
            ➕
          </button>
        </div>
      </div>

      <div className="page-content">
        {/* Week Summary */}
        <WeekSummaryCard summary={weekSummary} />

        {/* Loading State */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">{t('common.loading')}</span>
            </div>
          </div>
        ) : workouts.length === 0 ? (
          /* Empty State */
          <div className="dark-card fade-in" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
            <h2 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>
              {t('workouts.emptyState.title')}
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
              {t('workouts.emptyState.subtitle')}
            </p>
            <button className="gradient-button" onClick={handleNewWorkout}>
              {t('workouts.emptyState.cta')}
            </button>
          </div>
        ) : (
          /* Workout List */
          <div>
            <h2 style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-semibold)',
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-3)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)'
            }}>
              📜 {t('workouts.recentWorkouts')} ({workouts.length})
            </h2>

            {workouts.map(workout => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default WorkoutsListPage;
