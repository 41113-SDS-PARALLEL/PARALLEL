import React, { forwardRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./datePicker.css";

const DatePicker = forwardRef(({ navigateToDate }, ref) => (
  <div className="date-picker">
    <FullCalendar
      ref={ref}
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      weekends={true}
      headerToolbar={{
        right: "prev,next",
        left: "title",
      }}
      dayHeaderContent={(args) => args.text}
      firstDay={1}
      aspectRatio={1}
      fixedWeekCount={false}
      dateClick={(e) => navigateToDate(e.date)}
    />
  </div>
));

export default DatePicker;
