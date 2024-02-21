import { useDispatch, useSelector } from "react-redux";
import { fetchEvent } from "../../store/events";
import { useEffect } from "react";
import "./EventDetailsCard.css";

export function EventDetailsCard({ eventId }) {
  const dispatch = useDispatch();
  const event = useSelector((state) => state.events[eventId]);
  const startDate = new Date(event?.startDate).toDateString();
  const startTime = new Date(event?.startDate).toLocaleTimeString();

  useEffect(() => {
    dispatch(fetchEvent(eventId));
  }, [eventId]);

  return (
    // <Link className="edc-link" to={`/events/${event?.id}`}>
      <div className="edc-card">
        <div className="edc-img-info">
          <div className="edc-img-container">
            <img
              className="edc-img"
              src={event?.EventImages && `${event?.EventImages.url}`}
            />
          </div>
          <div className="edc-info-container">
            <p>
              {startDate} {startTime}
            </p>
            <h2>{event?.name}</h2>
            <p style={{ color: "grey" }}>
              {event?.Venue.city} {event?.Venue.state}
            </p>
          </div>
        </div>
        <div className="edc-description">{event?.description}</div>
      </div>
    // </Link>
  );
}
