import { useDispatch, useSelector } from "react-redux";
import { fetchEvent } from "../../store/events";
import { useEffect } from "react";
import { FaCodeCommit } from "react-icons/fa6";
import "./EventDetailsCard.css";

export function EventDetailsCard({ event }) {
  const dispatch = useDispatch();
  // const event = useSelector((state) => state.events[eventId]);
  const startDate = new Date(event?.startDate).toDateString();
  const startTime = new Date(event?.startDate).toLocaleTimeString();

  // useEffect(() => {
  //   dispatch(fetchEvent(eventId));
  // }, [eventId]);

  return (
    // <Link className="edc-link" to={`/events/${event?.id}`}>
    <div className="edc-card">
      <div className="edc-img-info">
        <div className="edc-img-container">
          <img className="edc-img" src={event.previewImage} />
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
    // </Link>
  );
}
