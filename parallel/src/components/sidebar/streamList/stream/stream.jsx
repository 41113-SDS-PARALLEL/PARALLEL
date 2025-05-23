import optionsIcon from '../../../../assets/options_icon.svg';
import './stream.css';

const Stream = ({ stream, onSelectStream, onOptionsClick }) => {
    return (
        <div className='stream-list-div'>
            <input
                style={{ accentColor: stream.color }}
                className='stream-list-checkbox'
                type="checkbox"
                defaultChecked={true}
                onChange={() => onSelectStream(stream)}
                name={`stream-checkbox-${stream.id}`}
            />
            {stream.name}
            <button
                className='button stream-list-options-button'
                onClick={() => onOptionsClick(stream.id)}
                name={`stream-options-button-${stream.id}`}
            >
                <img src={optionsIcon} alt='Options' className='icon stream-list-options-icon' />
            </button>
        </div>
    );
}
 
export default Stream;