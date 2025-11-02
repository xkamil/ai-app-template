export default {
  common: {
    loading: "Ładowanie...",
    email: "Adres e-mail",
    password: "Hasło",
    language: "Język",
    cancel: "Anuluj",
    confirm: "Potwierdź",
    volume: "Objętość"
  },
  login: {
    title: "Witaj ponownie",
    subtitle: "Zaloguj się do swojego konta",
    forgotPassword: "Zapomniałeś hasła?",
    signInButton: "Zaloguj się",
    signingIn: "Logowanie...",
    noAccount: "Nie masz konta?",
    signUp: "Zarejestruj się"
  },
  signup: {
    title: "Utwórz konto",
    subtitle: "Zarejestruj się, aby rozpocząć",
    confirmPassword: "Potwierdź hasło",
    passwordHint: "Minimum 6 znaków",
    signUpButton: "Zarejestruj się",
    creatingAccount: "Tworzenie konta...",
    successMessage: "Konto utworzone pomyślnie! Sprawdź swoją skrzynkę e-mail, aby potwierdzić konto.",
    alreadyHaveAccount: "Masz już konto?",
    signIn: "Zaloguj się"
  },
  passwordReset: {
    title: "Resetuj hasło",
    subtitle: "Wpisz swój e-mail, aby otrzymać link resetujący",
    updateTitle: "Zaktualizuj hasło",
    updateSubtitle: "Wprowadź nowe hasło",
    newPassword: "Nowe hasło",
    confirmPassword: "Potwierdź hasło",
    passwordHint: "Minimum 6 znaków",
    sendResetButton: "Wyślij link resetujący",
    sending: "Wysyłanie...",
    updateButton: "Zaktualizuj hasło",
    updating: "Aktualizowanie...",
    successMessage: "Link resetujący hasło został wysłany! Sprawdź swoją skrzynkę e-mail.",
    updateSuccessMessage: "Hasło zaktualizowane pomyślnie! Przekierowywanie...",
    rememberPassword: "Pamiętasz hasło?"
  },
  dashboard: {
    title: "Panel AI",
    signOut: "Wyloguj się",
    welcomeTitle: "Witaj w swoim panelu",
    welcomeSubtitle: "Jesteś pomyślnie zalogowany! Twoja sesja jest zapisana w localStorage.",
    sessionActive: "Sesja aktywna",
    userEmail: "E-mail",
    userId: "ID użytkownika",
    profile: "Profil",
    profileDescription: "Zarządzaj ustawieniami konta",
    aiFeatures: "Funkcje AI",
    aiFeaturesDescription: "Odkryj narzędzia oparte na AI",
    settings: "Ustawienia",
    settingsDescription: "Skonfiguruj swoje preferencje",
    sessionInfo: "Informacje o sesji",
    status: "Status",
    statusActive: "Aktywna",
    storage: "Przechowywanie",
    storageValue: "localStorage (utrzymuje się po odświeżeniu strony)",
    authentication: "Uwierzytelnianie",
    authenticationValue: "Supabase E-mail/Hasło",
    lastActivity: "Ostatnia aktywność"
  },
  errors: {
    passwordsDoNotMatch: "Hasła nie są identyczne",
    passwordTooShort: "Hasło musi mieć co najmniej 6 znaków"
  },
  bottomNav: {
    workouts: "Treningi",
    plans: "Plany",
    exercises: "Ćwiczenia",
    profile: "Profil"
  },
  workouts: {
    title: "Treningi",
    subtitle: "Historia treningów",
    greeting: "Witaj, {name}!",
    lastWorkout: "Ostatni trening: {time}",
    startWorkout: "ROZPOCZNIJ TRENING",
    thisWeek: "Ten tydzień",
    workoutsCount: "{count} treningi",
    totalTime: "{hours}h",
    caloriesBurned: "{calories}k",
    history: "Historia treningów",
    viewDetails: "Zobacz szczegóły",
    prs: "{count} PRs",
    recentWorkouts: "Ostatnie treningi",
    defaultName: "Trening",
    exercisesCount: "ćwiczeń",
    setsCount: "serii",
    volume: "objętość",
    weekSummary: {
      title: "Podsumowanie tygodnia",
      workouts: "Treningi",
      hours: "Godziny",
      noWorkouts: "Jeszcze nie masz treningów w tym tygodniu. Czas zacząć!",
      greatStart: "Świetny początek! Kontynuuj!",
      keepGoing: "Niesamowite! Trzymaj tak dalej!"
    },
    monthSummary: {
      title: "Podsumowanie miesiąca",
      workouts: "Treningi",
      hours: "Godziny",
      noWorkouts: "Brak treningów w tym miesiącu. Czas zacząć!",
      greatStart: "Świetny start! Kontynuuj!",
      keepGoing: "Niesamowite! Trzymaj tak dalej!"
    },
    emptyState: {
      title: "Brak treningów",
      subtitle: "Rozpocznij swój pierwszy trening!",
      cta: "ROZPOCZNIJ SWÓJ PIERWSZY TRENING"
    },
    ongoing: {
      title: "Trening w toku",
      continue: "Kontynuuj",
      cancel: "Anuluj",
      confirmCancel: "Czy na pewno chcesz anulować trening? Wszystkie dane zostaną utracone."
    },
    actions: {
      delete: "Usuń"
    },
    deleteConfirm: {
      title: "Usuń trening?",
      message: "Czy na pewno chcesz usunąć trening \"{name}\"?",
      cancel: "Anuluj",
      confirm: "Usuń"
    }
  },
  newWorkout: {
    title: "Nowy trening",
    cancel: "Anuluj",
    ok: "OK",
    back: "Wstecz",
    step0: {
      title: "Wybierz Plan",
      progress: "Krok 1/4",
      search: "Wyszukaj plan...",
      createNew: "Utwórz Nowy Plan",
      yourPlans: "Twoje plany",
      noResults: "Brak planów pasujących do wyszukiwania",
      emptyState: {
        title: "Brak planów treningowych",
        subtitle: "Najpierw utwórz plan treningowy, aby rozpocząć trening",
        cta: "UTWÓRZ PLAN"
      }
    },
    step1: {
      title: "Wybierz ćwiczenia",
      progress: "Krok 2/4",
      search: "Wyszukaj ćwiczenie...",
      selected: "Wybrane ({count})",
      yourExercises: "Twoje ćwiczenia",
      addNew: "Dodaj nowe ćwiczenie",
      next: "DALEJ ({count} wybrane)"
    },
    step2: {
      title: "Loguj serie",
      progress: "Krok 3/4",
      workoutFromPlan: "Trening z planu:",
      nameLabel: "Nazwa (opcjonalnie)",
      namePlaceholder: "np. Upper Body A",
      set: "Seria {number}",
      reps: "Powtórzenia",
      weight: "Waga",
      duration: "Czas",
      done: "Gotowe",
      addSet: "Dodaj serię",
      lastTime: "Ostatnio: {sets}×{reps} @ {weight}kg",
      finish: "Zakończ trening",
      finishExercise: "Zakończ ćwiczenie",
      skipExercise: "Pomiń ćwiczenie",
      resumeExercise: "Wznów ćwiczenie",
      cancel: "Anuluj trening",
      confirmCancel: "Czy na pewno chcesz anulować trening? Wszystkie dane zostaną utracone.",
      confirmFinishWithSkipped: "Czy na pewno chcesz zakończyć trening? Pominiesz pozostałe {count} ćwiczeń. Zostaną one automatycznie pominięte i nie zapiszą się w historii.",
      exerciseNotes: "Notatki",
      exerciseNotesPlaceholder: "Notatki do ćwiczenia...",
      validationError: "Każda seria musi mieć co najmniej 1 powtórzenie"
    },
    step3: {
      title: "Trening zakończony!",
      subtitle: "Świetna robota! Gotowy do zapisu?",
      close: "Zamknij",
      summary: {
        duration: "Czas: {minutes} min",
        exercises: "Ćwiczeń: {count}",
        sets: "Serii: {count}",
        prs: "Nowe PRs: {count}"
      },
      exercisesLabel: "Ćwiczeń",
      totalSetsLabel: "Wszystkie Serie",
      volumeLabel: "Objętość (kg)",
      workoutNameLabel: "Nazwa Treningu",
      workoutDetailsLabel: "Szczegóły Treningu",
      setLabel: "Seria",
      noData: "Brak danych",
      saving: "Zapisywanie...",
      saveButton: "Zapisz Trening",
      notesLabel: "Notatki (opcjonalnie)",
      notesPlaceholder: "Jak się czułeś? Notatki...",
      newRecords: "Nowe rekordy!",
      recordLine: "{exercise}: {weight}kg ({reps} reps)",
      previousPR: "Poprzedni PR: {weight}kg",
      backHome: "POWRÓT DO GŁÓWNEJ",
      share: "UDOSTĘPNIJ"
    }
  },
  exercises: {
    title: "Ćwiczenia",
    search: "Wyszukaj ćwiczenie...",
    count: "Masz {count} ćwiczeń",
    pr: "PR: {weight}kg @ {reps} reps",
    lastUsed: "Ostatnio: {time}",
    workoutsCount: "{count} treningów",
    lastUsedToday: "dzisiaj",
    lastUsedDaysAgo: "{count} {days} temu",
    neverUsed: "nigdy",
    noPlan: "Brak planu",
    noResultsFound: "Nie znaleziono ćwiczeń",
    tryAdjustingSearch: "Spróbuj zmienić wyszukiwanie lub filtry",
    sort: {
      newest: "Najnowsze",
      mostUsed: "Najwięcej treningów",
      leastUsed: "Najmniej treningów"
    },
    filter: {
      withoutPlan: "Bez planu"
    },
    actions: {
      edit: "Edytuj",
      stats: "Statystyki",
      delete: "Usuń",
      clone: "Duplikuj"
    },
    addModal: {
      title: "Nowe ćwiczenie",
      cancel: "Anuluj",
      nameLabel: "Nazwa",
      namePlaceholder: "np. Bench Press",
      descriptionLabel: "Opis (opcjonalnie)",
      descriptionPlaceholder: "Opis ćwiczenia...",
      unitsLabel: "Jednostki",
      weightUnitsLabel: "Używa wagi",
      timeUnitsLabel: "Używa czasu",
      planLabel: "Plan treningowy (opcjonalnie)",
      noPlanOption: "Brak",
      submit: "DODAJ ĆWICZENIE",
      fieldRequired: "jest wymagane"
    },
    emptyState: {
      title: "Brak ćwiczeń",
      subtitle: "Dodaj swoje pierwsze ćwiczenie!",
      cta: "DODAJ ĆWICZENIE"
    },
    deleteConfirm: {
      title: "Usuń ćwiczenie?",
      message: "Czy na pewno chcesz usunąć \"{name}\"? Historia treningów z tym ćwiczeniem zostanie zachowana.",
      cancel: "Anuluj",
      confirm: "Usuń"
    },
    statistics: {
      title: "Statystyki",
      totalWorkouts: "Ilość treningów",
      maxReps: "Max powtórzeń",
      maxWeight: "Max obciążenie",
      reps: "powtórzeń"
    }
  },
  plans: {
    title: "Plany Treningowe",
    subtitle: "Zarządzaj swoimi planami treningowymi",
    create: "Utwórz Plan",
    exercises: "ćwiczeń",
    sets: "serii",
    more: "więcej",
    startWorkout: "Rozpocznij trening",
    exerciseList: "Lista ćwiczeń",
    edit: "Edytuj",
    delete: "Usuń",
    clone: "Duplikuj",
    noPlansFound: "Nie znaleziono planów",
    tryAdjustingSearchPlans: "Spróbuj zmienić wyszukiwanie",
    emptyPlanMessage: "Aby rozpocząć trening, najpierw dodaj ćwiczenia do planu",
    deleteConfirm: {
      title: "Usuń plan?",
      message: "Czy na pewno chcesz usunąć plan \"{name}\"?",
      cancel: "Anuluj",
      confirm: "Usuń"
    },
    deleteError: "Nie można usunąć planu",
    cloneError: "Nie można zduplikować planu",
    lastWorkoutToday: "Ostatni trening dzisiaj",
    lastWorkoutDaysAgo: "Ostatni trening {count} {days} temu",
    neverUsed: "Ostatni trening: nigdy",
    day: "dzień",
    days: "dni",
    emptyState: {
      title: "Brak planów treningowych",
      subtitle: "Utwórz swój pierwszy plan treningowy!",
      cta: "UTWÓRZ PLAN"
    },
    modal: {
      createTitle: "Nowy Plan Treningowy",
      editTitle: "Edytuj Plan",
      name: "Nazwa",
      namePlaceholder: "np. Push Day",
      color: "Kolor",
      description: "Opis",
      descriptionPlaceholder: "Opcjonalny opis planu...",
      exercises: "Ćwiczenia",
      noExercises: "Brak wybranych ćwiczeń. Wyszukaj poniżej aby dodać.",
      searchExercises: "Filtruj ćwiczenia...",
      selectExercise: "Wybierz ćwiczenie do dodania",
      noResults: "Brak wyników",
      nameRequired: "Nazwa planu jest wymagana",
      exercisesRequired: "Dodaj przynajmniej jedno ćwiczenie",
      save: "ZAPISZ",
      create: "UTWÓRZ PLAN",
      cancel: "Anuluj"
    }
  },
  profile: {
    title: "Profil",
    back: "Wstecz",
    memberSince: "Członek od: {date}",
    settings: {
      title: "Ustawienia",
      language: "Język",
      units: "Jednostki wagi",
      unitsKg: "Kilogramy (kg)",
      unitsLbs: "Funty (lbs)",
      theme: "Motyw",
      themeLight: "Jasny",
      themeDark: "Ciemny"
    },
    data: {
      title: "Dane",
      export: "Eksportuj dane do CSV",
      deleteAll: "Usuń wszystkie dane",
      deleteConfirm: "Czy na pewno chcesz usunąć WSZYSTKIE dane? Tej operacji nie można cofnąć!",
      deleteSuccess: "Dane zostały usunięte"
    },
    logout: "WYLOGUJ",
    logoutConfirm: {
      title: "Wylogować się?",
      message: "Czy na pewno chcesz się wylogować?",
      cancel: "Anuluj",
      confirm: "Wyloguj"
    },
    version: "v1.0.0"
  }
}
