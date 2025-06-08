import React, { Component } from "react";
import closeIcon from "../../../assets/x_icon.svg";
import "./createTaskOptions.css";

class CreateTaskOptions extends Component {
  constructor(props) {
    super(props);
    const { streams } = props;
    this.state.streamID = streams[0].id;
  }

  state = {
    title: "New Task",
    endDate: null,
    hours: 0,
    streamID: null,
  };

  render() {
    const { onClose, onSubmitTask, streams } = this.props;
    const { title, endDate, hours, streamID } = this.state;
    return (
      <div className="modal-background">
        <div className="modal panel">
          <div className="modal-header">
            <h2>Create Task</h2>
            <button
              className="clickable home-page-clickable round-button"
              onClick={onClose}
            >
              <img
                id="close"
                src={closeIcon}
                alt="Cancel"
                className="icon x-icon"
              />
            </button>
          </div>
          <div className="modal-inputs">
            <label className="modal-input-row">
              Title:&nbsp;
              <input
                id="task-title"
                style={{ width: "100%" }}
                type="text"
                name="title"
                value={title || ""}
                onChange={(e) => this.setState({ title: e.target.value })}
              />
            </label>
            <label>
              Stream:&nbsp;
              <select
                id="task-stream"
                name="stream"
                value={streamID}
                onChange={(e) => {
                  this.setState({ streamID: e.target.value });
                }}
              >
                {streams.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="modal-input-row">
              Hours:&nbsp;
              <input
                id="hours"
                style={{ width: "100%" }}
                type="number"
                name="hours"
                value={hours || 0}
                onChange={(e) => this.setState({ hours: e.target.value })}
              />
            </label>
            <label>
              End Date:&nbsp;
              <input
                id="task-end-date"
                type="date"
                name="endDate"
                value={endDate || ""}
                onChange={(e) => this.setState({ endDate: e.target.value })}
              />
            </label>
            <div className="modal-actions">
              <button
                id="submit"
                type="submit"
                onClick={() => {
                  onSubmitTask({
                    title: title || "New Task",
                    endDate: new Date(endDate + "T00:00:00") || new Date(),
                    duration: hours * 60 || 0,
                    stream: parseInt(streamID, 10) || 1,
                  });
                  onClose();
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateTaskOptions;
