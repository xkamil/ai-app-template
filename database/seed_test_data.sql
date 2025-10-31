-- =====================================================
-- SEED TEST DATA FOR WORKOUT DIARY
-- =====================================================
-- This script adds test data for user: ssjkamil@gmail.com
-- - 15 diverse exercises (push/pull/legs)
-- - 3 workout plans (Upper Body, Lower Body, Full Body)
-- - ~13 workout sessions in October 2025 (3x per week)
-- =====================================================

-- Get user_id for ssjkamil@gmail.com
DO $$
DECLARE
    v_user_id UUID;
    v_exercise_ids UUID[];
    v_plan_upper_id UUID;
    v_plan_lower_id UUID;
    v_plan_full_id UUID;
    v_workout_id UUID;
    v_workout_exercise_id UUID;
    v_workout_date TIMESTAMPTZ;
    v_plan_cycle INT;
BEGIN
    -- Get user ID
    SELECT id INTO v_user_id FROM auth.users WHERE email = 'ssjkamil@gmail.com';

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'User ssjkamil@gmail.com not found in database';
    END IF;

    RAISE NOTICE 'Found user ID: %', v_user_id;

    -- =====================================================
    -- 1. CREATE EXERCISES
    -- =====================================================
    RAISE NOTICE 'Creating exercises...';

    -- Push exercises
    INSERT INTO public.exercises (user_id, name, description) VALUES
    (v_user_id, 'Bench Press', 'Wyciskanie sztangi na ławce płaskiej'),
    (v_user_id, 'Incline Dumbbell Press', 'Wyciskanie hantli na ławce skośnej'),
    (v_user_id, 'Overhead Press', 'Wyciskanie sztangi nad głową (OHP)'),
    (v_user_id, 'Dips', 'Pompki na poręczach'),
    (v_user_id, 'Tricep Extensions', 'Prostowanie ramion na wyciągu górnym'),

    -- Pull exercises
    (v_user_id, 'Pull-ups', 'Podciąganie na drążku chwytem nachwytem'),
    (v_user_id, 'Bent-Over Row', 'Wiosłowanie sztangą w opadzie tułowia'),
    (v_user_id, 'Lat Pulldown', 'Ściąganie drążka górą do klatki'),
    (v_user_id, 'Face Pulls', 'Przyciąganie liny do twarzy'),
    (v_user_id, 'Barbell Curl', 'Uginanie ramion ze sztangą prostą'),

    -- Leg exercises
    (v_user_id, 'Squat', 'Przysiad ze sztangą na plecach'),
    (v_user_id, 'Romanian Deadlift', 'Martwy ciąg rumuński'),
    (v_user_id, 'Leg Press', 'Prasa nożna 45°'),
    (v_user_id, 'Lunges', 'Wykroki ze sztangą'),
    (v_user_id, 'Calf Raises', 'Wspięcia na palce stojąc');

    -- Store exercise IDs in array (order matters for indexing)
    SELECT ARRAY_AGG(id ORDER BY name) INTO v_exercise_ids
    FROM public.exercises
    WHERE user_id = v_user_id
    AND name IN (
        'Bench Press', 'Incline Dumbbell Press', 'Overhead Press', 'Dips', 'Tricep Extensions',
        'Pull-ups', 'Bent-Over Row', 'Lat Pulldown', 'Face Pulls', 'Barbell Curl',
        'Squat', 'Romanian Deadlift', 'Leg Press', 'Lunges', 'Calf Raises'
    );

    RAISE NOTICE 'Created % exercises', array_length(v_exercise_ids, 1);

    -- =====================================================
    -- 2. CREATE WORKOUT PLANS
    -- =====================================================
    RAISE NOTICE 'Creating workout plans...';

    -- Plan 1: UPPER BODY
    INSERT INTO public.workout_plans (user_id, name, color, description)
    VALUES (v_user_id, 'Upper Body', '#FF6B35', 'Trening górnych partii mięśniowych')
    RETURNING id INTO v_plan_upper_id;

    -- Add exercises to Upper Body plan (Push + Pull exercises)
    INSERT INTO public.workout_plan_exercises (workout_plan_id, exercise_id, order_index, suggested_sets, notes)
    SELECT
        v_plan_upper_id,
        id,
        ROW_NUMBER() OVER (ORDER BY name) - 1,
        CASE
            WHEN name IN ('Bench Press', 'Pull-ups', 'Overhead Press') THEN 4
            ELSE 3
        END,
        NULL
    FROM public.exercises
    WHERE user_id = v_user_id
    AND name IN ('Bench Press', 'Incline Dumbbell Press', 'Overhead Press', 'Pull-ups', 'Bent-Over Row', 'Barbell Curl');

    RAISE NOTICE 'Created Upper Body plan with ID: %', v_plan_upper_id;

    -- Plan 2: LOWER BODY
    INSERT INTO public.workout_plans (user_id, name, color, description)
    VALUES (v_user_id, 'Lower Body', '#4ECDC4', 'Trening dolnych partii mięśniowych')
    RETURNING id INTO v_plan_lower_id;

    -- Add exercises to Lower Body plan
    INSERT INTO public.workout_plan_exercises (workout_plan_id, exercise_id, order_index, suggested_sets, notes)
    SELECT
        v_plan_lower_id,
        id,
        ROW_NUMBER() OVER (ORDER BY name) - 1,
        CASE
            WHEN name IN ('Squat', 'Romanian Deadlift') THEN 4
            ELSE 3
        END,
        NULL
    FROM public.exercises
    WHERE user_id = v_user_id
    AND name IN ('Squat', 'Romanian Deadlift', 'Leg Press', 'Lunges', 'Calf Raises');

    RAISE NOTICE 'Created Lower Body plan with ID: %', v_plan_lower_id;

    -- Plan 3: FULL BODY
    INSERT INTO public.workout_plans (user_id, name, color, description)
    VALUES (v_user_id, 'Full Body', '#95E1D3', 'Trening całego ciała')
    RETURNING id INTO v_plan_full_id;

    -- Add exercises to Full Body plan (mix of all)
    INSERT INTO public.workout_plan_exercises (workout_plan_id, exercise_id, order_index, suggested_sets, notes)
    SELECT
        v_plan_full_id,
        id,
        ROW_NUMBER() OVER (ORDER BY
            CASE name
                WHEN 'Squat' THEN 1
                WHEN 'Bench Press' THEN 2
                WHEN 'Pull-ups' THEN 3
                WHEN 'Overhead Press' THEN 4
                WHEN 'Romanian Deadlift' THEN 5
                WHEN 'Dips' THEN 6
                WHEN 'Face Pulls' THEN 7
                WHEN 'Calf Raises' THEN 8
            END
        ) - 1,
        3,
        NULL
    FROM public.exercises
    WHERE user_id = v_user_id
    AND name IN ('Squat', 'Bench Press', 'Pull-ups', 'Overhead Press', 'Romanian Deadlift', 'Dips', 'Face Pulls', 'Calf Raises');

    RAISE NOTICE 'Created Full Body plan with ID: %', v_plan_full_id;

    -- =====================================================
    -- 3. CREATE WORKOUT HISTORY FOR OCTOBER 2025
    -- =====================================================
    RAISE NOTICE 'Creating workout history for October 2025...';

    -- October 2025 workout dates (3x per week, ~13 workouts)
    -- Rotation: Upper -> Lower -> Full Body -> Upper -> Lower...
    v_plan_cycle := 0;

    -- Loop through workout dates in October
    FOR v_workout_date IN
        SELECT d::TIMESTAMPTZ + INTERVAL '10 hours' -- Set time to 10:00 AM
        FROM generate_series(
            '2025-10-01'::DATE,
            '2025-10-31'::DATE,
            INTERVAL '2.5 days' -- ~3 workouts per week
        ) AS d
        WHERE EXTRACT(DOW FROM d) NOT IN (0) -- Skip Sundays
        LIMIT 13
    LOOP
        v_plan_cycle := v_plan_cycle + 1;

        -- Determine which plan to use (cycle through Upper -> Lower -> Full)
        IF v_plan_cycle % 3 = 1 THEN
            -- UPPER BODY workout
            INSERT INTO public.workouts (user_id, workout_plan_id, name, workout_date, notes)
            VALUES (v_user_id, v_plan_upper_id, 'Upper Body', v_workout_date, 'Dobry trening górnej partii')
            RETURNING id INTO v_workout_id;

            -- Add exercises from Upper Body plan
            FOR v_workout_exercise_id IN
                INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, notes)
                SELECT v_workout_id, exercise_id, order_index, NULL
                FROM public.workout_plan_exercises
                WHERE workout_plan_id = v_plan_upper_id
                ORDER BY order_index
                RETURNING id
            LOOP
                -- Add sets for each exercise (3-4 sets with progressive overload)
                INSERT INTO public.exercise_sets (workout_exercise_id, set_number, reps, weight_kg, notes)
                SELECT
                    v_workout_exercise_id,
                    s.set_num,
                    8 + (random() * 4)::INT, -- 8-12 reps
                    50 + (random() * 40)::INT + (v_plan_cycle * 2.5)::INT, -- Progressive overload
                    NULL
                FROM generate_series(1, 3 + (random())::INT) AS s(set_num); -- 3-4 sets
            END LOOP;

        ELSIF v_plan_cycle % 3 = 2 THEN
            -- LOWER BODY workout
            INSERT INTO public.workouts (user_id, workout_plan_id, name, workout_date, notes)
            VALUES (v_user_id, v_plan_lower_id, 'Lower Body', v_workout_date, 'Intensywny trening nóg')
            RETURNING id INTO v_workout_id;

            -- Add exercises from Lower Body plan
            FOR v_workout_exercise_id IN
                INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, notes)
                SELECT v_workout_id, exercise_id, order_index, NULL
                FROM public.workout_plan_exercises
                WHERE workout_plan_id = v_plan_lower_id
                ORDER BY order_index
                RETURNING id
            LOOP
                -- Add sets for each exercise
                INSERT INTO public.exercise_sets (workout_exercise_id, set_number, reps, weight_kg, notes)
                SELECT
                    v_workout_exercise_id,
                    s.set_num,
                    6 + (random() * 6)::INT, -- 6-12 reps (heavier for legs)
                    60 + (random() * 60)::INT + (v_plan_cycle * 3)::INT, -- Progressive overload
                    NULL
                FROM generate_series(1, 3 + (random())::INT) AS s(set_num);
            END LOOP;

        ELSE
            -- FULL BODY workout
            INSERT INTO public.workouts (user_id, workout_plan_id, name, workout_date, notes)
            VALUES (v_user_id, v_plan_full_id, 'Full Body', v_workout_date, 'Kompleksowy trening całego ciała')
            RETURNING id INTO v_workout_id;

            -- Add exercises from Full Body plan
            FOR v_workout_exercise_id IN
                INSERT INTO public.workout_exercises (workout_id, exercise_id, order_index, notes)
                SELECT v_workout_id, exercise_id, order_index, NULL
                FROM public.workout_plan_exercises
                WHERE workout_plan_id = v_plan_full_id
                ORDER BY order_index
                RETURNING id
            LOOP
                -- Add sets for each exercise
                INSERT INTO public.exercise_sets (workout_exercise_id, set_number, reps, weight_kg, notes)
                SELECT
                    v_workout_exercise_id,
                    s.set_num,
                    8 + (random() * 5)::INT, -- 8-12 reps
                    50 + (random() * 50)::INT + (v_plan_cycle * 2)::INT, -- Progressive overload
                    NULL
                FROM generate_series(1, 3) AS s(set_num); -- Always 3 sets for full body
            END LOOP;
        END IF;

        RAISE NOTICE 'Created workout % on %', v_plan_cycle, v_workout_date;
    END LOOP;

    RAISE NOTICE 'Successfully created all test data!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Summary:';
    RAISE NOTICE '- User: ssjkamil@gmail.com (ID: %)', v_user_id;
    RAISE NOTICE '- Exercises: 15';
    RAISE NOTICE '- Workout Plans: 3';
    RAISE NOTICE '- Workout Sessions: % (October 2025)', v_plan_cycle;
    RAISE NOTICE '========================================';

END $$;
