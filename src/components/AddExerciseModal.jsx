import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useExercise } from '../context/ExerciseContext';
import { useWorkoutPlan } from '../context/WorkoutPlanContext';

const AddExerciseModal = ({ show, onClose, exercise = null }) => {
  const { t } = useLanguage();
  const { addExercise, updateExercise } = useExercise();
  const { workoutPlans, addExerciseToPlan, removeExerciseFromPlan } = useWorkoutPlan();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditMode = !!exercise;

  // Load exercise data when editing
  useEffect(() => {
    if (exercise) {
      setName(exercise.name || '');
      setDescription(exercise.description || '');

      // Find which plan this exercise belongs to
      const assignedPlan = workoutPlans.find(plan =>
        plan.workout_plan_exercises?.some(wpe => wpe.exercise_id === exercise.id)
      );
      setSelectedPlanId(assignedPlan?.id || '');
    } else {
      setName('');
      setDescription('');
      setSelectedPlanId('');
    }
    setError('');
  }, [exercise, show, workoutPlans]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError(t('exercises.addModal.nameLabel') + ' is required');
      return;
    }

    setLoading(true);

    const exerciseData = {
      name: name.trim(),
      description: description.trim() || null
    };

    // Save/update exercise first
    const result = isEditMode
      ? await updateExercise(exercise.id, exerciseData)
      : await addExercise(exerciseData);

    if (result.error) {
      setLoading(false);
      setError(result.error);
      return;
    }

    // Handle plan assignment
    const savedExerciseId = isEditMode ? exercise.id : result.data.id;

    if (isEditMode) {
      // In edit mode, handle plan change
      const oldPlan = workoutPlans.find(plan =>
        plan.workout_plan_exercises?.some(wpe => wpe.exercise_id === exercise.id)
      );

      // If plan changed
      if (oldPlan?.id !== selectedPlanId) {
        // Remove from old plan if exists
        if (oldPlan) {
          await removeExerciseFromPlan(oldPlan.id, exercise.id);
        }

        // Add to new plan if selected
        if (selectedPlanId) {
          const addResult = await addExerciseToPlan(selectedPlanId, savedExerciseId);
          if (addResult.error) {
            setError(addResult.error);
          }
        }
      }
    } else {
      // In add mode, just add to plan if selected
      if (selectedPlanId) {
        const addResult = await addExerciseToPlan(selectedPlanId, savedExerciseId);
        if (addResult.error) {
          setError(addResult.error);
        }
      }
    }

    setLoading(false);
    onClose();
  };

  const handleClose = () => {
    if (!loading) {
      setName('');
      setDescription('');
      setSelectedPlanId('');
      setError('');
      onClose();
    }
  };

  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 1050,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-4)'
        }}
        onClick={handleClose}
      >
        {/* Modal */}
        <div
          className="dark-card fade-in"
          style={{
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: 'var(--space-6)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', margin: 0 }}>
              {isEditMode ? t('exercises.actions.edit') : t('exercises.addModal.title')}
            </h2>
            <button
              onClick={handleClose}
              disabled={loading}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: 'var(--text-2xl)',
                color: 'var(--text-tertiary)',
                cursor: loading ? 'not-allowed' : 'pointer',
                padding: '0',
                lineHeight: '1'
              }}
            >
              ✕
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Error Alert */}
            {error && (
              <div className="alert alert-danger" role="alert" style={{ marginBottom: 'var(--space-4)' }}>
                {error}
              </div>
            )}

            {/* Name Input */}
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label
                htmlFor="exerciseName"
                style={{
                  display: 'block',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-medium)',
                  color: 'var(--text-primary)',
                  marginBottom: 'var(--space-2)'
                }}
              >
                📝 {t('exercises.addModal.nameLabel')}
              </label>
              <input
                id="exerciseName"
                type="text"
                className="dark-input"
                placeholder={t('exercises.addModal.namePlaceholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            {/* Description Textarea */}
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label
                htmlFor="description"
                style={{
                  display: 'block',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-medium)',
                  color: 'var(--text-primary)',
                  marginBottom: 'var(--space-2)'
                }}
              >
                📝 {t('exercises.addModal.descriptionLabel')}
              </label>
              <textarea
                id="description"
                className="dark-input"
                placeholder={t('exercises.addModal.descriptionPlaceholder')}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
                rows={3}
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Plan Selection */}
            <div style={{ marginBottom: 'var(--space-5)' }}>
              <label
                htmlFor="planSelect"
                style={{
                  display: 'block',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-medium)',
                  color: 'var(--text-primary)',
                  marginBottom: 'var(--space-2)'
                }}
              >
                📋 {t('exercises.addModal.planLabel')}
              </label>
              <select
                id="planSelect"
                className="dark-input"
                value={selectedPlanId}
                onChange={(e) => setSelectedPlanId(e.target.value)}
                disabled={loading}
              >
                <option value="">{t('exercises.addModal.noPlanOption')}</option>
                {workoutPlans.map(plan => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <button
                type="submit"
                className="gradient-button"
                disabled={loading}
                style={{ flex: 1 }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    {t('common.loading')}
                  </>
                ) : (
                  <>➕ {isEditMode ? t('exercises.actions.edit') : t('exercises.addModal.submit')}</>
                )}
              </button>
              <button
                type="button"
                className="ghost-button"
                onClick={handleClose}
                disabled={loading}
                style={{ flex: 1 }}
              >
                {t('exercises.addModal.cancel')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddExerciseModal;
