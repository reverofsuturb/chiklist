import { useDispatch, useSelector } from "react-redux";
import { fetchEvent } from "../../store/events";
import { fetchGroup } from "../../store/groups";
import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";

export function EventDetailsCard({ eventId }) {
  const event = useSelector((state) => state.events[eventId]);

  const startDate = new Date(event?.startDate).toDateString();
  const startTime = new Date(event?.startDate).toLocaleTimeString();

  useEffect(() => {
    dispatch(fetchEvent(eventId));
  }, [eventId]);

  return (
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
          <p style={{color: "grey"}}>{event?.Venue.city} {event?.Venue.state}</p>
        </div>
      </div>
    </div>
  );
}
