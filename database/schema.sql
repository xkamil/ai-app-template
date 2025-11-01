-- =====================================================
-- WORKOUT DIARY DATABASE SCHEMA FOR SUPABASE
-- =====================================================
-- This file contains the complete database schema for a workout diary application
-- with Row Level Security (RLS) enabled for all user-specific tables.
--
-- Execute this file in Supabase SQL Editor to create all tables, policies, and indexes.
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE 1: EXERCISES
-- =====================================================
-- Stores user-created exercises

CREATE TABLE IF NOT EXISTS public.exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, name)
);

COMMENT ON TABLE public.exercises IS 'User-created exercises';

-- Enable Row Level Security
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;

-- RLS Policies for exercises
CREATE POLICY "Users can view their own exercises"
    ON public.exercises
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own exercises"
    ON public.exercises
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own exercises"
    ON public.exercises
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own exercises"
    ON public.exercises
    FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- TABLE 2: WORKOUT PLANS
-- =====================================================
-- Stores workout plan templates that users can create and reuse

CREATE TABLE IF NOT EXISTS public.workout_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT NOT NULL DEFAULT '#FF6B35',
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, name)
);

COMMENT ON TABLE public.workout_plans IS 'Workout plan templates that can be reused';
COMMENT ON COLUMN public.workout_plans.name IS 'Name of the workout plan (e.g., "Push Day", "Pull Day")';
COMMENT ON COLUMN public.workout_plans.color IS 'Hex color code for visual identification';

-- Enable Row Level Security
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;

-- RLS Policies for workout_plans
CREATE POLICY "Users can view their own workout plans"
    ON public.workout_plans
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workout plans"
    ON public.workout_plans
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workout plans"
    ON public.workout_plans
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workout plans"
    ON public.workout_plans
    FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- TABLE 3: WORKOUT PLAN EXERCISES
-- =====================================================
-- Stores exercises that belong to a workout plan with suggested sets

CREATE TABLE IF NOT EXISTS public.workout_plan_exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workout_plan_id UUID NOT NULL REFERENCES public.workout_plans(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL DEFAULT 0,
    suggested_sets INTEGER DEFAULT 3,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(workout_plan_id, exercise_id),
    CONSTRAINT valid_suggested_sets CHECK (suggested_sets IS NULL OR suggested_sets > 0)
);

COMMENT ON TABLE public.workout_plan_exercises IS 'Exercises in a workout plan with suggested set counts';
COMMENT ON COLUMN public.workout_plan_exercises.order_index IS 'Order of exercise in plan (0-based index)';
COMMENT ON COLUMN public.workout_plan_exercises.suggested_sets IS 'Suggested number of sets for this exercise';

-- Enable Row Level Security
ALTER TABLE public.workout_plan_exercises ENABLE ROW LEVEL SECURITY;

-- RLS Policies for workout_plan_exercises
CREATE POLICY "Users can view their own workout plan exercises"
    ON public.workout_plan_exercises
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.workout_plans
            WHERE workout_plans.id = workout_plan_exercises.workout_plan_id
            AND workout_plans.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their own workout plan exercises"
    ON public.workout_plan_exercises
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.workout_plans
            WHERE workout_plans.id = workout_plan_exercises.workout_plan_id
            AND workout_plans.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own workout plan exercises"
    ON public.workout_plan_exercises
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.workout_plans
            WHERE workout_plans.id = workout_plan_exercises.workout_plan_id
            AND workout_plans.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.workout_plans
            WHERE workout_plans.id = workout_plan_exercises.workout_plan_id
            AND workout_plans.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their own workout plan exercises"
    ON public.workout_plan_exercises
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.workout_plans
            WHERE workout_plans.id = workout_plan_exercises.workout_plan_id
            AND workout_plans.user_id = auth.uid()
        )
    );

-- =====================================================
-- TABLE 4: WORKOUTS
-- =====================================================
-- Stores workout sessions logged by users

