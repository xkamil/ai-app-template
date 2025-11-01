export default {
  common: {
    loading: "Loading...",
    email: "Email address",
    password: "Password",
    language: "Language",
    cancel: "Cancel",
    confirm: "Confirm"
  },
  login: {
    title: "Welcome Back",
    subtitle: "Sign in to your account",
    forgotPassword: "Forgot password?",
    signInButton: "Sign In",
    signingIn: "Signing in...",
    noAccount: "Don't have an account?",
    signUp: "Sign up"
  },
  signup: {
    title: "Create Account",
    subtitle: "Sign up to get started",
    confirmPassword: "Confirm Password",
    passwordHint: "At least 6 characters",
    signUpButton: "Sign Up",
    creatingAccount: "Creating account...",
    successMessage: "Account created successfully! Check your email to confirm your account.",
    alreadyHaveAccount: "Already have an account?",
    signIn: "Sign in"
  },
  passwordReset: {
    title: "Reset Password",
    subtitle: "Enter your email to receive a reset link",
    updateTitle: "Update Password",
    updateSubtitle: "Enter your new password",
    newPassword: "New Password",
    confirmPassword: "Confirm Password",
    passwordHint: "At least 6 characters",
    sendResetButton: "Send Reset Link",
    sending: "Sending...",
    updateButton: "Update Password",
    updating: "Updating...",
    successMessage: "Password reset link sent! Check your email.",
    updateSuccessMessage: "Password updated successfully! Redirecting...",
    rememberPassword: "Remember your password?"
  },
  dashboard: {
    title: "AI App Dashboard",
    signOut: "Sign Out",
    welcomeTitle: "Welcome to Your Dashboard",
    welcomeSubtitle: "You are successfully logged in! Your session is persisted in localStorage.",
    sessionActive: "Session Active",
    userEmail: "Email",
    userId: "User ID",
    profile: "Profile",
    profileDescription: "Manage your account settings",
    aiFeatures: "AI Features",
    aiFeaturesDescription: "Explore AI-powered tools",
    settings: "Settings",
    settingsDescription: "Configure your preferences",
    sessionInfo: "Session Information",
    status: "Status",
    statusActive: "Active",
    storage: "Storage",
    storageValue: "localStorage (persists across page refreshes)",
    authentication: "Authentication",
    authenticationValue: "Supabase Email/Password",
    lastActivity: "Last Activity"
  },
  errors: {
    passwordsDoNotMatch: "Passwords do not match",
    passwordTooShort: "Password must be at least 6 characters long"
  },
  bottomNav: {
    workouts: "Workouts",
    plans: "Plans",
    exercises: "Exercises",
    profile: "Profile"
  },
  workouts: {
    title: "Workouts",
    subtitle: "Workout history",
    greeting: "Welcome, {name}!",
    lastWorkout: "Last workout: {time}",
    startWorkout: "START WORKOUT",
    thisWeek: "This week",
    workoutsCount: "{count} workouts",
    totalTime: "{hours}h",
    caloriesBurned: "{calories}k",
    history: "Workout history",
    viewDetails: "View details",
    prs: "{count} PRs",
    recentWorkouts: "Recent workouts",
    defaultName: "Workout",
    exercisesCount: "exercises",
    setsCount: "sets",
    volume: "volume",
    weekSummary: {
      title: "Week Summary",
      workouts: "Workouts",
      hours: "Hours",
      noWorkouts: "No workouts this week yet. Time to start!",
      greatStart: "Great start! Keep going!",
      keepGoing: "Amazing! Keep up the great work!"
    },
    monthSummary: {
      title: "Month Summary",
      workouts: "Workouts",
      hours: "Hours",
      noWorkouts: "No workouts this month yet. Time to start!",
      greatStart: "Great start! Keep going!",
      keepGoing: "Amazing! Keep up the great work!"
    },
    emptyState: {
      title: "No workouts yet",
      subtitle: "Start your first workout!",
      cta: "START YOUR FIRST WORKOUT"
    },
    ongoing: {
      title: "Workout in progress",
      continue: "Continue",
      cancel: "Cancel",
      confirmCancel: "Are you sure you want to cancel the workout? All data will be lost."
    },
    actions: {
      delete: "Delete"
    },
    deleteConfirm: {
      title: "Delete workout?",
      message: "Are you sure you want to delete workout \"{name}\"?",
      cancel: "Cancel",
      confirm: "Delete"
    }
  },
  newWorkout: {
    title: "New Workout",
    cancel: "Cancel",
    ok: "OK",
    back: "Back",
    step0: {
      title: "Select Plan",
      progress: "Step 1/4",
      search: "Search plans...",
      createNew: "Create New Plan",
      yourPlans: "Your plans",
      noResults: "No plans matching your search",
      emptyState: {
        title: "No workout plans",
        subtitle: "Create a workout plan first to start training",
        cta: "CREATE PLAN"
      }
    },
    step1: {
      title: "Select exercises",
      progress: "Step 2/4",
      search: "Search exercise...",
      selected: "Selected ({count})",
      yourExercises: "Your exercises",
      addNew: "Add new exercise",
      next: "NEXT ({count} selected)"
    },
    step2: {
      title: "Log sets",
      progress: "Step 3/4",
      workoutFromPlan: "Workout from plan:",
      nameLabel: "Name (optional)",
      namePlaceholder: "e.g. Upper Body A",
      set: "Set {number}",
      reps: "Reps",
      weight: "Weight",
      duration: "Duration",
      done: "Done",
      addSet: "Add set",
      lastTime: "Last: {sets}×{reps} @ {weight}kg",
      finish: "Finish workout",
      finishExercise: "Finish exercise",
      skipExercise: "Skip exercise",
      unskipExercise: "Unskip exercise",
      cancel: "Cancel workout",
      confirmCancel: "Are you sure you want to cancel the workout? All data will be lost.",
      confirmFinishWithSkipped: "Are you sure you want to finish the workout? You will skip the remaining {count} exercises. They will be automatically skipped and will not be saved in the history."
    },
    step3: {
      title: "Workout completed!",
      close: "Close",
      summary: {
        duration: "Duration: {minutes} min",
        exercises: "Exercises: {count}",
        sets: "Sets: {count}",
        prs: "New PRs: {count}"
      },
      notesLabel: "Notes (optional)",
      notesPlaceholder: "How did you feel? Notes...",
      newRecords: "New records!",
      recordLine: "{exercise}: {weight}kg ({reps} reps)",
      previousPR: "Previous PR: {weight}kg",
      backHome: "BACK TO HOME",
      share: "SHARE"
    }
  },
  exercises: {
    title: "Exercises",
    search: "Search exercise...",
    count: "You have {count} exercises",
    pr: "PR: {weight}kg @ {reps} reps",
    lastUsed: "Last used: {time}",
    workoutsCount: "{count} workouts",
    lastUsedToday: "today",
    lastUsedDaysAgo: "{count} {days} ago",
    neverUsed: "never",
    noPlan: "No plan",
    sort: {
      newest: "Newest",
      mostUsed: "Most workouts",
      leastUsed: "Least workouts"
    },
    filter: {
      withoutPlan: "Without plan"
    },
    actions: {
      edit: "Edit",
      stats: "Stats",
      delete: "Delete",
      clone: "Duplicate"
    },
    addModal: {
      title: "New exercise",
      cancel: "Cancel",
      nameLabel: "Name",
      namePlaceholder: "e.g. Bench Press",
      descriptionLabel: "Description (optional)",
      descriptionPlaceholder: "Exercise description...",
      planLabel: "Workout Plan (optional)",
      noPlanOption: "None",
      submit: "ADD EXERCISE"
    },
    emptyState: {
      title: "No exercises yet",
      subtitle: "Add your first exercise!",
      cta: "ADD EXERCISE"
    },
    deleteConfirm: {
      title: "Delete exercise?",
      message: "Are you sure you want to delete \"{name}\"? Your workout history with this exercise will be preserved.",
      cancel: "Cancel",
      confirm: "Delete"
    },
    statistics: {
      title: "Statistics",
      totalWorkouts: "Total workouts",
      maxReps: "Max reps",
      maxWeight: "Max weight",
      reps: "reps"
    }
  },
  plans: {
    title: "Workout Plans",
    subtitle: "Manage your workout plans",
    create: "Create Plan",
    exercises: "exercises",
    sets: "sets",
    more: "more",
    startWorkout: "Start Workout",
    exerciseList: "Exercise List",
    edit: "Edit",
    delete: "Delete",
    clone: "Duplicate",
    deleteConfirm: {
      title: "Delete plan?",
      message: "Are you sure you want to delete plan \"{name}\"?",
      cancel: "Cancel",
      confirm: "Delete"
    },
    deleteError: "Cannot delete plan",
    cloneError: "Cannot duplicate plan",
    lastWorkoutToday: "Last workout today",
    lastWorkoutDaysAgo: "Last workout {count} {days} ago",
    neverUsed: "Last workout: never",
    day: "day",
    days: "days",
    emptyState: {
      title: "No workout plans",
      subtitle: "Create your first workout plan!",
      cta: "CREATE PLAN"
    },
    modal: {
      createTitle: "New Workout Plan",
      editTitle: "Edit Plan",
      name: "Name",
      namePlaceholder: "e.g. Push Day",
      color: "Color",
      description: "Description",
      descriptionPlaceholder: "Optional plan description...",
      exercises: "Exercises",
      noExercises: "No exercises selected. Search below to add.",
      searchExercises: "Filter exercises...",
      selectExercise: "Select exercise to add",
      noResults: "No results found",
      nameRequired: "Plan name is required",
      exercisesRequired: "Add at least one exercise",
      save: "SAVE",
      create: "CREATE PLAN",
      cancel: "Cancel"
    }
  },
  profile: {
    title: "Profile",
    back: "Back",
    memberSince: "Member since: {date}",
    settings: {
      title: "Settings",
      language: "Language",
      units: "Weight units",
      unitsKg: "Kilograms (kg)",
      unitsLbs: "Pounds (lbs)",
      darkMode: "Dark mode",
      darkModeAlways: "Always on"
    },
    data: {
      title: "Data",
      export: "Export data to CSV",
      deleteAll: "Delete all data",
      deleteConfirm: "Are you sure you want to delete ALL data? This action cannot be undone!",
      deleteSuccess: "Data has been deleted"
    },
    logout: "SIGN OUT",
    logoutConfirm: {
      title: "Sign out?",
      message: "Are you sure you want to sign out?",
      cancel: "Cancel",
      confirm: "Sign out"
    },
    version: "v1.0.0"
  }
}
