export default {
  common: {
    loading: "Ładowanie...",
    email: "Adres e-mail",
    password: "Hasło",
    language: "Język"
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
    stats: "Statystyki",
    profile: "Profil"
  },
  workouts: {
    title: "Treningi",
    subtitle: "Historia treningów",
    greeting: "Witaj, {name}!",
    lastWorkout: "Ostatni trening: {time}",
    startWorkout: "START WORKOUT",
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
      cta: "START YOUR FIRST WORKOUT"
    },
    actions: {
      delete: "Usuń"
    },
    deleteConfirm: {
      message: "Czy na pewno chcesz usunąć trening \"{name}\"?"
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
      nameLabel: "Nazwa (opcjonalnie)",
      namePlaceholder: "np. Upper Body A",
      set: "Seria {number}",
      reps: "Reps",
      weight: "Weight",
      duration: "Czas",
      done: "Gotowe",
      addSet: "Dodaj serię",
      lastTime: "Ostatnio: {sets}×{reps} @ {weight}kg",
      finish: "ZAKOŃCZ TRENING"
    },
    step3: {
      title: "Trening zakończony!",
      close: "Zamknij",
      summary: {
        duration: "Czas: {minutes} min",
        exercises: "Ćwiczeń: {count}",
        sets: "Serii: {count}",
        prs: "Nowe PRs: {count}"
      },
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
    actions: {
      edit: "Edytuj",
      stats: "Statystyki",
      delete: "Usuń"
    },
    addModal: {
      title: "Nowe ćwiczenie",
      cancel: "Anuluj",
      nameLabel: "Nazwa",
      namePlaceholder: "np. Bench Press",
      descriptionLabel: "Opis (opcjonalnie)",
      descriptionPlaceholder: "Opis ćwiczenia...",
      submit: "DODAJ ĆWICZENIE"
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
    }
  },
  stats: {
    title: "Statystyki",
    activity: {
      title: "Aktywność",
      streak: "Streak",
      workouts: "Workouts",
      totalTime: "Total time",
      days: ["Pn", "Wt", "Śr", "Cz", "Pt", "Sb", "Nd"]
    },
    prs: {
      title: "Personal Records",
      at: "@",
      reps: "reps",
      ago: "{time} temu",
      viewDetails: "Zobacz szczegóły"
    },
    detail: {
      personalRecord: "Personal Record",
      achieved: "Osiągnięty: {date}",
      improvement: "+{diff}kg od poprzedniego PR",
      progress: "Postęp (ostatnie 3 miesiące)",
      statistics: "Statystyki",
      totalVolume: "Łączna objętość:",
      avgWeight: "Średni ciężar:",
      workoutsCount: "Liczba treningów:",
      lastWorkout: "Ostatni trening:",
      recordHistory: "Historia rekordów"
    },
    timeRange: {
      week: "Ostatnie 7 dni",
      month: "Ostatnie 30 dni",
      threeMonths: "3 miesiące",
      year: "Rok",
      all: "Wszystko"
    },
    emptyState: {
      title: "Brak danych",
      subtitle: "Wykonaj pierwszy trening aby zobaczyć swoje statystyki i rekordy!",
      cta: "START WORKOUT"
    }
  },
  plans: {
    title: "Plany Treningowe",
    subtitle: "Zarządzaj swoimi planami treningowymi",
    create: "Utwórz Plan",
    exercises: "ćwiczeń",
    sets: "serii",
    more: "więcej",
    deleteConfirm: "Czy na pewno chcesz usunąć plan \"{name}\"?",
    deleteError: "Nie można usunąć planu",
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
      searchExercises: "Wyszukaj ćwiczenia...",
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
      darkMode: "Tryb ciemny",
      darkModeAlways: "Zawsze włączony"
    },
    data: {
      title: "Dane",
      export: "Eksportuj dane do CSV",
      deleteAll: "Usuń wszystkie dane",
      deleteConfirm: "Czy na pewno chcesz usunąć WSZYSTKIE dane? Tej operacji nie można cofnąć!",
      deleteSuccess: "Dane zostały usunięte"
    },
    logout: "WYLOGUJ",
    logoutConfirm: "Czy na pewno chcesz się wylogować?",
    version: "v1.0.0"
  }
}
