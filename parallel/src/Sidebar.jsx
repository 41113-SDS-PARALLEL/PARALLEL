import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import parallelLogo from './assets/parallel_logo.png';
import addIcon from './assets/add_icon.svg';
import Stream from './Stream';
import StreamList, { calculateStreamOptionsPosition } from './StreamList';
import './Sidebar.css'

export function Sidebar({ miniCalendarRef, calendarRef, streamManager, deleteStream }) {
  const [activeStream, setActiveStream] = useState(null);
  const [streamOptionsPosition, setStreamOptionsPosition] = useState({ top: 0, left: 0 });

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

  function createStream() {
    const newStream = new Stream("New Stream", streamManager);
    setActiveStream(newStream.getID());

    setTimeout(() => {
      const listItems = document.querySelectorAll('.stream-list-item');
      const listItem = listItems[listItems.length - 1]?.children[1];
      if (listItem) {
        listItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        setStreamOptionsPosition(calculateStreamOptionsPosition(listItem));
      }
    }, 0);
  }

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
          dayHeaderContent={(args) => args.text}
          firstDay={1}
          aspectRatio={1}
          fixedWeekCount={false}
          dayCellDidMount={colorCurrentDay}
          dateClick={navigateToDate}
        />
      </div>
      <div id="Sidebar-Options">
        <h3 className='sidebar-header'>Streams</h3>
        <button 
          className='add-stream-button'
          onClick={createStream}
        >
          <img src={addIcon} alt='Add' className='add-icon' />
        </button>
      </div>
      <StreamList 
        streamManager={streamManager} 
        setActiveStream={setActiveStream} 
        setStreamOptionsPosition={setStreamOptionsPosition} 
        activeStream={activeStream} 
        streamOptionsPosition={streamOptionsPosition}
        deleteStream={deleteStream}
      />
    </div>
  );
}

export default Sidebar;