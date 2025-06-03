import React, { Component } from "react";
import closeIcon from "../../../assets/x_icon.svg";
import "./createTaskOptions.css";

class CreateTaskOptions extends Component {
  constructor(props) {
    super(props);
    const { streams } = props;

    // const formatDateTimeLocal = (date) => {
    //   if (!date) return "";
    //   const pad = (n) => n.toString().padStart(2, "0");
    //   const yyyy = date.getFullYear();
    //   const MM = pad(date.getMonth() + 1);
    //   const dd = pad(date.getDate());
    //   const hh = pad(date.getHours());
    //   const mm = pad(date.getMinutes());
    //   return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
    // };

    // this.state = {
      // streamID:
      //   this.props.stream || (streams.length > 0 ? streams[0].id : null),
      // startDate: this.props.start ? formatDateTimeLocal(this.props.start).substring(0, 10) : null,
      // endDate: this.props.end ? formatDateTimeLocal(this.props.end).substring(0, 10) : null,
      // startTime: this.props.start ? formatDateTimeLocal(this.props.start).substring(11) : null,
      // endTime: this.props.end ? formatDateTimeLocal(this.props.end).substring(11) : null,
    // };
    console.log(this.state);
  }

  state = {
    title: "New Task",
    endDate: null,
    hours: 0,
    hoursPerWeek: 0,
    streamID: null,
    definite: true,
  };

  render() {
    const { onClose, onSubmitTask, streams } = this.props;
    const { title, endDate, hours, hoursPerWeek, streamID, definite } = this.state;
    return (
      <div className="popup-background">
        <div className="task-panel">
          <div className="task-panel-title">
            Create Task
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
                id="task-title"
                type="text"
                name="title"
                value={title || ""}
                onChange={(e) => this.setState({ title: e.target.value })}
              />
            </label>
            <br />
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
            <br />
            <label>
              Definite:&nbsp;
              <input
                id="definite"
                type="radio"
                name="definite"
                // checked
                value="value1"
                onChange={(e) => this.setState({ definite: !this.state.definite })}
              />
            </label>
            <br />
            <label>
              Indefinite:&nbsp;
              <input
                id="indefinite"
                type="radio"
                name="definite"
                value="value2"
                onChange={(e) => this.setState({ definite: !this.state.definite })}
              />
            </label>
            <br />
            {definite && ( <div>
              <label>
                Hours:&nbsp;
                <input
                  id="hours"
                  type="number"
                  name="hours"
                  value={hours || 0}
                  onChange={(e) => this.setState({ hours: e.target.value })}
                />
              </label>
              <br />
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
              <br />
            </div>)}
            {!definite && ( <div>
              <label>
                Hours/Week:&nbsp;
                <input
                  id="hours-week"
                  type="number"
                  name="hoursPerWeek"
                  value={hoursPerWeek || 0}
                  onChange={(e) => this.setState({ hoursPerWeek: e.target.value })}
                />
              </label>
              <br />
            </div>)}
            <button
              id="submit"
              type="submit"
              // you should probably just disable this button if any of the fields are empty
              onClick={() => {
                onSubmitTask(
                    {
                      title: title || "New Task",
                      endDate: new Date(endDate + "T00:00:00") || new Date(),
                      hours: hours || 0,
                      stream: parseInt(streamID, 10) || 1,
                    }
                );
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

export default CreateTaskOptions;
