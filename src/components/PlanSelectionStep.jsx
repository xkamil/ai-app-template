import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useWorkoutPlan } from '../context/WorkoutPlanContext';
import WorkoutPlanCard from './WorkoutPlanCard';
import WorkoutPlanModal from './WorkoutPlanModal';

const PlanSelectionStep = ({ onSelectPlan }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { workoutPlans, loading, createWorkoutPlan } = useWorkoutPlan();
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreatePlan = () => {
    setShowModal(true);
  };

  const handleSavePlan = async (planData) => {
    const result = await createWorkoutPlan(planData);
    if (result.error) {
      alert(result.error);
    } else if (result.data) {
      // After creating plan, select it
      onSelectPlan(result.data);
    }
  };

  const handleSelectPlan = (plan) => {
    onSelectPlan(plan);
  };

  const handleCancel = () => {
    navigate('/workouts');
  };

  const filteredPlans = workoutPlans.filter(plan =>
    plan.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
          <button
            onClick={handleCancel}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: 'var(--text-2xl)',
              cursor: 'pointer',
              padding: 0
            }}
          >
            ←
          </button>
          <h1 className="page-title" style={{ margin: 0 }}>
            {t('newWorkout.step0.title')}
          </h1>
        </div>
        <p className="page-subtitle">
          {t('newWorkout.step0.progress')}
        </p>
      </div>

      <div className="page-content">
        {/* Search */}
        <input
          type="text"
          className="dark-input"
          placeholder={t('newWorkout.step0.search')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginBottom: 'var(--space-3)', fontSize: 'var(--text-base)' }}
        />

        {/* Create New Plan Button */}
        <button
          onClick={handleCreatePlan}
          style={{
            width: '100%',
            padding: 'var(--space-3)',
            marginBottom: 'var(--space-4)',
            background: 'var(--accent-gradient)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            color: 'white',
            fontSize: 'var(--text-base)',
            fontWeight: 'var(--font-bold)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-2)'
          }}
        >
          ➕ {t('newWorkout.step0.createNew')}
        </button>

        {/* Plans List */}
        {workoutPlans.length === 0 ? (
          <div className="dark-card fade-in" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
            <h2 style={{ color: 'var(--text-primary)', marginBottom: '8px', fontSize: 'var(--text-lg)' }}>
              {t('newWorkout.step0.emptyState.title')}
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: 'var(--text-sm)' }}>
              {t('newWorkout.step0.emptyState.subtitle')}
            </p>
            <button className="gradient-button" onClick={handleCreatePlan}>
              {t('newWorkout.step0.emptyState.cta')}
            </button>
          </div>
        ) : filteredPlans.length === 0 ? (
          <div className="dark-card" style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
              {t('newWorkout.step0.noResults')}
            </p>
          </div>
        ) : (
          <>
            <h3 style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--text-tertiary)',
              marginBottom: 'var(--space-2)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {t('newWorkout.step0.yourPlans')} ({filteredPlans.length})
            </h3>
            {filteredPlans.map(plan => (
              <WorkoutPlanCard
                key={plan.id}
                plan={plan}
                onSelect={handleSelectPlan}
              />
            ))}
          </>
        )}
      </div>

      {/* Plan Modal */}
      <WorkoutPlanModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSavePlan}
      />
    </div>
  );
};

export default PlanSelectionStep;
