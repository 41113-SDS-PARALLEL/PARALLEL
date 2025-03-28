import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interationPlugin from '@fullcalendar/interaction';
import './Calendar.css'

export function Calendar({ calendarRef, miniCalendarRef, events }) {
  function renderEventStyle(info) {
    const eventColor = info.event.extendedProps.stream.color;
    info.el.style.setProperty('--fc-event-bg-color', eventColor);
    info.el.style.setProperty('--fc-event-border-color', eventColor);
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

  return (
    <div id="Calendar">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interationPlugin]}
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
          left: 'prev,next customToday',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        firstDay={1}
        // nowIndicator={True}
        customButtons={{
          customToday: {
            text: 'today',
            click: navigateCalendarsToToday,
          },
        }}
      />
    </div>
  );
}

export default Calendar;