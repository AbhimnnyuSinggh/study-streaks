import { SupabaseClient } from '@supabase/supabase-js';
import { differenceInDays, addDays, format, parseISO } from 'date-fns';

export async function generateFullPlan(supabase: SupabaseClient, userId: string) {
    // 1. Fetch user data
    const { data: user, error: userError } = await supabase
        .from('users')
        .select('*, exams(id, sections, total_topics, exam_pattern), user_section_levels(section_name, level), user_resources(section_name, resource_name, resource_type)')
        .eq('id', userId)
        .single();

    if (userError || !user) throw new Error('User not found');

    const exam = user.exams;
    if (!exam || !exam.sections) throw new Error('Exam data missing');

    // Convert nested relations arrays to easy lookup maps
    const levelMap = (user.user_section_levels || []).reduce((acc: any, row: any) => {
        acc[row.section_name] = row.level;
        return acc;
    }, {});

    const resourceMap = (user.user_resources || []).reduce((acc: any, row: any) => {
        acc[row.section_name] = row;
        return acc;
    }, {});

    // 2. Assess timeframe
    const startDate = new Date();
    const endDate = parseISO(user.exam_date || addDays(startDate, 180).toISOString());
    const totalDays = Math.max(differenceInDays(endDate, startDate), 7); // minimum 7 days to avoid crash

    // Which days of week user studies
    const studyDaysSet = new Set(user.study_days.map((d: string) => d.toLowerCase().substring(0, 3)));
    const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

    // Create an array of actual study dates
    const studyDates = [];
    for (let i = 0; i <= totalDays; i++) {
        const d = addDays(startDate, i);
        const dayStr = dayNames[d.getDay()];
        if (studyDaysSet.has(dayStr)) {
            studyDates.push(d);
        }
    }

    // 3. Weight Calculation (How many hours per section)
    const targetTier = user.target_tier || 'both';
    let totalRawWeight = 0;

    const sectionsWithWeights = exam.sections.map((section: any) => {
        const level = levelMap[section.name] || 'not_started';
        const weaknessMultiplier =
            level === 'not_started' ? 1.5 :
                level === 'basics_done' ? 1.2 :
                    level === 'moderate' ? 1.0 : 0.6; // strong

        const rawWeight = (section.weightage || 25) * weaknessMultiplier;
        totalRawWeight += rawWeight;

        // Filter topics by target tier (ignore mains-only topics if targeting prelims, etc.)
        const filteredTopics = section.topics.filter((t: any) => {
            if (targetTier === 'both') return true;
            return (t.tier === 'both' || t.tier === targetTier || !t.tier); // fallback to include if tier not defined
        });

        // Sort topics by order within section (handling prerequisites implies sort order)
        const topics = [...filteredTopics].sort((a: any, b: any) => (a.order || 99) - (b.order || 99));

        return { ...section, rawWeight, topics, topicsUncovered: [...topics] };
    });

    // Calculate total hours available
    const dailyHours = parseFloat(user.available_hours) || 3;
    const totalSafeHours = studyDates.length * dailyHours * 0.85; // 15% buffer

    // Distribute allocated hours proportionally
    sectionsWithWeights.forEach((s: any) => {
        s.allocatedTotalHours = totalSafeHours * (s.rawWeight / totalRawWeight);
        // Rough estimate of how much time we spend per topic
        const topicCount = s.topics.length;
        s.hoursPerTopic = topicCount > 0 ? (s.allocatedTotalHours / topicCount) * 0.7 : 0; // 70% new, 30% rev
    });

    // 4. Build Daily Plans
    const dailyPlansList = [];
    const tasksList = [];
    const topicProgressList = [];

    let globalTaskOrderCounter = 1;
    const scheduledRevisions: any[] = []; // [{date, sectionName, topicName, duration, revNum}]

    for (let d = 0; d < studyDates.length; d++) {
        const currentDate = studyDates[d];
        const dateStr = format(currentDate, 'yyyy-MM-dd');
        const DP_ID = crypto.randomUUID();

        let remainingMins = dailyHours * 60;
        let newTasksAdded = 0;

        dailyPlansList.push({
            id: DP_ID,
            user_id: user.id,
            plan_date: dateStr,
            available_hours: dailyHours,
            energy_level: 'normal',
            topic_preference: 'follow_plan',
            total_tasks: 0 // Will increment as we push tasks
        });

        let todaysTaskOrder = 1;

        // 4a. Perform scheduled revisions first
        const todaysRevisions = scheduledRevisions.filter(r => r.dateStr === dateStr);
        for (const rev of todaysRevisions) {
            if (remainingMins < rev.duration) break; // cap today

            tasksList.push({
                daily_plan_id: DP_ID,
                user_id: user.id,
                task_order: todaysTaskOrder++,
                section_name: rev.sectionName,
                topic_name: rev.topicName,
                task_type: 'revision',
                duration_minutes: rev.duration,
                resource_name: rev.resourceName,
                resource_type: rev.resourceType,
                tip: `Revision ${rev.revNum}: Review your short notes and try 5 medium-level questions.`,
                revision_number: rev.revNum,
                plan_date: dateStr
            });

            remainingMins -= rev.duration;
            newTasksAdded++;
        }

        // Remove the processed ones (naive slice approach since they are processed chronologically but we might miss skipped due to capacity. Wait, just filter out)
        scheduledRevisions.splice(0, scheduledRevisions.length, ...scheduledRevisions.filter(r => r.dateStr !== dateStr || remainingMins === 0));

        // 4b. Allocate remaining time to new topics (using round-robin across sections)
        let sectionIdx = 0;
        while (remainingMins >= 15 && newTasksAdded < 5) { // max 5 tasks per day to avoid clutter
            // Find a section with uncovered topics
            let foundTopic = null;
            let activeSection = null;

            for (let i = 0; i < sectionsWithWeights.length; i++) {
                const s = sectionsWithWeights[(sectionIdx + i) % sectionsWithWeights.length];
                if (s.topicsUncovered.length > 0) {
                    foundTopic = s.topicsUncovered.shift();
                    activeSection = s;
                    sectionIdx = (sectionIdx + i + 1) % sectionsWithWeights.length;
                    break;
                }
            }

            if (!foundTopic || !activeSection) {
                break; // All topics covered!
            }

            // Assign duration cap 45 mins
            const duration = Math.min(Math.min((foundTopic.hours || 1) * 60, 45), remainingMins);
            const resource = resourceMap[activeSection.name] || { resource_name: 'Standard Text', resource_type: 'book' };

            tasksList.push({
                daily_plan_id: DP_ID,
                user_id: user.id,
                task_order: todaysTaskOrder++,
                section_name: activeSection.name,
                topic_name: foundTopic.name,
                task_type: 'new_topic',
                duration_minutes: duration,
                resource_name: resource.resource_name,
                resource_type: resource.resource_type,
                tip: `Focus on understanding the core concept of ${foundTopic.name} today.`,
                revision_number: null,
                plan_date: dateStr
            });

            remainingMins -= duration;
            newTasksAdded++;

            // Create topic_progress entry
            const revDates = [
                format(addDays(currentDate, 3), 'yyyy-MM-dd'),
                format(addDays(currentDate, 7), 'yyyy-MM-dd'),
                format(addDays(currentDate, 21), 'yyyy-MM-dd'),
                format(addDays(currentDate, 45), 'yyyy-MM-dd')
            ];

            topicProgressList.push({
                user_id: user.id,
                exam_id: exam.id,
                section_name: activeSection.name,
                topic_name: foundTopic.name,
                status: 'in_progress',
                first_studied_date: dateStr,
                total_time_minutes: duration,
                revision_dates: revDates,
                resource_used: resource.resource_name
            });

            // Schedule revisions into queue
            scheduledRevisions.push({ dateStr: revDates[0], sectionName: activeSection.name, topicName: foundTopic.name, duration: 30, revNum: 1, resourceName: resource.resource_name, resourceType: resource.resource_type });
            scheduledRevisions.push({ dateStr: revDates[1], sectionName: activeSection.name, topicName: foundTopic.name, duration: 20, revNum: 2, resourceName: resource.resource_name, resourceType: resource.resource_type });
            scheduledRevisions.push({ dateStr: revDates[2], sectionName: activeSection.name, topicName: foundTopic.name, duration: 15, revNum: 3, resourceName: resource.resource_name, resourceType: resource.resource_type });
            scheduledRevisions.push({ dateStr: revDates[3], sectionName: activeSection.name, topicName: foundTopic.name, duration: 10, revNum: 4, resourceName: resource.resource_name, resourceType: resource.resource_type });
        }

        // Update DP count
        dailyPlansList[dailyPlansList.length - 1].total_tasks = newTasksAdded;

        // If no tasks could be created (e.g. all topics done and no revisions), stop adding blank days
        if (newTasksAdded === 0) {
            dailyPlansList.pop();
        }
    }

    // 5. Batch Insert into Data Layers
    // Delete existing uncompleted plans if user is regenerating
    await supabase.from('tasks').delete().eq('user_id', user.id).eq('status', 'pending');
    await supabase.from('daily_plans').delete().eq('user_id', user.id).eq('completed_tasks', 0);

    if (dailyPlansList.length > 0) {
        const { error: dErr } = await supabase.from('daily_plans').insert(dailyPlansList);
        if (dErr) console.error("DP insert error", dErr);

        const { error: tErr } = await supabase.from('tasks').insert(tasksList);
        if (tErr) console.error("Task insert error", tErr);

        // Upsert topic progress
        if (topicProgressList.length > 0) {
            const { error: tpErr } = await supabase.from('topic_progress').upsert(topicProgressList, { onConflict: 'user_id, section_name, topic_name' });
            if (tpErr) console.error("Topic progress upsert error", tpErr);
        }
    }

    return true;
}
