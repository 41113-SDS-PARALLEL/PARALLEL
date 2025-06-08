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
    const { onClose, onCreateEvent, onCreateTask, position } = this.props;
    return (
      <div
        className="panel popup simple-options-popup create-options-popup"
        ref={this.createOptionsRef}
        style={{
          top: position.top,
          left: position.left,
          width: position.width,
        }}
      >
        <button
          className="clickable simple-options-popup-option"
          onClick={() => {
            onCreateEvent("Create");
            onClose();
          }}
        >
          Event
        </button>
        <button
          className="clickable simple-options-popup-option"
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
