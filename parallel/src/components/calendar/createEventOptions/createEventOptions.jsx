import React, { Component } from "react";
import "./createEventOptions.css";

class CreateEventOptions extends Component {
  constructor(props) {
    super(props);
    const { streams } = props;

    const formatDateTimeLocal = (date) => {
      if (!date) return "";
      const pad = (n) => n.toString().padStart(2, "0");
      const yyyy = date.getFullYear();
      const MM = pad(date.getMonth() + 1);
      const dd = pad(date.getDate());
      const hh = pad(date.getHours());
      const mm = pad(date.getMinutes());
      return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
    };

    this.state = {
      streamID:
        this.props.stream || (streams.length > 0 ? streams[0].id : null),
      start: this.props.start ? formatDateTimeLocal(this.props.start) : null,
      end: this.props.end ? formatDateTimeLocal(this.props.end) : null,
    };
  }

  state = {
    title: "New Event",
    start: null,
    end: null,
    allDay: false,
    streamID: null,
  };

  render() {
    const { onClose, onSubmitEvent, streams } = this.props;
    const { title, start, end, allDay, streamID } = this.state;
    return (
      <div className="popup-background">
        <div className="event-panel">
          <div className="event-panel-title">Create Event</div>
          <div className="delete-panel-options">
            <label>
              Title:&nbsp;
              <input
                id="event-title"
                type="text"
                name="title"
                value={title || ""}
                onChange={(e) => this.setState({ title: e.target.value })}
              />
            </label>
            <br />
            <label>
              Start Date:&nbsp;
              <input
                id="event-start-date"
                type="datetime-local"
                name="start"
                value={start || ""}
                onChange={(e) => this.setState({ start: e.target.value })}
              />
            </label>
            <br />
            <label>
              End Date:&nbsp;
              <input
                id="event-end-date"
                type="datetime-local"
                name="end"
                value={end || ""}
                onChange={(e) => this.setState({ end: e.target.value })}
              />
            </label>
            <br />
            <label>
              All Day:&nbsp;
              <input
                id="event-all-day"
                type="checkbox"
                name="allDay"
                value={allDay}
                onChange={(e) => this.setState({ allDay: e.target.value })}
              />
            </label>
            <br />
            <label>
              Stream:&nbsp;
              <select
                id="event-stream"
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
            <br />
            <button
              id="submit"
              type="submit"
              // you should probably just disable this button if any of the fields are empty
              onClick={() => {
                onSubmitEvent(
                  {
                    title: title || "New Event",
                    start: new Date(start) || new Date(),
                    end: new Date(end) || new Date(),
                    allDay: allDay || false,
                    extendedProps: {
                      stream: parseInt(streamID, 10) || 1,
                    },
                  },
                  streamID
                );
                onClose();
              }}
            >
              Submit
            </button>
          </div>
          <div className="event-panel-actions">
            <button className="cancel-button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateEventOptions;
