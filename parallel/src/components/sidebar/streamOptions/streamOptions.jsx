import React, { Component, createRef } from "react";
import editIcon from "../../../assets/edit_icon.svg";
import DeleteStreamOptions from "./deleteStreamOptions/deleteStreamOptions";
import "./streamOptions.css";

class StreamOptions extends Component {
  state = {
    editingName: this.props.stream.name === "New Stream",
    deletingStream: false,
  };
  streamOptionsRef = createRef();

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    if (
      this.streamOptionsRef.current &&
      !this.streamOptionsRef.current.contains(event.target)
    ) {
      this.props.onClose();
    }
  };

  render() {
    const {
      stream,
      onClose,
      onDeleteStream,
      onEditStream,
      onEditStreamTimes,
      colors,
      position,
      streams,
      events,
    } = this.props;
    return (
      <div
        className="stream-options"
        ref={this.streamOptionsRef}
        style={{ top: position.top, left: position.left }}
      >
        <div className="stream-options-name">
          {this.state.editingName ? (
            <input
              type="text"
              className="name-input"
              value={stream.name}
              onChange={(e) => {
                onEditStream(stream.id, e.target.value, stream.color);
                console.log(e.target.value);
              }}
              onBlur={() => {
                this.setState({ editingName: false });
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  this.setState({ editingName: false });
                }
              }}
              autoFocus
            />
          ) : (
            <>
              <div className="stream-name">{stream.name}</div>
              <button
                className="button edit-button"
                onClick={() => this.setState({ editingName: true })}
              >
                <img src={editIcon} alt="Edit" className="icon edit-icon" />
              </button>
            </>
          )}
        </div>
        <div className="color-grid">
          {colors.map((color, index) => (
            <button
              key={index}
              className="button color-button"
              onClick={() => {
                onEditStream(stream.id, stream.name, color);
              }}
              style={{
                backgroundColor: color,
                border: stream.color === color ? "2px solid black" : "none",
              }}
            />
          ))}
        </div>
        <div className="stream-options-actions">
          <button
            className="button edit-times-button"
            onClick={() => {
              onEditStreamTimes(stream.id);
              onClose();
            }}
          >
            Edit Times
          </button>
          <button
            className="button delete-button"
            onClick={() => {
              const hasEvents =
                events &&
                events.some((e) => e.extendedProps.stream === stream.id);
              if (hasEvents) {
                this.setState({ deletingStream: true });
              } else {
                onDeleteStream(stream.id, null);
                onClose();
              }
            }}
          >
            Delete Stream
          </button>
        </div>
        {this.state.deletingStream && (
          <DeleteStreamOptions
            stream={stream}
            onClose={() => {
              this.setState({ deletingStream: false });
              onClose();
            }}
            onDeleteStream={onDeleteStream}
            streams={streams}
          />
        )}
      </div>
    );
  }
}

export default StreamOptions;
