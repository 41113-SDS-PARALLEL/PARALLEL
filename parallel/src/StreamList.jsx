// import React, { Component } from 'react';
// import './StreamList.css';

// class StreamList extends Component {
//     constructor(props) {
//         super(props);
//         this.streamManager = props.streamManager;
//     }

//     toggleStreamSelection (stream) {
//         if (this.streamManager.streamIsSelected(stream)) {
//             this.streamManager.deselectStream(stream);
//         } else {
//             this.streamManager.selectStream(stream);
//         }
//     };

//     render() {
//         return (
//             <div>
//             <ul>
//                 {this.streamManager.getStreams().map((stream, index) => (
//                 <li key={index}>
//                     <input
//                     type="checkbox"
//                     defaultChecked={true}
//                     onChange={() => this.toggleStreamSelection(stream)}
//                     />
//                     {stream.getName()}
//                 </li>
//                 ))}
//             </ul>
//             </div>
//         );
//     }
// }

// export default StreamList;

import React, { Component } from 'react';
import './StreamList.css';

export function StreamList ({ streamManager }) {
    function toggleStreamSelection(stream) {
        if (streamManager.streamIsSelected(stream)) {
            streamManager.deselectStream(stream);
        } else {
            streamManager.selectStream(stream);
        }
    };

    return (
        <div>
            <ul className='stream-list'>
                {streamManager.getStreams().map((stream, index) => (
                    <li key={index} className='stream-list-item'>
                        <input
                            style={{ accentColor: stream.getColor() }}
                            className='stream-list-checkbox'
                            type="checkbox"
                            defaultChecked={true}
                            onChange={() => toggleStreamSelection(stream)}
                        />
                        {stream.getName()}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default StreamList;