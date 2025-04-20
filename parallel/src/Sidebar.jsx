import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import parallelLogo from './assets/parallel_logo.png';
import './Sidebar.css'

export function Sidebar({ miniCalendarRef, calendarRef, streamManager }) {
  function navigateToDate(info) {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(info.date)
    }
  };

  function colorCurrentDay(info) {
    const today = new Date();
    if (
      info.date.getDate() === today.getDate() &&
      info.date.getMonth() === today.getMonth() &&
      info.date.getFullYear() === today.getFullYear()
    ) {
      info.el.querySelector('.fc-daygrid-day-number').style.backgroundColor = 'var(--theme-color)';
    }
  };

  return (
    <div id="Sidebar">
      <img src={parallelLogo} alt="Parallel Logo" id='Logo' />
      <div id="MiniCalendar">
        <FullCalendar 
          ref={miniCalendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView='dayGridMonth'
          headerToolbar={{
            right: 'prev,next',
            left: 'title'
          }}
          dayHeaderContent={(args) => args.text.charAt(0)}
          firstDay={1}
          aspectRatio={1}
          fixedWeekCount={false}
          dayCellDidMount={colorCurrentDay}
          dateClick={navigateToDate}
        />
      </div>
      <h3 className='sidebar-header'>Streams</h3>
      {streamManager.streamList()}
    </div>
  );
}

export default Sidebar;