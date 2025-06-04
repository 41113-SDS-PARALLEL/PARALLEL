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
import "./App.css";

class App extends Component {
  state = {
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
    currentDisplayedDate: new Date(),
    splitView: false,
    editingStreamTimes: false,
    erasingStreamTimes: false,
    selectedEditingStream: null,
    streams: [
      {
        id: 1,
        name: "Work",
        color: "#B4415A",
        selected: true,
        timePeriods: [
          { day: 1, startTime: "09:00", endTime: "17:00" },
        ],
      },
      {
        id: 2,
        name: "University",
        color: "#DB7C41",
        selected: true,
        timePeriods: [
          { day: 2, startTime: "10:00", endTime: "12:00" },
        ],
      },
      {
        id: 3,
        name: "Gym",
        color: "#E9E985",
        selected: true,
        timePeriods: [
          { day: 2, startTime: "10:00", endTime: "12:00" },
          { day: 4, startTime: "11:00", endTime: "15:00" },
        ],
      },
    ],

    // Events time-blocking must 'respect'
    events: [
      {
        title: "Meeting",
        start: new Date(2025, 5, 5, 9, 0),
        extendedProps: { stream: 1 },
      },
      {
        title: "Conference",
        start: new Date(2025, 5, 5, 11, 0),
        extendedProps: { stream: 1 },
      },
      {
        title: "Lecture",
        start: new Date(2025, 5, 4, 21, 30),
        extendedProps: { stream: 2 },
      },
      {
        title: "Dinner",
        start: new Date(2025, 5, 4, 19, 0),
        extendedProps: { stream: 3 },
      },
      {
        title: "Canyoning",
        start: new Date(2025, 5, 24),
        allDay: true,
        extendedProps: { stream: 3 },
      },
    ],

    tasks: [
      {
        title:"Gym",
        endDate: new Date(2025, 5, 3, 19, 0),
        duration: 60,
        stream: 3
      },
    ],
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

  render() {
    return (
      <div id="App">
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
            
            tasks={this.state.tasks}  
            events={this.state.events}
            streams={this.state.streams}
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
          />
        </div>
      </div>
    );
  }
}

export default App;
