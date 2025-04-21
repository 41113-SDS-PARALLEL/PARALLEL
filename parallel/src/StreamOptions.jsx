import React, { useState } from 'react';
import editIcon from './assets/edit_icon.svg';
import './StreamOptions.css';

export function StreamOptions ({ stream, style }) {
    const [editingName, setEditingName] = useState(null);

    return (stream) ? (
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
        </div>
    ) : null;
}

export default StreamOptions;