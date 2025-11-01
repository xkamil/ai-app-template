/**
 * Utility for managing ongoing workout session in localStorage
 */

const STORAGE_KEY = 'ongoing-workout';

/**
 * Save ongoing workout to localStorage
 * @param {Object} workoutData - The workout data to save
 * @param {Object} selectedPlan - The selected workout plan
 * @param {number} currentExerciseIndex - Current exercise index
 * @param {Object} exerciseStatus - Exercise status (completed/skipped)
 */
export const saveOngoingWorkout = (workoutData, selectedPlan, currentExerciseIndex = 0, exerciseStatus = {}) => {
  try {
    const data = {
      workoutData,
      selectedPlan,
      currentExerciseIndex,
      exerciseStatus,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save ongoing workout to localStorage:', error);
  }
};

/**
 * Load ongoing workout from localStorage
 * @returns {Object|null} The saved workout data or null if none exists
 */
export const loadOngoingWorkout = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;

    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load ongoing workout from localStorage:', error);
    return null;
  }
};

/**
 * Clear ongoing workout from localStorage
 */
export const clearOngoingWorkout = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear ongoing workout from localStorage:', error);
  }
};

/**
 * Check if there is an ongoing workout
 * @returns {boolean} True if there is an ongoing workout
 */
export const hasOngoingWorkout = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch (error) {
    console.error('Failed to check for ongoing workout:', error);
    return false;
  }
};
