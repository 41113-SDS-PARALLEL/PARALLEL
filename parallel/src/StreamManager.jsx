import Stream from "./Stream";
import StreamList from "./StreamList";

const colors = [
    '#B4415A', '#DB7C41', '#E9E985', '#A97AEC', '#418DB4', '#F69FE4', '#8CCF58', '#336699', '#339970'
]

class StreamManager {
    #streams = [];
    #selectedStreams = new Set();
    #listeners = [];

    getColors() {
        return colors;
    }

    pickUnusedColor() {
        const usedColors = new Set(this.#streams.map((stream) => stream.getColor()));
        for (const color of colors) {
            if (!usedColors.has(color)) {
                return color;
            }
        }
        return colors[Math.floor(Math.random() * colors.length)];
    }

    pickUnusedID() {
        const usedIDs = new Set(this.#streams.map((stream) => stream.getID()));
        let id = 1;
        while (usedIDs.has(id)) {
            id += 1;
        }
        return id;
    }

    getStreamByID(id) {
        return this.#streams.find((stream) => stream.getID() === id) || null;
    }

    getStreamIndex(stream) {
        return this.#streams.indexOf(stream);
    }

    addListener(listener) {
        this.#listeners.push(listener);
    }

    removeListener(listener) {
        this.#listeners = this.#listeners.filter((l) => l !== listener);
    }

    notifyListeners() {
        this.#listeners.forEach((listener) => listener(this.getSelectedStreamIDs()));
    }

    selectStream(stream) {
        this.#selectedStreams.add(stream.getID());
        this.notifyListeners();
    }

    deselectStream(stream) {
        this.#selectedStreams.delete(stream.getID());
        this.notifyListeners();
    }

    getSelectedStreamNames() {
        return new Set(Array.from(this.#selectedStreams).map((stream) => stream.getName()));
    }

    getSelectedStreamIDs() {
        return this.#selectedStreams;
    }

    streamIsSelected(stream) {
        return this.#selectedStreams.has(stream.getID());
    }
    
    getStreams() {
        return this.#streams;
    }

    getStreamNames() {
        return this.#streams.map((stream) => stream.getName());
    }

    getStreamIDs() {
        return this.#streams.map((stream) => stream.getID());
    }

    getStreamByName(name) {
        return this.#streams.find((stream) => stream.getName() === name) || null;
    }

    getStreamByTime(time) {
        for (const stream of this.#streams) {
            if (stream.includesTime(time)) {
                return stream;
            }
        }
        return null;
    }

    addStream(stream) {
        if (this.#streams.includes(stream)) {
            return;
        }
        this.#streams.push(stream);
        this.#selectedStreams.add(stream.getID());
        this.notifyListeners();
    }

    removeStream(stream) {
        const index = this.#streams.indexOf(stream);
        if (index > -1) {
            this.#streams.splice(index, 1);
        }
    }

    resolveTimePeriodClashes(stream) {
        for (const otherStream of this.#streams) {
            if (otherStream !== stream) {
                for (const timePeriod of stream.getTimePeriods()) {
                    otherStream.removeTimePeriod(timePeriod)
                }
            }
        }
    }

    streamList() {
        return <StreamList streamManager={this} />;
    }
}

export default StreamManager;