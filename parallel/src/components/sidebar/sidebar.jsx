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
    createOptionPosition: { top: 0, left: 0 },
  };
  sidebarRef = createRef();
  streamOptionsPanelRef = createRef();

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
        optionsPosition: { top: 0, left: 0 },
      });
    }, 0);
  };

  calculateStreamOptionsPosition(listItem) {
    const rect = listItem.getBoundingClientRect();
    let panelHeight = 0;
    if (this.streamOptionsPanelRef && this.streamOptionsPanelRef.current) {
      panelHeight = this.streamOptionsPanelRef.current.offsetHeight;
    } else {
      panelHeight = 250;
    }
    const spaceBelow = window.innerHeight - rect.top;

    return {
      top:
        spaceBelow >= panelHeight
          ? rect.top + window.scrollY
          : rect.top + window.scrollY - panelHeight + rect.height,
      left: rect.left + window.scrollX,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    // reposition the popup according to its rendered height
    if (
      this.state.optionsStream &&
      (!prevState.optionsStream ||
        prevState.optionsStream !== this.state.optionsStream) &&
      this.streamOptionsPanelRef.current
    ) {
      const button = this.sidebarRef.current.querySelector(
        `button[name="stream-options-button-${this.state.optionsStream}"]`
      );
      const newPosition = this.calculateStreamOptionsPosition(button);
      if (
        newPosition.top !== this.state.optionsPosition.top ||
        newPosition.left !== this.state.optionsPosition.left
      ) {
        this.setState({ optionsPosition: newPosition });
      }
    }

    // prevent scrolling while popup is open
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
    const tag = e.target.tagName;
    const isEditable =
      tag === "INPUT" || tag === "TEXTAREA" || e.target.isContentEditable;

    if (isEditable) return;

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
      <div className="sidebar sidebar-width" ref={this.sidebarRef}>
        {!editingStreamTimes && (
          <React.Fragment>
            <button
              className="clickable create-button"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const position = {
                  top: rect.bottom,
                  left: rect.left,
                  width: rect.width,
                };
                this.setState({
                  createOptionPosition: position,
                  choosingCreateOption: true,
                });
              }}
            >
              <h2>Create</h2>
              <img src={addIcon} alt="Create" className="icon add-icon" />
            </button>
            {this.state.choosingCreateOption && (
              <CreateOptions
                onClose={() => this.setState({ choosingCreateOption: false })}
                onCreateEvent={onCreateEvent}
                onCreateTask={onCreateTask}
                position={this.state.createOptionPosition}
              />
            )}
            <DatePicker ref={datePickerRef} navigateToDate={navigateToDate} />
          </React.Fragment>
        )}
        <div className="streams-toolbar">
          <h2>Streams</h2>
          <button
            className="clickable home-page-clickable round-button"
            onClick={this.handleAddStream}
          >
            <img src={addIcon} alt="Add" className="icon add-icon" />
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
            panelRef={this.streamOptionsPanelRef}
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
    );
  }
}

export default Sidebar;
