import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interationPlugin from '@fullcalendar/interaction';
import { Test } from './Test';
import './Calendar.css'

export function Calendar({ calendarRef, miniCalendarRef, events }) {

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

  function selectModal(dateTime) {
    eventRef.current.openModal(dateTime)
  }

  return (
    <div id="Calendar">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interationPlugin]}
        initialView='timeGridWeek'
        weekends={true}
        events={events}
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
        customButtons={{
          customToday: {
            text: 'today',
            click: navigateCalendarsToToday,
          },
          eventButton: {
            text: 'add event...',
            click: function() {
              eventRef.current.openModal(null);
            }
          }
        }}
      />
      <Test calendarRef={calendarRef} eventRef={eventRef}/>
    </div>
  );
}

export default Calendar;