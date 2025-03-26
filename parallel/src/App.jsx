import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import './App.css';
import parallelLogo from './assets/parallel_logo.png';
import Stream from './Stream';

const streams = {
  work: new Stream('Work'),
  university: new Stream('University'),
  personal: new Stream('Personal')
};

const events = [
  { title: 'Meeting', start: new Date(2025, 2, 25, 9, 0), extendedProps: { stream: streams.work } }, 
  { title: 'Conference', start: new Date(), extendedProps: { stream: streams.work } }, 
  { title: 'Lecture', start: new Date(2025, 2, 26, 13, 30), extendedProps: { stream: streams.university } },
];

export function App() {
  return (
    <div id="App">
      {renderSidebar()}
      {renderCalendar()}
    </div>
  );
}

function renderSidebar() {
  return (
    <div id="Sidebar">
      <img src={parallelLogo} alt="Parallel Logo" id='Logo' />
      <h2>Sidebar</h2>
      <h3>Streams</h3>
    </div>
  );
}

function renderCalendar() {
  return (
    <div id="Calendar">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView='timeGridWeek'
        weekends={true}
        events={events}
        eventDidMount={renderEventStyle}
        eventTimeFormat={{
            hour: 'numeric',
            minute: '2-digit',
            omitZeroMinute: false,
            meridiem: 'short'
          }}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
      />
    </div>
  );
}

function renderEventStyle(info) {
  const eventColor = info.event.extendedProps.stream.color;
  info.el.style.setProperty('--fc-event-bg-color', eventColor);
  info.el.style.setProperty('--fc-event-border-color', eventColor);
}

export default App;