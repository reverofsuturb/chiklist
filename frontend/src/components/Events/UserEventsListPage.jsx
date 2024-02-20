import { useDispatch, useSelector } from "react-redux";
import { fetchUserEvents } from "../../store/events";
import { useEffect } from "react";
import { Link } from "react-router-dom";

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
              <h1>{event.name}</h1>
            </Link>
            <li>{event.type}</li>
            <li>{event.startDate}</li>
            <li>{event.endDate}</li>
          </>
        ))}
      </ul>
    </>
  );
}
