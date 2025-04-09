class Stream {
    constructor(name) {
        this.name = name;
        this.color = this.generateRandomColor();
    }

    generateRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    getColor() {
        return this.color;
    }
}

export default Stream;

// Need to eventually add a method to Stream that will return the color of the stream.
// Also need to add the times this stream is active as a parameter to the constructor.
// Also need to add a method that will return the times this stream is active.
// Also need to replace the generateRandomColor method with a method that will return a color based on the current colour theme.
