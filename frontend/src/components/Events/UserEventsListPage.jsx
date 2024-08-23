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
      <div className="uel-header">
        <h2>Manage Events</h2>
      </div>
      <div className="uel-container">
        {events.map((event) => (
          <Link key={event.id} className="uel-link" to={`/events/${event.id}`}>
            <EventDetailsCard event={event} />
          </Link>
        ))}
      </div>
    </>
  );
}
