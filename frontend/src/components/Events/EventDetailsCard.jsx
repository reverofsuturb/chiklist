import { FaCodeCommit } from "react-icons/fa6";
import "./EventDetailsCard.css";

export function EventDetailsCard({ event }) {
  const startDate = new Date(event?.startDate).toDateString();
  const startTime = new Date(event?.startDate).toLocaleTimeString();
  const image = event?.EventImages[0]?.url
  return (
    <div className="edc-card">
      <div className="edc-img-info">
        <div className="edc-img-container">
          <img className="edc-img" src={image} />
        </div>
        <div className="edc-info-container">
          <p className="edc-time">
            {startDate} <FaCodeCommit className="edc-dot" /> {startTime}
          </p>
          <h2 className="edc-name">{event?.name}</h2>
          <p className="edc-location">
            {event?.Venue?.city || "Kentucky"}, {event?.Venue?.state || "Saska"}
          </p>
          <div className="edc-description">{event.description}</div>
        </div>
      </div>
    </div>
  );
}
