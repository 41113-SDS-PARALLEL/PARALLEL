import React, { Component } from "react";
import "./deleteStreamOptions.css";

class DeleteStreamOptions extends Component {
  constructor(props) {
    super(props);
    const { streams, stream } = props;
    const availableStreams = streams.filter((s) => s.id !== stream.id);
    this.state = {
      deletingEvents: true,
      toStreamID: availableStreams.length > 0 ? availableStreams[0].id : null,
    };
  }

  state = {
    deletingEvents: true,
    toStreamID: null,
  };

  render() {
    const { stream, onClose, onDeleteStream, streams } = this.props;
    const { deletingEvents, toStreamID } = this.state;
    return (
      <div className="modal-background">
        <div className="modal panel">
          <h2 className="modal-header">Delete {stream.name} Stream</h2>
          <p className="modal-text">
            How would you like to handle the events and tasks in this stream?
          </p>
          <div className="modal-radio-options">
            <div className="modal-radio-option">
              <input
                type="radio"
                id="delete-events-and-tasks"
                className="clickable modal-radio-button"
                name="delete-options"
                value="delete-events"
                checked={deletingEvents === true}
                onChange={() => this.setState({ deletingEvents: true })}
              />
              <label htmlFor="delete-events-and-tasks" className="clickable">
                Delete events and tasks
              </label>
            </div>
            <div className="modal-radio-option">
              <input
                type="radio"
                id="transfer-events-and-tasks"
                className="clickable modal-radio-button"
                name="delete-options"
                value="transfer-events"
                checked={deletingEvents === false}
                onChange={() => this.setState({ deletingEvents: false })}
              />
              <label htmlFor="transfer-events-and-tasks" className="clickable">
                Transfer events and tasks to&nbsp;
                <select
                  name="transfer-stream"
                  onChange={(e) =>
                    this.setState({
                      toStreamID: streams.find(
                        (s) => s.id === parseInt(e.target.value)
                      ).id,
                    })
                  }
                  value={toStreamID ? toStreamID : ""}
                >
                  {streams
                    .filter((s) => s.id !== stream.id)
                    .map((s, index) => (
                      <option key={index} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                </select>
              </label>
            </div>
          </div>
          <div className="modal-actions">
            <button
              className="clickable delete-stream-button"
              disabled={
                deletingEvents === null ||
                (deletingEvents === false && toStreamID === null)
              }
              onClick={() => {
                onDeleteStream(stream.id, deletingEvents ? null : toStreamID);
                onClose();
              }}
            >
              Delete Stream
            </button>
            <button className="clickable" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default DeleteStreamOptions;
