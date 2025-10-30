import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useExercise } from '../context/ExerciseContext';

const WorkoutPlanModal = ({ isOpen, onClose, onSave, editingPlan }) => {
  const { t } = useLanguage();
  const { exercises } = useExercise();

  const [planName, setPlanName] = useState('');
  const [planColor, setPlanColor] = useState('#FF6B35');
  const [planDescription, setPlanDescription] = useState('');
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const predefinedColors = [
    '#FF6B35', // Orange
    '#F7931E', // Gold
    '#4ECDC4', // Turquoise
    '#95E1D3', // Mint
    '#FF6F91', // Pink
    '#C44569', // Dark Pink
    '#F8B500', // Yellow
    '#5F27CD', // Purple
    '#00D2FF', // Sky Blue
    '#48C9B0'  // Aqua
  ];

  useEffect(() => {
    if (editingPlan) {
      setPlanName(editingPlan.name);
      setPlanColor(editingPlan.color || '#FF6B35');
      setPlanDescription(editingPlan.description || '');

      // Map workout_plan_exercises to selectedExercises format
      const exercisesWithSets = editingPlan.workout_plan_exercises?.map((pe, index) => ({
        exercise_id: pe.exercise_id,
        order_index: pe.order_index !== undefined ? pe.order_index : index,
        suggested_sets: pe.suggested_sets || 3,
        notes: pe.notes || '',
        exercise: pe.exercise
      })) || [];

      setSelectedExercises(exercisesWithSets);
    } else {
      // Reset form for new plan
      setPlanName('');
      setPlanColor('#FF6B35');
      setPlanDescription('');
      setSelectedExercises([]);
    }
  }, [editingPlan, isOpen]);

  const handleAddExercise = (exercise) => {
    if (selectedExercises.find(e => e.exercise_id === exercise.id)) {
      return; // Already added
    }

    setSelectedExercises(prev => [...prev, {
      exercise_id: exercise.id,
      order_index: prev.length,
      suggested_sets: 3,
      notes: '',
      exercise: exercise
    }]);
  };

  const handleRemoveExercise = (exerciseId) => {
    setSelectedExercises(prev =>
      prev.filter(e => e.exercise_id !== exerciseId)
        .map((e, index) => ({ ...e, order_index: index }))
    );
  };

  const handleUpdateSets = (exerciseId, sets) => {
    setSelectedExercises(prev =>
      prev.map(e => e.exercise_id === exerciseId ? { ...e, suggested_sets: parseInt(sets) || 3 } : e)
    );
  };

  const handleMoveExercise = (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= selectedExercises.length) return;

    const newExercises = [...selectedExercises];
    [newExercises[index], newExercises[newIndex]] = [newExercises[newIndex], newExercises[index]];

    // Update order_index
    newExercises.forEach((e, i) => e.order_index = i);

    setSelectedExercises(newExercises);
  };

  const handleSave = () => {
    if (!planName.trim()) {
      alert(t('plans.modal.nameRequired'));
      return;
    }

    if (selectedExercises.length === 0) {
      alert(t('plans.modal.exercisesRequired'));
      return;
    }

    onSave({
      name: planName.trim(),
      color: planColor,
      description: planDescription.trim(),
      exercises: selectedExercises
    });

    handleClose();
  };

  const handleClose = () => {
    setPlanName('');
    setPlanColor('#FF6B35');
    setPlanDescription('');
    setSelectedExercises([]);
    setSearchQuery('');
    onClose();
  };

  const filteredExercises = exercises.filter(ex =>
    ex.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !selectedExercises.find(se => se.exercise_id === ex.id)
  );

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 'var(--space-4)'
      }}
      onClick={handleClose}
    >
      <div
        className="dark-card"
        style={{
          width: '100%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: 'var(--space-4)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ fontSize: 'var(--text-xl)', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
          {editingPlan ? t('plans.modal.editTitle') : t('plans.modal.createTitle')}
        </h2>

        {/* Plan Name */}
        <div style={{ marginBottom: 'var(--space-3)' }}>
          <label style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>
            {t('plans.modal.name')} *
          </label>
          <input
            type="text"
            className="dark-input"
            placeholder={t('plans.modal.namePlaceholder')}
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            style={{ fontSize: 'var(--text-base)' }}
          />
        </div>

        {/* Plan Color */}
        <div style={{ marginBottom: 'var(--space-3)' }}>
          <label style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>
            {t('plans.modal.color')}
          </label>
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            {predefinedColors.map(color => (
              <button
                key={color}
                onClick={() => setPlanColor(color)}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: color,
                  border: planColor === color ? '3px solid white' : '1px solid var(--border-color)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              />
            ))}
          </div>
        </div>

        {/* Plan Description */}
        <div style={{ marginBottom: 'var(--space-3)' }}>
          <label style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>
            {t('plans.modal.description')}
          </label>
          <textarea
            className="dark-input"
            placeholder={t('plans.modal.descriptionPlaceholder')}
            value={planDescription}
            onChange={(e) => setPlanDescription(e.target.value)}
            rows={2}
            style={{ fontSize: 'var(--text-base)', resize: 'vertical' }}
          />
        </div>

        {/* Selected Exercises */}
        <div style={{ marginBottom: 'var(--space-3)' }}>
          <label style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>
            {t('plans.modal.exercises')} * ({selectedExercises.length})
          </label>

          {selectedExercises.length > 0 ? (
            <div style={{ marginBottom: 'var(--space-2)' }}>
              {selectedExercises.map((se, index) => (
                <div
                  key={se.exercise_id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    padding: 'var(--space-2)',
                    backgroundColor: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: 'var(--space-2)'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <button
                      onClick={() => handleMoveExercise(index, 'up')}
                      disabled={index === 0}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: index === 0 ? 'var(--text-tertiary)' : 'var(--text-secondary)',
                        cursor: index === 0 ? 'default' : 'pointer',
                        fontSize: '12px',
                        padding: '0'
                      }}
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => handleMoveExercise(index, 'down')}
                      disabled={index === selectedExercises.length - 1}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: index === selectedExercises.length - 1 ? 'var(--text-tertiary)' : 'var(--text-secondary)',
                        cursor: index === selectedExercises.length - 1 ? 'default' : 'pointer',
                        fontSize: '12px',
                        padding: '0'
                      }}
                    >
                      ▼
                    </button>
                  </div>

                  <span style={{ flex: 1, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                    {index + 1}. {se.exercise?.name}
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={se.suggested_sets}
                      onChange={(e) => handleUpdateSets(se.exercise_id, e.target.value)}
                      style={{
                        width: '50px',
                        padding: '4px',
                        backgroundColor: 'var(--bg-primary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--text-primary)',
                        fontSize: 'var(--text-sm)',
                        textAlign: 'center'
                      }}
                    />
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                      {t('plans.sets')}
                    </span>
                  </div>

                  <button
                    onClick={() => handleRemoveExercise(se.exercise_id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--danger)',
                      fontSize: 'var(--text-base)',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              padding: 'var(--space-4)',
              textAlign: 'center',
              color: 'var(--text-tertiary)',
              fontSize: 'var(--text-sm)',
              backgroundColor: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-md)',
              marginBottom: 'var(--space-2)'
            }}>
              {t('plans.modal.noExercises')}
            </div>
          )}

          {/* Search and Add Exercises */}
          <input
            type="text"
            className="dark-input"
            placeholder={t('plans.modal.searchExercises')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}
          />

          {searchQuery && (
            <div style={{
              maxHeight: '200px',
              overflowY: 'auto',
              backgroundColor: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-2)'
            }}>
              {filteredExercises.length > 0 ? (
                filteredExercises.map(exercise => (
                  <button
                    key={exercise.id}
                    onClick={() => handleAddExercise(exercise)}
                    style={{
                      width: '100%',
                      padding: 'var(--space-2)',
                      textAlign: 'left',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-primary)',
                      fontSize: 'var(--text-sm)',
                      cursor: 'pointer',
                      borderRadius: 'var(--radius-sm)',
                      marginBottom: '4px',
                      transition: 'background var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'var(--bg-secondary)'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  >
                    + {exercise.name}
                  </button>
                ))
              ) : (
                <div style={{ padding: 'var(--space-2)', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>
                  {t('plans.modal.noResults')}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
          <button
            onClick={handleSave}
            className="gradient-button"
            style={{ flex: 1 }}
          >
            {editingPlan ? t('plans.modal.save') : t('plans.modal.create')}
          </button>
          <button
            onClick={handleClose}
            style={{
              flex: 1,
              padding: 'var(--space-3)',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--font-semibold)',
              cursor: 'pointer'
            }}
          >
            {t('plans.modal.cancel')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutPlanModal;
