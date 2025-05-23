import React, { Component } from 'react';
import logo from '../../assets/parallel_logo.png';
import arrowIcon from '../..//assets/arrow_icon.svg';
import './navbar.css';

class Navbar extends Component {
    state = {  } 
    render() { 
        const { onPrev, onNext, onToday, onSplit, onViewChange, title } = this.props;
        return (
            <div id="Navbar">
                <div id='sidebarNav'>
                    <img src={logo} alt="Parallel Logo" id='Logo' />
                </div>
                <div id='calendarNav'>
                    <button id='prevButton' className='navButton' onClick={onPrev}>
                        <img id='prev' src={arrowIcon} alt='previous' className='icon nav-arrow' />
                    </button>
                    <button id='nextButton' className='navButton' onClick={onNext}>
                        <img id='next' src={arrowIcon} alt='next' className='icon nav-arrow' />
                    </button>
                    <button id='todayButton' className='navButton' onClick={onToday}>Today</button>
                    <h1 id='title'>{title}</h1>
                    <button id='splitButton' className='navButton' onClick={onSplit}>Split</button>
                    <div id='viewSelectorContainer'>
                        <img src={arrowIcon} alt="dropdown arrow" className="icon select-arrow" />
                        <select id='viewSelector' onChange={e => onViewChange(e.target.value)} defaultValue='timeGridWeek'>
                            <option value='dayGridMonth'>Month</option>
                            <option value='timeGridWeek'>Week</option>
                            <option value='timeGridDay'>Day</option>
                        </select>
                    </div>
                </div>
            </div>
            
        );
    }
}
 
export default Navbar;