export function timePeriodIncludesTime(timePeriod, time) {
    return time >= timePeriod.start && time <= timePeriod.end;
}

export function timePeriodLessThan(timePeriod1, timePeriod2) {
    return timePeriod1.start < timePeriod2.start || (timePeriod1.start === timePeriod2.start && timePeriod1.end < timePeriod2.end);
}

export function timePeriodGreaterThan(timePeriod1, timePeriod2) {
    return timePeriod1.start > timePeriod2.start || (timePeriod1.start === timePeriod2.start && timePeriod1.end > timePeriod2.end);
}

export function timePeriodOverlaps(timePeriod1, timePeriod2) {
    return timePeriodIncludesTime(timePeriod1, timePeriod2.start) || timePeriodIncludesTime(timePeriod1, timePeriod2.end) || timePeriodIncludesTime(timePeriod2, timePeriod1.start) || timePeriodIncludesTime(timePeriod2, timePeriod1.end);
}