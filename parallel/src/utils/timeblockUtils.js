import { timeStringToMinutes } from "./timePeriodUtils";

export function retrieveScheduledTasks(
  streams,
  events,
  tasks,
  dateStartIndex,
  dateEndIndex
) {
  function allocateTasksToTimeSlots(streams, events, tasks, dayStart, dayEnd) {
    // (1) Sort Events
    const sortedEvents = [...events]
      .map((event) => ({
        start: new Date(event.start),
        end: new Date(event.end),
      }))
      .filter((event) => event.end > dayStart && event.start < dayEnd)
      .sort((a, b) => a.start - b.start);

    // (2) Calculate Free Slots Between Events, split by stream time periods
    const freeSlots = [];
    if (sortedEvents.length === 0) {
      streams.forEach((stream) => {
        if (!stream.timePeriods) return;
        stream.timePeriods.forEach((period) => {
          if (period.day !== dayStart.getDay()) return;
          const periodStart = new Date(dayStart);
          const [startHour, startMin] = period.startTime.split(":").map(Number);
          periodStart.setHours(startHour, startMin, 0, 0);

          const periodEnd = new Date(dayStart);
          const [endHour, endMin] = period.endTime.split(":").map(Number);
          periodEnd.setHours(endHour, endMin, 0, 0);

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
      let currentTime = new Date(dayStart);
      for (const event of sortedEvents) {
        if (currentTime < event.start) {
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
              const slotEnd = new Date(Math.min(event.start, periodEnd));
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

  const scheduledTasksGlobal = [];

  let dateCursor = new Date();
  const currentDayOfWeek = dateCursor.getDay();
  const daysToMove = dateStartIndex - currentDayOfWeek;
  dateCursor.setDate(dateCursor.getDate() + daysToMove);
  let loopIndex = dateStartIndex;

  let remainingTasks = tasks.map((t, idx) => ({ ...t, id: idx }));

  while (loopIndex <= dateEndIndex) {
    const dayStart = new Date(dateCursor);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(dateCursor);
    dayEnd.setHours(23, 59, 59, 999);

    const scheduledForDay = allocateTasksToTimeSlots(
      streams,
      events,
      remainingTasks,
      dayStart,
      dayEnd
    );

    scheduledTasksGlobal.push(scheduledForDay);

    const assignedTaskIds = new Set(scheduledForDay.map((t) => t.id));
    remainingTasks = remainingTasks.filter((t) => !assignedTaskIds.has(t.id));

    loopIndex++;
    dateCursor.setDate(dateCursor.getDate() + 1);
  }

  const flatTasks = scheduledTasksGlobal.flat();
  return flatTasks.map((t) => ({
    title: t.title,
    start: t.start,
    end: t.end,
    extendedProps: { stream: t.stream, task: true },
  }));
}