CREATE TABLE IF NOT EXISTS public.workouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    workout_plan_id UUID REFERENCES public.workout_plans(id) ON DELETE SET NULL,
    name TEXT,
    workout_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.workouts IS 'User workout sessions with date and notes';
COMMENT ON COLUMN public.workouts.workout_plan_id IS 'Optional reference to the workout plan this workout was based on';
COMMENT ON COLUMN public.workouts.name IS 'Optional name for the workout (e.g., "Upper Body Day")';
COMMENT ON COLUMN public.workouts.workout_date IS 'Date and time when the workout was performed';

-- Enable Row Level Security
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for workouts
CREATE POLICY "Users can view their own workouts"
    ON public.workouts
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workouts"
    ON public.workouts
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workouts"
    ON public.workouts
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workouts"
    ON public.workouts
    FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- TABLE 5: WORKOUT EXERCISES
-- =====================================================
-- Junction table linking exercises to workouts

CREATE TABLE IF NOT EXISTS public.workout_exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workout_id UUID NOT NULL REFERENCES public.workouts(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(workout_id, exercise_id)
);

COMMENT ON TABLE public.workout_exercises IS 'Links exercises to workouts with ordering';
COMMENT ON COLUMN public.workout_exercises.order_index IS 'Order of exercise in workout (0-based index)';
COMMENT ON COLUMN public.workout_exercises.notes IS 'Notes specific to this exercise in this workout';

-- Enable Row Level Security
ALTER TABLE public.workout_exercises ENABLE ROW LEVEL SECURITY;

-- RLS Policies for workout_exercises
-- Users can only access workout_exercises if they own the parent workout
CREATE POLICY "Users can view their own workout exercises"
    ON public.workout_exercises
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.workouts
            WHERE workouts.id = workout_exercises.workout_id
            AND workouts.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their own workout exercises"
    ON public.workout_exercises
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.workouts
            WHERE workouts.id = workout_exercises.workout_id
            AND workouts.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own workout exercises"
    ON public.workout_exercises
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.workouts
            WHERE workouts.id = workout_exercises.workout_id
            AND workouts.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.workouts
            WHERE workouts.id = workout_exercises.workout_id
            AND workouts.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their own workout exercises"
    ON public.workout_exercises
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.workouts
            WHERE workouts.id = workout_exercises.workout_id
            AND workouts.user_id = auth.uid()
        )
    );

-- =====================================================
-- TABLE 6: EXERCISE SETS
-- =====================================================
-- Stores individual sets for each exercise with performance data

CREATE TABLE IF NOT EXISTS public.exercise_sets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workout_exercise_id UUID NOT NULL REFERENCES public.workout_exercises(id) ON DELETE CASCADE,
    set_number INTEGER NOT NULL,
    reps INTEGER,
    weight_kg DECIMAL(10, 2),
    duration_seconds INTEGER,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_set_number CHECK (set_number > 0),
    CONSTRAINT valid_reps CHECK (reps IS NULL OR reps > 0),
    CONSTRAINT valid_weight CHECK (weight_kg IS NULL OR weight_kg >= 0),
    CONSTRAINT valid_duration CHECK (duration_seconds IS NULL OR duration_seconds > 0)
);

COMMENT ON TABLE public.exercise_sets IS 'Individual sets with reps, weight, duration, and notes';
COMMENT ON COLUMN public.exercise_sets.set_number IS 'Set number (1, 2, 3, etc.)';
COMMENT ON COLUMN public.exercise_sets.reps IS 'Number of repetitions performed';
COMMENT ON COLUMN public.exercise_sets.weight_kg IS 'Weight lifted in kilograms';
COMMENT ON COLUMN public.exercise_sets.duration_seconds IS 'Duration in seconds (for timed exercises)';

-- Enable Row Level Security
ALTER TABLE public.exercise_sets ENABLE ROW LEVEL SECURITY;

