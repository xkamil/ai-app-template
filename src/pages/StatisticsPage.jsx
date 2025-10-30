import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useWorkout } from '../context/WorkoutContext';
import BottomNav from '../components/BottomNav';
import ActivityHeatmap from '../components/ActivityHeatmap';
import PRCard from '../components/PRCard';

const StatisticsPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { workouts, loading, getPersonalRecords } = useWorkout();
  const [timeRange, setTimeRange] = useState('all'); // 'week', 'month', '3months', 'year', 'all'

  // Filter workouts by time range
  const filteredWorkouts = useMemo(() => {
    if (timeRange === 'all') return workouts;

    const now = new Date();
    const cutoffDate = new Date(now);

    switch (timeRange) {
      case 'week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case '3months':
        cutoffDate.setDate(now.getDate() - 90);
        break;
      case 'year':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return workouts;
    }

    return workouts.filter(w => new Date(w.workout_date) >= cutoffDate);
  }, [workouts, timeRange]);

  const personalRecords = useMemo(() => {
    return getPersonalRecords();
  }, [workouts, getPersonalRecords]);

  const handleNewWorkout = () => {
    navigate('/workout/new');
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-content">
          <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">{t('common.loading')}</span>
            </div>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (workouts.length === 0) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">
            {t('stats.title')}
          </h1>
        </div>

        <div className="page-content">
          <div className="dark-card fade-in" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
            <h2 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>
              {t('stats.emptyState.title')}
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
              {t('stats.emptyState.subtitle')}
            </p>
            <button className="gradient-button" onClick={handleNewWorkout}>
              {t('stats.emptyState.cta')}
            </button>
          </div>
        </div>

        <BottomNav />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">
          {t('stats.title')}
        </h1>
        <p className="page-subtitle">
          Track your progress
        </p>
      </div>

      <div className="page-content">
        {/* Time Range Filter */}
        <div style={{
          display: 'flex',
          gap: 'var(--space-2)',
          overflowX: 'auto',
          paddingBottom: 'var(--space-2)',
          marginBottom: 'var(--space-4)',
          scrollbarWidth: 'thin'
        }}>
          {[
            { value: 'week', label: t('stats.timeRange.week') },
            { value: 'month', label: t('stats.timeRange.month') },
            { value: '3months', label: t('stats.timeRange.threeMonths') },
            { value: 'year', label: t('stats.timeRange.year') },
            { value: 'all', label: t('stats.timeRange.all') }
          ].map(range => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value)}
              style={{
                padding: 'var(--space-2) var(--space-4)',
                background: timeRange === range.value ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                color: timeRange === range.value ? 'white' : 'var(--text-secondary)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-medium)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all var(--transition-fast)'
              }}
            >
              {range.label}
            </button>
          ))}
        </div>

        {/* Activity Heatmap */}
        <ActivityHeatmap workouts={filteredWorkouts} />

        {/* Personal Records */}
        <div style={{ marginTop: 'var(--space-5)' }}>
          <h2 style={{
            fontSize: 'var(--text-lg)',
            fontWeight: 'var(--font-semibold)',
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-3)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)'
          }}>
            🏆 {t('stats.prs.title')} ({personalRecords.length})
          </h2>

          {personalRecords.length === 0 ? (
            <div className="dark-card" style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
              <div style={{ fontSize: '48px', marginBottom: 'var(--space-2)' }}>💪</div>
              <p style={{ color: 'var(--text-secondary)' }}>
                No personal records yet. Keep training!
              </p>
            </div>
          ) : (
            personalRecords.map(pr => (
              <PRCard key={pr.exercise_id} pr={pr} />
            ))
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default StatisticsPage;
