import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import './Calendar.css'

export function Calendar({ calendarRef, events }) {
    const renderEventStyle = (info) => {
      const eventColor = info.event.extendedProps.stream.color;
      info.el.style.setProperty('--fc-event-bg-color', eventColor);
      info.el.style.setProperty('--fc-event-border-color', eventColor);
    }
  
    return (
      <div id="Calendar">
        <FullCalendar
          ref={calendarRef}
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
          firstDay={1}
        />
      </div>
    );
  }

export default Calendar;