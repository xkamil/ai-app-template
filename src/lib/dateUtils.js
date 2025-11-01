/**
 * Calculate how many days have passed since a given date
 * @param {string|Date} date - The date to calculate from
 * @returns {number} Number of days since the date (0 for today)
 */
export const getDaysSinceDate = (date) => {
  if (!date) return null;

  const targetDate = new Date(date);
  const today = new Date();

  // Reset time to midnight for accurate day calculation
  targetDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = today - targetDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};

/**
 * Format the last workout date for display
 * @param {string|Date} date - The date of the last workout
 * @param {Function} t - Translation function
 * @returns {string} Formatted string like "Ostatni trening dzisiaj" or "Ostatni trening 3 dni temu"
 */
export const formatLastWorkoutDate = (date, t) => {
  if (!date) {
    return t('plans.neverUsed');
  }

  const days = getDaysSinceDate(date);

  if (days === 0) {
    return t('plans.lastWorkoutToday');
  }

  // Polish plural forms: 1 dzień, 2-4 dni, 5+ dni
  const daysLabel = days === 1 ? t('plans.day') : t('plans.days');

  return t('plans.lastWorkoutDaysAgo', { count: days, days: daysLabel });
};
