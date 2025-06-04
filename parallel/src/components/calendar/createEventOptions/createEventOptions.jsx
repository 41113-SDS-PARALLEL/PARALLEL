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
      console.log(this.props.event);
      if (this.props.event.groupId) {
        console.log("nya!!!");
        for (let i = 0; i < this.props.events.length; i++) {
          if (this.props.events[i].groupId == this.props.event.groupId) {
            this.state = {
              title: this.props.event.title,
              streamID: this.props.event.extendedProps.stream,
              startDate: formatDateTimeLocal(this.props.events[i].startRecur).substring(0, 10),
              endDate: formatDateTimeLocal(this.props.events[i].endRecur).substring(0, 10),
              startTime: this.props.events[i].startTime,
              endTime: this.props.events[i].endTime,
              allDay: this.props.event.allDay,
              recurring: true,
              type: true,
              badInput: false,
              days: this.props.events[i].daysOfWeek,
              mon: this.props.events[i].daysOfWeek.includes(1),
              tue: this.props.events[i].daysOfWeek.includes(2),
              wed: this.props.events[i].daysOfWeek.includes(3),
              thu: this.props.events[i].daysOfWeek.includes(4),
              fri: this.props.events[i].daysOfWeek.includes(5),
              sat: this.props.events[i].daysOfWeek.includes(6),
              sun: this.props.events[i].daysOfWeek.includes(0),
            };
            // for (let i = 0; i < this.props.events[i].daysOfWeek.length; i++) {
            //   if (this.props.events[i].daysOfWeek[i] = 0) this.setState({sun: true});
            //   if (this.props.events[i].daysOfWeek[i] = 1) this.setState({mon: true});
            //   if (this.props.events[i].daysOfWeek[i] = 2) this.setState({tue: true});
            //   if (this.props.events[i].daysOfWeek[i] = 3) this.setState({wed: true});
            //   if (this.props.events[i].daysOfWeek[i] = 4) this.setState({thu: true});
            //   if (this.props.events[i].daysOfWeek[i] = 5) this.setState({fri: true});
            //   if (this.props.events[i].daysOfWeek[i] = 6) this.setState({sat: true});
            // }
            break
          }
        }
      }
      else {this.state = {
        title: this.props.event.title,
        streamID: this.props.event.extendedProps.stream,
        startDate: this.props.event.start ? formatDateTimeLocal(this.props.event.start).substring(0, 10) : null,
        endDate: this.props.event.end ? formatDateTimeLocal(this.props.event.end).substring(0, 10) : null,
        startTime: this.props.event.start ? formatDateTimeLocal(this.props.event.start).substring(11) : null,
        endTime: this.props.event.end ? formatDateTimeLocal(this.props.event.end).substring(11) : null,
        allDay: this.props.event.allDay,
        type: true,
        badInput: false,
      };}
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
    mon: false,
    tue: false,
    wed: false,
    thu: false,
    fri: false,
    sat: false,
    sun: false,
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
    const { title, startDate, endDate, startTime, endTime, allDay, streamID, recurring, days, type, badInput, mon, tue, wed, thu, fri, sat, sun } = this.state;
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
                checked={recurring}
                onChange={(e) => this.setState({ recurring: !this.state.recurring })}
              />
            </label>
            <br />
            {recurring && (<div>
              <input
                type="checkbox"
                id="Mon"
                name="Day"
                value={mon}
                checked={mon}
                onChange={(e) => this.setState({ mon: !this.state.mon })} />
              <input
                type="checkbox"
                id="Tue"
                name="Day"
                value={tue}
                checked={tue}
                onChange={(e) => this.setState({ tue: !this.state.tue })} />
              <input
                type="checkbox"
                id="Wed"
                name="Day"
                value={wed}
                checked={wed}
                onChange={(e) => this.setState({ wed: !this.state.wed })} />
              <input
                type="checkbox"
                id="Thu"
                name="Day"
                value={thu}
                checked={thu}
                onChange={(e) => this.setState({ thu: !this.state.thu })} />
              <input
                type="checkbox"
                id="Fri"
                name="Day"
                value={fri}
                checked={fri}
                onChange={(e) => this.setState({ fri: !this.state.fri })} />
              <input
                type="checkbox"
                id="Sat"
                name="Day"
                value={sat}
                checked={sat}
                onChange={(e) => this.setState({ sat: !this.state.sat })} />
              <input
                type="checkbox"
                id="Sun"
                name="Day"
                value={sun}
                checked={sun}
                onChange={(e) => this.setState({ sun: !this.state.sun })} />
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
                  if (!recurring) {
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
                    let daysArray = [];
                    if (sun == true) daysArray.push(0);
                    if (mon == true) daysArray.push(1);
                    if (tue == true) daysArray.push(2);
                    if (wed == true) daysArray.push(3);
                    if (thu == true) daysArray.push(4);
                    if (fri == true) daysArray.push(5);
                    if (sat == true) daysArray.push(6);
                    if (!allDay) {
                      onSubmitEvent(
                        {
                          title: title || "New Event",
                          startTime: (startTime + ":00") || null,
                          endTime: (endTime + ":00") || null,
                          startRecur: new Date(startDate + "T" + startTime) || new Date(),
                          endRecur: new Date(endDate + "T" + endTime) || new Date(),
                          allDay: allDay || false,
                          daysOfWeek: daysArray,
                          groupId: Math.floor(Math.random() * 100),
                          extendedProps: {
                            stream: parseInt(streamID, 10) || 1,
                          },
                        },
                        this.props.event
                      );
                    }
                    else {
                      onSubmitEvent(
                        {
                          title: title || "New Event",
                          startRecur: new Date(startDate + "T" + startTime) || new Date(),
                          endRecur: new Date(endDate + "T" + endTime) || new Date(),
                          allDay: allDay,
                          daysOfWeek: daysArray,
                          groupId: Math.floor(Math.random() * 100),
                          extendedProps: {
                            stream: parseInt(streamID, 10) || 1,
                          },
                        },
                        this.props.event
                      );
                    }
                  }
                }
                else {
                  if (!recurring) {
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
                    let daysArray = [];
                    if (mon == true) daysArray.push(1);
                    if (tue == true) daysArray.push(2);
                    if (wed == true) daysArray.push(3);
                    if (thu == true) daysArray.push(4);
                    if (fri == true) daysArray.push(5);
                    if (sat == true) daysArray.push(6);
                    if (sun == true) daysArray.push(0);
                    if (!allDay) {
                      onSubmitEvent(
                        {
                          title: title || "New Event",
                          startTime: (startTime + ":00") || null,
                          endTime: (endTime + ":00") || null,
                          startRecur: new Date(startDate + "T" + startTime) || new Date(),
                          endRecur: new Date(endDate + "T" + endTime) || new Date(),
                          allDay: allDay || false,
                          daysOfWeek: daysArray,
                          groupId: Math.floor(Math.random() * 1000),
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
                      onSubmitEvent(
                        {
                          title: title || "New Event",
                          startRecur: new Date(startDate + "T" + startTime) || new Date(),
                          endRecur: new Date(endDate + "T" + endTime) || new Date(),
                          allDay: allDay,
                          daysOfWeek: daysArray,
                          groupId: Math.floor(Math.random() * 1000),
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
                    // onSubmitEvent(
                    //   {
                    //     title: title || "New Event",
                    //     startTime: (startTime + ":00") || null,
                    //     endTime: (endTime + ":00") || null,
                    //     startRecur: new Date(startDate + "T" + startTime) || new Date(),
                    //     endRecur: new Date(endDate + "T" + endTime) || new Date(),
                    //     allDay: allDay || false,
                    //     daysOfWeek: daysArray,
                    //     groupId: Math.floor(Math.random() * 100),
                    //     extendedProps: {
                    //       stream: parseInt(streamID, 10) || 1,
                    //     },
                    //   },
                    //   {
                    //     title: this.props.event.title,
                    //     start: this.props.event.start,
                    //     end: this.props.event.end,
                    //     allDay: this.props.event.allDay,
                    //     extendedProps: {
                    //       stream: this.props.event.extendedProps.stream,
                    //     },
                    //   }
                    // );
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
