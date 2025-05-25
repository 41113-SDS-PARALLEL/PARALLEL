import React, { Component } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import auLocale from "@fullcalendar/core/locales/en-au";
import "./calendar.css";

class Calendar extends Component {
  state = {};
  splitScrollListeners = [];
  splitCalendarDomRefs = {};

  getCalendarScroller = (streamId) => {
    const container = this.splitCalendarDomRefs[streamId];
    if (!container) return null;
    return container.querySelector(
      ".fc-scroller-liquid-absolute, .fc-scroller, .fc-timegrid-slot-label-frame"
    );
  };

  componentDidMount() {
    this.attachSplitCalendarScrollSync();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.streams !== this.props.streams ||
      prevProps.splitView !== this.props.splitView
    ) {
      setTimeout(() => {
        this.attachSplitCalendarScrollSync();
      }, 0);
    }
  }

  attachSplitCalendarScrollSync = () => {
    if (!this.props.splitView) return;
    if (this.splitScrollListeners) {
      this.splitScrollListeners.forEach(({ scroller, handler }) => {
        scroller.removeEventListener("scroll", handler);
      });
    }
    this.splitScrollListeners = [];

    const splitIDs = this.props.streams
      .filter((stream) => stream.selected)
      .map((stream) => stream.id);

    const scrollers = splitIDs
      .map((ID) => this.getCalendarScroller(ID))
      .filter(Boolean);

    scrollers.forEach((scroller, idx) => {
      const handler = (e) => {
        const scrollTop = scroller.scrollTop;
        scrollers.forEach((other, j) => {
          if (j !== idx && other.scrollTop !== scrollTop) {
            other.scrollTop = scrollTop;
          }
        });
      };
      scroller.addEventListener("scroll", handler);
      this.splitScrollListeners.push({ scroller, handler });
    });
  };

  componentWillUnmount() {
    if (this.splitScrollListeners) {
      this.splitScrollListeners.forEach(({ scroller, handler }) => {
        scroller.removeEventListener("scroll", handler);
      });
    }
  }

  commonParams = (onDatesSet) => {
    return {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: "timeGridWeek",
      weekends: true,
      headerToolbar: false,
      firstDay: 1,
      selectable: true,
      contentHeight: "100%",
      datesSet: onDatesSet,
      slotLabelContent: (arg) => (
        <div className="slot-label-content">
          {arg.date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
          &nbsp;&nbsp;
        </div>
      ),
      eventTimeFormat: {
        hour: "numeric",
        minute: "2-digit",
        omitZeroMinute: false,
        meridiem: "short",
      },
      locale: auLocale,
    };
  };

  render() {
    const {
      onDatesSet,
      events,
      streams,
      splitView,
      editingStreamTimes,
      mainCalendarRef,
      headerCalendarRef,
      getSplitCalendarRef,
      onSelectTimes,
    } = this.props;
    return (
      <div id="Calendar">
        {splitView ? (
          <div className="split-calendar-container">
            <div className="calendar-header-container">
              <h2 className="stream-header header-placeholder"></h2>
              {
                <div className="split-calendar main-calendar calendar-header">
                  <FullCalendar
                    ref={headerCalendarRef}
                    nowIndicator={true}
                    events={events
                      .map((event) => ({ ...event }))
                      .filter((event) => event.allDay === true)}
                    eventDidMount={(info) => {
                      const stream = streams.find(
                        (s) => s.id === info.event.extendedProps.stream
                      );
                      let eventColor = "gray";
                      if (stream.selected === true) {
                        eventColor = stream.color;
                      }
                      info.el.style.setProperty(
                        "--fc-event-bg-color",
                        eventColor
                      );
                      info.el.style.setProperty(
                        "--fc-event-border-color",
                        eventColor
                      );
                    }}
                    {...this.commonParams(onDatesSet)}
                  />
                </div>
              }
            </div>
            {streams
              .filter((stream) => stream.selected)
              .map((stream) => (
                <div
                  key={stream.id}
                  className="split-calendar"
                  ref={(el) => {
                    if (el) this.splitCalendarDomRefs[stream.id] = el;
                  }}
                >
                  <h2 className="stream-header">{stream.name}</h2>
                  <FullCalendar
                    ref={getSplitCalendarRef(stream.id)}
                    nowIndicator={true}
                    dayHeaders={false}
                    allDaySlot={false}
                    events={[
                      ...events,
                      ...streams.flatMap((s) =>
                        (s.timePeriods || []).map((tp, idx) => ({
                          groupId: `stream-${stream.id}-tp-${idx}`,
                          daysOfWeek: [tp.day],
                          startTime: tp.startTime,
                          endTime: tp.endTime,
                          extendedProps: { stream: s.id, isTimePeriod: true },
                          display: "background",
                          color: s.id === stream.id ? stream.color : "gray",
                        }))
                      ),
                    ]}
                    eventDidMount={(info) => {
                      if (info.event.display === "background") {
                        if (info.event.extendedProps.stream !== stream.id) {
                          info.el.style.setProperty(
                            "--fc-bg-event-opacity",
                            "0.8"
                          );
                        } else {
                          info.el.style.setProperty(
                            "--fc-bg-event-opacity",
                            "0.3"
                          );
                        }
                        return;
                      }
                      let eventColor = "gray";
                      if (info.event.extendedProps.stream === stream.id) {
                        eventColor = stream.color;
                      }
                      info.el.style.setProperty(
                        "--fc-event-bg-color",
                        eventColor
                      );
                      info.el.style.setProperty(
                        "--fc-event-border-color",
                        eventColor
                      );
                    }}
                    {...this.commonParams(onDatesSet)}
                  />
                </div>
              ))}
          </div>
        ) : editingStreamTimes ? (
          <div className="main-calendar editing-times-calendar">
            <FullCalendar
              allDaySlot={false}
              dayHeaderFormat={{ weekday: "long" }}
              events={[
                ...streams.flatMap((s) =>
                  (s.timePeriods || []).map((tp, idx) => ({
                    groupId: `stream-${s.id}-tp-${idx}`,
                    daysOfWeek: [tp.day],
                    startTime: tp.startTime,
                    endTime: tp.endTime,
                    extendedProps: { stream: s.id, isTimePeriod: true },
                    display: "background",
                    color: s.color,
                  }))
                ),
              ]}
              selectable={true}
              select={(info) => {
                const periods = [];
                let current = new Date(info.start);
                const end = new Date(info.end);
                const pad = (n) => n.toString().padStart(2, "0");
                while (current < end) {
                  const day = current.getDay();
                  let startTime = "00:00";
                  let endTime = "24:00";
                  if (current.toDateString() === info.start.toDateString()) {
                    startTime = `${pad(info.start.getHours())}:${pad(
                      info.start.getMinutes()
                    )}`;
                  }
                  if (current.toDateString() === info.end.toDateString()) {
                    endTime = `${pad(end.getHours())}:${pad(end.getMinutes())}`;
                  }
                  periods.push({ day, startTime, endTime });
                  current.setDate(current.getDate() + 1);
                  current.setHours(0, 0, 0, 0);
                }
                onSelectTimes(periods);
              }}
              {...this.commonParams(onDatesSet)}
            />
          </div>
        ) : (
          <div className="main-calendar">
            <FullCalendar
              ref={mainCalendarRef}
              nowIndicator={true}
              events={events.filter((event) =>
                streams.find(
                  (stream) =>
                    stream.id === event.extendedProps.stream && stream.selected
                )
              )}
              eventDidMount={(info) => {
                const stream = info.event.extendedProps.stream;
                const streamObj = streams.find((s) => s.id === stream);
                const eventColor = streamObj ? streamObj.color : "#3788d8";
                info.el.style.setProperty("--fc-event-bg-color", eventColor);
                info.el.style.setProperty(
                  "--fc-event-border-color",
                  eventColor
                );
              }}
              {...this.commonParams(onDatesSet)}
            />
          </div>
        )}
      </div>
    );
  }
}

export default Calendar;
