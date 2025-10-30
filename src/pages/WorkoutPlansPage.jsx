import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useWorkoutPlan } from '../context/WorkoutPlanContext';
import BottomNav from '../components/BottomNav';
import WorkoutPlanCard from '../components/WorkoutPlanCard';
import WorkoutPlanModal from '../components/WorkoutPlanModal';

const WorkoutPlansPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { workoutPlans, loading, createWorkoutPlan, updateWorkoutPlan, deleteWorkoutPlan } = useWorkoutPlan();

  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const handleCreatePlan = () => {
    setEditingPlan(null);
    setShowModal(true);
  };

  const handleEditPlan = (plan) => {
    setEditingPlan(plan);
    setShowModal(true);
  };

  const handleDeletePlan = async (plan) => {
    if (window.confirm(t('plans.deleteConfirm').replace('{name}', plan.name))) {
      const result = await deleteWorkoutPlan(plan.id);
      if (result.error) {
        alert(t('plans.deleteError'));
      }
    }
  };

  const handleSavePlan = async (planData) => {
    if (editingPlan) {
      // Update existing plan
      const result = await updateWorkoutPlan(editingPlan.id, planData);
      if (result.error) {
        alert(result.error);
      }
    } else {
      // Create new plan
      const result = await createWorkoutPlan(planData);
      if (result.error) {
        alert(result.error);
      }
    }
  };

  const handleStartWorkout = (plan) => {
    // Navigate to new workout page with plan ID
    navigate(`/workout/new?planId=${plan.id}`);
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

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">
          {t('plans.title')}
        </h1>
        <p className="page-subtitle">
          {t('plans.subtitle')}
        </p>
      </div>

      <div className="page-content">
        {/* Create Plan Button */}
        <button
          onClick={handleCreatePlan}
          className="gradient-button"
          style={{ width: '100%', marginBottom: 'var(--space-4)' }}
        >
          ➕ {t('plans.create')}
        </button>

        {/* Plans List */}
        {workoutPlans.length === 0 ? (
          <div className="dark-card fade-in" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
            <h2 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>
              {t('plans.emptyState.title')}
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
              {t('plans.emptyState.subtitle')}
            </p>
            <button className="gradient-button" onClick={handleCreatePlan}>
              {t('plans.emptyState.cta')}
            </button>
          </div>
        ) : (
          <>
            {workoutPlans.map(plan => (
              <WorkoutPlanCard
                key={plan.id}
                plan={plan}
                onEdit={handleEditPlan}
                onDelete={handleDeletePlan}
                onSelect={handleStartWorkout}
              />
            ))}
          </>
        )}
      </div>

      {/* Plan Modal */}
      <WorkoutPlanModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingPlan(null);
        }}
        onSave={handleSavePlan}
        editingPlan={editingPlan}
      />

      <BottomNav />
    </div>
  );
};

export default WorkoutPlansPage;
