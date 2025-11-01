import { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useExercise } from '../context/ExerciseContext';

const ExerciseSelectionStep = ({ selectedExercises, onToggleExercise, onNext, onBack }) => {
  const { t } = useLanguage();
  const { exercises } = useExercise();
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

  const isSelected = (exerciseId) => {
    return selectedExercises.some(ex => ex.id === exerciseId);
  };

  return (
    <div>
      {/* Progress Indicator */}
      <div style={{
        padding: 'var(--space-4)',
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
          {onBack && (
            <button
              onClick={onBack}
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
          )}
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--text-tertiary)',
              marginBottom: 'var(--space-1)'
            }}>
              {t('newWorkout.step1.progress')}
            </div>
            <h2 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 'var(--font-bold)',
              color: 'var(--text-primary)',
              margin: 0
            }}>
              {t('newWorkout.step1.title')}
            </h2>
          </div>
        </div>

        {/* Selected Count Badge */}
        {selectedExercises.length > 0 && (
          <div style={{
            marginTop: 'var(--space-3)',
            padding: 'var(--space-2) var(--space-3)',
            background: 'var(--accent-gradient)',
            borderRadius: 'var(--radius-md)',
            color: 'white',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-semibold)',
            textAlign: 'center'
          }}>
            ✓ {t('newWorkout.step1.selected').replace('{count}', selectedExercises.length)}
          </div>
        )}
      </div>

      <div style={{ padding: 'var(--space-4)', paddingBottom: '100px' }}>
        {/* Search Bar */}
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <input
            type="text"
            className="dark-input"
            placeholder={t('newWorkout.step1.search')}
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

        {/* Exercise List */}
        {filteredExercises.length === 0 ? (
          <div className="dark-card" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
            <div style={{ fontSize: '48px', marginBottom: 'var(--space-3)' }}>💪</div>
            <p style={{ color: 'var(--text-secondary)' }}>
              {exercises.length === 0 ? t('exercises.emptyState.subtitle') : t('exercises.noResultsFound')}
            </p>
          </div>
        ) : (
          <div>
            {filteredExercises.map(exercise => {
              const selected = isSelected(exercise.id);
              return (
                <div
                  key={exercise.id}
                  onClick={() => onToggleExercise(exercise)}
                  className="dark-card"
                  style={{
                    marginBottom: 'var(--space-3)',
                    cursor: 'pointer',
                    border: selected ? '2px solid var(--accent-primary)' : '2px solid transparent',
                    background: selected ? 'rgba(255, 107, 53, 0.1)' : 'var(--bg-secondary)',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: 'var(--text-base)',
                        fontWeight: 'var(--font-semibold)',
                        color: 'var(--text-primary)',
                        marginBottom: exercise.description ? 'var(--space-1)' : 0
                      }}>
                        🏋️ {exercise.name}
                      </div>
                      {exercise.description && (
                        <div style={{
                          fontSize: 'var(--text-sm)',
                          color: 'var(--text-secondary)',
                          lineHeight: '1.4'
                        }}>
                          {exercise.description}
                        </div>
                      )}
                    </div>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      border: selected ? '2px solid var(--accent-primary)' : '2px solid var(--border-color)',
                      background: selected ? 'var(--accent-primary)' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginLeft: 'var(--space-3)',
                      flexShrink: 0,
                      transition: 'all var(--transition-fast)'
                    }}>
                      {selected && <span style={{ color: 'white', fontSize: '14px' }}>✓</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Fixed Bottom Button */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 'var(--space-4)',
        background: 'var(--bg-primary)',
        borderTop: '1px solid var(--border-color)',
        zIndex: 10
      }}>
        <button
          onClick={onNext}
          disabled={selectedExercises.length === 0}
          className="gradient-button"
          style={{
            width: '100%',
            padding: 'var(--space-4)',
            fontSize: 'var(--text-lg)',
            fontWeight: 'var(--font-bold)',
            opacity: selectedExercises.length === 0 ? 0.5 : 1,
            cursor: selectedExercises.length === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          {t('newWorkout.step1.next').replace('{count}', selectedExercises.length)}
        </button>
      </div>
    </div>
  );
};

export default ExerciseSelectionStep;
