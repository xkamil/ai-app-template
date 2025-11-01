import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useWorkout } from '../context/WorkoutContext';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import MonthSummaryCard from '../components/MonthSummaryCard';
import WorkoutCard from '../components/WorkoutCard';
import ConfirmModal from '../components/ConfirmModal';

const WorkoutsListPage = () => {
  const { t } = useLanguage();
  const { workouts, loading, deleteWorkout, getMonthSummary, activeWorkout, clearActiveWorkout } = useWorkout();
  const navigate = useNavigate();

  // Modal state
  const [showCancelActiveWorkoutModal, setShowCancelActiveWorkoutModal] = useState(false);

  const monthSummary = getMonthSummary();

  const handleDelete = async (id) => {
    const result = await deleteWorkout(id);
    if (result.error) {
      alert(result.error);
    }
  };

  const handleNewWorkout = () => {
    navigate('/plans');
  };

  const handleContinueWorkout = () => {
    navigate('/workout/new');
  };

  const handleCancelActiveWorkout = () => {
    setShowCancelActiveWorkoutModal(true);
  };

  const confirmCancelActiveWorkout = () => {
    setShowCancelActiveWorkoutModal(false);
    clearActiveWorkout();
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
        {/* Month Summary */}
        <MonthSummaryCard summary={monthSummary} />

        {/* Ongoing Workout Card */}
        {activeWorkout && (
          <div
            className="dark-card"
            style={{
              marginBottom: 'var(--space-4)',
              background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)',
              border: '2px solid var(--accent-primary)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Animated background indicator */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'var(--accent-gradient)',
              animation: 'pulse 2s ease-in-out infinite'
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 'var(--space-3)'
              }}>
                <div>
                  <h3 style={{
                    fontSize: 'var(--text-lg)',
                    fontWeight: 'var(--font-bold)',
                    color: 'var(--accent-primary)',
                    marginBottom: 'var(--space-1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)'
                  }}>
                    <span style={{ fontSize: '24px' }}>🏋️</span>
                    {t('workouts.ongoing.title')}
                  </h3>
                  <p style={{
                    fontSize: 'var(--text-base)',
                    color: 'var(--text-primary)',
                    fontWeight: 'var(--font-semibold)',
                    marginBottom: 'var(--space-1)'
                  }}>
                    {activeWorkout.selectedPlan?.name}
                  </p>
                  <p style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-tertiary)'
                  }}>
                    💪 {Object.keys(activeWorkout.workoutData?.exercises || {}).length} {t('plans.exercises')}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: 'var(--space-2)'
              }}>
                <button
                  onClick={handleContinueWorkout}
                  className="gradient-button"
                  style={{
                    flex: 1,
                    padding: 'var(--space-3)'
                  }}
                >
                  {t('workouts.ongoing.continue')}
                </button>
                <button
                  onClick={handleCancelActiveWorkout}
                  style={{
                    flex: 1,
                    padding: 'var(--space-3)',
                    background: 'transparent',
                    border: '1px solid var(--danger)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--danger)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-semibold)',
                    cursor: 'pointer'
                  }}
                >
                  {t('workouts.ongoing.cancel')}
                </button>
              </div>
            </div>
          </div>
        )}

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

      {/* Cancel Active Workout Confirmation Modal */}
      <ConfirmModal
        show={showCancelActiveWorkoutModal}
        title={t('workouts.ongoing.cancel')}
        message={t('workouts.ongoing.confirmCancel')}
        onConfirm={confirmCancelActiveWorkout}
        onCancel={() => setShowCancelActiveWorkoutModal(false)}
        confirmText={t('common.confirm')}
        cancelText={t('common.cancel')}
        isDanger={true}
      />
    </div>
  );
};

export default WorkoutsListPage;
