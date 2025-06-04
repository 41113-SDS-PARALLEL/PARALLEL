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
    if (this.props.eventOptionType == "Create") {
      this.state = {
        streamID: this.props.stream || (streams.length > 0 ? streams[0].id : null),
        startDate: this.props.start ? formatDateTimeLocal(this.props.start).substring(0, 10) : null,
        endDate: this.props.end ? formatDateTimeLocal(this.props.end).substring(0, 10) : null,
        startTime: this.props.start ? formatDateTimeLocal(this.props.start).substring(11) : null,
        endTime: this.props.end ? formatDateTimeLocal(this.props.end).substring(11) : null,
        allDay: this.props.allDay ? this.props.allDay : false,
        type: false,
        badInput: false,
      };
      this.checkInput()
      // console.log(this.props.event);
    }
    else {
      this.state = {
        title: this.props.event.title,
        streamID: this.props.event.extendedProps.stream,
        startDate: this.props.event.start ? formatDateTimeLocal(this.props.event.start).substring(0, 10) : null,
        endDate: this.props.event.end ? formatDateTimeLocal(this.props.event.end).substring(0, 10) : null,
        startTime: this.props.event.start ? formatDateTimeLocal(this.props.event.start).substring(11) : null,
        endTime: this.props.event.end ? formatDateTimeLocal(this.props.event.end).substring(11) : null,
        allDay: this.props.event.allDay,
        type: true,
        badInput: false,
      };
      this.checkInput();
    }

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
    type: false,
    badInput: true,
  };

  checkInput() {
    // setTimeout(() => {
    if (this.state.startDate | this.state.endDate | this.state.startTime | this.state.endTime === null) this.setState({badInput: true});
    else if (new Date(this.state.startDate + "T" + this.state.startTime) >= new Date(this.state.endDate + "T" + this.state.endTime)) this.setState({badInput: true});
    else this.setState({badInput: false});
  }

  componentDidUpdate(prevProps, prevState) {
    if (new Date(this.state.startDate + "T" + this.state.startTime).toString() !== new Date(prevState.startDate + "T" + prevState.startTime).toString()) this.checkInput();
    if (new Date(this.state.endDate + "T" + this.state.endTime).toString() !== new Date(prevState.endDate + "T" + prevState.endTime).toString()) this.checkInput();
  }

  render() {
    const { onClose, onSubmitEvent, streams, eventOptionType } = this.props;
    const { title, startDate, endDate, startTime, endTime, allDay, streamID, recurring, days, type, badInput } = this.state;
    return (
      <div className="popup-background">
        <div className="event-panel">
          <div className="event-panel-title">
            {eventOptionType} Event
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
                onChange={(e) => {this.setState({ startDate: e.target.value })}}
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
                checked={allDay}
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
              disabled={this.state.badInput}
              // you should probably just disable this button if any of the fields are empty
              onClick={() => {
                // console.log(this.state);
                if (this.props.event == null) {
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
                      }
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
                      this.props.event
                    );
                  }
                }
                else {
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
                      {
                        title: this.props.event.title,
                        start: this.props.event.start,
                        end: this.props.event.end,
                        allDay: this.props.event.allDay,
                        extendedProps: {
                          stream: this.props.event.extendedProps.stream,
                        },
                      }
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
                      {
                        title: this.props.event.title,
                        start: this.props.event.start,
                        end: this.props.event.end,
                        allDay: this.props.event.allDay,
                        extendedProps: {
                          stream: this.props.event.extendedProps.stream,
                        },
                      }
                    );
                  }
                }
                onClose();
              }}
            >
              Submit
            </button>
            {type && (<div>
              <button
                id="submit"
                type="submit"
                // you should probably just disable this button if any of the fields are empty
                onClick={() => {
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
                      {
                        title: this.props.event.title,
                        start: this.props.event.start,
                        end: this.props.event.end,
                        allDay: this.props.event.allDay,
                        extendedProps: {
                          stream: this.props.event.extendedProps.stream,
                        },
                      },
                      true
                    );
                  onClose();
                }}
              >
                Delete Event
              </button>
            </div>)}
          </div>
        </div>
      </div>
    );
  }
}

export default CreateEventOptions;
