-- =====================================================
-- ADD WORKOUT PLANS
-- =====================================================
-- This script adds 3 workout plans (Plan A, B, C) for user: ssjkamil@gmail.com
-- Each plan will have 10 randomly selected exercises
-- =====================================================

DO $$
DECLARE
    v_user_id UUID;
    v_plan_a_id UUID;
    v_plan_b_id UUID;
    v_plan_c_id UUID;
    v_all_exercises UUID[];
    v_random_exercises UUID[];
    v_exercise_id UUID;
    v_order_idx INT;
BEGIN
    -- Get user ID
    SELECT id INTO v_user_id FROM auth.users WHERE email = 'ssjkamil@gmail.com';

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'User ssjkamil@gmail.com not found in database';
    END IF;

    RAISE NOTICE 'Found user ID: %', v_user_id;

    -- Get all exercises for this user
    SELECT ARRAY_AGG(id) INTO v_all_exercises
    FROM public.exercises
    WHERE user_id = v_user_id;

    IF v_all_exercises IS NULL OR array_length(v_all_exercises, 1) < 10 THEN
        RAISE EXCEPTION 'User needs at least 10 exercises to create plans. Current count: %', COALESCE(array_length(v_all_exercises, 1), 0);
    END IF;

    RAISE NOTICE 'Found % exercises for user', array_length(v_all_exercises, 1);

    -- =====================================================
    -- CREATE PLAN A
    -- =====================================================
    RAISE NOTICE 'Creating Plan A...';

    INSERT INTO public.workout_plans (user_id, name, color, description)
    VALUES (v_user_id, 'Plan A', '#FF6B35', 'Plan treningowy A - zestaw 10 losowych ćwiczeń')
    RETURNING id INTO v_plan_a_id;

    -- Select 10 random exercises for Plan A
    SELECT ARRAY_AGG(id ORDER BY random())
    INTO v_random_exercises
    FROM (
        SELECT id FROM public.exercises
        WHERE user_id = v_user_id
        ORDER BY random()
        LIMIT 10
    ) sub;

    -- Add exercises to Plan A
    v_order_idx := 0;
    FOREACH v_exercise_id IN ARRAY v_random_exercises
    LOOP
        INSERT INTO public.workout_plan_exercises (workout_plan_id, exercise_id, order_index, suggested_sets)
        VALUES (v_plan_a_id, v_exercise_id, v_order_idx, 3);
        v_order_idx := v_order_idx + 1;
    END LOOP;

    RAISE NOTICE 'Created Plan A with ID: % (10 exercises)', v_plan_a_id;

    -- =====================================================
    -- CREATE PLAN B
    -- =====================================================
    RAISE NOTICE 'Creating Plan B...';

    INSERT INTO public.workout_plans (user_id, name, color, description)
    VALUES (v_user_id, 'Plan B', '#4ECDC4', 'Plan treningowy B - zestaw 10 losowych ćwiczeń')
    RETURNING id INTO v_plan_b_id;

    -- Select 10 random exercises for Plan B
    SELECT ARRAY_AGG(id ORDER BY random())
    INTO v_random_exercises
    FROM (
        SELECT id FROM public.exercises
        WHERE user_id = v_user_id
        ORDER BY random()
        LIMIT 10
    ) sub;

    -- Add exercises to Plan B
    v_order_idx := 0;
    FOREACH v_exercise_id IN ARRAY v_random_exercises
    LOOP
        INSERT INTO public.workout_plan_exercises (workout_plan_id, exercise_id, order_index, suggested_sets)
        VALUES (v_plan_b_id, v_exercise_id, v_order_idx, 3);
        v_order_idx := v_order_idx + 1;
    END LOOP;

    RAISE NOTICE 'Created Plan B with ID: % (10 exercises)', v_plan_b_id;

    -- =====================================================
    -- CREATE PLAN C
    -- =====================================================
    RAISE NOTICE 'Creating Plan C...';

    INSERT INTO public.workout_plans (user_id, name, color, description)
    VALUES (v_user_id, 'Plan C', '#95E1D3', 'Plan treningowy C - zestaw 10 losowych ćwiczeń')
    RETURNING id INTO v_plan_c_id;

    -- Select 10 random exercises for Plan C
    SELECT ARRAY_AGG(id ORDER BY random())
    INTO v_random_exercises
    FROM (
        SELECT id FROM public.exercises
        WHERE user_id = v_user_id
        ORDER BY random()
        LIMIT 10
    ) sub;

    -- Add exercises to Plan C
    v_order_idx := 0;
    FOREACH v_exercise_id IN ARRAY v_random_exercises
    LOOP
        INSERT INTO public.workout_plan_exercises (workout_plan_id, exercise_id, order_index, suggested_sets)
        VALUES (v_plan_c_id, v_exercise_id, v_order_idx, 3);
        v_order_idx := v_order_idx + 1;
    END LOOP;

    RAISE NOTICE 'Created Plan C with ID: % (10 exercises)', v_plan_c_id;

    RAISE NOTICE '========================================';
    RAISE NOTICE 'Successfully created 3 workout plans!';
    RAISE NOTICE 'Plan A (Orange): % - 10 exercises', v_plan_a_id;
    RAISE NOTICE 'Plan B (Turquoise): % - 10 exercises', v_plan_b_id;
    RAISE NOTICE 'Plan C (Green): % - 10 exercises', v_plan_c_id;
    RAISE NOTICE '========================================';

END $$;
