import optionsIcon from "../../../../assets/options_icon.svg";
import "./stream.css";

const Stream = ({
  stream,
  onSelectStream,
  onOptionsClick,
  editingStreamTimes,
  erasingStreamTimes,
  selectedEditingStream,
}) => {
  return (
    <div className="stream-list-div">
      {editingStreamTimes ? (
        <input
          style={{ accentColor: stream.color }}
          className="stream-list-input"
          type="radio"
          onChange={() => onSelectStream(stream)}
          name={`stream-radio-${stream.id}`}
          checked={stream.id === selectedEditingStream && !erasingStreamTimes}
        />
      ) : (
        <input
          style={{ accentColor: stream.color }}
          className="stream-list-input"
          type="checkbox"
          onChange={() => onSelectStream(stream)}
          name={`stream-checkbox-${stream.id}`}
          checked={stream.selected}
        />
      )}

      {stream.name}
      <button
        className="button stream-list-options-button"
        onClick={() => onOptionsClick(stream.id)}
        name={`stream-options-button-${stream.id}`}
      >
        <img
          src={optionsIcon}
          alt="Options"
          className="icon stream-list-options-icon"
        />
      </button>
    </div>
  );
};

export default Stream;
