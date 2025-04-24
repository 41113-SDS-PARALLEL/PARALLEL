import React, { useRef } from 'react';
import './App.css';
import Stream from './Stream';
import Calendar from './Calendar'
import Sidebar from './Sidebar'
import { Test } from './Test';

// hardcoded streams
const streams = {
  work: new Stream('Work'),
  university: new Stream('University'),
  personal: new Stream('Personal')
};

// hardcoded events
const events = [
  { title: 'Meeting', start: new Date(2025, 2, 25, 9, 0), extendedProps: { stream: streams.work } }, 
  { title: 'Conference', start: new Date(), extendedProps: { stream: streams.work } }, 
  { title: 'Lecture', start: new Date(2025, 2, 26, 13, 30), extendedProps: { stream: streams.university } },
];

export function App() {
  const calendarRef = useRef(null);
  const miniCalendarRef = useRef(null);

  return (
    <div id="App">
      <Sidebar miniCalendarRef={miniCalendarRef} calendarRef={calendarRef} />
      <Calendar calendarRef={calendarRef} miniCalendarRef={miniCalendarRef} events={events} />
      <Test calendarRef={calendarRef} />
    </div>
  );
}

export default App;