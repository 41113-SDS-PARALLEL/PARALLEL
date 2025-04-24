class TimePeriod {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }

    getStart() {
        return this.start;
    }

    getEnd() {
        return this.end;
    }

    setStart(start) {
        this.start = start;
    }

    setEnd(end) {
        this.end = end;
    }

    includesTime(time) {
        return time >= this.start && time <= this.end;
    }

    getDuration() {
        return this.end - this.start;
    }

    overlaps(other) {
        return this.includesTime(other.getStart()) || this.includesTime(other.getEnd()) || other.includesTime(this.getStart()) || other.includesTime(this.getEnd());
    }

    equals(other) {
        return this.start === other.getStart() && this.end === other.getEnd();
    }

    greaterThan(other) {
        return this.start > other.getStart() || (this.start === other.getStart() && this.end > other.getEnd());
    }

    lessThan(other) {
        return this.start < other.getStart() || (this.start === other.getStart() && this.end < other.getEnd());
    }
}

export default TimePeriod;