import TimePeriod from './TimePeriod.jsx';

class Stream {
    #name;
    #color;
    #timePeriods;
    #streamManager;

    constructor(name, streamManager, color=null, timePeriods=[]) {
        this.#name = name;
        this.#color = color;
        if (this.#color === null) {
            this.#color = streamManager.pickUnusedColor();
        }
        this.#timePeriods = timePeriods;
        this.#streamManager = streamManager;
    }

    // generateRandomColor() {
    //     const letters = '0123456789ABCDEF';
    //     let color = '#';
    //     for (let i = 0; i < 6; i++) {
    //         color += letters[Math.floor(Math.random() * 16)];
    //     }
    //     return color;
    // }

    getName() {
        return this.#name;
    }

    getColor() {
        return this.#color;
    }

    getStreamManager() {
        return this.#streamManager;
    }

    getTimePeriods() {
        return this.#timePeriods;
    }

    setName(name) {
        this.#name = name;
    }

    setColor(color) {
        this.#color = color;
    }

    setTimePeriods(timePeriods) {
        this.#timePeriods = timePeriods;
    }

    setStreamManager(streamManager) {
        this.#streamManager = streamManager;
    }

    includesTime(time) {
        for (const timePeriod of this.timePeriods.length) {
            if (timePeriod.includesTime(time)) {
                return true;
            }
        }
        return false;
    }

    #orderTimePeriods() {
        this.#timePeriods.sort((a, b) => {
            if (a.lessThan(b)) {
                return -1;
            } else if (a.greaterThan(b)) {
                return 1;
            } else {
                return 0;
            }
        });
    }

    addTimePeriod(timePeriod) {
        for (const existingTimePeriod of this.#timePeriods) {
            if (existingTimePeriod.includesTime(timePeriod.getStart()) && existingTimePeriod.includesTime(timePeriod.getEnd())) {
                return;
            }
            if (existingTimePeriod.includesTime(timePeriod.getStart()) && !existingTimePeriod.includesTime(timePeriod.getEnd())) {
                existingTimePeriod.setEnd(timePeriod.getEnd());
                return;
            }
            if (!existingTimePeriod.includesTime(timePeriod.getStart()) && existingTimePeriod.includesTime(timePeriod.getEnd())) {
                existingTimePeriod.setStart(timePeriod.getStart());
                return;
            }
        }

        this.#orderTimePeriods();

        previousTimePeriod = null;
        for (const currentTimePeriod of this.#timePeriods) {
            if (previousTimePeriod !== null) {
                if (currentTimePeriod.getStart() === previousTimePeriod.getEnd()) {
                    previousTimePeriod.setEnd(currentTimePeriod.getEnd());
                    this.#timePeriods.splice(this.#timePeriods.indexOf(currentTimePeriod), 1);
                }
            }
        }

        this.#streamManager.resolveTimePeriodClashes(this);
    }

    removeTimePeriod(timePeriod) {
        for (const existingTimePeriod of this.timePeriods) {
            if (existingTimePeriod.getStart() === timePeriod.getStart() && existingTimePeriod.getEnd() === timePeriod.getEnd()) {
                this.#timePeriods.splice(this.#timePeriods.indexOf(existingTimePeriod), 1);
                return;
            }
            if (existingTimePeriod.includesTime(timePeriod.getStart()) && (!existingTimePeriod.includesTime(timePeriod.getEnd()) || existingTimePeriod.getEnd() === timePeriod.getEnd())) {
                existingTimePeriod.setEnd(timePeriod.getEnd());
                return;
            }
            if (existingTimePeriod.includesTime(timePeriod.getEnd()) && (!existingTimePeriod.includesTime(timePeriod.getStart()) || existingTimePeriod.getStart() === timePeriod.getStart())) {
                existingTimePeriod.setStart(timePeriod.getStart());
                return;
            }
            if (existingTimePeriod.includesTime(timePeriod.getStart()) && existingTimePeriod.getStart() !== timePeriod.getStart() && existingTimePeriod.includesTime(timePeriod.getEnd()) && existingTimePeriod.getEnd() !== timePeriod.getEnd()) {
                this.addTimePeriod(new TimePeriod(existingTimePeriod.getStart(), timePeriod.getStart()));
                this.addTimePeriod(new TimePeriod(timePeriod.getEnd(), existingTimePeriod.getEnd()));
                this.#timePeriods.splice(this.#timePeriods.indexOf(existingTimePeriod), 1);
                return;
            }
        }
        this.#orderTimePeriods();
    }
}

export default Stream;

// need to replace the generateRandomColor method with a method that will return a color based on the current colour theme.
