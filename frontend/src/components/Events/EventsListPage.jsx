import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../../store/events";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { EventDetailsCard } from "./EventDetailsCard";
import "./EventsListPage.css";

export function EventsListPage() {
  const dispatch = useDispatch();
  const eventsObj = useSelector((state) => state.events);
  const events = Object.values(eventsObj);

  console.log(events);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);
  return (
    <div className="el-container">
      {events.map((event) => (
        <Link key={event.id} className="el-link" to={`/events/${event.id}`}>
          <EventDetailsCard event={event} />
        </Link>
      ))}
    </div>
  );
}
