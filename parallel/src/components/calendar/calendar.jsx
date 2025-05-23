import React, { forwardRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import './calendar.css';

const Calendar = forwardRef(({ onDatesSet, events, streams }, ref) => (
    <div id="Calendar">
        <FullCalendar
            ref={ref}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView='timeGridWeek'
            weekends={true}
            headerToolbar={false}
            firstDay={1}
            nowIndicator={true}
            selectable={true}
            contentHeight="100%"
            datesSet={onDatesSet}
            events={events}
            eventDidMount={(info) => {
                const stream = info.event.extendedProps.stream;
                const streamObj = streams.find(s => s.id === stream);
                const eventColor = streamObj ? streamObj.color : '#3788d8';
                info.el.style.setProperty('--fc-event-bg-color', eventColor);
                info.el.style.setProperty('--fc-event-border-color', eventColor);
            }}
            eventTimeFormat={{
                hour: 'numeric',
                minute: '2-digit',
                omitZeroMinute: false,
                meridiem: 'short'
            }}
        />
    </div>
));

export default Calendar;