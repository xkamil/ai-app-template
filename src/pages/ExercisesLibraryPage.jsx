import { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useExercise } from '../context/ExerciseContext';
import BottomNav from '../components/BottomNav';
import AddExerciseModal from '../components/AddExerciseModal';
import ExerciseCard from '../components/ExerciseCard';

const ExercisesLibraryPage = () => {
  const { t } = useLanguage();
  const { exercises, loading, deleteExercise } = useExercise();

  const [showModal, setShowModal] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter exercises
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

    return filtered;
  }, [exercises, searchQuery]);

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
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <input
            type="text"
            className="dark-input"
            placeholder={t('exercises.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              fontSize: 'var(--text-base)',
              paddingLeft: 'var(--space-5)'
            }}
          />
          <div style={{ position: 'relative', top: '-38px', left: '16px', pointerEvents: 'none', fontSize: 'var(--text-lg)' }}>
            🔍
          </div>
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
