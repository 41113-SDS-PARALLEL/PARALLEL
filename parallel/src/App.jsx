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
          name: "Personal",
          color: "#B4415A",
          selected: true,
          timePeriods: [],
        },
      ],
      events: JSON.parse(localStorage.getItem("events")) || [],
      tasks: JSON.parse(localStorage.getItem("tasks")) || [],
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
    if (prevState.tasks !== this.state.tasks) {
      localStorage.setItem("tasks", JSON.stringify(this.state.tasks));
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
              const { events, tasks } =
                eventTransferStreamID === null
                  ? {
                      events: this.state.events.filter(
                        (event) => event.extendedProps.stream !== streamID
                      ),
                      tasks: this.state.streams.filter(
                        (tasks) => tasks.stream !== streamID
                      ),
                    }
                  : {
                      events: this.state.events.map((event) =>
                        event.extendedProps.stream === streamID
                          ? {
                              ...event,
                              extendedProps: {
                                ...event.extendedProps,
                                stream: eventTransferStreamID,
                              },
                            }
                          : event
                      ),
                      tasks: this.state.tasks.map((task) =>
                        task.stream === streamID
                          ? {
                              ...task,
                              stream: eventTransferStreamID,
                            }
                          : task
                      ),
                    };
              this.setState({
                events: events,
                streams: this.state.streams.filter(
                  (stream) => stream.id !== streamID
                ),
                taskEvents: this.state.taskEvents.filter(
                  (taskEvents) => taskEvents.extendedProps.stream !== streamID
                ),
                tasks: tasks,
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
            onDeleteEvent={(event) => {
              this.setState({
                events: this.state.events.filter((e) => e.id !== event.id),
              });
            }}
            onSubmitEvent={(newEvent, oldEvent) => {
              if (oldEvent == null) {
                // Create Event
                this.setState({
                  events: [...this.state.events, newEvent],
                });
              } else {
                // Edit/Delete Event
                if (oldEvent.groupId) {
                  // Recurring Event
                  for (var i = 0; i < this.state.events.length; i++) {
                    if (this.state.events[i].groupId == oldEvent.groupId) {
                      this.state.events.splice(i, 1);
                      this.setState({
                        events: [...this.state.events, newEvent],
                      });
                      break;
                    }
                  }
                } else {
                  // Non-Recurring
                  for (var i = 0; i < this.state.events.length; i++) {
                    if (
                      this.state.events[i].title == oldEvent.title &&
                      new Date(this.state.events[i].start).toString() ==
                        oldEvent.start.toString()
                    ) {
                      this.state.events.splice(i, 1);
                      this.setState({
                        events: [...this.state.events, newEvent],
                      });
                      break;
                    }
                  }
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
