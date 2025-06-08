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
      //Create event
      this.state = {
        streamID:
          this.props.stream || (streams.length > 0 ? streams[0].id : null),
        startDate: this.props.start
          ? formatDateTimeLocal(this.props.start).substring(0, 10)
          : null,
        endDate: this.props.end
          ? formatDateTimeLocal(this.props.end).substring(0, 10)
          : null,
        startTime: this.props.start
          ? formatDateTimeLocal(this.props.start).substring(11)
          : null,
        endTime: this.props.end
          ? formatDateTimeLocal(this.props.end).substring(11)
          : null,
        allDay: this.props.allDay ? this.props.allDay : false,
        recurring: false,
        type: false,
        badInput: true,
        days: {
          id: "Day",
          mon: false,
          tue: false,
          wed: false,
          thu: false,
          fri: false,
          sat: false,
          sun: false,
        },
        test: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
      };
    } else {
      if (this.props.event.groupId) {
        for (let i = 0; i < this.props.events.length; i++) {
          if (this.props.events[i].groupId == this.props.event.groupId) {
            this.state = {
              title: this.props.event.title,
              streamID: this.props.event.extendedProps.stream,
              startDate: this.props.events[i].startRecur.substring(0, 10),
              endDate: this.props.events[i].endRecur.substring(0, 10),
              startTime: this.props.events[i].startTime
                ? this.props.events[i].startTime.substring(0, 5)
                : "00:00",
              endTime: this.props.events[i].endTime
                ? this.props.events[i].endTime.substring(0, 5)
                : "00:00",
              allDay: this.props.event.allDay,
              recurring: true,
              type: true,
              badInput: false,
              days: {
                id: "Day",
                mon: this.props.events[i].daysOfWeek.includes(1),
                tue: this.props.events[i].daysOfWeek.includes(2),
                wed: this.props.events[i].daysOfWeek.includes(3),
                thu: this.props.events[i].daysOfWeek.includes(4),
                fri: this.props.events[i].daysOfWeek.includes(5),
                sat: this.props.events[i].daysOfWeek.includes(6),
                sun: this.props.events[i].daysOfWeek.includes(0),
              },
              test: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
            };
            break;
          }
        }
      } else {
        //Editing a non-recurring event
        this.state = {
          title: this.props.event.title,
          streamID: this.props.event.extendedProps.stream,
          startDate: this.props.event.start
            ? formatDateTimeLocal(this.props.event.start).substring(0, 10)
            : null,
          endDate: this.props.event.end
            ? formatDateTimeLocal(this.props.event.end).substring(0, 10)
            : null,
          startTime: this.props.event.start
            ? formatDateTimeLocal(this.props.event.start).substring(11)
            : null,
          endTime: this.props.event.end
            ? formatDateTimeLocal(this.props.event.end).substring(11)
            : null,
          allDay: this.props.event.allDay,
          recurring: false,
          type: true,
          badInput: false,
          days: {
            id: "Day",
            mon: false,
            tue: false,
            wed: false,
            thu: false,
            fri: false,
            sat: false,
            sun: false,
          },
          test: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        };
      }
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
    type: false,
    badInput: true,
    days: {},
    test: [],
  };

  componentDidMount() {
    this.checkInput();
  }

  checkInput() {
    const { recurring, days, test } = this.state;
    if (
      this.state.startDate |
      this.state.endDate |
      this.state.startTime |
      (this.state.endTime === null)
    )
      this.setState({ badInput: true });
    else if (
      new Date(this.state.startDate + "T" + this.state.startTime) >=
      new Date(this.state.endDate + "T" + this.state.endTime)
    )
      this.setState({ badInput: true });
    else if (recurring == true) {
      let pass = false;
      for (let i = 0; i < this.state.test.length; i++) {
        if (days[test[i]]) {
          this.setState({ badInput: false });
          pass = true;
          break;
        }
      }
      if (!pass) this.setState({ badInput: true });
    } else this.setState({ badInput: false });
  }

  componentDidUpdate(prevProps, prevState) {
    const { recurring, days, test } = this.state;
    if (
      new Date(this.state.startDate + "T" + this.state.startTime).toString() !==
      new Date(prevState.startDate + "T" + prevState.startTime).toString()
    )
      this.checkInput();
    if (
      new Date(this.state.endDate + "T" + this.state.endTime).toString() !==
      new Date(prevState.endDate + "T" + prevState.endTime).toString()
    )
      this.checkInput();
    if (recurring != prevState.recurring) this.checkInput();
  }

  newEvent() {
    const {
      title,
      startDate,
      endDate,
      startTime,
      endTime,
      allDay,
      streamID,
      recurring,
      days,
      test,
    } = this.state;
    if (!recurring) {
      // Non-Recurring Event
      return {
        id: (() => {
          const { events } = this.props;
          if (events.length === 0) return 1;
          const usedIds = new Set(events.map((event) => event.id));
          let nextId = 1;
          while (usedIds.has(nextId)) {
            nextId++;
          }
          return nextId;
        })(),
        title: title || "New Event",
        start: startDate + "T" + startTime || new Date(),
        end: endDate + "T" + endTime || new Date(),
        allDay: allDay || false,
        extendedProps: {
          stream: parseInt(streamID, 10) || 1,
        },
      };
    } else {
      let daysArray = [];
      for (let i = 0; i < test.length - 1; i++) {
        if (days[test[i]]) daysArray.push(i + 1);
      }
      if (days["sun"]) daysArray.push(0);
      if (!allDay) {
        // Non All Day Recurring Event
        return {
          title: title || "New Event",
          startTime: startTime + ":00" || null,
          endTime: endTime + ":00" || null,
          startRecur: startDate + "T" + startTime || new Date(),
          endRecur: endDate + "T" + endTime || new Date(),
          allDay: allDay || false,
          daysOfWeek: daysArray,
          groupId: Math.floor(Math.random() * 100),
          extendedProps: {
            stream: parseInt(streamID, 10) || 1,
          },
        };
      } else {
        // All Day Recurring Event
        return {
          title: title || "New Event",
          startRecur: startDate + "T" + startTime || new Date(),
          endRecur: endDate + "T" + endTime || new Date(),
          allDay: allDay,
          daysOfWeek: daysArray,
          groupId: Math.floor(Math.random() * 100),
          extendedProps: {
            stream: parseInt(streamID, 10) || 1,
          },
        };
      }
    }
  }

  oldEvent() {
    if (!this.state.recurring) {
      // Non-Recurring Event
      return {
        id: parseInt(this.props.event.id, 10),
        title: this.props.event.title,
        start: this.props.event.start,
        end: this.props.event.end,
        allDay: this.props.event.allDay,
        extendedProps: {
          stream: this.props.event.extendedProps.stream,
        },
      };
    } else {
      return {
        groupId: this.props.event.groupId,
        title: this.props.event.title,
        start: this.props.event.start,
        end: this.props.event.end,
        allDay: this.props.event.allDay,
        extendedProps: {
          stream: this.props.event.extendedProps.stream,
        },
      };
    }
  }

  render() {
    const { onClose, onSubmitEvent, streams, eventOptionType, onDeleteEvent } =
      this.props;
    const {
      title,
      startDate,
      endDate,
      startTime,
      endTime,
      allDay,
      streamID,
      recurring,
      type,
      badInput,
      days,
      test,
    } = this.state;
    return (
      <div className="modal-background">
        <div className="modal panel">
          <div className="modal-header">
            <h2>{eventOptionType} Event</h2>
            <button
              className="clickable home-page-clickable round-button cancel-button"
              onClick={onClose}
            >
              <img src={closeIcon} alt="Cancel" className="icon x-icon" />
            </button>
          </div>
          <div className="modal-inputs">
            <label className="modal-input-row">
              Title:&nbsp;
              <input
                id="event-title"
                type="text"
                style={{ width: "100%" }}
                name="title"
                value={title || ""}
                onChange={(e) => this.setState({ title: e.target.value })}
              />
            </label>
            <div className="modal-input-row">
              <label>
                Start:&nbsp;
                <input
                  id="event-start-date"
                  type="date"
                  name="startDate"
                  value={startDate || ""}
                  onChange={(e) => {
                    this.setState({ startDate: e.target.value });
                  }}
                />
                <input
                  id="event-start-time"
                  type="time"
                  name="startTime"
                  value={startTime || ""}
                  onChange={(e) => this.setState({ startTime: e.target.value })}
                />
              </label>
            </div>
            <div className="modal-input-row">
              <label>
                End:&nbsp;&nbsp;
                <input
                  id="event-end-date"
                  type="date"
                  name="endDate"
                  value={endDate || ""}
                  onChange={(e) => this.setState({ endDate: e.target.value })}
                />
              </label>
              <input
                id="event-end-time"
                type="time"
                name="endTime"
                value={endTime || ""}
                onChange={(e) => this.setState({ endTime: e.target.value })}
              />
            </div>
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
            <label>
              All Day:&nbsp;
              <input
                id="event-all-day"
                type="checkbox"
                name="allDay"
                value={allDay}
                checked={allDay}
                onChange={(e) => this.setState({ allDay: !allDay })}
              />
            </label>
            <label>
              Recurring:&nbsp;
              <input
                id="event-Recurring"
                type="checkbox"
                name="recurring"
                value={recurring}
                checked={recurring}
                onChange={(e) => this.setState({ recurring: !recurring })}
              />
            </label>
            {recurring && (
              <div className="recurring-day-select-container">
                {test.map((day, idx) => (
                  <div key={idx}>
                    <label className="recurring-day-select">
                      {day.replace(/\b\w/, (c) => c.toUpperCase())}
                      <input
                        type="checkbox"
                        id={day}
                        name="Day"
                        checked={days[day]}
                        onChange={(e) => {
                          days[day] = !days[day];
                          this.checkInput();
                          this.forceUpdate();
                        }}
                      />
                    </label>
                  </div>
                ))}
              </div>
            )}
            <div className="modal-actions">
              <button
                className="clickable submit-button"
                type="submit"
                disabled={badInput}
                onClick={() => {
                  if (!type) {
                    //Create event
                    onSubmitEvent(this.newEvent());
                  } else {
                    // Edit event
                    onSubmitEvent(this.newEvent(), this.oldEvent());
                  }
                  onClose();
                }}
              >
                Submit
              </button>

              {type && (
                <button
                  id="submit"
                  type="submit"
                  onClick={() => {
                    // onSubmitEvent(this.newEvent(), this.oldEvent(), true);
                    onDeleteEvent(this.oldEvent());
                    onClose();
                  }}
                >
                  Delete Event
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateEventOptions;
