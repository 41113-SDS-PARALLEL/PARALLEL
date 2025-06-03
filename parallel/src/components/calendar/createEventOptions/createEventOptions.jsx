import React, { Component } from "react";
import closeIcon from "../../../assets/x_icon.svg";
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
      startDate: this.props.start ? formatDateTimeLocal(this.props.start).substring(0, 10) : null,
      endDate: this.props.end ? formatDateTimeLocal(this.props.end).substring(0, 10) : null,
      startTime: this.props.start ? formatDateTimeLocal(this.props.start).substring(11) : null,
      endTime: this.props.end ? formatDateTimeLocal(this.props.end).substring(11) : null,
    };
  }

  state = {
    title: "New Event",
    startDate: null,
    endDate: null,
    startTime: null,
    endTime: null,
    allDay: false,
    streamID: null,
    recurring: false,
    days: null,
  };

  render() {
    const { onClose, onSubmitEvent, streams } = this.props;
    const { title, startDate, endDate, startTime, endTime, allDay, streamID, recurring, days } = this.state;
    return (
      <div className="popup-background">
        <div className="event-panel">
          <div className="event-panel-title">
            Create Event
            <button className="cancel-button" onClick={onClose}>
              <img
                  id="close"
                  src={closeIcon}
                  alt="Cancel"
                  className="icon x-icon"
                />
            </button>
          </div>
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
                type="date"
                name="startDate"
                value={startDate || ""}
                onChange={(e) => this.setState({ startDate: e.target.value })}
              />
            </label>
            <br />
            <label>
              End Date:&nbsp;
              <input
                id="event-end-date"
                type="date"
                name="endDate"
                value={endDate || ""}
                onChange={(e) => this.setState({ endDate: e.target.value })}
              />
            </label>
            <br />
            <label>
              Start Time:&nbsp;
              <input
                id="event-start-time"
                type="time"
                name="startTime"
                value={startTime || ""}
                onChange={(e) => this.setState({ startTime: e.target.value })}
              />
            </label>
            <br />
            <label>
              End Time:&nbsp;
              <input
                id="event-end-time"
                type="time"
                name="endTime"
                value={endTime || ""}
                onChange={(e) => this.setState({ endTime: e.target.value })}
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
                onChange={(e) => this.setState({ allDay: !this.state.allDay })}
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
            <label>
              Recurring:&nbsp;
              <input
                id="event-Recurring"
                type="checkbox"
                name="recurring"
                value={recurring}
                onChange={(e) => this.setState({ recurring: !this.state.recurring })}
              />
            </label>
            <br />
            {recurring && (<div>
              <input
                type="checkbox"
                id="Mon"
                name="Day"
                value="1"
                onChange={(e) => this.setState({ days: days + e.target.value })} />
              <input
                type="checkbox"
                id="Tue"
                name="Day"
                value="2"
                onChange={(e) => this.setState({ days: days + e.target.value })} />
              <input
                type="checkbox"
                id="Wed"
                name="Day"
                value="3"
                onChange={(e) => this.setState({ days: days + e.target.value })} />
              <input
                type="checkbox"
                id="Thu"
                name="Day"
                value="4"
                onChange={(e) => this.setState({ days: days + e.target.value })} />
              <input
                type="checkbox"
                id="Fri"
                name="Day"
                value="5"
                onChange={(e) => this.setState({ days: days + e.target.value })} />
              <input
                type="checkbox"
                id="Sat"
                name="Day"
                value="6"
                onChange={(e) => this.setState({ days: days + e.target.value })} />
              <input
                type="checkbox"
                id="Sun"
                name="Day"
                value="0"
                onChange={(e) => this.setState({ days: days + e.target.value })} />
              <br />
            </div>)}
            <button
              id="submit"
              type="submit"
              // you should probably just disable this button if any of the fields are empty
              onClick={() => {
                console.log(this.state);
                if (days == null) {
                  onSubmitEvent(
                    {
                      title: title || "New Event",
                      start: new Date(startDate + "T" + startTime) || new Date(),
                      end: new Date(endDate + "T" + endTime) || new Date(),
                      allDay: allDay || false,
                      extendedProps: {
                        stream: parseInt(streamID, 10) || 1,
                      },
                    },
                    streamID
                  );
                }
                else {
                  let daysArray = days.substring(9).split("");
                  onSubmitEvent(
                    {
                      title: title || "New Event",
                      startTime: (startTime + ":00") || null,
                      endTime: (endTime + ":00") || null,
                      startRecur: new Date(startDate + "T" + startTime) || new Date(),
                      endRecur: new Date(endDate + "T" + endTime) || new Date(),
                      allDay: allDay || false,
                      daysOfWeek: daysArray,
                      extendedProps: {
                        stream: parseInt(streamID, 10) || 1,
                      },
                    },
                    streamID
                  );
                }
                onClose();
              }}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateEventOptions;
