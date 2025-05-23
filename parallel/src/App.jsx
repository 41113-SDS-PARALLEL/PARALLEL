import React, { Component, createRef } from 'react';
import Navbar from './components/navbar/navbar';
import Sidebar from './components/sidebar/sidebar';
import Calendar from './components/calendar/calendar';
import { selectStream, editStream } from './utils/streamUtils';
import './App.css';

class App extends Component {
  state = { 
    calendarTitle: '',
    colors: [
      '#B4415A', '#DB7C41', '#E9E985', '#A97AEC', '#418DB4', '#F69FE4', '#8CCF58', '#336699', '#339970'
    ],
    streams: [
      { id: 1, name: 'Work', color: '#B4415A', selected: true },
      { id: 2, name: 'University', color: '#DB7C41', selected: true },
      { id: 3, name: 'Personal', color: '#E9E985', selected: true }
    ], 
    events: [
      { title: 'Meeting', start: new Date(2025, 4, 23, 9, 0), extendedProps: { stream: 1 } },
      { title: 'Conference', start: new Date(2025, 4, 25, 11, 0), extendedProps: { stream: 1 } },
      { title: 'Lecture', start: new Date(2025, 4, 25, 23, 30), extendedProps: { stream: 2 } },
      { title: 'Dinner', start: new Date(2025, 4, 22, 19, 0), extendedProps: { stream: 3 } }
    ]
  };
  calendarRef = createRef();
  datePickerRef = createRef();

  handlePrev = () => {
    this.calendarRef.current.getApi().prev();
  };

  handleNext = () => {
    this.calendarRef.current.getApi().next();
  };

  handleToday = () => {
    this.calendarRef.current.getApi().today();

  };

  handleViewChange = (view) => {
    this.calendarRef.current.getApi().changeView(view);
    this.updateCalendarTitle();
  };

  handleDatePick = (date) => {
    this.calendarRef.current.getApi().gotoDate(date);
  };

  updateCalendarTitle = () => {
    if (!this.calendarRef.current) return;
    const calendarApi = this.calendarRef.current.getApi();
    this.setState({ calendarTitle: calendarApi.view.title });
  };

  componentDidMount() {
    setTimeout(this.updateCalendarTitle, 0);
  };

  render() { 
    return (
      <div id="App">
        <Navbar 
          onPrev={this.handlePrev} 
          onNext={this.handleNext} 
          onToday={this.handleToday} 
          onViewChange={this.handleViewChange}
          title={this.state.calendarTitle}
        />
        <div className="content">
          <Sidebar 
            ref={this.datePickerRef}
            navigateToDate={this.handleDatePick}
            streams={this.state.streams}
            colors={this.state.colors}
            events={this.state.events}
            onSelectStream={s => this.setState({ streams: selectStream(s, this.state.streams) })}
            onAddStream={s => this.setState({ streams: [...this.state.streams, s] })}
            onDeleteStream={(streamID, eventTransferStreamID) => {
              const events = eventTransferStreamID === null ? 
                this.state.events.filter(event => event.extendedProps.stream !== streamID) :
                this.state.events.map(event =>
                  event.extendedProps.stream === streamID
                  ? { ...event, extendedProps: { ...event.extendedProps, stream: eventTransferStreamID } }
                  : event
                );
              this.setState({ events });
              this.setState({ streams: this.state.streams.filter(stream => stream.id !== streamID) });
            }}
            onEditStream={(id, newName, newColor) => {
              this.setState({ 
                streams: editStream(this.state.streams, id, newName, newColor), 
                events: this.state.events.map(event => ({ ...event })),
              });
            }}
          />
          <Calendar 
            ref={this.calendarRef}
            onDatesSet={this.updateCalendarTitle}
            events={this.state.events.filter(event => 
              this.state.streams.find(stream => stream.id === event.extendedProps.stream && stream.selected)
            )}
            streams={this.state.streams}
          />
        </div>
      </div>
    );
  }
}
 
export default App;