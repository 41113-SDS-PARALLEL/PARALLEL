import React, { Component } from "react";
import editIcon from "../../../assets/edit_icon.svg";
import DeleteStreamOptions from "./deleteStreamOptions/deleteStreamOptions";
import "./streamOptions.css";

class StreamOptions extends Component {
  state = {
    editingName: this.props.stream.name === "New Stream",
    deletingStream: false,
  };

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    if (
      this.props.panelRef.current &&
      !this.props.panelRef.current.contains(event.target)
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
      panelRef,
    } = this.props;
    return (
      <div
        className="panel popup stream-options-popup"
        ref={panelRef}
        style={{ top: position.top, left: position.left }}
      >
        <div className="stream-options-header">
          {this.state.editingName ? (
            <input
              type="text"
              id="stream-name-input"
              className="stream-name-input"
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
            <React.Fragment>
              <p className="stream-name">{stream.name}</p>
              <button
                className="clickable home-page-clickable round-button edit-stream-name-button"
                onClick={() => this.setState({ editingName: true })}
              >
                <img src={editIcon} alt="Edit" className="icon edit-icon" />
              </button>
            </React.Fragment>
          )}
        </div>
        <div className="stream-color-grid">
          {colors.map((color, index) => (
            <button
              key={index}
              className="clickable stream-color-button"
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
            className="clickable edit-times-button"
            onClick={() => {
              onEditStreamTimes(stream.id);
              onClose();
            }}
          >
            Edit Times
          </button>
          <button
            className="clickable delete-button"
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
            disabled={streams.length === 1}
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
