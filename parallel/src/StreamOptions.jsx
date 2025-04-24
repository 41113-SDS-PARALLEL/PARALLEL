import React, { useState } from 'react';
import editIcon from './assets/edit_icon.svg';
import './StreamOptions.css';

export function StreamOptions ({ stream, style, closeOptions, setDeletingStream }) {
    const [editingName, setEditingName] = useState(null);

    return (
        <div className='stream-options' style={style}>
            <div className='stream-options-name'>
                {editingName ? (
                    <input
                        type='text'
                        className='name-input'
                        value={stream.getName()}
                        onChange={(e) => {stream.setName(e.target.value); stream.getStreamManager().notifyListeners()}}
                        onBlur={() => {setEditingName(false)}}
                        onKeyDown={(e) => {if (e.key === 'Enter') {setEditingName(false)}}}
                        autoFocus
                    />
                ) : (
                    <>
                        {stream.getName()} 
                        <button
                            className='edit-button'
                            onClick={(e) => {e.stopPropagation(); setEditingName(true)}}
                        >
                            <img src={editIcon} alt='Edit' className='edit-icon' />
                        </button>
                    </>
                )}
            </div>
            <div className='grid'>
                {stream.getStreamManager().getColors().map((color, index) => (
                    <button
                        key={index}
                        className='color-button'
                        onClick={() => {stream.setColor(color); stream.getStreamManager().notifyListeners()}}
                        style={{ backgroundColor: color, border: stream.getColor() === color ? '2px solid black' : 'none' }}
                    />
                ))}
            </div>
            <div className='stream-options-actions'>
                <button
                    className='edit-times-button'
                    onClick={() => {}}
                >
                    Edit Times
                </button>
                <button
                    className='delete-button'
                    onClick={() => {setDeletingStream(stream); closeOptions()}}
                >
                    Delete Stream
                </button>
            </div>
        </div>
    );
}

export default StreamOptions;