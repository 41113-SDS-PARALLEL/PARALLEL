// Time Blocking Function, schedules tasks from start to end date (i.e., Monday - Friday)
export function retrieveScheduledTasks(
  streams, // Streams of PARALLEL
  events, // All events of parallel
  tasks, // All tasks of parallel (these are unschduled)
  dateStartIndex, // Starting Date to Begin Time Blocking
  dateEndIndex // Ending Date of Time Blocking
) {
  // Helper Function: Allocate Tasks For A Given Day
  function allocateTasksToTimeSlots(streams, events, tasks, dayStart, dayEnd) {
    // (1) Sort and Filter Events, retrieves events in order for a given day (i.e., all events of June 8th 2025)
    const sortedEvents = [...events]
      .map((event) => ({
        start: new Date(event.start),
        end: new Date(event.end),
      }))
      .filter((event) => event.end > dayStart && event.start < dayEnd)
      .sort((a, b) => a.start - b.start);

    // (2) Calculate Free Slots Between Events, split by stream time periods
    // A free slot is a time period is void of an event and apart of a stream period.
    const freeSlots = [];

    // Check if no events are on the current day, free slots are based off stream periods (i.e., University Free Slot 9:00am - 4:00pm)
    if (sortedEvents.length === 0) {
      streams.forEach((stream) => {
        if (!stream.timePeriods) return; // Check if no stream time periods are on current day, nothing to return, no free slots
        stream.timePeriods.forEach((period) => {
          if (period.day !== dayStart.getDay()) return;
          const periodStart = new Date(dayStart);
          const [startHour, startMin] = period.startTime.split(":").map(Number);
          periodStart.setHours(startHour, startMin, 0, 0);

          const periodEnd = new Date(dayStart);
          const [endHour, endMin] = period.endTime.split(":").map(Number);
          periodEnd.setHours(endHour, endMin, 0, 0);

          // Logic for adding freeslot
          if (periodEnd > periodStart) {
            freeSlots.push({
              start: new Date(periodStart),
              end: new Date(periodEnd),
              stream: stream.id,
            });
          }
        });
      });
    } else {
      // Otherwise events are on current calendar day ...
      let currentTime = new Date(dayStart);
      for (const event of sortedEvents) {
        // Loop over events in order (i.e., from beginning of day to the end ...)
        if (currentTime < event.start) {
          streams.forEach((stream) => {
            if (!stream.timePeriods) return; // If no stream for current day no free slots available
            stream.timePeriods.forEach((period) => {
              if (period.day !== dayStart.getDay()) return;

              const periodStart = new Date(dayStart);
              const [startHour, startMin] = period.startTime
                .split(":")
                .map(Number);
              periodStart.setHours(startHour, startMin, 0, 0);

              const periodEnd = new Date(dayStart);
              const [endHour, endMin] = period.endTime.split(":").map(Number);
              periodEnd.setHours(endHour, endMin, 0, 0);

              const slotStart = new Date(Math.max(currentTime, periodStart));
              const slotEnd = new Date(Math.min(event.start, periodEnd));

              // Logic for adding free slot
              if (slotEnd > slotStart) {
                freeSlots.push({
                  start: slotStart,
                  end: slotEnd,
                  stream: stream.id,
                });
              }
            });
          });
        }

        if (currentTime < event.end) {
          currentTime = new Date(event.end);
        }
      }
      if (currentTime < new Date(dayEnd)) {
        streams.forEach((stream) => {
          if (!stream.timePeriods) return;
          stream.timePeriods.forEach((period) => {
            if (period.day !== dayStart.getDay()) return;
            const periodStart = new Date(dayStart);
            const [startHour, startMin] = period.startTime
              .split(":")
              .map(Number);
            periodStart.setHours(startHour, startMin, 0, 0);

            const periodEnd = new Date(dayStart);
            const [endHour, endMin] = period.endTime.split(":").map(Number);
            periodEnd.setHours(endHour, endMin, 0, 0);

            const slotStart = new Date(Math.max(currentTime, periodStart));
            const slotEnd = new Date(Math.min(dayEnd, periodEnd));
            if (slotEnd > slotStart) {
              freeSlots.push({
                start: slotStart,
                end: slotEnd,
                stream: stream.id,
              });
            }
          });
        });
      }
    }

    // (3) : Fit Tasks Into Free Slots
    const scheduledTasks = [];
    for (const task of tasks) {
      for (const slot of freeSlots) {
        const slotDuration = Math.round((slot.end - slot.start) / 60000);
        if (slotDuration >= task.duration && slot.stream === task.stream) {
          const start = new Date(slot.start);
          const end = new Date(start.getTime() + task.duration * 60000);
          scheduledTasks.push({
            ...task,
            start,
            end,
          });

          slot.start = end;
          break;
        }
      }
    }

    return scheduledTasks;
  }

  // All Tasks to be time blocked (return variable)
  const scheduledTasksGlobal = [];

  // Variables used for scheduling throughout a date range
  let dateCursor = new Date();
  const currentDayOfWeek = dateCursor.getDay();
  const daysToMove = dateStartIndex - currentDayOfWeek;
  dateCursor.setDate(dateCursor.getDate() + daysToMove);

  let loopIndex = dateStartIndex;
  let remainingTasks = tasks.map((t, idx) => ({ ...t, id: idx }));

  // Loop until last day (i.e., Wednesday - Friday)
  while (loopIndex <= dateEndIndex) {
    // Variables used for allocateTasksToTimeSlot function
    const dayStart = new Date(dateCursor);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(dateCursor);
    dayEnd.setHours(23, 59, 59, 999);

    // Retrieves scheduled tasks for certain day
    const scheduledForDay = allocateTasksToTimeSlots(
      streams,
      events,
      remainingTasks,
      dayStart,
      dayEnd
    );

    // Adds tasked scheduled to a day into all tasks begin scheduled for date range
    scheduledTasksGlobal.push(scheduledForDay);

    const assignedTaskIds = new Set(scheduledForDay.map((t) => t.id));
    remainingTasks = remainingTasks.filter((t) => !assignedTaskIds.has(t.id));

    // Increment Loop and Date Cursor
    loopIndex++;
    dateCursor.setDate(dateCursor.getDate() + 1);
  }

  const flatTasks = scheduledTasksGlobal.flat();

  // Returning Scheduled Tasks
  return flatTasks.map((t) => ({
    title: t.title,
    start: t.start,
    end: t.end,
    extendedProps: { stream: t.stream, task: true },
  }));
}
