import { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useExercise } from '../context/ExerciseContext';
import { useWorkout } from '../context/WorkoutContext';
import { useWorkoutPlan } from '../context/WorkoutPlanContext';
import BottomNav from '../components/BottomNav';
import AddExerciseModal from '../components/AddExerciseModal';
import ExerciseCard from '../components/ExerciseCard';

const ExercisesLibraryPage = () => {
  const { t } = useLanguage();
  const { exercises, loading, deleteExercise, cloneExercise } = useExercise();
  const { workouts } = useWorkout();
  const { workoutPlans } = useWorkoutPlan();

  const [showModal, setShowModal] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Filter and sort exercises
  const filteredExercises = useMemo(() => {
    let filtered = exercises;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(ex =>
        ex.name.toLowerCase().includes(query) ||
        (ex.description && ex.description.toLowerCase().includes(query))
      );
    }

    // Filter by plan assignment (if 'without_plan' is selected as sortBy)
    if (sortBy === 'without_plan') {
      filtered = filtered.filter(exercise => {
        const hasPlans = workoutPlans.some(plan =>
          plan.workout_plan_exercises?.some(wpe => wpe.exercise_id === exercise.id)
        );
        return !hasPlans;
      });
    }

    // Calculate workout count for each exercise
    const exercisesWithCount = filtered.map(exercise => {
      const workoutsCount = workouts.filter(workout =>
        workout.workout_exercises?.some(we => we.exercise?.id === exercise.id)
      ).length;
      return { ...exercise, workoutsCount };
    });

    // Sort based on selected option
    const sorted = [...exercisesWithCount].sort((a, b) => {
      switch (sortBy) {
        case 'most_used':
          return b.workoutsCount - a.workoutsCount;
        case 'least_used':
          return a.workoutsCount - b.workoutsCount;
        case 'newest':
        default:
          return new Date(b.created_at) - new Date(a.created_at);
      }
    });

    return sorted;
  }, [exercises, searchQuery, sortBy, workouts, workoutPlans]);

  const handleAddNew = () => {
    setEditingExercise(null);
    setShowModal(true);
  };

  const handleEdit = (exercise) => {
    setEditingExercise(exercise);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const result = await deleteExercise(id);
    if (result.error) {
      alert(result.error);
    }
  };

  const handleClone = async (exercise) => {
    const result = await cloneExercise(exercise);
    if (result.error) {
      alert(result.error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingExercise(null);
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="page-title">
              {t('exercises.title')}
            </h1>
            <p className="page-subtitle">
              {t('exercises.count', { count: exercises.length })}
            </p>
          </div>
          <button
            onClick={handleAddNew}
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
        <div style={{ marginBottom: 'var(--space-2)', position: 'relative' }}>
          <input
            type="text"
            className="dark-input"
            placeholder={t('exercises.search')}
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

        {/* Sort and Filter Buttons */}
        <div style={{
          display: 'flex',
          gap: 'var(--space-2)',
          marginBottom: 'var(--space-3)',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setSortBy('newest')}
            style={{
              flex: 1,
              padding: 'var(--space-2) var(--space-3)',
              background: sortBy === 'newest' ? 'var(--accent-primary)' : 'transparent',
              border: `1px solid ${sortBy === 'newest' ? 'var(--accent-primary)' : 'var(--border-color)'}`,
              borderRadius: 'var(--radius-md)',
              color: sortBy === 'newest' ? 'white' : 'var(--text-secondary)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-semibold)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              if (sortBy !== 'newest') {
                e.target.style.borderColor = 'var(--text-secondary)';
              }
            }}
            onMouseLeave={(e) => {
              if (sortBy !== 'newest') {
                e.target.style.borderColor = 'var(--border-color)';
              }
            }}
          >
            {t('exercises.sort.newest')}
          </button>

          <button
            onClick={() => setSortBy('most_used')}
            style={{
              flex: 1,
              padding: 'var(--space-2) var(--space-3)',
              background: sortBy === 'most_used' ? 'var(--accent-primary)' : 'transparent',
              border: `1px solid ${sortBy === 'most_used' ? 'var(--accent-primary)' : 'var(--border-color)'}`,
              borderRadius: 'var(--radius-md)',
              color: sortBy === 'most_used' ? 'white' : 'var(--text-secondary)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-semibold)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              if (sortBy !== 'most_used') {
                e.target.style.borderColor = 'var(--text-secondary)';
              }
            }}
            onMouseLeave={(e) => {
              if (sortBy !== 'most_used') {
                e.target.style.borderColor = 'var(--border-color)';
              }
            }}
          >
            {t('exercises.sort.mostUsed')}
          </button>

          <button
            onClick={() => setSortBy('least_used')}
            style={{
              flex: 1,
              padding: 'var(--space-2) var(--space-3)',
              background: sortBy === 'least_used' ? 'var(--accent-primary)' : 'transparent',
              border: `1px solid ${sortBy === 'least_used' ? 'var(--accent-primary)' : 'var(--border-color)'}`,
              borderRadius: 'var(--radius-md)',
              color: sortBy === 'least_used' ? 'white' : 'var(--text-secondary)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-semibold)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              if (sortBy !== 'least_used') {
                e.target.style.borderColor = 'var(--text-secondary)';
              }
            }}
            onMouseLeave={(e) => {
              if (sortBy !== 'least_used') {
                e.target.style.borderColor = 'var(--border-color)';
              }
            }}
          >
            {t('exercises.sort.leastUsed')}
          </button>

          <button
            onClick={() => setSortBy('without_plan')}
            style={{
              flex: 1,
              padding: 'var(--space-2) var(--space-3)',
              background: sortBy === 'without_plan' ? 'var(--accent-primary)' : 'transparent',
              border: `1px solid ${sortBy === 'without_plan' ? 'var(--accent-primary)' : 'var(--border-color)'}`,
              borderRadius: 'var(--radius-md)',
              color: sortBy === 'without_plan' ? 'white' : 'var(--text-secondary)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-semibold)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              if (sortBy !== 'without_plan') {
                e.target.style.borderColor = 'var(--text-secondary)';
              }
            }}
            onMouseLeave={(e) => {
              if (sortBy !== 'without_plan') {
                e.target.style.borderColor = 'var(--border-color)';
              }
            }}
          >
            {t('exercises.filter.withoutPlan')}
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">{t('common.loading')}</span>
            </div>
          </div>
        ) : filteredExercises.length === 0 ? (
          /* Empty State */
          <div className="dark-card fade-in" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💪</div>
            <h2 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>
              {exercises.length === 0 ? t('exercises.emptyState.title') : 'No exercises found'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
              {exercises.length === 0 ? t('exercises.emptyState.subtitle') : 'Try adjusting your search or filters'}
            </p>
            {exercises.length === 0 && (
              <button className="gradient-button" onClick={handleAddNew}>
                {t('exercises.emptyState.cta')}
              </button>
            )}
          </div>
        ) : (
          /* Exercise List */
          <div>
            {filteredExercises.map(exercise => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onClone={handleClone}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Exercise Modal */}
      <AddExerciseModal
        show={showModal}
        onClose={handleCloseModal}
        exercise={editingExercise}
      />

      <BottomNav />
    </div>
  );
};

export default ExercisesLibraryPage;
