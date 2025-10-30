import { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useExercise } from '../context/ExerciseContext';

const ExerciseSelectionStep = ({ selectedExercises, onToggleExercise, onNext }) => {
  const { t } = useLanguage();
  const { exercises, muscleGroups } = useExercise();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter exercises
  const filteredExercises = useMemo(() => {
    let filtered = exercises;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(ex =>
        ex.name.toLowerCase().includes(query) ||
        (ex.description && ex.description.toLowerCase().includes(query)) ||
        (ex.muscle_group && ex.muscle_group.name.toLowerCase().includes(query))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(ex => ex.muscle_group_id === selectedCategory);
    }

    return filtered;
  }, [exercises, searchQuery, selectedCategory]);

  // Group exercises by muscle group
  const groupedExercises = useMemo(() => {
    const groups = {};

    filteredExercises.forEach(exercise => {
      const groupName = exercise.muscle_group?.name || 'Uncategorized';
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(exercise);
    });

    return groups;
  }, [filteredExercises]);

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
        <div style={{
          fontSize: 'var(--text-xs)',
          color: 'var(--text-tertiary)',
          marginBottom: 'var(--space-2)'
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

        {/* Category Filter Chips */}
        <div style={{
          display: 'flex',
          gap: 'var(--space-2)',
          overflowX: 'auto',
          paddingBottom: 'var(--space-2)',
          marginBottom: 'var(--space-4)',
          scrollbarWidth: 'thin'
        }}>
          <button
            onClick={() => setSelectedCategory('all')}
            style={{
              padding: 'var(--space-2) var(--space-4)',
              background: selectedCategory === 'all' ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              color: selectedCategory === 'all' ? 'white' : 'var(--text-secondary)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-medium)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all var(--transition-fast)'
            }}
          >
            {t('exercises.categoryAll')}
          </button>
          {muscleGroups.map(group => (
            <button
              key={group.id}
              onClick={() => setSelectedCategory(group.id)}
              style={{
                padding: 'var(--space-2) var(--space-4)',
                background: selectedCategory === group.id ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                color: selectedCategory === group.id ? 'white' : 'var(--text-secondary)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-medium)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all var(--transition-fast)'
              }}
            >
              {group.name}
            </button>
          ))}
        </div>

        {/* Exercise List */}
        {filteredExercises.length === 0 ? (
          <div className="dark-card" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
            <div style={{ fontSize: '48px', marginBottom: 'var(--space-3)' }}>💪</div>
            <p style={{ color: 'var(--text-secondary)' }}>
              {exercises.length === 0 ? t('exercises.emptyState.subtitle') : 'No exercises found'}
            </p>
          </div>
        ) : (
          <div>
            {Object.entries(groupedExercises).map(([groupName, groupExercises]) => (
              <div key={groupName} style={{ marginBottom: 'var(--space-5)' }}>
                {/* Group Header */}
                <h3 style={{
                  fontSize: 'var(--text-base)',
                  fontWeight: 'var(--font-semibold)',
                  color: 'var(--text-primary)',
                  marginBottom: 'var(--space-3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)'
                }}>
                  💪 {groupName}
                </h3>

                {/* Exercise Cards */}
                {groupExercises.map(exercise => {
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
            ))}
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
