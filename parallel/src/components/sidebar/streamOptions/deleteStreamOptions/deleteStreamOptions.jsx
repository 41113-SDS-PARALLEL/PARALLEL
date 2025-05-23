import React, { Component } from 'react';
import './deleteStreamOptions.css';

class DeleteStreamOptions extends Component {
    constructor(props) {
        super(props);
        const { streams, stream } = props;
        const availableStreams = streams.filter(s => s.id !== stream.id);
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
            <div className='popup-background'>
                <div className='delete-panel'>
                    <div className='delete-panel-title'>
                        Delete {stream.name} Stream
                    </div>
                    <div className='delete-panel-text'>
                        How would you like to handle the events and tasks in this stream?
                    </div>
                    <div className='delete-panel-options'>
                        <div className='delete-panel-option-row'>
                            <input
                                type='radio'
                                id='delete-events'
                                name='delete-options'
                                value='delete-events'
                                checked={deletingEvents === true}
                                onChange={() => this.setState({ deletingEvents: true })}
                            />
                            <label htmlFor='delete-events'>Delete events and tasks</label>
                        </div>
                        <div className='delete-panel-option-row'>
                            <input
                                type='radio'
                                id='transfer-events'
                                name='delete-options'
                                value='transfer-events'
                                checked={deletingEvents === false}
                                onChange={() => this.setState({ deletingEvents: false })}
                            />
                            <label htmlFor='transfer-events'>
                                Transfer events and tasks to
                                <select 
                                    id='transfer-stream' 
                                    name='transfer-stream'
                                    onChange={(e) => this.setState({ toStreamID: streams.find(s => s.id === parseInt(e.target.value)).id })}
                                    value={toStreamID ? toStreamID : ''}
                                >
                                    {streams.filter(s => s.id !== stream.id).map((s, index) => (
                                        <option key={index} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </label>
                        </div>
                    </div>
                    <div className='delete-panel-actions'>
                        <button
                            className='button proceed-button'
                            disabled={deletingEvents === null || (deletingEvents === false && toStreamID === null)}
                            onClick={() => {
                                onDeleteStream(stream.id, deletingEvents ? null : toStreamID);
                                onClose();
                            }}
                        >
                            Delete Stream
                        </button>
                        <button
                            className='button cancel-button'
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
 
export default DeleteStreamOptions;