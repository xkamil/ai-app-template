import React from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { LanguageProvider } from './context/LanguageContext'
import { ExerciseProvider } from './context/ExerciseContext'
import { WorkoutProvider } from './context/WorkoutContext'
import { WorkoutPlanProvider } from './context/WorkoutPlanContext'
import PrivateRoute from './components/PrivateRoute'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import PasswordResetPage from './pages/PasswordResetPage'
import WorkoutsListPage from './pages/WorkoutsListPage'
import NewWorkoutPage from './pages/NewWorkoutPage'
import ExercisesLibraryPage from './pages/ExercisesLibraryPage'
import ProfilePage from './pages/ProfilePage'
import WorkoutPlansPage from './pages/WorkoutPlansPage'

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ExerciseProvider>
          <WorkoutProvider>
            <WorkoutPlanProvider>
              <HashRouter>
              <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/reset-password" element={<PasswordResetPage />} />

                {/* Workout Diary Routes - All Protected */}
                <Route
                  path="/workouts"
                  element={
                    <PrivateRoute>
                      <WorkoutsListPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/workout/new"
                  element={
                    <PrivateRoute>
                      <NewWorkoutPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/exercises"
                  element={
                    <PrivateRoute>
                      <ExercisesLibraryPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <ProfilePage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/plans"
                  element={
                    <PrivateRoute>
                      <WorkoutPlansPage />
                    </PrivateRoute>
                  }
                />

                {/* Redirect old dashboard to workouts */}
                <Route path="/dashboard" element={<Navigate to="/workouts" replace />} />

                {/* Catch all - redirect to login or workouts */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              </HashRouter>
            </WorkoutPlanProvider>
          </WorkoutProvider>
        </ExerciseProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App
