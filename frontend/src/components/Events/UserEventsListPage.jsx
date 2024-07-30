import { useDispatch, useSelector } from "react-redux";
import { fetchUserEvents } from "../../store/events";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { EventDetailsCard } from "./EventDetailsCard";

export function UserEventsListPage() {
  const dispatch = useDispatch();
  const eventsObj = useSelector((state) => state.events);
  const events = Object.values(eventsObj);

  console.log(events);

  useEffect(() => {
    dispatch(fetchUserEvents());
  }, [dispatch]);
  return (
    <>
      <ul>
        {events.map((event) => (
          <>
            <Link to={`/events/${event.id}`}>
              <EventDetailsCard event={event} />
            </Link>
          </>
        ))}
      </ul>
    </>
  );
}
