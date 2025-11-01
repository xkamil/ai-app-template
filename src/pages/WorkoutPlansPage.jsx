import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useWorkoutPlan } from '../context/WorkoutPlanContext';
import { useWorkout } from '../context/WorkoutContext';
import BottomNav from '../components/BottomNav';
import WorkoutPlanCard from '../components/WorkoutPlanCard';
import WorkoutPlanModal from '../components/WorkoutPlanModal';

const WorkoutPlansPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { workoutPlans, loading, createWorkoutPlan, updateWorkoutPlan, deleteWorkoutPlan, clonePlan } = useWorkoutPlan();
  const { workouts } = useWorkout();

  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Function to get the last workout date for a plan
  const getLastWorkoutDate = (planId) => {
    const planWorkouts = workouts.filter(w => w.workout_plan_id === planId);
    if (planWorkouts.length === 0) return null;

    // Find the most recent workout
    const sortedWorkouts = planWorkouts.sort((a, b) =>
      new Date(b.workout_date) - new Date(a.workout_date)
    );

    return sortedWorkouts[0].workout_date;
  };

  // Filter and sort plans
  const filteredAndSortedPlans = useMemo(() => {
    let filtered = workoutPlans;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(plan =>
        plan.name.toLowerCase().includes(query) ||
        (plan.description && plan.description.toLowerCase().includes(query))
      );
    }

    // Sort by last workout date (oldest/never used first)
    return [...filtered].sort((a, b) => {
      const dateA = getLastWorkoutDate(a.id);
      const dateB = getLastWorkoutDate(b.id);

      // Plans without workouts come first
      if (!dateA && !dateB) return 0;
      if (!dateA) return -1;
      if (!dateB) return 1;

      // Otherwise sort by date (oldest first)
      return new Date(dateA) - new Date(dateB);
    });
  }, [workoutPlans, workouts, searchQuery]);

  // Debug logging
  console.log('WorkoutPlansPage: workoutPlans:', workoutPlans);
  console.log('WorkoutPlansPage: loading:', loading);
  console.log('WorkoutPlansPage: workoutPlans.length:', workoutPlans?.length);

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

  const handleClonePlan = async (plan) => {
    const result = await clonePlan(plan);
    if (result.error) {
      alert(t('plans.cloneError'));
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
      {/* Header */}
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="page-title">
              {t('plans.title')}
            </h1>
            <p className="page-subtitle">
              {t('plans.subtitle')}
            </p>
          </div>
          <button
            onClick={handleCreatePlan}
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
        {/* Search Bar */}
        {workoutPlans.length > 0 && (
          <div style={{ marginBottom: 'var(--space-3)', position: 'relative' }}>
            <input
              type="text"
              className="dark-input"
              placeholder={t('newWorkout.step0.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                fontSize: 'var(--text-base)',
                paddingRight: searchQuery ? 'var(--space-10)' : 'var(--space-3)'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: 'var(--space-3)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-tertiary)',
                  fontSize: 'var(--text-lg)',
                  cursor: 'pointer',
                  padding: 'var(--space-1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'color var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'var(--text-tertiary)';
                }}
              >
                ✕
              </button>
            )}
          </div>
        )}

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
        ) : filteredAndSortedPlans.length === 0 ? (
          <div className="dark-card fade-in" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <h2 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>
              No plans found
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Try adjusting your search
            </p>
          </div>
        ) : (
          <>
            {filteredAndSortedPlans.map(plan => (
              <WorkoutPlanCard
                key={plan.id}
                plan={plan}
                onEdit={handleEditPlan}
                onDelete={handleDeletePlan}
                onSelect={handleStartWorkout}
                onClone={handleClonePlan}
                lastWorkoutDate={getLastWorkoutDate(plan.id)}
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
