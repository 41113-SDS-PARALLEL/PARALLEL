import React, { useRef, useState, useEffect } from 'react';
import './App.css';
import Stream from './Stream';
import Calendar from './Calendar';
import Sidebar from './Sidebar';
import StreamManager from './StreamManager';

// hardcoded events
const events = [
  { title: 'Meeting', start: new Date(2025, 3, 16, 9, 0), extendedProps: { stream: 1 } },
  { title: 'Conference', start: new Date(2025, 3, 17, 11, 0), extendedProps: { stream: 1 } },
  { title: 'Lecture', start: new Date(2025, 3, 17, 13, 30), extendedProps: { stream: 2 } },
  { title: 'Dinner', start: new Date(2025, 3, 17, 19, 0), extendedProps: { stream: 3 } },
];

const streamManager = new StreamManager();
streamManager.addStream(new Stream('Work', streamManager));
streamManager.addStream(new Stream('University', streamManager));
streamManager.addStream(new Stream('Personal', streamManager));
for (let i = 0; i < events.length; i++) {
  streamManager.addEvent(events[i]);
}

export function App() {
  const calendarRef = useRef(null);
  const miniCalendarRef = useRef(null);
  const [selectedStreams, setSelectedStreams] = useState(new Set(streamManager.getStreamIDs()));
  const [events, setEvents] = useState([
    { title: 'Meeting', start: new Date(2025, 3, 16, 9, 0), extendedProps: { stream: 1 } },
    { title: 'Conference', start: new Date(2025, 3, 17, 11, 0), extendedProps: { stream: 1 } },
    { title: 'Lecture', start: new Date(2025, 3, 17, 13, 30), extendedProps: { stream: 2 } },
    { title: 'Dinner', start: new Date(2025, 3, 17, 19, 0), extendedProps: { stream: 3 } },
]);

  useEffect(() => {
    const handleStreamChange = (newSelectedStreams) => {
      setSelectedStreams(new Set(newSelectedStreams));
    };
    streamManager.addListener(handleStreamChange);

    return () => {
      streamManager.removeListener(handleStreamChange);
    };
  }, []);

  const deleteStream = (stream) => {
    // console.log('deleting stream', stream.getID());
    setSelectedStreams(new Set(streamManager.getStreamIDs()));
    streamManager.deleteStreamAndEvents(stream);
    // console.log(events);
    setEvents(streamManager.getEvents().slice());
  }

  return (
    <div id="App">
      <Sidebar
        miniCalendarRef={miniCalendarRef}
        calendarRef={calendarRef}
        streamManager={streamManager}
        deleteStream={deleteStream}
      />
      <Calendar
        calendarRef={calendarRef}
        miniCalendarRef={miniCalendarRef}
        events={events}
        selectedStreams={selectedStreams}
        streamManager={streamManager}
      />
    </div>
  );
}

export default App;