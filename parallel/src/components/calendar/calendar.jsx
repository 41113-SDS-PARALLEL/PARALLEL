import React, { Component } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import CreateEventOptions from "./createEventOptions/createEventOptions";
import CreateTaskOptions from "./createTaskOptions/createTaskOptions";
import auLocale from "@fullcalendar/core/locales/en-au";
import "./calendar.css";

import { retrieveScheduledTasks } from "../../utils/timeblockUtils";

class Calendar extends Component {
  state = {
    selectedStartTime: null,
    selectedEndTime: null,
    selectedStreamID: null,
    selectedAllDay: null,
    selectedEvent: null,
    popupType: null,
  };
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

  eventTextColor = (arg, backgroundColor = null) => {
    let color = "var(--gray)";
    if (!backgroundColor) {
      const streamId = arg.event.extendedProps?.stream;
      if (streamId && Array.isArray(this.props.streams)) {
        const stream = this.props.streams.find((s) => s.id === streamId);
        if (stream && stream.color) color = stream.color;
      }
    } else {
      color = backgroundColor;
    }
    const hex = color.replace(/^#/, "");
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    const textColor = luminance > 0.5 ? "black" : "white";
    return textColor;
  };

  styleTask = (info, eventColor) => {
    if (info.event.extendedProps.task) {
      info.el.classList.add("task-event");
      info.el.style.border = "0";
      info.el.style.borderLeft = `0.5rem solid ${eventColor}`;
      info.el.style.backgroundColor = "var(--gray)";
      info.el.style.setProperty(
        "--fc-event-text-color",
        "var(--content-color)"
      );
      info.el.style.paddingLeft = "0.2rem";
    }
  };

  commonParams = (onDatesSet) => {
    return {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: "timeGridWeek",
      initialDate: this.props.currentDisplayedDate,
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
      tasks,
      streams,
      view,
      splitView,
      editingStreamTimes,
      mainCalendarRef,
      headerCalendarRef,
      getSplitCalendarRef,
      onSelectTimes,
      onCreateEvent,
      onCreateTask,
      creatingEvent,
      creatingTask,
      editingEvent,
      eventOptionType,
      onCloseCreateEventOptions,
      onCloseCreateTaskOptions,
      onSubmitEvent,
      onSubmitTask,
    } = this.props;

    return (
      <React.Fragment>
        <div
          className={`calendar-container ${
            view === "dayGridMonth" ? "month-view" : ""
          }`}
        >
          {splitView ? (
            <div className="split-calendar-container">
              <div className="calendar-header-container">
                <h2 className="stream-header"></h2>
                {
                  <div className="main-calendar date-calendar">
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
                        let eventColor = "var(--gray)";
                        if (stream.selected === true) {
                          eventColor = stream.color;
                        }
                        info.el.style.setProperty(
                          "--fc-event-text-color",
                          this.eventTextColor(info, eventColor)
                        );
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
                      selectable={true}
                      select={(info) => {
                        this.setState({
                          selectedStartTime: new Date(info.start),
                          selectedEndTime: new Date(info.end),
                          selectedAllDay: info.allDay,
                          selectedStreamID: stream.id,
                          popupType: "Create",
                        });
                        onCreateEvent("Create");
                      }}
                      eventClick={(info) => {
                        this.setState({
                          selectedEvent: info.event,
                          popupType: "Edit",
                        });
                        onCreateEvent("Edit");
                      }}
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
                            color:
                              s.id === stream.id ? stream.color : "var(--gray)",
                          }))
                        ),
                        ...tasks,
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
                              "0.25"
                            );
                          }
                          return;
                        }
                        let eventColor = "var(--gray)";
                        if (info.event.extendedProps.stream === stream.id) {
                          eventColor = stream.color;
                        }
                        info.el.style.setProperty(
                          "--fc-event-text-color",
                          this.eventTextColor(info, eventColor)
                        );
                        info.el.style.setProperty(
                          "--fc-event-bg-color",
                          eventColor
                        );
                        info.el.style.setProperty(
                          "--fc-event-border-color",
                          eventColor
                        );
                        this.styleTask(info, eventColor);
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
                dayHeaderFormat={{ weekday: "short" }}
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
                      endTime = `${pad(end.getHours())}:${pad(
                        end.getMinutes()
                      )}`;
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
            <div className="main-calendar date-calendar">
              <FullCalendar
                ref={mainCalendarRef}
                nowIndicator={true}
                events={[
                  ...events.filter((event) =>
                    streams.find(
                      (stream) =>
                        stream.id === event.extendedProps.stream &&
                        stream.selected
                    )
                  ),
                  ...tasks,
                ]}
                selectable={true}
                select={(info) => {
                  this.setState({
                    selectedStartTime: new Date(info.start),
                    selectedEndTime: new Date(info.end),
                    selectedAllDay: info.allDay,
                    popupType: "Create",
                  });
                  onCreateEvent("Create");
                }}
                eventClick={(info) => {
                  this.setState({
                    selectedEvent: info.event,
                    popupType: "Edit",
                  });
                  onCreateEvent("Edit");
                }}
                eventDidMount={(info) => {
                  const stream = info.event.extendedProps.stream;
                  const streamObj = streams.find((s) => s.id === stream);
                  const eventColor = streamObj ? streamObj.color : "#3788d8";
                  info.el.style.setProperty(
                    "--fc-event-text-color",
                    this.eventTextColor(info, eventColor)
                  );
                  info.el.style.setProperty("--fc-event-bg-color", eventColor);
                  info.el.style.setProperty(
                    "--fc-event-border-color",
                    eventColor
                  );
                  this.styleTask(info, eventColor);
                }}
                {...this.commonParams(onDatesSet)}
              />
            </div>
          )}
        </div>
        {creatingEvent && (
          <CreateEventOptions
            onClose={() => {
              onCloseCreateEventOptions();
              this.setState({
                selectedStartTime: null,
                selectedEndTime: null,
                selectedStreamID: null,
                selectedAllDay: null,
                selectedEvent: null,
                popupType: null,
              });
            }}
            streams={streams}
            onSubmitEvent={onSubmitEvent}
            start={this.state.selectedStartTime}
            end={this.state.selectedEndTime}
            allDay={this.state.selectedAllDay}
            stream={this.state.selectedStreamID}
            event={this.state.selectedEvent}
            eventOptionType={eventOptionType}
            events={events}
          />
        )}
        {editingEvent && (
          <CreateEventOptions
            onClose={() => {
              onCloseCreateEventOptions();
              this.setState({
                selectedStartTime: null,
                selectedEndTime: null,
                selectedStreamID: null,
                selectedAllDay: null,
                selectedEvent: null,
                popupType: null,
              });
            }}
            streams={streams}
            onSubmitEvent={onSubmitEvent}
            start={this.state.selectedStartTime}
            end={this.state.selectedEndTime}
            allDay={this.state.selectedAllDay}
            stream={this.state.selectedStreamID}
            event={this.state.selectedEvent}
            eventOptionType={eventOptionType}
            events={events}
          />
        )}
        {creatingTask && (
          <CreateTaskOptions
            onClose={() => {
              onCloseCreateTaskOptions();
              this.setState({
                selectedStartTime: null,
                selectedEndTime: null,
                selectedStreamID: null,
                selectedAllDay: null,
                selectedEvent: null,
              });
            }}
            streams={streams}
            onSubmitTask={onSubmitTask}
            start={this.state.selectedStartTime}
            end={this.state.selectedEndTime}
            stream={this.state.selectedStreamID}
          />
        )}
      </React.Fragment>
    );
  }
}

export default Calendar;