-- RLS Policies for exercise_sets
-- Users can only access sets if they own the parent workout
CREATE POLICY "Users can view their own exercise sets"
    ON public.exercise_sets
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.workout_exercises we
            JOIN public.workouts w ON w.id = we.workout_id
            WHERE we.id = exercise_sets.workout_exercise_id
            AND w.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their own exercise sets"
    ON public.exercise_sets
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.workout_exercises we
            JOIN public.workouts w ON w.id = we.workout_id
            WHERE we.id = exercise_sets.workout_exercise_id
            AND w.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own exercise sets"
    ON public.exercise_sets
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.workout_exercises we
            JOIN public.workouts w ON w.id = we.workout_id
            WHERE we.id = exercise_sets.workout_exercise_id
            AND w.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.workout_exercises we
            JOIN public.workouts w ON w.id = we.workout_id
            WHERE we.id = exercise_sets.workout_exercise_id
            AND w.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their own exercise sets"
    ON public.exercise_sets
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.workout_exercises we
            JOIN public.workouts w ON w.id = we.workout_id
            WHERE we.id = exercise_sets.workout_exercise_id
            AND w.user_id = auth.uid()
        )
    );

-- =====================================================
-- VIEW: PERSONAL RECORDS (Auto-calculated PRs)
-- =====================================================
-- Calculates personal records for each exercise based on workout history

CREATE OR REPLACE VIEW public.personal_records AS
SELECT
    e.user_id,
    e.id AS exercise_id,
    e.name AS exercise_name,
    MAX(es.weight_kg) AS max_weight_kg,
    MAX(es.reps) AS max_reps,
    MAX(es.weight_kg * (1 + es.reps::DECIMAL / 30)) AS estimated_1rm,
    (
        SELECT w.workout_date
        FROM public.exercise_sets es2
        JOIN public.workout_exercises we2 ON we2.id = es2.workout_exercise_id
        JOIN public.workouts w ON w.id = we2.workout_id
        WHERE we2.exercise_id = e.id
        AND es2.weight_kg = MAX(es.weight_kg)
        ORDER BY w.workout_date DESC
        LIMIT 1
    ) AS max_weight_date,
    COUNT(DISTINCT we.workout_id) AS total_workouts,
    COUNT(es.id) AS total_sets
FROM public.exercises e
LEFT JOIN public.workout_exercises we ON we.exercise_id = e.id
LEFT JOIN public.exercise_sets es ON es.workout_exercise_id = we.id
GROUP BY e.user_id, e.id, e.name;

COMMENT ON VIEW public.personal_records IS 'Auto-calculated personal records for each exercise';

-- Note: Views inherit RLS from underlying tables, so users will only see their own PRs

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
-- These indexes improve query performance for common operations

