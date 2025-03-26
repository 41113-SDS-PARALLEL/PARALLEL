// import React, { Component } from 'react';

// class StreamList extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             streams: props.streams || []
//         };
//     }

//     addStream = (stream) => {
//         this.setState((prevState) => ({
//             streams: [...prevState.streams, stream]
//         }));
//     };

//     render() {
//         return (
//             <div>
//             <ul style={{ listStyleType: 'none' }}>
//                 {this.state.streams.map((stream, index) => (
//                 <li key={index}>
//                     <input type="checkbox" />
//                     {stream.name}
//                 </li>
//                 ))}
//             </ul>
//             </div>
//         );
//     }
// }

// export default StreamList;



// StreamList should be a regular class (doesn't extend Component). 
// It should have a constructor that initializes the state with an empty array of streams.
// It should have a method addStream that takes a stream as an argument and adds it to the state.
// The render method should return a list of streams with checkboxes next to them.
// The list should be styled to have no bullet points and no indent. 
// It should have a method that returns active streams (streams with a checkbox checked).