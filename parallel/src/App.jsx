import React, { useRef, useState, useEffect } from 'react';
import './App.css';
import Stream from './Stream';
import Calendar from './Calendar';
import Sidebar from './Sidebar';
import StreamManager from './StreamManager';

const streamManager = new StreamManager([
  new Stream('Work'),
  new Stream('University'),
  new Stream('Personal'),
]);

export function App() {
  const calendarRef = useRef(null);
  const miniCalendarRef = useRef(null);
  const [selectedStreams, setSelectedStreams] = useState(new Set(streamManager.getStreamNames()));

  useEffect(() => {
    const handleStreamChange = (newSelectedStreams) => {
      setSelectedStreams(newSelectedStreams);
    };
    streamManager.addListener(handleStreamChange);

    return () => {
      streamManager.removeListener(handleStreamChange);
    };
  }, []);

  return (
    <div id="App">
      <Sidebar
        miniCalendarRef={miniCalendarRef}
        calendarRef={calendarRef}
        streamManager={streamManager}
      />
      <Calendar
        calendarRef={calendarRef}
        miniCalendarRef={miniCalendarRef}
        events={[
          { title: 'Meeting', start: new Date(2025, 3, 16, 9, 0), extendedProps: { stream: 'Work' } },
          { title: 'Conference', start: new Date(2025, 3, 17, 11, 0), extendedProps: { stream: 'Work' } },
          { title: 'Lecture', start: new Date(2025, 3, 17, 13, 30), extendedProps: { stream: 'University' } },
        ]}
        selectedStreams={selectedStreams}
        streamManager={streamManager}
      />
    </div>
  );
}

export default App;