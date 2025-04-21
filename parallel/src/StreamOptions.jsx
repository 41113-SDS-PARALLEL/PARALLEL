import React from 'react';
import './StreamOptions.css';
import Stream from './Stream';

export function StreamOptions ({ stream, style }) {
    return (stream) ? (
        <div className='stream-options' style={style}>
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