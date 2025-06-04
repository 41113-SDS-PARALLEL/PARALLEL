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
    <div className="stream-list-item">
      {editingStreamTimes ? (
        <div
          className="stream-list-radio-border"
          style={{
            background: `${stream.color}`,
          }}
        >
          <input
            style={{
              accentColor: stream.color,
            }}
            className="stream-list-input stream-list-radio"
            type="radio"
            onChange={() => onSelectStream(stream)}
            name={`stream-radio-${stream.id}`}
            checked={stream.id === selectedEditingStream && !erasingStreamTimes}
          />
        </div>
      ) : (
        <input
          style={{ accentColor: stream.color }}
          className="stream-list-input stream-list-checkbox"
          type="checkbox"
          onChange={() => onSelectStream(stream)}
          name={`stream-checkbox-${stream.id}`}
          checked={stream.selected}
        />
      )}

      <div className="stream-name">{stream.name}</div>
      <button
        className="clickable home-page-clickable round-button stream-list-options-button"
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
