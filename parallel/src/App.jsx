import React, { Component, createRef } from "react";
import Navbar from "./components/navbar/navbar";
import Sidebar from "./components/sidebar/sidebar";
import Calendar from "./components/calendar/calendar";
import {
  selectStream,
  editStream,
  addTimePeriodToStream,
  removeTimePeriodFromStream,
} from "./utils/streamUtils";
import { retrieveScheduledTasks } from "./utils/timeblockUtils";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      streams: JSON.parse(localStorage.getItem("streams")) || [
        {
          id: 1,
          name: "Work",
          color: "#B4415A",
          selected: true,
          timePeriods: [
            { day: 1, startTime: "09:00", endTime: "17:00" },
            { day: 3, startTime: "13:00", endTime: "17:00" },
          ],
        },
        {
          id: 2,
          name: "University",
          color: "#DB7C41",
          selected: true,
          timePeriods: [
            { day: 2, startTime: "10:00", endTime: "12:00" },
            { day: 4, startTime: "14:00", endTime: "16:00" },
          ],
        },
        {
          id: 3,
          name: "Personal",
          color: "#E9E985",
          selected: true,
          timePeriods: [
            { day: 0, startTime: "08:00", endTime: "10:00" },
            { day: 5, startTime: "18:00", endTime: "20:00" },
          ],
        },
      ],
      events: JSON.parse(localStorage.getItem("events")) || [
        {
          title: "Meeting",
          start: new Date(2025, 5, 5, 0, 30),
          end: new Date(2025, 5, 5, 11, 30),
          extendedProps: { stream: 1 },
        },
        {
          title: "Conference",
          start: new Date(2025, 5, 4, 11, 0),
          end: new Date(2025, 5, 4, 11, 30),
          extendedProps: { stream: 1 },
        },
        {
          title: "Lecture",
          start: new Date(2025, 5, 5, 17, 30),
          end: new Date(2025, 5, 5, 19, 30),
          extendedProps: { stream: 2 },
        },
        {
          title: "Dinner",
          start: new Date(2025, 5, 6, 19, 0),
          end: new Date(2025, 5, 6, 20, 30),
          extendedProps: { stream: 3 },
        },
        {
          title: "Canyoning",
          start: new Date(2025, 4, 24),
          allDay: true,
          extendedProps: { stream: 3 },
        },
      ],
      tasks: JSON.parse(localStorage.getItem("tasks")) || [
        {
          title: "Gym",
          duration: 60,
          stream: 3,
        },
        {
          title: "Assignment",
          duration: 180,
          stream: 2,
        },
      ],
      taskEvents: [],
      calendarTitle: "",
      colors: [
        "#B4415A",
        "#DB7C41",
        "#E9E985",
        "#A97AEC",
        "#418DB4",
        "#F69FE4",
        "#8CCF58",
        "#336699",
        "#339970",
      ],
      view: "timeGridWeek",
      splitView: false,
      editingStreamTimes: false,
      selectedEditingStream: null,
      erasingStreamTimes: false,
      creatingEvent: false,
      eventOptionType: null,
      creatingTask: false,
    };
  }

  state = {
    calendarTitle: null,
    colors: null,
    splitView: false,
    editingStreamTimes: false,
    selectedEditingStream: null,
    erasingStreamTimes: false,
    streams: null,
    events: null,
    tasks: null,
    taskEvents: [],
    creatingEvent: false,
    eventOptionType: null,
    creatingTask: false,
  };

  mainCalendarRef = createRef();
  headerCalendarRef = createRef();
  splitCalendarRefs = {};
  datePickerRef = createRef();

  updateCalendarTitle = () => {
    if (this.mainCalendarRef.current) {
      const calendarApi = this.mainCalendarRef.current.getApi();
      this.setState({ calendarTitle: calendarApi.view.title });
      return;
    }
    if (this.headerCalendarRef.current) {
      const calendarApi = this.headerCalendarRef.current.getApi();
      this.setState({ calendarTitle: calendarApi.view.title });
      return;
    }
  };

  handleViewChange = (view) => {
    if (!this.mainCalendarRef.current) return;
    this.mainCalendarRef.current.getApi().changeView(view);
    this.updateCalendarTitle();
    this.setState({ view: view });
  };

  componentDidMount() {
    setTimeout(this.updateCalendarTitle, 0);
  }

  allCurrentCalendarRefs = () => {
    const refs = [
      this.mainCalendarRef,
      this.headerCalendarRef,
      ...Object.values(this.splitCalendarRefs),
    ];
    return refs
      .map((ref) => ref.current)
      .filter((current) => current !== null && current !== undefined);
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.streams !== this.state.streams) {
      localStorage.setItem("streams", JSON.stringify(this.state.streams));
    }
    if (prevState.events !== this.state.events) {
      localStorage.setItem("events", JSON.stringify(this.state.events));
    }
  }

  render() {
    return (
      <div className="app">
        <Navbar
          onPrev={() => {
            const refs = this.allCurrentCalendarRefs();
            refs.forEach((ref) => {
              ref.getApi().prev();
            });
            this.setState({
              currentDisplayedDate: refs[0].getApi().getDate(),
            });
          }}
          onNext={() => {
            const refs = this.allCurrentCalendarRefs();
            refs.forEach((ref) => {
              ref.getApi().next();
            });
            this.setState({
              currentDisplayedDate: refs[0].getApi().getDate(),
            });
          }}
          onToday={() => {
            const refs = this.allCurrentCalendarRefs();
            refs.forEach((ref) => {
              ref.getApi().today();
            });
            this.datePickerRef.current.getApi().today();
            this.setState({
              currentDisplayedDate: refs[0].getApi().getDate(),
            });
          }}
          view={this.state.view}
          onViewChange={this.handleViewChange}
          title={this.state.calendarTitle}
          onSplit={() => {
            this.setState({ splitView: !this.state.splitView });
          }}
          splitView={this.state.splitView}
          editingStreamTimes={this.state.editingStreamTimes}
          onDoneEditingStreamTimes={() => {
            this.setState({
              editingStreamTimes: false,
              selectedEditingStream: null,
              erasingStreamTimes: false,
            });
          }}
          onEraseStreamTimes={() => {
            this.setState({
              erasingStreamTimes: !this.state.erasingStreamTimes,
            });
          }}
          erasingStreamTimes={this.state.erasingStreamTimes}
          onClearStreamTimes={() =>
            this.setState({
              streams: this.state.streams.map((s) => ({
                ...s,
                timePeriods: [],
              })),
            })
          }
          onTimeblock={(period) => {
            const { streams, events, tasks } = this.state;
            const dateStart = new Date().getDay();
            const dateEnd = period === "day" ? dateStart : 6;
            const scheduledTasks = retrieveScheduledTasks(
              streams,
              events,
              tasks,
              dateStart,
              dateEnd
            );
            this.setState({ taskEvents: scheduledTasks });
          }}
        />
        <div className="content">
          <Sidebar
            datePickerRef={this.datePickerRef}
            editingStreamTimes={this.state.editingStreamTimes}
            selectedEditingStream={this.state.selectedEditingStream}
            erasingStreamTimes={this.state.erasingStreamTimes}
            navigateToDate={(date) => {
              this.allCurrentCalendarRefs().forEach((ref) => {
                ref.getApi().gotoDate(date);
              });
              this.setState({
                currentDisplayedDate: date,
              });
            }}
            streams={this.state.streams}
            colors={this.state.colors}
            events={this.state.events}
            onCreateEvent={(type) => {
              this.setState({ creatingEvent: true });
              this.setState({ eventOptionType: type });
            }}
            onCreateTask={() => {
              this.setState({ creatingTask: true });
            }}
            onSelectStream={(s) => {
              if (this.state.editingStreamTimes) {
                this.setState({
                  selectedEditingStream: s.id,
                  erasingStreamTimes: false,
                });
              } else {
                this.setState({
                  streams: selectStream(s, this.state.streams),
                });
              }
            }}
            onAddStream={(s) =>
              this.setState({
                streams: [...this.state.streams, s],
                editingStreamTimes: true,
                splitView: false,
                erasingStreamTimes: false,
                selectedEditingStream: s.id,
              })
            }
            onDeleteStream={(streamID, eventTransferStreamID) => {
              const events =
                eventTransferStreamID === null
                  ? this.state.events.filter(
                      (event) => event.extendedProps.stream !== streamID
                    )
                  : this.state.events.map((event) =>
                      event.extendedProps.stream === streamID
                        ? {
                            ...event,
                            extendedProps: {
                              ...event.extendedProps,
                              stream: eventTransferStreamID,
                            },
                          }
                        : event
                    );
              this.setState({ events });
              this.setState({
                streams: this.state.streams.filter(
                  (stream) => stream.id !== streamID
                ),
              });
            }}
            onEditStream={(id, newName, newColor) => {
              this.setState({
                streams: editStream(this.state.streams, id, newName, newColor),
                events: this.state.events.map((event) => ({ ...event })),
              });
            }}
            onEditStreamTimes={(streamID) => {
              this.handleViewChange("timeGridWeek");
              this.setState({
                editingStreamTimes: true,
                selectedEditingStream: streamID,
                splitView: false,
                erasingStreamTimes: false,
              });
            }}
          />
          <Calendar
            mainCalendarRef={this.mainCalendarRef}
            headerCalendarRef={this.headerCalendarRef}
            splitCalendarRefs={this.splitCalendarRefs}
            getSplitCalendarRef={(streamID) => {
              if (!this.splitCalendarRefs[streamID]) {
                this.splitCalendarRefs[streamID] = createRef();
              }
              return this.splitCalendarRefs[streamID];
            }}
            currentDisplayedDate={this.state.currentDisplayedDate}
            onDatesSet={this.updateCalendarTitle}
            tasks={this.state.taskEvents}
            events={this.state.events}
            eventOptionType={this.state.eventOptionType}
            streams={this.state.streams}
            view={this.state.view}
            scheduledTasks={this.state.scheduledTasks}
            splitView={this.state.splitView}
            editingStreamTimes={this.state.editingStreamTimes}
            onSelectTimes={(timePeriods) => {
              if (!this.state.editingStreamTimes) return;
              const stream = this.state.streams.find(
                (stream) => stream.id === this.state.selectedEditingStream
              );
              const updatedStreams = timePeriods.reduce(
                (streams, tp) =>
                  this.state.erasingStreamTimes
                    ? streams.map((s) => removeTimePeriodFromStream(s, tp))
                    : addTimePeriodToStream(
                        streams.find((s) => s.id === stream.id),
                        tp,
                        streams
                      ),
                this.state.streams
              );
              this.setState({ streams: updatedStreams });
            }}
            onCreateEvent={(type) => {
              this.setState({ eventOptionType: type });
              console.log(this.state.eventOptionType);
              this.setState({ creatingEvent: true });
            }}
            onCreateTask={() => {
              this.setState({ creatingTask: true });
            }}
            creatingEvent={this.state.creatingEvent}
            creatingTask={this.state.creatingTask}
            onCloseCreateEventOptions={() => {
              this.setState({ creatingEvent: false });
            }}
            onCloseCreateTaskOptions={() => {
              this.setState({ creatingTask: false });
            }}
            onSubmitEvent={(newEvent, oldEvent, remove) => {
              if (oldEvent == null) {
                this.setState({
                  events: [...this.state.events, newEvent],
                });
              } else {
                let matches = [];
                for (var i = 0; i < this.state.events.length; i++) {
                  if (this.state.events[i].title == oldEvent.title) {
                    matches.push(i);
                  }
                }
                for (var i = 0; i < matches.length; i++) {
                  if (this.state.events[matches[i]].start == null) {
                    this.state.events.splice(matches[i], 1);
                    if (!remove) {
                      this.setState({
                        events: [...this.state.events, newEvent],
                      });
                    }
                    break;
                  }
                  if (
                    this.state.events[matches[i]].start.toString() !=
                    oldEvent.start
                  ) {
                    matches.splice(i, 1);
                  }
                }
                this.state.events.splice(matches[0], 1);
                if (!remove) {
                  this.setState({
                    events: [...this.state.events, newEvent],
                  });
                }
              }
            }}
            onSubmitTask={(newTask) => {
              this.setState({
                tasks: [...this.state.tasks, newTask],
              });
            }}
          />
        </div>
      </div>
    );
  }
}

export default App;
