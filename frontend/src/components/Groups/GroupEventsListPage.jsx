import { useDispatch, useSelector } from "react-redux";
import { fetchGroupEvents } from "../../store/groups";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
export function GroupEventsListPage() {
  const dispatch = useDispatch();
  const { groupId } = useParams();
  const eventsObj = useSelector((state) => state.groups);
  const groupEvents = Object.values(eventsObj);

  console.log(groupEvents);

  useEffect(() => {
    dispatch(fetchGroupEvents(groupId));
  }, [dispatch, groupId]);
  return (
    <>
      <ul>
        {groupEvents.map((event) => (
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
