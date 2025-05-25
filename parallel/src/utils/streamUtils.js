import {
    // timePeriodIncludesTime,
    timePeriodLessThan,
    timePeriodGreaterThan,
    timePeriodOverlaps, 
    timeStringToMinutes
} from './timePeriodUtils.js';

// time = { day: 0-6, time: "HH:mm" }
// export function streamIncludesTime(stream, time) {
//     return stream.timePeriods.some(tp => timePeriodIncludesTime(tp, time));
// }

function orderedTimePeriods(timePeriods) {
    return [...timePeriods].sort((a, b) => {
        if (timePeriodLessThan(a, b)) return -1;
        if (timePeriodGreaterThan(a, b)) return 1;
        return 0;
    });
}

export function smoothedTimePeriods(timePeriods) {
    if (timePeriods.length === 0) return [];
    const ordered = orderedTimePeriods(timePeriods);
    const smoothed = [];
    let current = { ...ordered[0] };

    for (let i = 1; i < ordered.length; i++) {
        const next = ordered[i];
        if (
            current.day === next.day &&
            timeStringToMinutes(next.startTime) <= timeStringToMinutes(current.endTime)
        ) {
            current.endTime = maxTime(current.endTime, next.endTime);
        } else {
            smoothed.push({ ...current });
            current = { ...next };
        }
    }
    smoothed.push({ ...current });
    return smoothed;
}

function maxTime(t1, t2) {
    return timeStringToMinutes(t1) > timeStringToMinutes(t2) ? t1 : t2;
}
function minTime(t1, t2) {
    return timeStringToMinutes(t1) < timeStringToMinutes(t2) ? t1 : t2;
}

function addTimePeriod(timePeriods, newTimePeriod) {
    return smoothedTimePeriods([...timePeriods, newTimePeriod]);
}

function removeTimePeriod(timePeriods, removePeriod) {
    const result = [];
    for (const period of timePeriods) {
        if (period.day !== removePeriod.day) {
            result.push({ ...period });
            continue;
        }
        const pStart = timeStringToMinutes(period.startTime);
        const pEnd = timeStringToMinutes(period.endTime);
        const rStart = timeStringToMinutes(removePeriod.startTime);
        const rEnd = timeStringToMinutes(removePeriod.endTime);

        if (pEnd <= rStart || pStart >= rEnd) {
            result.push({ ...period });
            continue;
        }
        if (pStart < rStart) {
            result.push({
                day: period.day,
                startTime: period.startTime,
                endTime: minutesToTimeString(rStart)
            });
        }
        if (pEnd > rEnd) {
            result.push({
                day: period.day,
                startTime: minutesToTimeString(rEnd),
                endTime: period.endTime
            });
        }
    }
    return result;
}

function minutesToTimeString(mins) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export function deleteStreamEvents(stream, events) {
    return events.filter((event) => event.extendedProps.stream !== stream.id);
}

export function transferStreamEvents(fromStream, toStream, events) {
    return events.map((event) => {
        if (event.extendedProps.stream === fromStream.id) {
            return {
                ...event,
                extendedProps: {
                    ...event.extendedProps,
                    stream: toStream.id
                }
            };
        }
        return event;
    });
}

export function unusedColor(streams, colors) {
    const usedColors = new Set(streams.map((stream) => stream.color));
    for (const color of colors) {
        if (!usedColors.has(color)) {
            return color;
        }
    }
    return colors[Math.floor(Math.random() * colors.length)];
}

export function unusedID(streams) {
    const usedIDs = new Set(streams.map((stream) => stream.id));
    let id = 1;
    while (usedIDs.has(id)) {
        id += 1;
    }
    return id;
}

export function getStreamByID(id, streams) {
    return streams.find((stream) => stream.id === id) || null;
}

export function selectStream(stream, streams) {
    return streams.map((s) => {
        if (s.id === stream.id) {
            return { ...s, selected: !s.selected };
        }
        return s;
    });
}

export function getSelectedStreamIDs(streams) {
    return streams.filter((stream) => stream.selected).map((stream) => stream.id);
}

export function getSelectedStreams(streams) {
    return streams.filter((stream) => stream.selected);
}

export function addTimePeriodToStream(stream, timePeriod, streams) {
    const newStreamTimePeriods = addTimePeriod(stream.timePeriods, timePeriod);
    const newStreams = streams.map((s) => {
        if (s.id === stream.id) {
            return { ...s, timePeriods: newStreamTimePeriods };
        }
        return s;
    });
    for (const s of newStreams) {
        if (s.id !== stream.id) {
            s.timePeriods = removeTimePeriod(s.timePeriods, timePeriod);
        }
    }
    return newStreams;
}

export function removeTimePeriodFromStream(stream, timePeriod) {
    // if (!stream.timePeriods.some((tp) => timePeriodOverlaps(tp, timePeriod))) {
    //     return streams;
    // };
    // const newStreamTimePeriods = removeTimePeriod(stream.timePeriods, timePeriod);
    // return streams.map((s) => {
    //     if (s.id === stream.id) {
    //         return { ...s, timePeriods: newStreamTimePeriods };
    //     }
    //     return s;
    // });
    return { ...stream, timePeriods: removeTimePeriod(stream.timePeriods, timePeriod) }
}

export function getStreamByTime(streams, time) {
    return streams.find((stream) => streamIncludesTime(stream, time)) || null;
}

export function createStream(streams, colors) {
    return {
        id: unusedID(streams),
        name: 'New Stream',
        color: unusedColor(streams, colors),
        timePeriods: [],
        selected: true,
    };
}

export function editStream(streams, id, newName, newColor) {
    return streams.map((stream) => {
        if (stream.id === id) {
            return { ...stream, name: newName, color: newColor };
        }
        return stream;
    });
}