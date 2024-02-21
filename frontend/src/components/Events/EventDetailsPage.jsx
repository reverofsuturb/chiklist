import { useDispatch, useSelector } from "react-redux";
import { fetchEvent} from "../../store/events";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import OpenModalButton from "../OpenModalButton/";
import { DeleteModal } from "../DeleteModal";

export function EventDetailsPage() {
  const dispatch = useDispatch();
  const { eventId } = useParams();
  const event = useSelector((state) => state.events[eventId]);
  const type = "event";
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
      </ul>
      <OpenModalButton
        buttonText="Delete Event"
        modalComponent={<DeleteModal type={type} id={eventId} />}
      />
    </>
  );
}
