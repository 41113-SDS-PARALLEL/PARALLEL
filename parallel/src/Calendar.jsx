import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interationPlugin from '@fullcalendar/interaction';
import { CreateEvent } from './CreateEvent';
import './Calendar.css'

export function Calendar({ calendarRef, miniCalendarRef, events, selectedStreams, streamManager }) {
  function renderEventStyle(info) {
    if (streamManager.getStreamByID(info.event.extendedProps.stream) != null) {
      const eventColor = streamManager.getStreamByID(info.event.extendedProps.stream).getColor();
      info.el.style.setProperty('--fc-event-bg-color', eventColor);
      info.el.style.setProperty('--fc-event-border-color', eventColor);
    }
  }

  function navigateCalendarsToToday() {
    if (miniCalendarRef.current) {
      const miniCalendarApi = miniCalendarRef.current.getApi();
      miniCalendarApi.today();
    }
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi()
      calendarApi.today()
    }
  };

  const eventRef = React.useRef();
  const [activeEvent, setActiveEvent] = React.useState(null);

  function selectModal(dateTime) {
    setActiveEvent(events)
    // eventRef.current.openModal(dateTime)
  }

  // for (const event of events) {
  //   console.log(event);
  // }
  // console.log(selectedStreams);

  const filteredEvents = events.filter((event) =>
    selectedStreams.has(event.extendedProps.stream)
  );

  return (
    <div id="Calendar">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interationPlugin]}
        initialView='timeGridWeek'
        weekends={true}
        events={filteredEvents}
        eventDidMount={renderEventStyle}
        selectable={true}
        select={selectModal}
        eventTimeFormat={{
            hour: 'numeric',
            minute: '2-digit',
            omitZeroMinute: false,
            meridiem: 'short'
          }}
        headerToolbar={{
          left: 'prev,next today eventButton',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        firstDay={1}
        nowIndicator={true}
        customButtons={{
          customToday: {
            text: 'today',
            click: navigateCalendarsToToday,
          },
          eventButton: {
            text: 'add event...',
            click: function() {
              setActiveEvent(events)
              // eventRef.current.openModal(null);
            }
          }
        }}
      />
      {activeEvent && (
                          <CreateEvent calendarRef={calendarRef} eventRef={eventRef} streamRef={streamManager} onClose={() => {setActiveEvent(null)}}/>
                      )}
      
    </div>
  );
}

export default Calendar;