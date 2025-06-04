import React, { Component } from "react";
import TimeblockOptions from "./timeblockOptions/timeblockOptions";
import Select from "react-select";
import logo from "../../assets/parallel_logo.svg";
import arrowIcon from "../../assets/arrow_icon.svg";
import eraserIcon from "../../assets/eraser_icon.svg";
import splitIcon from "../../assets/parallel_icon_black.png";
import "./navbar.css";

class Navbar extends Component {
  state = {
    timeblocking: false,
    timeblockPosition: { top: 0, left: 0 },
  };

  render() {
    const {
      onPrev,
      onNext,
      onToday,
      onSplit,
      onViewChange,
      title,
      view,
      splitView,
      editingStreamTimes,
      onDoneEditingStreamTimes,
      onClearStreamTimes,
      onEraseStreamTimes,
      erasingStreamTimes,
    } = this.props;

    const selectOptions = [
      { value: "dayGridMonth", label: "Month" },
      { value: "timeGridWeek", label: "Week" },
      { value: "timeGridDay", label: "Day" },
    ];

    return (
      <div className="navbar">
        <div className="sidebar-nav sidebar-width">
          <img src={logo} alt="Parallel Logo" className="icon logo" />
        </div>
        <div className="calendar-nav">
          {editingStreamTimes ? (
            <React.Fragment>
              <h1 className="title">Edit Stream Times</h1>
              <button
                className={`home-page-clickable clickable home-page-selectable round-button ${
                  erasingStreamTimes && "home-page-selectable-selected"
                }`}
                onClick={onEraseStreamTimes}
              >
                <img
                  src={eraserIcon}
                  alt="Erase"
                  className="icon navbar-icon"
                />
              </button>
              <button
                className="home-page-clickable clickable"
                onClick={onClearStreamTimes}
              >
                Clear
              </button>
              <button
                className="home-page-clickable clickable"
                onClick={onDoneEditingStreamTimes}
              >
                Done
              </button>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <button
                className="home-page-clickable clickable round-button"
                onClick={onPrev}
              >
                <img
                  src={arrowIcon}
                  alt="Previous"
                  className="icon navbar-icon prev"
                />
              </button>
              <button
                className="home-page-clickable clickable round-button"
                onClick={onNext}
              >
                <img
                  src={arrowIcon}
                  alt="Next"
                  className="icon navbar-icon next"
                />
              </button>
              <button
                className="home-page-clickable clickable"
                onClick={onToday}
              >
                Today
              </button>
              <h1 className="title">{title}</h1>
              <button
                className="home-page-clickable clickable round-button"
                onClick={() => {
                  onSplit();
                  onViewChange("timeGridWeek");
                }}
              >
                <img src={splitIcon} alt="Split" className="icon navbar-icon" />
              </button>
              <button
                className="clickable home-page-clickable"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const position = { top: rect.bottom, left: rect.left };
                  this.setState({
                    timeblocking: true,
                    timeblockPosition: position,
                  });
                }}
              >
                Timeblock
              </button>
              {this.state.timeblocking && (
                <TimeblockOptions
                  onTimeblock={(d) => console.log("timeblock", d)}
                  onClose={() => this.setState({ timeblocking: false })}
                  position={this.state.timeblockPosition}
                />
              )}
              <Select
                isSearchable={false}
                isClearable={false}
                isDisabled={splitView}
                value={selectOptions.find((option) => option.value === view)}
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    borderColor: state.isDisabled
                      ? "var(--gray)"
                      : "var(--content-color)",
                    borderRadius: "var(--radius)",
                    background: "transparent",
                    width: "7rem",
                    accentColor: "var(--theme-color)",
                    boxShadow: "none",
                    cursor: !state.isDisabled ? "pointer" : "auto",
                    "&:hover": {
                      borderColor: "var(--content-color)",
                      background: "var(--theme-color)",
                    },
                  }),
                  singleValue: (baseStyles, state) => ({
                    ...baseStyles,
                    color: state.isDisabled
                      ? "var(--gray)"
                      : "var(--content-color)",
                  }),
                  menu: (baseStyles, state) => ({
                    ...baseStyles,
                    background: "var(--gray)",
                    zIndex: "10",
                  }),
                  option: (baseStyles, state) => ({
                    ...baseStyles,
                    background: state.isSelected
                      ? "var(--theme-color)"
                      : state.isFocused
                      ? "var(--faded-theme-color)"
                      : "var(--gray)",
                    color: "var(--content-color)",
                    cursor: "pointer",
                    "&:active": {
                      background: "var(--theme-color)",
                    },
                  }),
                  dropdownIndicator: (baseStyles, state) => ({
                    ...baseStyles,
                    color: state.isDisabled
                      ? "var(--gray)"
                      : "var(--content-color)",
                    "&:hover": {
                      color: "var(--content-color)",
                    },
                  }),
                  indicatorSeparator: (baseStyles, state) => ({
                    ...baseStyles,
                    background: state.isDisabled
                      ? "var(--gray)"
                      : "var(--content-color)",
                  }),
                }}
                onChange={(e) => {
                  onViewChange(e.value);
                  this.setState({ view: e.value });
                }}
                options={selectOptions}
              />
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }
}

export default Navbar;
