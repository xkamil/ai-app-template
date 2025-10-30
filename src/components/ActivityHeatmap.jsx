import { useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';

const ActivityHeatmap = ({ workouts }) => {
  const { t } = useLanguage();

  // Generate last 12 weeks of days
  const weeks = useMemo(() => {
    const today = new Date();
    const weeksData = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Start from 12 weeks ago
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (12 * 7));
    startDate.setHours(0, 0, 0, 0);

    // Create workout count map
    const workoutCountMap = {};
    workouts.forEach(workout => {
      const date = new Date(workout.workout_date);
      const dateKey = date.toISOString().split('T')[0];
      workoutCountMap[dateKey] = (workoutCountMap[dateKey] || 0) + 1;
    });

    // Generate weeks
    for (let weekIndex = 0; weekIndex < 12; weekIndex++) {
      const week = [];
      for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + (weekIndex * 7) + dayIndex);

        const dateKey = date.toISOString().split('T')[0];
        const count = workoutCountMap[dateKey] || 0;

        week.push({
          date: date,
          count: count,
          isToday: date.toDateString() === today.toDateString(),
          isFuture: date > today
        });
      }
      weeksData.push(week);
    }

    return weeksData;
  }, [workouts]);

  const getIntensityColor = (count) => {
    if (count === 0) return 'var(--bg-tertiary)';
    if (count === 1) return 'rgba(255, 107, 53, 0.3)';
    if (count === 2) return 'rgba(255, 107, 53, 0.6)';
    return 'var(--accent-primary)';
  };

  const totalWorkouts = workouts.length;
  const currentStreak = useMemo(() => {
    if (workouts.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streak = 0;
    let checkDate = new Date(today);

    while (true) {
      const dateKey = checkDate.toISOString().split('T')[0];
      const hasWorkout = workouts.some(w => {
        const wDate = new Date(w.workout_date);
        return wDate.toISOString().split('T')[0] === dateKey;
      });

      if (hasWorkout) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (streak === 0 && checkDate.toDateString() === today.toDateString()) {
        // If today has no workout, check yesterday
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }, [workouts]);

  return (
    <div className="dark-card">
      <h3 style={{
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--font-semibold)',
        color: 'var(--text-primary)',
        marginBottom: 'var(--space-3)'
      }}>
        📊 {t('stats.activity.title')}
      </h3>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 'var(--space-3)',
        marginBottom: 'var(--space-4)'
      }}>
        <div style={{
          padding: 'var(--space-3)',
          background: 'var(--bg-tertiary)',
          borderRadius: 'var(--radius-md)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-bold)',
            color: 'var(--accent-primary)',
            marginBottom: 'var(--space-1)'
          }}>
            {currentStreak}
          </div>
          <div style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--text-secondary)'
          }}>
            🔥 {t('stats.activity.streak')} days
          </div>
        </div>

        <div style={{
          padding: 'var(--space-3)',
          background: 'var(--bg-tertiary)',
          borderRadius: 'var(--radius-md)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-bold)',
            color: 'var(--accent-primary)',
            marginBottom: 'var(--space-1)'
          }}>
            {totalWorkouts}
          </div>
          <div style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--text-secondary)'
          }}>
            💪 {t('stats.activity.workouts')} (12 weeks)
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div style={{
        overflowX: 'auto',
        paddingBottom: 'var(--space-2)'
      }}>
        <div style={{
          display: 'flex',
          gap: 'var(--space-1)',
          minWidth: 'fit-content'
        }}>
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
              {week.map((day, dayIndex) => {
                const isToday = day.isToday;
                const isFuture = day.isFuture;

                return (
                  <div
                    key={dayIndex}
                    title={`${day.date.toLocaleDateString()} - ${day.count} workout${day.count !== 1 ? 's' : ''}`}
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: 'var(--radius-sm)',
                      background: isFuture ? 'transparent' : getIntensityColor(day.count),
                      border: isToday ? '2px solid white' : isFuture ? '1px dashed var(--border-color)' : 'none',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => {
                      if (!isFuture) {
                        e.target.style.transform = 'scale(1.3)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        marginTop: 'var(--space-3)',
        fontSize: 'var(--text-xs)',
        color: 'var(--text-tertiary)'
      }}>
        <span>Less</span>
        {[0, 1, 2, 3].map(level => (
          <div
            key={level}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: 'var(--radius-sm)',
              background: getIntensityColor(level)
            }}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
};

export default ActivityHeatmap;
