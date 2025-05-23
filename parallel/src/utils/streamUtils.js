import { timePeriodIncludesTime, timePeriodLessThan, timePeriodGreaterThan, timePeriodOverlaps } from './timePeriodUtils.js';

export function streamIncludesTime(stream, time) {
    for (const timePeriod of stream.timePeriods) {
        if (timePeriodIncludesTime(timePeriod, time)) {
            return true;
        }
    }
    return false;
}

function orderedTimePeriods(timePeriods) {
    return timePeriods.sort((a, b) => {
        if (timePeriodLessThan(a, b)) {
            return -1;
        } else if (timePeriodGreaterThan(a, b)) {
            return 1;
        } else {
            return 0;
        }
    });
}

export function smoothedTimePeriods(timePeriods) {
    ordered = orderedTimePeriods(timePeriods);
    const smoothed = [];
    let currentTimePeriod = ordered[0];

    for (let i = 1; i < ordered.length; i++) {
        const nextTimePeriod = ordered[i];
        if (timePeriodIncludesTime(currentTimePeriod, nextTimePeriod.start)) {
            currentTimePeriod.end = Math.max(currentTimePeriod.end, nextTimePeriod.end);
        } else {
            smoothed.push(currentTimePeriod);
            currentTimePeriod = nextTimePeriod;
        }
    }
    smoothed.push(currentTimePeriod);

    return smoothed;
}

function addTimePeriod(timePeriods, newTimePeriod) {
    const combined = [...timePeriods, newTimePeriod];
    return smoothedTimePeriods(combined);
}

function removeTimePeriod(timePeriods, removePeriod) {
    const result = [];
    for (const period of timePeriods) {
        // No overlap
        if (!timePeriodOverlaps(period, removePeriod)) {
            result.push({ ...period });
            continue;
        }
        // Overlap at the start
        if (period.start < removePeriod.start && period.end > removePeriod.start) {
            result.push({ start: period.start, end: removePeriod.start });
        }
        // Overlap at the end
        if (period.end > removePeriod.end && period.start < removePeriod.end) {
            result.push({ start: removePeriod.end, end: period.end });
        }
        // If removePeriod fully covers period, nothing is pushed
    }
    return result;
}

export function deleteStreamEvents(stream, events) {
    return events.filter((event) => event.extendedProps.stream !== stream.id);
}

export function transferStreamEvents(fromStream, toStream, events) {
    return events.map((event) => {
        if (event.extendedProps.stream === fromStream.id) {
            event.extendedProps.stream = toStream.id;
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
            s.selected = !s.selected;
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
    stream.timePeriods = addTimePeriod(stream.timePeriods, timePeriod);
    for (const s of streams) {
        if (s.id !== stream.id) {
            s.timePeriods = removeTimePeriod(s.timePeriods, timePeriod);
        }
    }
}

export function removeTimePeriodFromStream(stream, timePeriod) {
    stream.timePeriods = removeTimePeriod(stream.timePeriods, timePeriod);
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
            stream.name = newName;
            stream.color = newColor;
        }
        return stream;
    });
}