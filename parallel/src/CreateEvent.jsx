import Modal from 'react-modal';
import React from 'react';
import './CreateEvent.css';

const customStyles = {
    content: {
      top: '5%',
      // left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      // transform: 'translate(-5%, -50%)',
    },
  };

export function CreateEvent({calendarRef, eventRef, streamRef, onClose}) {
  // Modal Code
  // const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal(dateInfo) {
    if (dateInfo != null) {
      setInputs(values => ({...values, ['title']: new Date(dateInfo.start.toString().split('GMT')[0]+' UTC').toISOString().split('.')[0]}))
      setInputs(values => ({...values, ['startDate']: new Date(dateInfo.start.toString().split('GMT')[0]+' UTC').toISOString().split('.')[0]}))
      setInputs(values => ({...values, ['endDate']: new Date(dateInfo.end.toString().split('GMT')[0]+' UTC').toISOString().split('.')[0]}))
      setInputs(values => ({...values, ['allDay']: dateInfo.allDay}))
    }
    if (inputs['allDay'] == undefined) inputs['allDay'] = false;
    // setIsOpen(true);
  }
  React.useImperativeHandle(eventRef, () => ({
    openModal: openModal
  }));

  // function closeModal() {
  //   setIsOpen(false);
  // }

  // Form Code
  const [inputs, setInputs] = React.useState({});

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({...values, [name]: value}))
  }

  const handleBoolChange = (event) => {
    const name = event.target.name;
    const value = !(inputs[name]);
    setInputs(values => ({...values, [name]: value}))
  }

  const handleSubmit = (event) => {
    if (inputs['allDay'] == undefined) inputs['allDay'] = false;
    event.preventDefault();
    calendarRef.current.getApi().addEvent({
        title: inputs['title'],
        start: inputs['startDate'],
        end: inputs['endDate'],
        allDay: inputs['allDay'], 
        extendedProps: { stream: parseInt(inputs['stream']) }
      });
    console.log(inputs)
  }

  return (
        // <div className='popup-background'>
            <div className='event-panel'>
                <div className='event-panel-title'>
                    Create Event
                </div>
                <div className='delete-panel-options'>
                  <form onSubmit={handleSubmit}>
                    <label>Title:
                      <input id='event-title' type="text" name="title" value={inputs.title || ""} 
                        onChange={handleChange}
                      />
                      </label>
                      <label>Start Date:
                      <input id='event-start-date' type="datetime-local" name="startDate" value={inputs.startDate || ""} 
                        onChange={handleChange}
                      />
                      </label>
                      <label>End Date:
                      <input id='event-end-date' type="datetime-local" name="endDate" value={inputs.endDate || ""} 
                        onChange={handleChange}
                      />
                      </label>
                      <label>All Day:
                      <input id='event-all-day' type="checkbox" name="allDay" value={inputs['allDay']} checked={inputs['allDay']}
                        onChange={handleBoolChange}
                      />
                      </label>
                      <input id='submit' type="submit" />
                  </form>
                </div>
                <div className='event-panel-actions'>
                    <button
                        className='cancel-button'
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        // </div>
  );
  
  // return (
  //   <div>
  //     <Modal
  //       isOpen={modalIsOpen}
  //       style={customStyles}
  //       onRequestClose={closeModal}
  //       ariaHideApp={false}
  //     >
  //       <form onSubmit={handleSubmit}>
  //       <label>Title:
  //         <input type="text" name="title" value={inputs.title || ""} 
  //           onChange={handleChange}
  //         />
  //         </label>
  //         <label>Start Date:
  //         <input type="datetime-local" name="startDate" value={inputs.startDate || ""} 
  //           onChange={handleChange}
  //         />
  //         </label>
  //         <label>End Date:
  //         <input type="datetime-local" name="endDate" value={inputs.endDate || ""} 
  //           onChange={handleChange}
  //         />
  //         </label>
  //         <label>All Day:
  //         <input type="checkbox" name="allDay" value={inputs['allDay']} checked={inputs['allDay']}
  //           onChange={handleBoolChange}
  //         />
  //         </label>
  //         <label>Stream:
  //           <select name="stream" onChange={handleChange}>
  //             {streamRef.getStreams().map((stream) => <option value={stream.getID() || ""}>{stream.getName()}</option>)}
  //           </select>
  //         </label>
  //         <input type="submit" />
  //       </form>
  //     </Modal>
  //     </div>
  // )
}
export default CreateEvent;