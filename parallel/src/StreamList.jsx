import React, { useState, useEffect, useRef } from 'react';
import StreamOptions from './StreamOptions';
import optionsIcon from './assets/options_icon.svg';
import './StreamList.css';

export function StreamList ({ streamManager, setActiveStream, setStreamOptionsPosition, activeStream, streamOptionsPosition }) {
    // const [activeStream, setActiveStream] = useState(null);
    // const [streamOptionsPosition, setStreamOptionsPosition] = useState({ top: 0, left: 0 });
    const listRef = useRef(null);

    function toggleStreamSelection(stream) {
        if (streamManager.streamIsSelected(stream)) {
            // console.log('Deselecting stream:', stream.getName());
            streamManager.deselectStream(stream);
        } else {
            streamManager.selectStream(stream);
            // console.log('Selecting stream:', stream.getName());

        }
    };

    function handleOptionsClick(streamID, index) {
        setActiveStream((prev) => (prev === streamID ? null : streamID));

        const listItem = listRef.current?.children[index].children[1];
        if (listItem) {
            const rect = listItem.getBoundingClientRect();
            const panelHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--stream-options-height')) + 2*parseInt(getComputedStyle(document.documentElement).getPropertyValue('--stream-options-padding'));
            const spaceBelow = window.innerHeight - (rect.top + rect.height);
            
            setStreamOptionsPosition({
                top: spaceBelow >= panelHeight 
                    ? rect.top + window.scrollY + rect.height 
                    : rect.top + window.scrollY- panelHeight,
                left: rect.left + window.scrollX,
            });
        }
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (!event.target.closest('.stream-options') && !event.target.closest('.stream-list-options-button') && !event.target.closest('.add-stream-button')) {
                setActiveStream(null);
            }
        }

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className='stream-list-container'>
            <ul className='stream-list' ref={listRef}>
                {streamManager.getStreams().map((stream, index) => (
                    <li key={index} className='stream-list-item'>
                        <input
                            style={{ accentColor: stream.getColor() }}
                            className='stream-list-checkbox'
                            type="checkbox"
                            defaultChecked={true}
                            onChange={() => toggleStreamSelection(stream)}
                            name={`stream-checkbox-${stream.getID()}`}
                        />
                        {stream.getName()}
                        <button
                            className='stream-list-options-button'
                            onClick={() => handleOptionsClick(stream.getID(), index)}
                        >
                            <img src={optionsIcon} alt='Options' className='stream-list-options-icon' />
                        </button>
                    </li>
                ))}
                {activeStream && (
                    <StreamOptions 
                        stream={streamManager.getStreamByID(activeStream)} 
                        style={{
                            position: 'absolute',
                            top: `${streamOptionsPosition.top}px`,
                            left: `${streamOptionsPosition.left}px`,
                        }}
                    />
                )}
            </ul>
        </div>
    );
}

export default StreamList;