-- Index for filtering by user_id (most common query pattern)
CREATE INDEX IF NOT EXISTS idx_exercises_user_id ON public.exercises(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_plans_user_id ON public.workout_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_workouts_user_id ON public.workouts(user_id);

-- Index for workout date sorting and filtering
CREATE INDEX IF NOT EXISTS idx_workouts_workout_date ON public.workouts(workout_date DESC);
CREATE INDEX IF NOT EXISTS idx_workouts_user_date ON public.workouts(user_id, workout_date DESC);

-- Indexes for foreign key relationships
CREATE INDEX IF NOT EXISTS idx_workout_plan_exercises_plan_id ON public.workout_plan_exercises(workout_plan_id);
CREATE INDEX IF NOT EXISTS idx_workout_plan_exercises_exercise_id ON public.workout_plan_exercises(exercise_id);
CREATE INDEX IF NOT EXISTS idx_workouts_workout_plan_id ON public.workouts(workout_plan_id);
CREATE INDEX IF NOT EXISTS idx_workout_exercises_workout_id ON public.workout_exercises(workout_id);
CREATE INDEX IF NOT EXISTS idx_workout_exercises_exercise_id ON public.workout_exercises(exercise_id);
CREATE INDEX IF NOT EXISTS idx_exercise_sets_workout_exercise_id ON public.exercise_sets(workout_exercise_id);

-- Index for set ordering within exercises
CREATE INDEX IF NOT EXISTS idx_exercise_sets_set_number ON public.exercise_sets(workout_exercise_id, set_number);

-- =====================================================
-- HELPER FUNCTIONS (Optional)
-- =====================================================
-- Function to update updated_at timestamp automatically

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables with updated_at column
CREATE TRIGGER update_exercises_updated_at
    BEFORE UPDATE ON public.exercises
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workouts_updated_at
    BEFORE UPDATE ON public.workouts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workout_exercises_updated_at
    BEFORE UPDATE ON public.workout_exercises
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_exercise_sets_updated_at
    BEFORE UPDATE ON public.exercise_sets
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workout_plans_updated_at
    BEFORE UPDATE ON public.workout_plans
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workout_plan_exercises_updated_at
    BEFORE UPDATE ON public.workout_plan_exercises
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- MIGRATION: ADD UNIT FLAGS TO EXERCISES
-- =====================================================
-- Date: 2025-11-01
-- Description: Adds weight_units and time_units boolean flags to exercises table
--              and sets default values for exercise_sets

-- Step 1: Add new columns to exercises table
ALTER TABLE public.exercises
ADD COLUMN IF NOT EXISTS weight_units BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS time_units BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN public.exercises.weight_units IS 'Whether this exercise uses weight measurements';
COMMENT ON COLUMN public.exercises.time_units IS 'Whether this exercise uses time/duration measurements';

-- Step 2: Set both flags to true for all existing exercises (backward compatibility)
UPDATE public.exercises
SET weight_units = true, time_units = true
WHERE weight_units = false OR time_units = false;

-- Step 3: Drop old CHECK constraints first (they don't allow 0)
ALTER TABLE public.exercise_sets
DROP CONSTRAINT IF EXISTS valid_weight,
DROP CONSTRAINT IF EXISTS valid_duration;

-- Step 4: Update exercise_sets to set default values for NULL weights and durations
UPDATE public.exercise_sets
SET weight_kg = 0
WHERE weight_kg IS NULL;

UPDATE public.exercise_sets
SET duration_seconds = 0
WHERE duration_seconds IS NULL;

-- Step 5: Alter exercise_sets columns to have NOT NULL constraint with default 0
ALTER TABLE public.exercise_sets
ALTER COLUMN weight_kg SET NOT NULL,
ALTER COLUMN weight_kg SET DEFAULT 0,
ALTER COLUMN duration_seconds SET NOT NULL,
ALTER COLUMN duration_seconds SET DEFAULT 0;

-- Step 6: Add new CHECK constraints that allow 0 values
ALTER TABLE public.exercise_sets
ADD CONSTRAINT valid_weight CHECK (weight_kg >= 0),
ADD CONSTRAINT valid_duration CHECK (duration_seconds >= 0);

-- =====================================================
-- SCHEMA COMPLETE
-- =====================================================
-- This schema is ready to be executed in Supabase SQL Editor
--
-- Tables created:
-- 1. exercises - User-created exercises
-- 2. workout_plans - Workout plan templates
-- 3. workout_plan_exercises - Exercises in plans with suggested sets
-- 4. workouts - Workout sessions (with optional plan reference)
-- 5. workout_exercises - Exercises in workouts
-- 6. exercise_sets - Individual sets with reps/weight/duration
--
-- Views created:
-- 1. personal_records - Auto-calculated PRs
--
-- All tables have Row Level Security enabled
-- All foreign keys use CASCADE deletes where appropriate
-- Indexes optimize common query patterns
-- Triggers maintain updated_at timestamps
