import React, { useState } from 'react';
import './DeleteStreamPanel.css';

export function DeleteStreamPanel ({ stream, onClose, deleteStream }) {
    const [deletingEvents, setDeletingEvents] = useState(null);
    const [toStream, setToStream] = useState(stream.getStreamManager().getStreams().filter(s => s.getID() !== stream.getID())[0] || null);

    return (
        <div className='popup-background'>
            <div className='delete-panel'>
                <div className='delete-panel-title'>
                    Delete {stream.getName()} Stream
                </div>
                <div className='delete-panel-text'>
                    How would you like to handle the events and tasks in this stream?
                </div>
                <div className='delete-panel-options'>
                    <input
                        type='radio'
                        id='delete-events'
                        name='delete-options'
                        value='delete-events'
                        onChange={() => setDeletingEvents(true)}
                    />
                    <label htmlFor='delete-events'>Delete events and tasks</label>
                    <br />
                    <input
                        type='radio'
                        id='transfer-events'
                        name='delete-options'
                        value='transfer-events'
                        onChange={() => setDeletingEvents(false)}
                    />
                    <label htmlFor='transfer-events'>
                        Transfer events and tasks to {
                            <select 
                                id='transfer-stream' 
                                name='transfer-stream' 
                                onChange={(e) => setToStream(stream.getStreamManager().getStreamByID(parseInt(e.target.value)))}
                                value={toStream ? toStream.getID() : ''}
                            >
                                {stream.getStreamManager().getStreams().filter(s => s.getID() !== stream.getID()).map((s, index) => (
                                    <option key={index} value={s.getID()}>{s.getName()}</option>
                                ))}
                            </select>
                        }
                    </label>
                </div>
                <div className='delete-panel-actions'>
                    <button
                        className='proceed-button'
                        disabled={deletingEvents === null || (deletingEvents === false && toStream === null)}
                        onClick={() => {
                            if (deletingEvents === true) {
                                deleteStream(stream);
                            } else {
                                stream.getStreamManager().transferEvents(stream, toStream);
                                deleteStream(stream);
                            }
                            onClose();
                        }}
                    >
                        Delete Stream
                    </button>
                    <button
                        className='cancel-button'
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteStreamPanel;