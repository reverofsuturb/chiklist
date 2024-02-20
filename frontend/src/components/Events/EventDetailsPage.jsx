import { useDispatch, useSelector } from "react-redux";
import { fetchEvent, removeEvent } from "../../store/events";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export function EventDetailsPage() {
  const dispatch = useDispatch();
  const { eventId } = useParams();
  const navigate = useNavigate();
  const event = useSelector((state) => state.events[eventId]);
  useEffect(() => {
    dispatch(fetchEvent(eventId));
  }, [dispatch, eventId]);
  return (
    <>
      <h1>{event?.name}</h1>
      <ul>
        <li>Group ID: {event?.groupId}</li>
        <li>Venue ID:{event?.venueId}</li>
        <li>Description: {event?.description}</li>
        <li>Type: {event?.type}</li>
        <li>Capacity: {event?.capacity}</li>
        <li>Price: ${event?.price}</li>
        <li>Start Date: {event?.startDate}</li>
        <li>End Date: {event?.endDate}</li>
        <button
          onClick={() => {
            dispatch(removeEvent(eventId));
            navigate("/events");
          }}
        >
          Delete an Event
        </button>
      </ul>
    </>
  );
}
