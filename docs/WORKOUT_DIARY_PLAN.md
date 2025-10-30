# 🏋️ Workout Diary - Plan Aplikacji Mobile-First

## 📋 Spis treści
1. [Przegląd projektu](#przegląd-projektu)
2. [Architektura aplikacji](#architektura-aplikacji)
3. [Design System - Dark Mode Fitness](#design-system)
4. [Mapa podstron](#mapa-podstron)
5. [Projekty ekranów z mockupami](#projekty-ekranów)
6. [Plan implementacji](#plan-implementacji)
7. [Integracja z bazą danych](#integracja-z-bazą-danych)

---

## 🎯 Przegląd projektu

### Założenia
- **Mobile-first**: Aplikacja projektowana najpierw dla urządzeń mobilnych (320px - 428px)
- **Dark mode fitness**: Ciemny motyw z energetycznymi akcentami kolorystycznymi
- **Progressive Web App**: Możliwość instalacji jako PWA
- **Offline-first**: Podstawowe funkcje działające offline (opcjonalnie w przyszłości)
- **Dwujęzyczność**: Polski i angielski (rozszerzenie istniejącego systemu i18n)

### Cel aplikacji
Aplikacja do śledzenia treningów siłowych pozwalająca na:
- Tworzenie własnej biblioteki ćwiczeń
- Szybkie logowanie treningów z seriami, powtórzeniami i ciężarem
- Automatyczne śledzenie personal records (PRs)
- Wizualizację postępów na wykresach
- Przeglądanie historii treningów

### Zastąpienie obecnego dashboardu
Workout Diary **całkowicie zastąpi** obecny dashboard. Po zalogowaniu użytkownik będzie przekierowany bezpośrednio do głównego ekranu aplikacji treningowej.

---

## 🏗️ Architektura aplikacji

### Routing Structure
```
/ (LoginPage)
/signup (SignUpPage)
/reset-password (PasswordResetPage)
/dashboard (DashboardPage) → ZASTĄPIONY przez workout diary
/workouts (WorkoutsListPage) → NOWY - lista treningów (główny ekran)
/workout/new (NewWorkoutPage) → NOWY - dodawanie treningu
/exercises (ExercisesLibraryPage) → NOWY - biblioteka ćwiczeń
/stats (StatisticsPage) → NOWY - statystyki i PRs
/profile (ProfilePage) → NOWY - ustawienia użytkownika
```

### Nowe konteksty React
```javascript
// WorkoutContext - zarządzanie stanem treningów
- activeWorkout (trening w trakcie tworzenia)
- saveWorkout()
- deleteWorkout()
- loadWorkouts()

// ExerciseContext - zarządzanie ćwiczeniami
- exercises (lista ćwiczeń użytkownika)
- addExercise()
- updateExercise()
- deleteExercise()

// StatsContext - obliczanie statystyk
- personalRecords (PRs dla każdego ćwiczenia)
- calculateProgress()
```

### Bottom Navigation
Stała dolna nawigacja dostępna na wszystkich ekranach aplikacji (poza auth):
```
┌─────────┬─────────┬─────────┬─────────┐
│ 📅 Home │ ➕ Nowy │ 💪 Ćwicz│ 📊 Stats│
└─────────┴─────────┴─────────┴─────────┘
```

---

## 🎨 Design System - Dark Mode Fitness

### Paleta kolorów

#### Główne kolory
```css
/* Background & Surfaces */
--bg-primary: #0F0F0F       /* Główne tło (prawie czarny) */
--bg-secondary: #1A1A1A     /* Karty, panele */
--bg-tertiary: #252525      /* Podniesione elementy */

/* Akcenty (gradientowe) */
--accent-primary: #FF6B35   /* Pomarańczowy - energia */
--accent-secondary: #F7931E /* Złoty - osiągnięcia */
--accent-gradient: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)

/* Semantyczne kolory */
--success: #00D9A3          /* Zielony - sukces, PR */
--warning: #FFB627          /* Żółty - ostrzeżenie */
--danger: #FF4757           /* Czerwony - błąd */
--info: #4BA3FF             /* Niebieski - informacja */

/* Tekst */
--text-primary: #FFFFFF     /* Główny tekst (biały) */
--text-secondary: #A0A0A0   /* Drugorzędny tekst (szary) */
--text-tertiary: #6B6B6B    /* Placeholder, disabled (ciemny szary) */

/* Borders & Dividers */
--border-color: #2A2A2A     /* Linie oddzielające */
--divider-color: #1F1F1F    /* Cienkie separatory */
```

#### Przykłady zastosowania
- **Przyciski główne**: Gradient (accent-primary → accent-secondary)
- **Przyciski drugorzędne**: bg-secondary z border accent-primary
- **Karty**: bg-secondary z border-color
- **Input fields**: bg-tertiary z focus accent-primary
- **Success states**: success color
- **PRs (Personal Records)**: accent-gradient z ikoną 🏆

### Typografia

```css
/* Font Stack */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
             'Helvetica Neue', Arial, sans-serif;

/* Rozmiary (mobile) */
--text-xs: 12px      /* Timestamps, labels */
--text-sm: 14px      /* Body text, descriptions */
--text-base: 16px    /* Default text */
--text-lg: 18px      /* Subheadings */
--text-xl: 24px      /* Section headers */
--text-2xl: 32px     /* Page titles */
--text-3xl: 40px     /* Hero numbers (stats) */

/* Grubości */
--font-regular: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
```

### Komponenty bazowe

#### Button Styles
```
┌──────────────────────────────────┐
│  ▶ Start Workout (Gradient)     │  Primary CTA
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  + Add Exercise (Secondary)      │  Secondary action
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  ×  Cancel (Ghost)               │  Tertiary/cancel
└──────────────────────────────────┘
```

#### Card Styles
```
╔════════════════════════════════════╗
║ Exercise Name            🏋️        ║  Card header
╠════════════════════════════════════╣
║ 3 sets • 12 reps • 50kg           ║  Card body
║ Last: 2 days ago                   ║  Card meta
╚════════════════════════════════════╝
```

#### Input Fields
```
┌────────────────────────────────────┐
│ Exercise name                      │  Label
│ ┌────────────────────────────────┐ │
│ │ Bench Press             ▼      │ │  Input with icon
│ └────────────────────────────────┘ │
└────────────────────────────────────┘
```

### Spacing System
```css
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-5: 24px
--space-6: 32px
--space-8: 48px
--space-10: 64px
```

### Ikony
Używamy emoji jako ikon (dostępne natywnie, nie wymaga zewnętrznej biblioteki):
- 🏋️ Workout/Exercise
- 📅 Calendar/Date
- ➕ Add/New
- 💪 Muscle/Strength
- 📊 Statistics/Charts
- ⚙️ Settings
- 🏆 Personal Record
- ✓ Complete/Success
- ✕ Cancel/Remove
- 📝 Edit/Notes

---

## 🗺️ Mapa podstron

### Struktura nawigacji

```
┌─────────────────────────────────────────┐
│  [Po zalogowaniu] → /workouts (Home)    │
└─────────────────────────────────────────┘
                    ↓
        ┌───────────┼───────────┐
        ↓           ↓           ↓
    /workout/new  /exercises  /stats
    (Nowy)        (Biblioteka) (Stats)
```

### Bottom Navigation - Stała nawigacja

```
╔═════════════════════════════════════════╗
║              [SCREEN CONTENT]           ║
║                                         ║
║                                         ║
╠═════════════════════════════════════════╣
║  📅      ➕       💪       📊      👤  ║  <- Bottom Nav
║  Home    New    Library   Stats  Profile║
╚═════════════════════════════════════════╝
```

#### Bottom Nav - Struktura
| Ikona | Label (PL) | Label (EN) | Route | Opis |
|-------|-----------|-----------|-------|------|
| 📅 | Treningi | Workouts | /workouts | Lista wszystkich treningów |
| ➕ | Nowy | New | /workout/new | Dodaj nowy trening |
| 💪 | Ćwiczenia | Exercises | /exercises | Biblioteka ćwiczeń |
| 📊 | Statystyki | Stats | /stats | Wykresy i PRs |
| 👤 | Profil | Profile | /profile | Ustawienia |

---

## 📱 Projekty ekranów z mockupami

---

### 1️⃣ EKRAN: Home - Lista treningów (`/workouts`)

#### Cel ekranu
- Główny ekran aplikacji po zalogowaniu
- Wyświetlenie wszystkich wykonanych treningów w porządku chronologicznym
- Szybki dostęp do rozpoczęcia nowego treningu
- Podsumowanie aktywności użytkownika

#### Layout mobilny (375px width)

```
╔═══════════════════════════════════════╗
║  10:24                    🇬🇧 🔊 100% ║  Status bar
╠═══════════════════════════════════════╣
║                                       ║
║  👋 Witaj, User!                      ║  Header
║  ⚡ Ostatni trening: 2 dni temu       ║  Subtitle
║                                       ║
║  ┌─────────────────────────────────┐ ║
║  │  ▶ START WORKOUT                │ ║  Primary CTA
║  └─────────────────────────────────┘ ║  (Gradient button)
║                                       ║
║  ┌─────────────────────────────────┐ ║
║  │ 📊 Ten tydzień                  │ ║  Stats summary
║  │                                 │ ║
║  │ 🏋️ 3 treningi  💪 2.5h  🔥 18k │ ║
║  └─────────────────────────────────┘ ║
║                                       ║
║  📅 Historia treningów              ▼ ║  Section header
║                                       ║
║  ┌─────────────────────────────────┐ ║
║  │ Wtorek, 28 Paź 2025      60 min │ ║  Workout card
║  │ Upper Body A             💪 🏋️  │ ║
║  │                                 │ ║
║  │ • Bench Press    3×10 @ 80kg   │ ║
║  │ • Rows           4×12 @ 60kg   │ ║
║  │ • Shoulder Press 3×8 @ 40kg    │ ║
║  │                                 │ ║
║  │ 🏆 2 PRs        📝 View details  │ ║
║  └─────────────────────────────────┘ ║
║                                       ║
║  ┌─────────────────────────────────┐ ║
║  │ Niedziela, 26 Paź 2025   45 min │ ║  Workout card
║  │ Legs Day                 💪 🦵  │ ║
║  │                                 │ ║
║  │ • Squats         5×5 @ 100kg   │ ║
║  │ • Leg Press      3×15 @ 150kg  │ ║
║  │ • Leg Curls      3×12 @ 50kg   │ ║
║  │                                 │ ║
║  │ 📝 View details                 │ ║
║  └─────────────────────────────────┘ ║
║                                       ║
║  ┌─────────────────────────────────┐ ║
║  │ Piątek, 24 Paź 2025      55 min │ ║  Workout card
║  │ Pull Day                 💪 🔙  │ ║
║  │                                 │ ║
║  │ • Deadlift       4×6 @ 120kg   │ ║
║  │ • Pull-ups       4×8            │ ║
║  │ • Bicep Curls    3×10 @ 20kg   │ ║
║  │                                 │ ║
║  │ 🏆 1 PR         📝 View details  │ ║
║  └─────────────────────────────────┘ ║
║                                       ║
║  [Scroll for more...]                ║
║                                       ║
╠═══════════════════════════════════════╣
║  📅      ➕       💪       📊      👤 ║  Bottom Nav
║ [Home]   New    Library   Stats  User ║  (Home active)
╚═══════════════════════════════════════╝
```

#### Komponenty i funkcjonalności

**Header Section:**
- Powitanie z imieniem użytkownika (pobrane z auth context)
- Dynamiczny status ostatniego treningu (X dni/godzin temu)
- Language switcher (🇬🇧/🇵🇱) w top-right

**CTA Button:**
- Duży gradient button "START WORKOUT"
- Prowadzi do `/workout/new`
- Animacja pulse na hover/tap

**Week Summary Card:**
- Liczba treningów w tym tygodniu
- Łączny czas treningów
- Spalone kalorie (opcjonalnie - jeśli będzie tracking)
- Background: `bg-secondary`, border: `accent-primary`

**Workout History List:**
- Każdy workout jako osobna karta
- Data i czas treningu (górny wiersz)
- Nazwa treningu + emoji kategorii
- Lista 3 pierwszych ćwiczeń (skrócona)
- Badge z liczbą PRs (jeśli są)
- Link "View details" prowadzący do szczegółów treningu
- Tap na całą kartę = rozwiń szczegóły inline

**Filtrowanie/Sortowanie:**
- Domyślnie: Od najnowszych
- Dropdown filter: "Wszystkie", "Ten tydzień", "Ten miesiąc"
- Search bar (opcjonalnie): Wyszukaj po nazwie ćwiczenia

**Empty State (gdy brak treningów):**
```
╔═══════════════════════════════════════╗
║                                       ║
║         🏋️                            ║
║                                       ║
║  Brak treningów                       ║
║  Rozpocznij swój pierwszy trening!    ║
║                                       ║
║  ┌─────────────────────────────────┐ ║
║  │  ▶ START YOUR FIRST WORKOUT     │ ║
║  └─────────────────────────────────┘ ║
║                                       ║
╚═══════════════════════════════════════╝
```

#### Interakcje
- **Scroll:** Lista treningów przewijalna w dół
- **Tap na "START WORKOUT":** Nawigacja do `/workout/new`
- **Tap na kartę treningu:** Rozwiń/zwiń szczegóły
- **Tap "View details":** Nawigacja do pełnego widoku treningu z możliwością edycji
- **Swipe na karcie:** Delete workout (z potwierdzeniem)
- **Pull-to-refresh:** Odśwież listę treningów

#### Dane z backendu
```sql
-- Pobieranie ostatnich treningów użytkownika
SELECT
  w.id, w.name, w.workout_date, w.notes,
  COUNT(DISTINCT we.id) as exercise_count,
  -- PRs będą obliczane w aplikacji lub przez view
FROM workouts w
LEFT JOIN workout_exercises we ON we.workout_id = w.id
WHERE w.user_id = auth.uid()
GROUP BY w.id
ORDER BY w.workout_date DESC
LIMIT 20;
```

#### Tłumaczenia (i18n keys)
```javascript
// Polish
workouts: {
  title: "Treningi",
  greeting: "Witaj, {name}!",
  lastWorkout: "Ostatni trening: {time}",
  startWorkout: "START WORKOUT",
  thisWeek: "Ten tydzień",
  workoutsCount: "{count} treningi",
  totalTime: "{hours}h",
  caloriesBurned: "{calories}k",
  history: "Historia treningów",
  viewDetails: "View details",
  prs: "{count} PRs",
  emptyState: {
    title: "Brak treningów",
    subtitle: "Rozpocznij swój pierwszy trening!",
    cta: "START YOUR FIRST WORKOUT"
  }
}

// English
workouts: {
  title: "Workouts",
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
  emptyState: {
    title: "No workouts yet",
    subtitle: "Start your first workout!",
    cta: "START YOUR FIRST WORKOUT"
  }
}
```

---

### 2️⃣ EKRAN: Nowy trening (`/workout/new`)

#### Cel ekranu
- Umożliwienie dodania nowego treningu krok po kroku
- Wybór ćwiczeń z biblioteki
- Logowanie serii (reps, weight, duration)
- Możliwość dodania notatek do treningu
- Szybkie dodawanie kolejnych ćwiczeń

#### Layout mobilny - Krok 1: Wybór ćwiczeń

```
╔═══════════════════════════════════════╗
║  ← Anuluj                       ✓ OK  ║  Top bar
╠═══════════════════════════════════════╣
║                                       ║
║  🏋️ Nowy trening                     ║  Header
║                                       ║
║  Krok 1/3: Wybierz ćwiczenia          ║  Progress
║  ●●○○                                 ║  Progress dots
║                                       ║
║  ┌─────────────────────────────────┐ ║
║  │ 🔍 Wyszukaj ćwiczenie...        │ ║  Search bar
║  └─────────────────────────────────┘ ║
║                                       ║
║  ✓ Wybrane (2)                    ▼  ║  Collapsed section
║                                       ║
║  💪 Twoje ćwiczenia                   ║  Section header
║                                       ║
║  ┌─────────────────────────────────┐ ║
║  │ 🏋️ Bench Press           [➕]   │ ║  Exercise item
║  │    Chest • Barbell              │ ║
║  └─────────────────────────────────┘ ║
║                                       ║
║  ┌─────────────────────────────────┐ ║
║  │ 🏋️ Squats                 [✓]   │ ║  Selected
║  │    Legs • Barbell               │ ║  (highlighted)
║  └─────────────────────────────────┘ ║
║                                       ║
║  ┌─────────────────────────────────┐ ║
║  │ 🏋️ Deadlift               [✓]   │ ║  Selected
║  │    Back • Barbell               │ ║
║  └─────────────────────────────────┘ ║
║                                       ║
║  ┌─────────────────────────────────┐ ║
║  │ 🏋️ Overhead Press         [➕]   │ ║
║  │    Shoulders • Barbell          │ ║
║  └─────────────────────────────────┘ ║
║                                       ║
║  ┌─────────────────────────────────┐ ║
║  │ ➕ Dodaj nowe ćwiczenie          │ ║  Create new
║  └─────────────────────────────────┘ ║
║                                       ║
║  [Scroll for more...]                ║
║                                       ║
║  ┌─────────────────────────────────┐ ║
║  │  DALEJ (2 wybrane)              │ ║  CTA
║  └─────────────────────────────────┘ ║
║                                       ║
╠═══════════════════════════════════════╣
║  📅      [➕]      💪       📊      👤 ║  Bottom Nav
║  Home   [New]   Library   Stats  User ║  (New active)
╚═══════════════════════════════════════╝
```

#### Layout mobilny - Krok 2: Logowanie serii

```
╔═══════════════════════════════════════╗
║  ← Wstecz                     ⏱️ 5:32 ║  Top bar + timer
╠═══════════════════════════════════════╣
║                                       ║
║  🏋️ Nowy trening                     ║  Header
║                                       ║
║  Krok 2/3: Loguj serie                ║
║  ●●●○                                 ║
║                                       ║
║  ┌─────────────────────────────────┐ ║
║  │ 📝 Nazwa (opcjonalnie)          │ ║  Workout name
║  │ ┌─────────────────────────────┐ │ ║
║  │ │ Upper Body A                │ │ ║
║  │ └─────────────────────────────┘ │ ║
║  └─────────────────────────────────┘ ║
║                                       ║
║  🏋️ Squats                       ▼ ▲ ║  Exercise accordion
║  ╔═══════════════════════════════════╗
║  ║                                   ║
║  ║  Seria 1                      [✓] ║
║  ║  ┌────────┬────────┬────────────┐ ║
║  ║  │ Reps   │ Weight │ ✓ Gotowe  │ ║
║  ║  │   12   │  100kg │           │ ║
║  ║  └────────┴────────┴────────────┘ ║
║  ║                                   ║
║  ║  Seria 2                      [✓] ║
║  ║  ┌────────┬────────┬────────────┐ ║
║  ║  │   10   │  100kg │ ✓ Gotowe  │ ║
║  ║  └────────┴────────┴────────────┘ ║
║  ║                                   ║
║  ║  Seria 3                      [ ] ║
║  ║  ┌────────┬────────┬────────────┐ ║
║  ║  │   [8]  │ [100]  │ Start     │ ║  Active set
║  ║  └────────┴────────┴────────────┘ ║
║  ║                                   ║
║  ║  ┌─────────────────────────────┐  ║
║  ║  │ ➕ Dodaj serię              │  ║
║  ║  └─────────────────────────────┘  ║
║  ║                                   ║
║  ║  🏆 Ostatnio: 3×10 @ 95kg        ║  PR info
║  ║                                   ║
║  ╚═══════════════════════════════════╝
║                                       ║
║  🏋️ Deadlift                     ▼ ▲ ║  Collapsed
║  ┌───────────────────────────────────┐
║  │ 0 serii                           │
║  └───────────────────────────────────┘
║                                       ║
║  ┌─────────────────────────────────┐ ║
║  │  ZAKOŃCZ TRENING                │ ║  Finish CTA
║  └─────────────────────────────────┘ ║
║                                       ║
╠═══════════════════════════════════════╣
║  📅      [➕]      💪       📊      👤 ║  Bottom Nav
╚═══════════════════════════════════════╝
```

#### Layout mobilny - Krok 3: Podsumowanie

```
╔═══════════════════════════════════════╗
║  ✕ Zamknij                            ║  Top bar
╠═══════════════════════════════════════╣
║                                       ║
║         ✓                             ║  Success icon
║                                       ║
║  Trening zakończony!                  ║  Header
║                                       ║
║  ┌─────────────────────────────────┐ ║
║  │ Upper Body A                    │ ║  Summary card
║  │                                 │ ║
║  │ ⏱️ Czas: 45 min                 │ ║
║  │ 💪 Ćwiczeń: 2                   │ ║
║  │ 🏋️ Serii: 8                     │ ║
║  │ 🏆 Nowe PRs: 1                  │ ║
║  │                                 │ ║
║  │ 📝 Notatki (opcjonalnie)        │ ║
║  │ ┌─────────────────────────────┐ │ ║
║  │ │ Great workout, felt strong! │ │ ║
║  │ └─────────────────────────────┘ │ ║
║  └─────────────────────────────────┘ ║
║                                       ║
║  🏆 Nowe rekordy!                     ║
║  ┌─────────────────────────────────┐ ║
║  │ Squats: 100kg (10 reps)         │ ║
║  │ Poprzedni PR: 95kg              │ ║
║  └─────────────────────────────────┘ ║
║                                       ║
║  ┌─────────────────────────────────┐ ║
║  │  POWRÓT DO GŁÓWNEJ              │ ║  CTA
║  └─────────────────────────────────┘ ║
║                                       ║
║  ┌─────────────────────────────────┐ ║
║  │  📤 UDOSTĘPNIJ                   │ ║  Secondary
║  └─────────────────────────────────┘ ║
║                                       ║
╠═══════════════════════════════════════╣
║  📅      [➕]      💪       📊      👤 ║  Bottom Nav
╚═══════════════════════════════════════╝
```

#### Komponenty i funkcjonalności

**Krok 1: Wybór ćwiczeń**
- Search bar z filtrowaniem na żywo
- Lista ćwiczeń z biblioteki użytkownika
- Checkbox/toggle do wyboru ćwiczeń
- Sekcja "Wybrane" pokazująca wybrane ćwiczenia (możliwość usunięcia)
- Przycisk "Dodaj nowe ćwiczenie" prowadzący do quick create
- CTA "DALEJ" aktywny tylko gdy wybrano min. 1 ćwiczenie

**Krok 2: Logowanie serii**
- Timer pokazujący czas trwania treningu (top-right)
- Opcjonalne pole na nazwę treningu
- Accordion z wybranymi ćwiczeniami
- Dla każdego ćwiczenia:
  - Lista serii z polami: Reps, Weight, Duration (opcjonalnie)
  - Checkbox "Gotowe" dla każdej serii
  - Przycisk "Dodaj serię"
  - Wyświetlenie ostatniego wyniku (z previous workout)
  - Indicator jeśli jest PR
- Możliwość zmiany kolejności ćwiczeń (drag & drop)
- Możliwość usunięcia ćwiczenia
- CTA "ZAKOŃCZ TRENING" - zapisuje trening do bazy

**Krok 3: Podsumowanie**
- Podsumowanie treningu (czas, liczba ćwiczeń, serie)
- Lista nowych PRs (jeśli są)
- Pole na notatki do treningu
- CTA "POWRÓT DO GŁÓWNEJ" - nawigacja do `/workouts`
- Opcjonalnie: "Udostępnij" (screenshot/social share)

**Input controls dla serii:**
```
Reps:
┌───────────┐
│  [−] 10 [+]│  Number stepper
└───────────┘

Weight:
┌───────────┐
│  [−]100[+] │  kg
└───────────┘

Duration (opcjonalnie):
┌───────────┐
│ 00:45     │  Timer format
└───────────┘
```

#### Interakcje
- **Tap na ćwiczenie (Krok 1):** Toggle selection
- **Tap "Dodaj nowe":** Modal/slide-up z quick create exercise
- **Tap "DALEJ":** Przejście do Kroku 2
- **Accordion toggle:** Rozwiń/zwiń ćwiczenie
- **Number stepper:** Increment/decrement wartości
- **Checkbox "Gotowe":** Oznacz serię jako wykonaną
- **Tap "Dodaj serię":** Dodaj nową serię z kopiowanymi wartościami
- **Tap "ZAKOŃCZ TRENING":** Walidacja + zapis + przejście do Kroku 3
- **Swipe na serii:** Delete set
- **Long press na ćwiczeniu:** Zmiana kolejności (drag mode)

#### Stan w WorkoutContext
```javascript
{
  activeWorkout: {
    name: "Upper Body A",
    date: "2025-10-30T10:24:00",
    exercises: [
      {
        exerciseId: "uuid-1",
        name: "Squats",
        sets: [
          { setNumber: 1, reps: 12, weightKg: 100, completed: true },
          { setNumber: 2, reps: 10, weightKg: 100, completed: true },
          { setNumber: 3, reps: 8, weightKg: 100, completed: false }
        ]
      }
    ],
    notes: "",
    startTime: "2025-10-30T10:19:00"
  }
}
```

#### Dane z backendu
```sql
-- Zapisywanie treningu
INSERT INTO workouts (user_id, name, workout_date, notes)
VALUES (auth.uid(), 'Upper Body A', NOW(), 'Great workout!');

-- Dodawanie ćwiczeń do treningu
INSERT INTO workout_exercises (workout_id, exercise_id, order_index)
VALUES ('workout-uuid', 'exercise-uuid', 0);

-- Zapisywanie serii
INSERT INTO exercise_sets (workout_exercise_id, set_number, reps, weight_kg)
VALUES ('workout-exercise-uuid', 1, 10, 100);
```

#### Tłumaczenia (i18n keys)
```javascript
// Polish
newWorkout: {
  title: "Nowy trening",
  cancel: "Anuluj",
  ok: "OK",
  back: "Wstecz",
  step1: {
    title: "Wybierz ćwiczenia",
    progress: "Krok 1/3",
    search: "Wyszukaj ćwiczenie...",
    selected: "Wybrane ({count})",
    yourExercises: "Twoje ćwiczenia",
    addNew: "Dodaj nowe ćwiczenie",
    next: "DALEJ ({count} wybrane)"
  },
  step2: {
    title: "Loguj serie",
    progress: "Krok 2/3",
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
}

// English
newWorkout: {
  title: "New Workout",
  cancel: "Cancel",
  ok: "OK",
  back: "Back",
  step1: {
    title: "Select exercises",
    progress: "Step 1/3",
    search: "Search exercise...",
    selected: "Selected ({count})",
    yourExercises: "Your exercises",
    addNew: "Add new exercise",
    next: "NEXT ({count} selected)"
  },
  step2: {
    title: "Log sets",
    progress: "Step 2/3",
    nameLabel: "Name (optional)",
    namePlaceholder: "e.g. Upper Body A",
    set: "Set {number}",
    reps: "Reps",
    weight: "Weight",
    duration: "Duration",
    done: "Done",
    addSet: "Add set",
    lastTime: "Last: {sets}×{reps} @ {weight}kg",
    finish: "FINISH WORKOUT"
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
}
```

---

### 3️⃣ EKRAN: Biblioteka ćwiczeń (`/exercises`)

#### Cel ekranu
- Wyświetlenie wszystkich ćwiczeń użytkownika
- Filtrowanie według grup mięśniowych
- Dodawanie nowych ćwiczeń
- Edycja i usuwanie ćwiczeń
- Wyświetlenie statystyk dla każdego ćwiczenia (PRs, historia)

#### Layout mobilny

```
╔═══════════════════════════════════════╗
║  [≡ Menu]     💪 Ćwiczenia       [+]  ║  Top bar
╠═══════════════════════════════════════╣
║                                       ║
║  ┌─────────────────────────────────┐ ║
║  │ 🔍 Wyszukaj ćwiczenie...        │ ║  Search bar
║  └─────────────────────────────────┘ ║
║                                       ║
║  ┌────┬────┬────┬────┬────┬────────┐ ║
║  │All │Chest│Back│Legs│Arms│Shoulders║  Filter chips
║  └────┴────┴────┴────┴────┴────────┘ ║  (scrollable)
║                                       ║
║  📊 Masz 12 ćwiczeń                   ║  Count
║                                       ║
║  🏋️ Klatka piersiowa (3)          ▼  ║  Category header
║  ┌─────────────────────────────────┐ ║
║  │ 🏋️ Bench Press                  │ ║  Exercise card
║  │    💪 Chest • 🏋️ Barbell         │ ║
║  │                                 │ ║
║  │    🏆 PR: 120kg @ 8 reps        │ ║
║  │    📅 Ostatnio: 3 dni temu      │ ║
║  │    📊 15 treningów              │ ║
║  │                                 │ ║
║  │    [📝 Edit]  [📊 Stats]  [🗑️]  │ ║  Actions
║  └─────────────────────────────────┘ ║
║                                       ║
║  ┌─────────────────────────────────┐ ║
║  │ 🏋️ Incline Dumbbell Press      │ ║
║  │    💪 Chest • 🏋️ Dumbbell       │ ║
║  │                                 │ ║
║  │    🏆 PR: 40kg @ 10 reps        │ ║
║  │    📅 Ostatnio: 5 dni temu      │ ║
║  │    📊 8 treningów               │ ║
║  │                                 │ ║
║  │    [📝 Edit]  [📊 Stats]  [🗑️]  │ ║
║  └─────────────────────────────────┘ ║
║                                       ║
║  ┌─────────────────────────────────┐ ║
║  │ 🏋️ Cable Flyes                  │ ║
║  │    💪 Chest • 🏋️ Cable          │ ║
║  │                                 │ ║
║  │    🏆 PR: 30kg @ 12 reps        │ ║
║  │    📅 Ostatnio: 1 tydzień temu  │ ║
║  │    📊 6 treningów               │ ║
║  │                                 │ ║
║  │    [📝 Edit]  [📊 Stats]  [🗑️]  │ ║
║  └─────────────────────────────────┘ ║
║                                       ║
║  🏋️ Plecy (4)                      ▼  ║  Category header
║  [Collapsed]                          ║
║                                       ║
║  🏋️ Nogi (5)                       ▼  ║
║  [Collapsed]                          ║
║                                       ║
║  [Scroll for more...]                ║
║                                       ║
╠═══════════════════════════════════════╣
║  📅      ➕       [💪]      📊      👤 ║  Bottom Nav
║  Home    New   [Library]  Stats  User ║  (Library active)
╚═══════════════════════════════════════╝
```

#### Modal - Dodaj ćwiczenie

```
╔═══════════════════════════════════════╗
║  ✕ Anuluj      Nowe ćwiczenie         ║  Modal header
╠═══════════════════════════════════════╣
║                                       ║
║  📝 Nazwa                             ║
║  ┌─────────────────────────────────┐ ║
║  │ Bench Press                     │ ║  Input
║  └─────────────────────────────────┘ ║
║                                       ║
║  💪 Grupa mięśniowa (opcjonalnie)    ║
║  ┌─────────────────────────────────┐ ║
║  │ Klatka piersiowa            ▼  │ ║  Dropdown
║  └─────────────────────────────────┘ ║
║                                       ║
║  📝 Opis (opcjonalnie)                ║
║  ┌─────────────────────────────────┐ ║
║  │ Compound chest exercise...      │ ║  Textarea
║  │                                 │ ║
║  └─────────────────────────────────┘ ║
║                                       ║
║  ┌─────────────────────────────────┐ ║
║  │  ➕ DODAJ ĆWICZENIE              │ ║  CTA
║  └─────────────────────────────────┘ ║
║                                       ║
║  ┌─────────────────────────────────┐ ║
║  │  Anuluj                         │ ║  Cancel
║  └─────────────────────────────────┘ ║
║                                       ║
╚═══════════════════════════════════════╝
```

#### Komponenty i funkcjonalności

**Top Bar:**
- Menu hamburger (lewy górny róg) - dostęp do profilu/settings
- Tytuł "Ćwiczenia"
- Przycisk [+] (prawy górny róg) - otwiera modal dodawania ćwiczenia

**Search & Filter:**
- Search bar z live filtering
- Scrollable chips do filtrowania według kategorii
- Chip "All" pokazuje wszystkie ćwiczenia

**Exercise List:**
- Pogrupowane według muscle groups (accordion)
- Każde ćwiczenie jako karta z:
  - Nazwa ćwiczenia + emoji
  - Kategoria + typ sprzętu (opcjonalnie)
  - PR (jeśli istnieje)
  - Data ostatniego użycia
  - Liczba treningów z tym ćwiczeniem
  - Action buttons: Edit, Stats, Delete

**Empty State (gdy brak ćwiczeń):**
```
╔═══════════════════════════════════════╗
║                                       ║
║         💪                            ║
║                                       ║
║  Brak ćwiczeń                         ║
║  Dodaj swoje pierwsze ćwiczenie!      ║
║                                       ║
║  ┌─────────────────────────────────┐ ║
║  │  ➕ DODAJ ĆWICZENIE              │ ║
║  └─────────────────────────────────┘ ║
║                                       ║
╚═══════════════════════════════════════╝
```

#### Interakcje
- **Tap [+] button:** Otwórz modal dodawania ćwiczenia
- **Tap na kartę ćwiczenia:** Rozwiń/zwiń szczegóły
- **Tap "Edit":** Modal edycji ćwiczenia (takie same pola jak dodawanie)
- **Tap "Stats":** Przejście do szczegółowego widoku statystyk ćwiczenia
- **Tap "Delete":** Confirmation alert → Usuń ćwiczenie
- **Tap category header:** Rozwiń/zwiń kategorię
- **Swipe na karcie:** Quick delete (z potwierdzeniem)
- **Search bar:** Live filtering po nazwie

#### Dane z backendu
```sql
-- Pobieranie ćwiczeń użytkownika z PRs
SELECT
  e.id, e.name, e.description,
  mg.name as muscle_group_name,
  pr.max_weight_kg, pr.max_reps, pr.total_workouts
FROM exercises e
LEFT JOIN muscle_groups mg ON mg.id = e.muscle_group_id
LEFT JOIN personal_records pr ON pr.exercise_id = e.id
WHERE e.user_id = auth.uid()
ORDER BY mg.name, e.name;

-- Dodawanie ćwiczenia
INSERT INTO exercises (user_id, name, muscle_group_id, description)
VALUES (auth.uid(), 'Bench Press', 'muscle-group-uuid', 'Compound...');
```

#### Tłumaczenia (i18n keys)
```javascript
// Polish
exercises: {
  title: "Ćwiczenia",
  search: "Wyszukaj ćwiczenie...",
  count: "Masz {count} ćwiczeń",
  categoryAll: "Wszystkie",
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
    muscleGroupLabel: "Grupa mięśniowa (opcjonalnie)",
    muscleGroupPlaceholder: "Wybierz kategorię",
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
}

// English - similar structure
```

---

### 4️⃣ EKRAN: Statystyki i PRs (`/stats`)

#### Cel ekranu
- Wyświetlenie personal records dla wszystkich ćwiczeń
- Wykresy postępów (weight, volume)
- Podsumowanie aktywności (treningi per tydzień/miesiąc)
- Streak tracking (dni z rzędu)

#### Layout mobilny

```
╔═══════════════════════════════════════╗
║  📊 Statystyki              🗓️ ▼      ║  Top bar + filter
╠═══════════════════════════════════════╣
║                                       ║
║  ┌─────────────────────────────────┐ ║
║  │ 🔥 Aktywność                    │ ║  Activity card
║  │                                 │ ║
║  │  🔥 12    💪 45    ⏱️ 35h       │ ║
║  │  Streak  Workouts  Total time   │ ║
║  │                                 │ ║
║  │  ┌────────────────────────────┐ │ ║  Activity graph
║  │  │     ■ ■ ■ □ ■ ■ □          │ │  (last 7 days)
║  │  │     M T W T F S S          │ │
║  │  └────────────────────────────┘ │ ║
║  └─────────────────────────────────┘ ║
║                                       ║
║  🏆 Personal Records                  ║  Section header
║                                       ║
║  ┌─────────────────────────────────┐ ║
║  │ 🏋️ Bench Press              📈  │ ║  PR card
║  │                                 │ ║
║  │ 🏆 120kg @ 8 reps               │ ║
║  │ 📅 3 dni temu                   │ ║
║  │                                 │ ║
║  │ ┌────────────────────────────┐  │ ║  Mini chart
║  │ │        ╱─────               │  │
║  │ │      ╱                      │  │
║  │ │    ╱                        │  │
║  │ │  ╱                          │  │
║  │ └────────────────────────────┘  │ ║
║  │ 100kg → 105kg → 110kg → 120kg  │ ║
║  │                                 │ ║
║  │ [📊 Zobacz szczegóły]           │ ║
║  └─────────────────────────────────┘ ║
║                                       ║
║  ┌─────────────────────────────────┐ ║
║  │ 🏋️ Squats                   📈  │ ║
║  │                                 │ ║
║  │ 🏆 140kg @ 5 reps               │ ║
║  │ 📅 1 tydzień temu               │ ║
║  │                                 │ ║
║  │ ┌────────────────────────────┐  │ ║
║  │ │          ╱────              │  │
║  │ │        ╱                    │  │
║  │ │      ╱                      │  │
║  │ │    ╱                        │  │
║  │ └────────────────────────────┘  │ ║
║  │ 120kg → 130kg → 135kg → 140kg  │ ║
║  │                                 │ ║
║  │ [📊 Zobacz szczegóły]           │ ║
║  └─────────────────────────────────┘ ║
║                                       ║
║  ┌─────────────────────────────────┐ ║
║  │ 🏋️ Deadlift                 📈  │ ║
║  │                                 │ ║
║  │ 🏆 160kg @ 3 reps               │ ║
║  │ 📅 2 tygodnie temu              │ ║
║  │                                 │ ║
║  │ ┌────────────────────────────┐  │ ║
║  │ │            ╱───             │  │
║  │ │          ╱                  │  │
║  │ │        ╱                    │  │
║  │ │      ╱                      │  │
║  │ └────────────────────────────┘  │ ║
║  │ 140kg → 150kg → 155kg → 160kg  │ ║
║  │                                 │ ║
║  │ [📊 Zobacz szczegóły]           │ ║
║  └─────────────────────────────────┘ ║
║                                       ║
║  [Scroll for more...]                ║
║                                       ║
╠═══════════════════════════════════════╣
║  📅      ➕       💪       [📊]     👤 ║  Bottom Nav
║  Home    New   Library   [Stats]  User║  (Stats active)
╚═══════════════════════════════════════╝
```

#### Detail View - Szczegóły ćwiczenia

```
╔═══════════════════════════════════════╗
║  ← Wstecz     🏋️ Bench Press          ║  Top bar
╠═══════════════════════════════════════╣
║                                       ║
║  🏆 Personal Record                   ║
║  ┌─────────────────────────────────┐ ║
║  │                                 │ ║
║  │        120kg                    │ ║  Big number
║  │      @ 8 reps                   │ ║
║  │                                 │ ║
║  │  📅 Osiągnięty: 27 Paź 2025     │ ║
║  │  📈 +5kg od poprzedniego PR     │ ║
║  └─────────────────────────────────┘ ║
║                                       ║
║  📊 Postęp (ostatnie 3 miesiące)      ║
║  ┌─────────────────────────────────┐ ║
║  │                                 │ ║  Full chart
║  │  120├───────────────────●       │ ║
║  │     │                 ╱         │ ║
║  │  110├──────────────●            │ ║
║  │     │          ╱                │ ║
║  │  100├────────●                  │ ║
║  │     │      ╱                    │ ║
║  │   90├────●                      │ ║
║  │     └────────────────────────   │ ║
║  │     Aug    Sep    Oct    Nov    │ ║
║  └─────────────────────────────────┘ ║
║                                       ║
║  📈 Statystyki                        ║
║  ┌─────────────────────────────────┐ ║
║  │ Łączna objętość:     12,450 kg  │ ║
║  │ Średni ciężar:          95 kg   │ ║
║  │ Liczba treningów:          15   │ ║
║  │ Ostatni trening:    3 dni temu  │ ║
║  └─────────────────────────────────┘ ║
║                                       ║
║  📅 Historia rekordów                 ║
║  ┌─────────────────────────────────┐ ║
║  │ 🏆 120kg @ 8 reps               │ ║
║  │    27 Paź 2025                  │ ║
║  └─────────────────────────────────┘ ║
║  ┌─────────────────────────────────┐ ║
║  │    115kg @ 8 reps               │ ║
║  │    13 Paź 2025                  │ ║
║  └─────────────────────────────────┘ ║
║  ┌─────────────────────────────────┐ ║
║  │    110kg @ 8 reps               │ ║
║  │    29 Wrz 2025                  │ ║
║  └─────────────────────────────────┘ ║
║                                       ║
║  [Scroll for more...]                ║
║                                       ║
╠═══════════════════════════════════════╣
║  📅      ➕       💪       [📊]     👤 ║  Bottom Nav
╚═══════════════════════════════════════╝
```

#### Komponenty i funkcjonalności

**Activity Card:**
- Streak counter (dni z rzędu z treningami)
- Liczba treningów (okres wybrany przez filtr)
- Łączny czas treningów
- Mini wykres aktywności (7 dni)

**PR Cards:**
- Lista wszystkich ćwiczeń z PRs
- Dla każdego: max weight, reps, data
- Mini wykres trendu (ostatnie 4 wartości)
- Przycisk "Zobacz szczegóły"

**Detail View:**
- Duży display obecnego PR
- Pełny wykres postępu w czasie
- Statystyki (volume, średnie, liczba treningów)
- Historia wszystkich PRs (chronologicznie)

**Filter/Time Range:**
- Dropdown w top-right
- Opcje: "Ostatnie 7 dni", "Ostatnie 30 dni", "3 miesiące", "Rok", "Wszystko"

**Empty State (gdy brak PRs):**
```
╔═══════════════════════════════════════╗
║                                       ║
║         📊                            ║
║                                       ║
║  Brak danych                          ║
║  Wykonaj pierwszy trening aby zobaczyć║
║  swoje statystyki i rekordy!          ║
║                                       ║
║  ┌─────────────────────────────────┐ ║
║  │  ▶ START WORKOUT                │ ║
║  └─────────────────────────────────┘ ║
║                                       ║
╚═══════════════════════════════════════╝
```

#### Interakcje
- **Tap na PR card:** Nawigacja do detail view
- **Tap "Zobacz szczegóły":** Nawigacja do detail view
- **Dropdown filter:** Zmiana zakresu czasowego
- **Scroll:** Lista PRs przewijalna
- **Pull-to-refresh:** Odśwież statystyki

#### Dane z backendu
```sql
-- Pobieranie PRs z view
SELECT * FROM personal_records
WHERE user_id = auth.uid()
ORDER BY max_weight_kg DESC;

-- Historia wartości dla ćwiczenia (do wykresu)
SELECT
  w.workout_date,
  MAX(es.weight_kg) as max_weight,
  MAX(es.reps) as max_reps
FROM exercise_sets es
JOIN workout_exercises we ON we.id = es.workout_exercise_id
JOIN workouts w ON w.id = we.workout_id
WHERE we.exercise_id = 'exercise-uuid'
  AND w.user_id = auth.uid()
GROUP BY w.workout_date
ORDER BY w.workout_date ASC;
```

#### Tłumaczenia (i18n keys)
```javascript
// Polish
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
}

// English - similar structure
```

---

### 5️⃣ EKRAN: Profil/Ustawienia (`/profile`)

#### Cel ekranu
- Wyświetlenie informacji o użytkowniku
- Zmiana ustawień aplikacji (język, jednostki)
- Zarządzanie kategoriami (muscle groups)
- Wylogowanie
- Eksport danych (opcjonalnie)

#### Layout mobilny

```
╔═══════════════════════════════════════╗
║  ← Wstecz          👤 Profil          ║  Top bar
╠═══════════════════════════════════════╣
║                                       ║
║  ┌─────────────────────────────────┐ ║
║  │        👤                        │ ║  User info
║  │    user@email.com                │ ║
║  │                                 │ ║
║  │  📅 Członek od: Paź 2025        │ ║
║  └─────────────────────────────────┘ ║
║                                       ║
║  ⚙️ Ustawienia                        ║  Section
║  ┌─────────────────────────────────┐ ║
║  │ 🌐 Język                        │ ║
║  │    Polski                    ▼  │ ║
║  └─────────────────────────────────┘ ║
║  ┌─────────────────────────────────┐ ║
║  │ ⚖️ Jednostki wagi                │ ║
║  │    Kilogramy (kg)            ▼  │ ║
║  └─────────────────────────────────┘ ║
║  ┌─────────────────────────────────┐ ║
║  │ 🌙 Tryb ciemny                  │ ║
║  │    Zawsze włączony           ●  │ ║  Toggle
║  └─────────────────────────────────┘ ║
║                                       ║
║  💪 Kategorie                         ║  Section
║  ┌─────────────────────────────────┐ ║
║  │ Zarządzaj grupami mięśniowymi   │ ║
║  │                                 │ ║
║  │ • Klatka piersiowa          [✕] │ ║
║  │ • Plecy                     [✕] │ ║
║  │ • Nogi                      [✕] │ ║
║  │ • Ramiona                   [✕] │ ║
║  │ • Barki                     [✕] │ ║
║  │ • Core                      [✕] │ ║
║  │                                 │ ║
║  │ ┌─────────────────────────────┐ │ ║
║  │ │ ➕ Dodaj kategorię          │ │ ║
║  │ └─────────────────────────────┘ │ ║
║  └─────────────────────────────────┘ ║
║                                       ║
║  📊 Dane                              ║  Section
║  ┌─────────────────────────────────┐ ║
║  │ 📤 Eksportuj dane do CSV        │ ║
║  └─────────────────────────────────┘ ║
║  ┌─────────────────────────────────┐ ║
║  │ 🗑️ Usuń wszystkie dane          │ ║  Danger zone
║  └─────────────────────────────────┘ ║
║                                       ║
║  ┌─────────────────────────────────┐ ║
║  │  🚪 WYLOGUJ                     │ ║  Logout button
║  └─────────────────────────────────┘ ║
║                                       ║
║  ────────────────────────────────────  ║
║  v1.0.0 • Made with 💪 by You         ║  Footer
║                                       ║
╠═══════════════════════════════════════╣
║  📅      ➕       💪       📊      [👤]║  Bottom Nav
║  Home    New   Library   Stats  [User]║  (Profile active)
╚═══════════════════════════════════════╝
```

#### Komponenty i funkcjonalności

**User Info Card:**
- Email użytkownika (z auth context)
- Data dołączenia
- Opcjonalnie: awatar (inicjały)

**Settings Section:**
- **Język:** Dropdown (Polski, English) - wykorzystuje istniejący LanguageContext
- **Jednostki wagi:** Dropdown (Kilogramy, Funty) - nowy settings context
- **Tryb ciemny:** Toggle (ON/OFF) - w tym przypadku zawsze ON

**Muscle Groups Management:**
- Lista kategorii użytkownika
- Możliwość usunięcia kategorii (jeśli nie ma przypisanych ćwiczeń)
- Przycisk dodania nowej kategorii
- Alert przy próbie usunięcia kategorii z przypisanymi ćwiczeniami

**Data Section:**
- Eksport wszystkich danych do CSV
- Usunięcie wszystkich danych (z potwierdzeniem)

**Logout:**
- Przycisk wylogowania (ghost button z ikoną)
- Po kliknięciu: signOut() z AuthContext + redirect do `/`

#### Interakcje
- **Dropdown language:** Zmiana języka (z LanguageContext)
- **Dropdown units:** Zmiana jednostek (zapisane w localStorage)
- **Toggle dark mode:** ON/OFF (w przyszłości - na razie zawsze ON)
- **Tap [✕] przy kategorii:** Usuń kategorię (z walidacją)
- **Tap "Dodaj kategorię":** Modal z inputem
- **Tap "Eksportuj":** Generuj CSV + download
- **Tap "Usuń dane":** Confirmation dialog → delete all user data
- **Tap "WYLOGUJ":** Confirmation → logout → redirect to login

#### Dane z backendu
```sql
-- Pobieranie kategorii użytkownika
SELECT * FROM muscle_groups
WHERE user_id = auth.uid()
ORDER BY name;

-- Usuwanie kategorii (tylko jeśli brak ćwiczeń)
DELETE FROM muscle_groups
WHERE id = 'category-uuid'
  AND user_id = auth.uid()
  AND NOT EXISTS (
    SELECT 1 FROM exercises
    WHERE muscle_group_id = 'category-uuid'
  );

-- Eksport danych (query w aplikacji)
SELECT * FROM workouts WHERE user_id = auth.uid();
SELECT * FROM exercises WHERE user_id = auth.uid();
-- etc...
```

#### Tłumaczenia (i18n keys)
```javascript
// Polish
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
  categories: {
    title: "Kategorie",
    manage: "Zarządzaj grupami mięśniowymi",
    add: "Dodaj kategorię",
    deleteConfirm: "Usuń kategorię \"{name}\"?",
    deleteError: "Nie można usunąć kategorii z przypisanymi ćwiczeniami"
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

// English - similar structure
```

---

## 🚀 Plan implementacji

### Faza 0: Przygotowanie (1-2 dni)
**Cel:** Setup środowiska i podstawowej struktury

#### Zadania:
1. **Stworzenie nowych komponentów bazowych**
   - `components/BottomNav.jsx` - Dolna nawigacja
   - `components/DarkModeWrapper.jsx` - Wrapper z dark theme
   - `styles/dark-theme.css` - Style dla dark mode

2. **Setup nowych kontekstów**
   - `context/WorkoutContext.jsx` - Stan treningów
   - `context/ExerciseContext.jsx` - Stan ćwiczeń
   - `context/StatsContext.jsx` - Obliczanie statystyk

3. **Rozszerzenie tłumaczeń**
   - Dodanie kluczy dla workout diary do `locales/en.js` i `locales/pl.js`

4. **Routing**
   - Aktualizacja `App.jsx` z nowymi route'ami
   - Zmiana przekierowania po logowaniu z `/dashboard` na `/workouts`

#### Pliki do utworzenia/modyfikacji:
```
src/
├── components/
│   ├── BottomNav.jsx                 [NOWY]
│   └── DarkModeWrapper.jsx           [NOWY]
├── context/
│   ├── WorkoutContext.jsx            [NOWY]
│   ├── ExerciseContext.jsx           [NOWY]
│   └── StatsContext.jsx              [NOWY]
├── styles/
│   └── dark-theme.css                [NOWY]
├── locales/
│   ├── en.js                         [MODYFIKACJA]
│   └── pl.js                         [MODYFIKACJA]
└── App.jsx                           [MODYFIKACJA]
```

---

### Faza 1: Biblioteka ćwiczeń (2-3 dni)
**Cel:** Umożliwienie zarządzania ćwiczeniami

#### Zadania:
1. **ExercisesLibraryPage** - Główny widok
   - Lista ćwiczeń (pogrupowana)
   - Search & filter
   - Empty state

2. **Komponenty**
   - `ExerciseCard.jsx` - Karta ćwiczenia
   - `AddExerciseModal.jsx` - Modal dodawania
   - `ExerciseDetailModal.jsx` - Szczegóły/edycja

3. **Integracja z Supabase**
   - CRUD operations dla `exercises`
   - CRUD dla `muscle_groups`
   - Pobieranie z view `personal_records`

4. **Muscle Groups Management**
   - Dodanie sekcji zarządzania w Profile
   - CRUD dla kategorii

#### Pliki:
```
src/
├── pages/
│   └── ExercisesLibraryPage.jsx      [NOWY]
├── components/
│   ├── ExerciseCard.jsx              [NOWY]
│   ├── AddExerciseModal.jsx          [NOWY]
│   └── ExerciseDetailModal.jsx       [NOWY]
└── context/
    └── ExerciseContext.jsx           [IMPLEMENTACJA]
```

---

### Faza 2: Dodawanie treningu (3-4 dni)
**Cel:** Pełny flow dodawania nowego treningu

#### Zadania:
1. **NewWorkoutPage** - Multi-step form
   - Step 1: Wybór ćwiczeń
   - Step 2: Logowanie serii
   - Step 3: Podsumowanie

2. **Komponenty**
   - `ExerciseSelector.jsx` - Wybór z listy
   - `SetLogger.jsx` - Formularz logowania serii
   - `WorkoutSummary.jsx` - Podsumowanie
   - `RestTimer.jsx` - Opcjonalny timer odpoczynku

3. **Integracja z Supabase**
   - INSERT do `workouts`
   - INSERT do `workout_exercises`
   - INSERT do `exercise_sets`
   - Transakcje (wszystko albo nic)

4. **Walidacja i UX**
   - Walidacja formularzy
   - Confirmation przy opuszczeniu w trakcie
   - Loading states
   - Success animations

#### Pliki:
```
src/
├── pages/
│   └── NewWorkoutPage.jsx            [NOWY]
├── components/
│   ├── ExerciseSelector.jsx          [NOWY]
│   ├── SetLogger.jsx                 [NOWY]
│   ├── WorkoutSummary.jsx            [NOWY]
│   └── RestTimer.jsx                 [NOWY]
└── context/
    └── WorkoutContext.jsx            [IMPLEMENTACJA]
```

---

### Faza 3: Lista treningów (2-3 dni)
**Cel:** Wyświetlenie historii treningów

#### Zadania:
1. **WorkoutsListPage** - Główny widok (zastępuje dashboard)
   - Header z powitaniem
   - Week summary card
   - Lista treningów
   - Empty state

2. **Komponenty**
   - `WorkoutCard.jsx` - Karta treningu
   - `WeekSummaryCard.jsx` - Podsumowanie tygodnia
   - `WorkoutDetailModal.jsx` - Szczegóły treningu

3. **Integracja z Supabase**
   - Pobieranie treningów z joinami
   - Obliczanie podsumowań tygodniowych
   - Usuwanie treningów

4. **Filtrowanie i wyszukiwanie**
   - Filter by date range
   - Search by exercise name
   - Sort options

#### Pliki:
```
src/
├── pages/
│   └── WorkoutsListPage.jsx          [NOWY - zastępuje DashboardPage]
├── components/
│   ├── WorkoutCard.jsx               [NOWY]
│   ├── WeekSummaryCard.jsx           [NOWY]
│   └── WorkoutDetailModal.jsx        [NOWY]
└── App.jsx                           [MODYFIKACJA - routing]
```

---

### Faza 4: Statystyki i PRs (2-3 dni)
**Cel:** Wizualizacja postępów

#### Zadania:
1. **StatisticsPage** - Główny widok
   - Activity card
   - Lista PRs
   - Mini charts

2. **ExerciseDetailPage** - Szczegóły ćwiczenia
   - Pełny wykres
   - Historia PRs
   - Statystyki

3. **Komponenty**
   - `PRCard.jsx` - Karta z PR
   - `ActivityCard.jsx` - Podsumowanie aktywności
   - `ProgressChart.jsx` - Wykres postępu (canvas/SVG)
   - `PRHistoryList.jsx` - Lista historii PRs

4. **Integracja z Supabase**
   - Query do `personal_records` view
   - Agregacje dla wykresów
   - Obliczanie streaks

5. **Charts**
   - Implementacja prostych wykresów (bez zewnętrznych bibliotek)
   - Lub integracja z lightweight chart library (np. Chart.js)

#### Pliki:
```
src/
├── pages/
│   ├── StatisticsPage.jsx            [NOWY]
│   └── ExerciseDetailPage.jsx        [NOWY]
├── components/
│   ├── PRCard.jsx                    [NOWY]
│   ├── ActivityCard.jsx              [NOWY]
│   ├── ProgressChart.jsx             [NOWY]
│   └── PRHistoryList.jsx             [NOWY]
└── context/
    └── StatsContext.jsx              [IMPLEMENTACJA]
```

---

### Faza 5: Profil i ustawienia (1-2 dni)
**Cel:** Zarządzanie kontem i ustawieniami

#### Zadania:
1. **ProfilePage** - Widok profilu
   - User info
   - Settings (język, jednostki)
   - Muscle groups management
   - Data export
   - Logout

2. **Komponenty**
   - `SettingsSection.jsx` - Sekcja ustawień
   - `MuscleGroupManager.jsx` - Zarządzanie kategoriami
   - `DataExport.jsx` - Eksport danych

3. **Funkcjonalności**
   - Zmiana języka (istniejący LanguageContext)
   - Zmiana jednostek (nowy SettingsContext)
   - CRUD dla muscle groups
   - CSV export
   - Delete all data with confirmation

#### Pliki:
```
src/
├── pages/
│   └── ProfilePage.jsx               [NOWY]
├── components/
│   ├── SettingsSection.jsx           [NOWY]
│   ├── MuscleGroupManager.jsx        [NOWY]
│   └── DataExport.jsx                [NOWY]
└── context/
    └── SettingsContext.jsx           [NOWY]
```

---

### Faza 6: Optymalizacja i testy (2-3 dni)
**Cel:** Polerowanie UX i performance

#### Zadania:
1. **Performance**
   - Lazy loading dla route'ów
   - Memoizacja komponentów
   - Optymalizacja query'ów do Supabase
   - Image optimization (jeśli będą używane)

2. **UX improvements**
   - Loading skeletons
   - Error boundaries
   - Offline detection
   - Success/error toasts
   - Animations (subtle)

3. **Testing**
   - Manual testing wszystkich flow'ów
   - Edge cases (empty states, errors)
   - Responsywność (320px - 428px)
   - Cross-browser testing (Chrome, Safari mobile)

4. **Documentation**
   - README update
   - Component documentation
   - API documentation

#### Pliki:
```
src/
├── components/
│   ├── LoadingSkeleton.jsx           [NOWY]
│   ├── ErrorBoundary.jsx             [NOWY]
│   └── Toast.jsx                     [NOWY]
└── utils/
    ├── errorHandling.js              [NOWY]
    └── analytics.js                  [NOWY - opcjonalnie]
```

---

### Timeline podsumowanie

| Faza | Czas | Zadania | Rezultat |
|------|------|---------|----------|
| 0 | 1-2 dni | Setup, konteksty, routing | Podstawowa struktura |
| 1 | 2-3 dni | Biblioteka ćwiczeń | Zarządzanie ćwiczeniami działa |
| 2 | 3-4 dni | Dodawanie treningu | Flow dodawania kompletny |
| 3 | 2-3 dni | Lista treningów | Historia treningów działa |
| 4 | 2-3 dni | Statystyki | Wykresy i PRs działają |
| 5 | 1-2 dni | Profil | Ustawienia i logout |
| 6 | 2-3 dni | Optymalizacja | Aplikacja production-ready |
| **TOTAL** | **13-20 dni** | | **MVP gotowe** |

---

## 💾 Integracja z bazą danych

### Mapowanie schema.sql → Komponenty

#### 1. muscle_groups ↔ ExerciseContext, ProfilePage
```javascript
// ExerciseContext.jsx
const fetchMuscleGroups = async () => {
  const { data, error } = await supabase
    .from('muscle_groups')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
};

const addMuscleGroup = async (name, description) => {
  const { data, error } = await supabase
    .from('muscle_groups')
    .insert([{ name, description }])
    .select();

  if (error) throw error;
  return data[0];
};
```

#### 2. exercises ↔ ExerciseContext, ExercisesLibraryPage
```javascript
// ExerciseContext.jsx
const fetchExercises = async () => {
  const { data, error } = await supabase
    .from('exercises')
    .select(`
      *,
      muscle_group:muscle_groups(id, name)
    `)
    .order('name');

  if (error) throw error;
  return data;
};

const addExercise = async (name, muscleGroupId, description) => {
  const { data, error } = await supabase
    .from('exercises')
    .insert([{
      name,
      muscle_group_id: muscleGroupId,
      description
    }])
    .select();

  if (error) throw error;
  return data[0];
};
```

#### 3. workouts ↔ WorkoutContext, WorkoutsListPage
```javascript
// WorkoutContext.jsx
const saveWorkout = async (workout) => {
  // 1. Insert workout
  const { data: workoutData, error: workoutError } = await supabase
    .from('workouts')
    .insert([{
      name: workout.name,
      workout_date: workout.date,
      notes: workout.notes
    }])
    .select();

  if (workoutError) throw workoutError;
  const workoutId = workoutData[0].id;

  // 2. Insert workout_exercises
  for (const exercise of workout.exercises) {
    const { data: weData, error: weError } = await supabase
      .from('workout_exercises')
      .insert([{
        workout_id: workoutId,
        exercise_id: exercise.exerciseId,
        order_index: exercise.order,
        notes: exercise.notes
      }])
      .select();

    if (weError) throw weError;
    const workoutExerciseId = weData[0].id;

    // 3. Insert exercise_sets
    for (const set of exercise.sets) {
      const { error: setError } = await supabase
        .from('exercise_sets')
        .insert([{
          workout_exercise_id: workoutExerciseId,
          set_number: set.setNumber,
          reps: set.reps,
          weight_kg: set.weightKg,
          duration_seconds: set.durationSeconds,
          notes: set.notes
        }]);

      if (setError) throw setError;
    }
  }

  return workoutId;
};

const fetchWorkouts = async (limit = 20) => {
  const { data, error } = await supabase
    .from('workouts')
    .select(`
      *,
      workout_exercises(
        id,
        order_index,
        notes,
        exercise:exercises(id, name),
        exercise_sets(*)
      )
    `)
    .order('workout_date', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
};
```

#### 4. personal_records (view) ↔ StatsContext, StatisticsPage
```javascript
// StatsContext.jsx
const fetchPersonalRecords = async () => {
  const { data, error } = await supabase
    .from('personal_records')
    .select('*')
    .order('max_weight_kg', { ascending: false });

  if (error) throw error;
  return data;
};

const fetchExerciseHistory = async (exerciseId) => {
  const { data, error } = await supabase
    .from('exercise_sets')
    .select(`
      *,
      workout_exercise:workout_exercises(
        workout:workouts(workout_date)
      )
    `)
    .eq('workout_exercise.exercise_id', exerciseId)
    .order('workout_exercise.workout.workout_date', { ascending: true });

  if (error) throw error;

  // Group by date and calculate max weight per workout
  const grouped = data.reduce((acc, set) => {
    const date = set.workout_exercise.workout.workout_date;
    if (!acc[date]) {
      acc[date] = { date, maxWeight: 0, maxReps: 0 };
    }
    if (set.weight_kg > acc[date].maxWeight) {
      acc[date].maxWeight = set.weight_kg;
      acc[date].maxReps = set.reps;
    }
    return acc;
  }, {});

  return Object.values(grouped);
};
```

### RLS Policies - Zabezpieczenia

Wszystkie table mają już RLS policies w `database/schema.sql`:
- Użytkownicy widzą tylko swoje dane (`auth.uid() = user_id`)
- CRUD operations sprawdzają ownership
- Views dziedziczą RLS z underlying tables

**Przykład z kodu:**
```javascript
// Supabase automatycznie stosuje RLS policies
// Użytkownik nie potrzebuje przekazywać user_id - jest brany z auth.uid()

const { data } = await supabase
  .from('exercises')
  .select('*'); // Automatycznie filtrowane WHERE user_id = auth.uid()
```

---

## 🎨 Design Tokens - CSS Variables

```css
/* dark-theme.css */
:root {
  /* Colors */
  --bg-primary: #0F0F0F;
  --bg-secondary: #1A1A1A;
  --bg-tertiary: #252525;

  --accent-primary: #FF6B35;
  --accent-secondary: #F7931E;
  --accent-gradient: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);

  --success: #00D9A3;
  --warning: #FFB627;
  --danger: #FF4757;
  --info: #4BA3FF;

  --text-primary: #FFFFFF;
  --text-secondary: #A0A0A0;
  --text-tertiary: #6B6B6B;

  --border-color: #2A2A2A;
  --divider-color: #1F1F1F;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-8: 48px;
  --space-10: 64px;

  /* Typography */
  --text-xs: 12px;
  --text-sm: 14px;
  --text-base: 16px;
  --text-lg: 18px;
  --text-xl: 24px;
  --text-2xl: 32px;
  --text-3xl: 40px;

  --font-regular: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;

  /* Borders */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;

  /* Shadows */
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.4);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.5);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.6);
}

/* Global body styles */
body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

/* Utility classes */
.gradient-button {
  background: var(--accent-gradient);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  padding: var(--space-4) var(--space-6);
  font-weight: var(--font-semibold);
  font-size: var(--text-base);
}

.card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  box-shadow: var(--shadow-sm);
}
```

---

## 📝 Notatki końcowe

### Priorytety UX
1. **Mobile-first zawsze** - Wszystkie ekrany najpierw projektowane dla 375px
2. **Performance** - Lazy loading, code splitting, optymalizacja query'ów
3. **Offline support** - W przyszłości: Service Worker + IndexedDB
4. **Accessibility** - Semantyczny HTML, ARIA labels, keyboard navigation

### Technologie dodatkowe (opcjonalne)
- **Chart.js** lub **Recharts** - dla ładniejszych wykresów
- **React Hook Form** - dla formularzy (walidacja)
- **React Query** - dla cache'owania danych z Supabase
- **Framer Motion** - dla animacji (jeśli potrzebne)

### Przyszłe rozszerzenia (poza MVP)
- 🔄 Workout templates (szablony treningów)
- 📸 Zdjęcia postępów (progress photos)
- 🏃 Cardio tracking (bieganie, rower)
- 📱 Progressive Web App (offline mode)
- 🤝 Social features (dzielenie się treningami)
- 📈 Advanced analytics (volume, intensity, frequency)
- ⏱️ Rest timer z powiadomieniami
- 🎯 Goals & achievements system

---

## ✅ Checklist implementacji

Po zakończeniu każdej fazy:
- [ ] Kod działa lokalnie bez błędów
- [ ] RLS policies działają poprawnie
- [ ] Wszystkie teksty mają tłumaczenia (PL + EN)
- [ ] Responsywność na mobile (320px - 428px)
- [ ] Loading states i error handling
- [ ] Dark mode styling konsystentny
- [ ] Manual testing głównych flow'ów
- [ ] Commit z opisem zmian

---

**Dokument utworzony:** 30 Października 2025
**Wersja:** 1.0
**Status:** Ready for implementation 🚀