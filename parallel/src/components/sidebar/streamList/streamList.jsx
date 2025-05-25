import React, { Component } from "react";
import Stream from "./stream/stream";

class StreamList extends Component {
  state = {};
  render() {
    const {
      streams,
      onSelectStream,
      onOptionsClick,
      editingStreamTimes,
      selectedEditingStream,
    } = this.props;
    return (
      <div className="stream-list-container">
        {streams.map((stream) => (
          <Stream
            key={stream.id}
            stream={stream}
            editingStreamTimes={editingStreamTimes}
            onSelectStream={onSelectStream}
            onOptionsClick={(streamID) => onOptionsClick(streamID)}
            selectedEditingStream={selectedEditingStream}
          />
        ))}
      </div>
    );
  }
}

export default StreamList;
