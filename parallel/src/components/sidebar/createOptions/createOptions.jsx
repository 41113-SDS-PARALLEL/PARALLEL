import React, { Component, createRef } from "react";
import "./createOptions.css";

class CreateOptions extends Component {
  state = {};
  createOptionsRef = createRef();

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    if (
      this.createOptionsRef.current &&
      !this.createOptionsRef.current.contains(event.target)
    ) {
      this.props.onClose();
    }
  };

  render() {
    const { onClose, onCreateEvent, onCreateTask } = this.props;
    return (
      <div id="createOptions" ref={this.createOptionsRef}>
        <button
          id="eventButton"
          className="button createButton"
          onClick={() => {
            onCreateEvent();
            onClose();
          }}
        >
          Event
        </button>
        <button
          id="taskButton"
          className="button createButton"
          onClick={() => {
            onCreateTask();
            onClose();
          }}
        >
          Task
        </button>
      </div>
    );
  }
}

export default CreateOptions;
