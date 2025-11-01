import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useExercise } from '../context/ExerciseContext';
import { useWorkoutPlan } from '../context/WorkoutPlanContext';

const WorkoutPlanModal = ({ isOpen, onClose, onSave, editingPlan }) => {
  const { t } = useLanguage();
  const { exercises } = useExercise();
  const { workoutPlans } = useWorkoutPlan();

  const [planName, setPlanName] = useState('');
  const [planColor, setPlanColor] = useState('#FF6B35');
  const [planDescription, setPlanDescription] = useState('');
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);

  const predefinedColors = [
    '#FF6B35', // Orange
    '#4ECDC4', // Turquoise
    '#FF6F91', // Pink
    '#F8B500', // Yellow
    '#5F27CD', // Purple
    '#00D2FF', // Sky Blue
    '#48C9B0', // Aqua
    '#C44569'  // Dark Pink
  ];

  // Get plan names that contain this exercise (excluding current plan being edited)
  const getPlansForExercise = (exerciseId) => {
    return workoutPlans
      .filter(plan =>
        plan.id !== editingPlan?.id && // Exclude current plan
        plan.workout_plan_exercises?.some(pe => pe.exercise_id === exerciseId)
      )
      .map(plan => plan.name);
  };

  useEffect(() => {
    if (editingPlan) {
      setPlanName(editingPlan.name);
      setPlanColor(editingPlan.color || '#FF6B35');
      setPlanDescription(editingPlan.description || '');

      // Map workout_plan_exercises to selectedExercises format
      const exercisesWithSets = editingPlan.workout_plan_exercises?.map((pe, index) => {
        // Get exercise_id - might be in pe.exercise_id or pe.exercise.id
        const exerciseId = pe.exercise_id || pe.exercise?.id;

        return {
          exercise_id: exerciseId,
          order_index: pe.order_index !== undefined ? pe.order_index : index,
          suggested_sets: pe.suggested_sets || 3,
          notes: pe.notes || '',
          exercise: pe.exercise
        };
      }).filter(e => e.exercise_id) || []; // Filter out any without exercise_id

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
      prev.map(e => e.exercise_id === exerciseId ? { ...e, suggested_sets: parseInt(sets) || 1 } : e)
    );
  };

  const handleIncreaseSets = (exerciseId) => {
    setSelectedExercises(prev =>
      prev.map(e => e.exercise_id === exerciseId ? { ...e, suggested_sets: (e.suggested_sets || 3) + 1 } : e)
    );
  };

  const handleDecreaseSets = (exerciseId) => {
    setSelectedExercises(prev =>
      prev.map(e => e.exercise_id === exerciseId ? { ...e, suggested_sets: Math.max(1, (e.suggested_sets || 3) - 1) } : e)
    );
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    e.stopPropagation();

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newExercises = [...selectedExercises];
    const draggedItem = newExercises[draggedIndex];

    // Remove from old position
    newExercises.splice(draggedIndex, 1);
    // Insert at new position
    newExercises.splice(dropIndex, 0, draggedItem);

    // Update order_index
    newExercises.forEach((e, i) => e.order_index = i);

    setSelectedExercises(newExercises);
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSelectExercise = (e) => {
    const exerciseId = e.target.value;
    if (!exerciseId) return;

    const exercise = exercises.find(ex => ex.id === exerciseId);
    if (exercise) {
      handleAddExercise(exercise);
    }

    // Reset select
    e.target.value = '';
  };

  const handleSave = () => {
    if (!planName.trim()) {
      alert(t('plans.modal.nameRequired'));
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
    onClose();
  };

  const availableExercises = exercises
    .filter(ex => !selectedExercises.find(se => se.exercise_id === ex.id))
    .map(ex => ({
      ...ex,
      assignedPlans: getPlansForExercise(ex.id)
    }))
    .sort((a, b) => {
      // Unassigned exercises first
      if (a.assignedPlans.length === 0 && b.assignedPlans.length > 0) return -1;
      if (a.assignedPlans.length > 0 && b.assignedPlans.length === 0) return 1;
      // Then alphabetically by name
      return a.name.localeCompare(b.name);
    });

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
          padding: 'var(--space-4)',
          paddingBottom: '60px'
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
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    padding: 'var(--space-2)',
                    backgroundColor: draggedIndex === index ? 'var(--bg-secondary)' : 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: 'var(--space-2)',
                    cursor: draggedIndex === index ? 'grabbing' : 'grab',
                    opacity: draggedIndex === index ? 0.5 : 1,
                    transition: 'background var(--transition-fast), opacity var(--transition-fast)',
                    border: draggedIndex === index ? '2px dashed var(--accent-primary)' : 'none'
                  }}
                >
                  {/* Drag handle */}
                  <div style={{
                    color: 'var(--text-tertiary)',
                    fontSize: '16px',
                    cursor: 'grab',
                    userSelect: 'none'
                  }}>
                    ⋮⋮
                  </div>

                  <span style={{ flex: 1, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                    {index + 1}. {se.exercise?.name}
                  </span>

                  {/* Sets control with +/- buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <button
                      onClick={() => handleDecreaseSets(se.exercise_id)}
                      disabled={se.suggested_sets <= 1}
                      style={{
                        width: '28px',
                        height: '28px',
                        padding: '0',
                        backgroundColor: 'var(--bg-primary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        color: se.suggested_sets <= 1 ? 'var(--text-tertiary)' : 'var(--text-primary)',
                        fontSize: 'var(--text-sm)',
                        cursor: se.suggested_sets <= 1 ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={se.suggested_sets}
                      onChange={(e) => handleUpdateSets(se.exercise_id, e.target.value)}
                      style={{
                        width: '40px',
                        height: '28px',
                        padding: '4px',
                        backgroundColor: 'var(--bg-primary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--text-primary)',
                        fontSize: 'var(--text-sm)',
                        textAlign: 'center'
                      }}
                    />
                    <button
                      onClick={() => handleIncreaseSets(se.exercise_id)}
                      style={{
                        width: '28px',
                        height: '28px',
                        padding: '0',
                        backgroundColor: 'var(--bg-primary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--text-primary)',
                        fontSize: 'var(--text-sm)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      +
                    </button>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginLeft: '4px' }}>
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

          {/* Add Exercise with Select */}
          <select
            onChange={handleSelectExercise}
            className="dark-input"
            style={{
              fontSize: 'var(--text-sm)',
              width: '100%',
              padding: 'var(--space-2)',
              cursor: 'pointer'
            }}
            value=""
          >
            <option value="" disabled>
              {t('plans.modal.selectExercise')}
            </option>
            {availableExercises.map(exercise => (
              <option key={exercise.id} value={exercise.id}>
                {exercise.name}
                {exercise.assignedPlans.length > 0 && ` 📋 ${exercise.assignedPlans.join(', ')}`}
              </option>
            ))}
          </select>
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
