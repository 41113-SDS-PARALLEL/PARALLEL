import React, { Component, createRef } from "react";
import "./timeblockOptions.css";

class TimeblockOptions extends Component {
  panelRef = createRef();

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    if (
      this.panelRef.current &&
      !this.panelRef.current.contains(event.target)
    ) {
      this.props.onClose();
    }
  };

  render() {
    const { onTimeblock, onClose, position } = this.props;
    return (
      <div
        className="panel popup simple-options-popup"
        ref={this.panelRef}
        style={{ top: position.top, left: position.left }}
      >
        <button
          className="clickable simple-options-popup-option"
          name="day"
          onClick={() => {
            onTimeblock("day");
            onClose();
          }}
        >
          for today
        </button>
        <button
          className="clickable simple-options-popup-option"
          name="week"
          onClick={() => {
            onTimeblock("week");
            onClose();
          }}
        >
          for this week
        </button>
      </div>
    );
  }
}

export default TimeblockOptions;
