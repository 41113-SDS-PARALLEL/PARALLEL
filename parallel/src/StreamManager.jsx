import StreamList from "./StreamList";

class StreamManager {
    constructor(streams = []) {
        this.streams = streams;
        this.selectedStreams = new Set(streams);
        this.listeners = [];
        for (const stream of streams) {
            stream.setStreamManager(this);
        }
    }

    addListener(listener) {
        this.listeners.push(listener);
    }

    removeListener(listener) {
        this.listeners = this.listeners.filter((l) => l !== listener);
    }

    notifyListeners() {
        this.listeners.forEach((listener) => listener(this.getSelectedStreamNames()));
    }

    selectStream(stream) {
        this.selectedStreams.add(stream);
        this.notifyListeners();
    }

    deselectStream(stream) {
        this.selectedStreams.delete(stream);
        this.notifyListeners();
    }

    getSelectedStreamNames() {
        return new Set(Array.from(this.selectedStreams).map((stream) => stream.getName()));
    }

    streamIsSelected(stream) {
        return this.selectedStreams.has(stream);
    }
    
    getStreams() {
        return this.streams;
    }

    getStreamNames() {
        return this.streams.map((stream) => stream.getName());
    }

    getStreamByName(name) {
        return this.streams.find((stream) => stream.getName() === name) || null;
    }

    getStreamByTime(time) {
        for (const stream of this.streams) {
            if (stream.includesTime(time)) {
                return stream;
            }
        }
        return null;
    }

    addStream(stream) {
        this.streams.push(stream);
    }

    removeStream(stream) {
        const index = this.streams.indexOf(stream);
        if (index > -1) {
            this.streams.splice(index, 1);
        }
    }

    resolveTimePeriodClashes(stream) {
        for (const otherStream of this.streams) {
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