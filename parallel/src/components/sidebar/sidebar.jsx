import React, { Component, createRef } from "react";
import DatePicker from "./datePicker/datePicker";
import addIcon from "../..//assets/add_icon.svg";
import StreamList from "./streamList/streamList";
import StreamOptions from "./streamOptions/streamOptions";
import CreateOptions from "./createOptions/createOptions";
import { createStream } from "../../utils/streamUtils";
import "./sidebar.css";

class Sidebar extends Component {
  state = {
    optionsStream: null,
    optionsPosition: { top: 0, left: 0 },
    selectedEditingStream: null,
    choosingCreateOption: false,
  };
  sidebarRef = createRef();

  handleAddStream = () => {
    const { onAddStream, streams, colors } = this.props;
    const newStream = createStream(streams, colors);
    onAddStream(newStream);
    setTimeout(() => {
      if (this.sidebarRef.current) {
        this.sidebarRef.current.scrollTop =
          this.sidebarRef.current.scrollHeight;
      }
      this.setState({
        optionsStream: newStream.id,
        optionsPosition: this.calculateStreamOptionsPosition(
          this.sidebarRef.current.querySelector(
            `button[name="stream-options-button-${newStream.id}"]`
          )
        ),
      });
    }, 0);
  };

  calculateStreamOptionsPosition(listItem) {
    const rect = listItem.getBoundingClientRect();
    const panelHeight =
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--stream-options-height"
        )
      ) +
      2 *
        parseInt(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--stream-options-padding"
          )
        );
    const spaceBelow = window.innerHeight - (rect.top + rect.height);

    return {
      top:
        spaceBelow >= panelHeight
          ? rect.top + window.scrollY
          : rect.top + window.scrollY - panelHeight + rect.height,
      left: rect.left + window.scrollX,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.optionsStream && this.state.optionsStream) {
      if (this.sidebarRef.current) {
        this.sidebarRef.current.addEventListener("wheel", this.preventScroll, {
          passive: false,
        });
        this.sidebarRef.current.addEventListener(
          "touchmove",
          this.preventScroll,
          { passive: false }
        );
        this.sidebarRef.current.addEventListener(
          "keydown",
          this.preventKeyScroll,
          { passive: false }
        );
      }
    } else if (prevState.optionsStream && !this.state.optionsStream) {
      if (this.sidebarRef.current) {
        this.sidebarRef.current.removeEventListener(
          "wheel",
          this.preventScroll
        );
        this.sidebarRef.current.removeEventListener(
          "touchmove",
          this.preventScroll
        );
        this.sidebarRef.current.removeEventListener(
          "keydown",
          this.preventKeyScroll
        );
      }
    }
  }

  preventScroll = (e) => {
    e.preventDefault();
  };

  preventKeyScroll = (e) => {
    const keys = [
      "ArrowUp",
      "ArrowDown",
      "PageUp",
      "PageDown",
      "Home",
      "End",
      " ",
    ];
    if (keys.includes(e.key)) {
      e.preventDefault();
    }
  };

  render() {
    const {
      datePickerRef,
      navigateToDate,
      streams,
      onSelectStream,
      onEditStream,
      onDeleteStream,
      colors,
      events,
      editingStreamTimes,
      onEditStreamTimes,
      selectedEditingStream,
      erasingStreamTimes,
      onCreateEvent,
      onCreateTask,
    } = this.props;
    return (
      <div id="outerSidebar">
        {!editingStreamTimes && (
          <React.Fragment>
            <button
              id="createButton"
              className="button"
              onClick={() =>
                this.setState({
                  choosingCreateOption: !this.state.choosingCreateOption,
                })
              }
            >
              <h2>Create</h2>
              <img
                id="create"
                src={addIcon}
                alt="Create"
                className="icon plus-icon"
              />
            </button>
            {this.state.choosingCreateOption && (
              <CreateOptions
                onClose={() => this.setState({ choosingCreateOption: false })}
                onCreateEvent={onCreateEvent}
                onCreateTask={onCreateTask}
              />
            )}
          </React.Fragment>
        )}
        <div id="Sidebar" ref={this.sidebarRef}>
          {!editingStreamTimes && (
            <div id="datePicker">
              <DatePicker ref={datePickerRef} navigateToDate={navigateToDate} />
            </div>
          )}
          <div id="streams">
            <div id="streamsHeader">
              <h2>Streams</h2>
              <button
                className="button add-stream-button"
                onClick={this.handleAddStream}
              >
                <img
                  id="add"
                  src={addIcon}
                  alt="Add Stream"
                  className="icon plus-icon"
                />
              </button>
            </div>
            <StreamList
              streams={streams}
              onSelectStream={onSelectStream}
              editingStreamTimes={editingStreamTimes}
              erasingStreamTimes={erasingStreamTimes}
              selectedEditingStream={selectedEditingStream}
              onOptionsClick={(streamID) =>
                this.setState({
                  optionsStream: streamID,
                  optionsPosition: this.calculateStreamOptionsPosition(
                    this.sidebarRef.current.querySelector(
                      `button[name="stream-options-button-${streamID}"]`
                    )
                  ),
                })
              }
            />
            {this.state.optionsStream && (
              <StreamOptions
                stream={streams.find(
                  (stream) => stream.id === this.state.optionsStream
                )}
                onClose={() => this.setState({ optionsStream: null })}
                onDeleteStream={onDeleteStream}
                onEditStream={onEditStream}
                onEditStreamTimes={(streamID) => {
                  this.setState({
                    selectedEditingStream: streamID,
                  });
                  onEditStreamTimes(streamID);
                }}
                colors={colors}
                position={this.state.optionsPosition}
                streams={streams}
                events={events}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Sidebar;
