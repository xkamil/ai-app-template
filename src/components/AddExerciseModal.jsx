import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useExercise } from '../context/ExerciseContext';

const AddExerciseModal = ({ show, onClose, exercise = null }) => {
  const { t } = useLanguage();
  const { muscleGroups, addExercise, updateExercise } = useExercise();

  const [name, setName] = useState('');
  const [muscleGroupId, setMuscleGroupId] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditMode = !!exercise;

  // Load exercise data when editing
  useEffect(() => {
    if (exercise) {
      setName(exercise.name || '');
      setMuscleGroupId(exercise.muscle_group_id || '');
      setDescription(exercise.description || '');
    } else {
      setName('');
      setMuscleGroupId('');
      setDescription('');
    }
    setError('');
  }, [exercise, show]);

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
      muscleGroupId: muscleGroupId || null,
      description: description.trim() || null
    };

    const result = isEditMode
      ? await updateExercise(exercise.id, exerciseData)
      : await addExercise(exerciseData);

    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      onClose();
    }
  };

  const handleClose = () => {
    if (!loading) {
      setName('');
      setMuscleGroupId('');
      setDescription('');
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

            {/* Muscle Group Select */}
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label
                htmlFor="muscleGroup"
                style={{
                  display: 'block',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-medium)',
                  color: 'var(--text-primary)',
                  marginBottom: 'var(--space-2)'
                }}
              >
                💪 {t('exercises.addModal.muscleGroupLabel')}
              </label>
              <select
                id="muscleGroup"
                className="dark-input"
                value={muscleGroupId}
                onChange={(e) => setMuscleGroupId(e.target.value)}
                disabled={loading}
                style={{ cursor: 'pointer' }}
              >
                <option value="">{t('exercises.addModal.muscleGroupPlaceholder')}</option>
                {muscleGroups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Description Textarea */}
            <div style={{ marginBottom: 'var(--space-5)' }}>
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
