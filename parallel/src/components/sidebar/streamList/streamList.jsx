import React, { Component } from 'react';
import Stream from './stream/stream'

class StreamList extends Component {
    state = {  } 
    render() { 
        const { streams, onSelectStream, onOptionsClick } = this.props;
        return (
            <div className='stream-list-container'>
                {streams.map((stream) => (
                        <Stream
                            key={stream.id}
                            stream={stream}
                            onSelectStream={onSelectStream}
                            onOptionsClick={streamID => onOptionsClick(streamID)}
                        />
                ))}
            </div>
        );
    }
}
 
export default StreamList;