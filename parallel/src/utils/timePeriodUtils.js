// Helper: convert "HH:mm" to minutes since midnight
export function timeStringToMinutes(str) {
    const [h, m] = str.split(":").map(Number);
    return h * 60 + m;
}

// Returns true if 'time' (object: {day, time: "HH:mm"}) is within the period
// export function timePeriodIncludesTime(timePeriod, time) {
//     if (time.day !== timePeriod.day) return false;
//     const t = timeStringToMinutes(time.time);
//     const start = timeStringToMinutes(timePeriod.startTime);
//     const end = timeStringToMinutes(timePeriod.endTime);
//     return t >= start && t <= end;
// }

export function timePeriodLessThan(tp1, tp2) {
    if (tp1.day !== tp2.day) return tp1.day < tp2.day;
    if (tp1.startTime !== tp2.startTime) return tp1.startTime < tp2.startTime;
    return tp1.endTime < tp2.endTime;
}

export function timePeriodGreaterThan(tp1, tp2) {
    if (tp1.day !== tp2.day) return tp1.day > tp2.day;
    if (tp1.startTime !== tp2.startTime) return tp1.startTime > tp2.startTime;
    return tp1.endTime > tp2.endTime;
}

export function timePeriodOverlaps(tp1, tp2) {
    if (tp1.day !== tp2.day) return false;
    const start1 = timeStringToMinutes(tp1.startTime);
    const end1 = timeStringToMinutes(tp1.endTime);
    const start2 = timeStringToMinutes(tp2.startTime);
    const end2 = timeStringToMinutes(tp2.endTime);
    return start1 < end2 && start2 < end1;
}