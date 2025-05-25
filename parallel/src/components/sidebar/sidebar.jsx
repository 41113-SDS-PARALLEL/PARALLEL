import React, { Component, createRef } from "react";
import DatePicker from "./datePicker/datePicker";
import addIcon from "../..//assets/add_icon.svg";
import StreamList from "./streamList/streamList";
import StreamOptions from "./streamOptions/streamOptions";
import { createStream } from "../../utils/streamUtils";
import "./sidebar.css";

class Sidebar extends Component {
  state = {
    optionsStream: null,
    optionsPosition: { top: 0, left: 0 },
  };
  sidebarRef = createRef();

  handleAddStream = () => {
    const { onAddStream, streams, colors } = this.props;
    onAddStream(createStream(streams, colors));
    setTimeout(() => {
      if (this.sidebarRef.current) {
        this.sidebarRef.current.scrollTop =
          this.sidebarRef.current.scrollHeight;
      }
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
          ? rect.top + window.scrollY + rect.height
          : rect.top + window.scrollY - panelHeight,
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
    } = this.props;
    return (
      <div id="Sidebar" ref={this.sidebarRef}>
        <div id="datePicker">
          <DatePicker ref={datePickerRef} navigateToDate={navigateToDate} />
        </div>
        <div id="streams">
          <div id="streamsHeader">
            <h2>Streams</h2>
            <button
              className="button add-stream-button"
              onClick={this.handleAddStream}
            >
              <img id="add" src={addIcon} alt="Add" className="icon" />
            </button>
          </div>
          <StreamList
            streams={streams}
            onSelectStream={onSelectStream}
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
              colors={colors}
              position={this.state.optionsPosition}
              streams={streams}
              events={events}
            />
          )}
        </div>
      </div>
    );
  }
}

export default Sidebar;
