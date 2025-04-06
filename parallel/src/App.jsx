import React, { useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'
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
  const calendarRef = useRef(null);
  return (
    <div id="App">
      {renderSidebar()}
      {renderCalendar(calendarRef)}
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

function renderCalendar(calendarRef) {
  return (
    <div id="Calendar">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView='timeGridWeek'
        weekends={true}
        events={events}
        editable={true}
        // eventDidMount={renderEventStyle}
        eventTimeFormat={{
            hour: 'numeric',
            minute: '2-digit',
            omitZeroMinute: false,
            meridiem: 'short'
          }}
        customButtons={{
          eventButton: {
            text: 'add event...',
            click: function() {
              onEventClick(calendarRef)
            }
          }
        }}
        headerToolbar={{
          left: 'prev,next today eventButton',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
      />
    </div>
  );
}

function onEventClick(calendarRef) {
  var dateStr = prompt('Enter a date in YYYY-MM-DD format');
  var date = new Date(dateStr + 'T00:00:00'); // will be in local time

  if (!isNaN(date.valueOf())) { // valid?
    const Calendar = calendarRef.current.getApi(); 
    Calendar.addEvent({
      title: 'dynamic event',
      start: date,
      allDay: true
    });
    alert('It worked!!!');
  } else {
    alert('Invalid date.');
  }
}

// function renderEventStyle(info) {
//   const eventColor = info.event.extendedProps.stream.color;
//   info.el.style.setProperty('--fc-event-bg-color', eventColor);
//   info.el.style.setProperty('--fc-event-border-color', eventColor);
// }

export default App;