import { useDispatch, useSelector } from "react-redux";
import { fetchGroup, fetchGroupEvents } from "../../store/groups";
import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import OpenModalButton from "../OpenModalButton";
import { DeleteModal } from "../DeleteModal";
import { EventDetailsCard } from "../Events/EventDetailsCard";
import "./GroupDetailsPage.css";

export function GroupDetailsPage() {
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.session);
  const css = "omb-detail-button";
  const group = useSelector((state) => state.groups[groupId]);
  const groupEvents = useSelector((state) => state.groups.events);
  let groupEventsArr = [];
  let groupEventsFuture = [];
  let groupEventsPast = [];
  const newDate = new Date();
  if (groupEvents) {
    groupEventsArr = Object.values(groupEvents);

    groupEventsArr.forEach((event) =>
      new Date(event.startDate) > newDate
        ? groupEventsFuture.push(event)
        : groupEventsPast.push(event)
    );
  }

  const type = "group";
  console.log(group);
  console.log(groupEventsFuture);
  console.log(groupEventsPast);
  useEffect(() => {
    dispatch(fetchGroup(groupId));
    dispatch(fetchGroupEvents(groupId));
  }, [dispatch, groupId]);

  return (
    <div className="gd-container">
      <div className="gd-banner">
        <div className="gd-img-container">
          <Link to="/groups">Groups</Link>
          <img
            className="gd-img"
            src={group?.GroupImages && `${group?.GroupImages[0].url}`}
            alt=""
          />
        </div>

        <div className="gd-info-container">
          <div className="gd-info">
            <h2>{group?.name}</h2>
            <p>
              {group?.city} {group?.state}
            </p>
            <label>
              Organized by: {group?.Organizer && group?.Organizer.firstName}{" "}
              {group?.Organizer && group?.Organizer.lastName}
            </label>
            <p>{group?.type}</p>
          </div>
          {user?.id == group?.organizerId && (
            <div className="gd-buttons">
              <Link className="gd-link" to={`/groups/${group?.id}/events/new`}>
                <button className="gd-button "> Create an Event </button>
              </Link>

              <Link className="gd-link" to={`/groups/${group?.id}/edit`}>
                <button className="gd-button">Edit Group </button>
              </Link>

              <OpenModalButton
                buttonText="Delete Group"
                modalComponent={<DeleteModal type={type} id={groupId}  />}
                css={css}
              />
            </div>
          )}
          {user?.id != group?.organizerId && user !== null ? (
            <div className="gd-buttons">
              <button
                className="gd-join"
                onClick={() => alert("Feature coming soon")}
              >
                Join This Group
              </button>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>

      <h2>Organizer</h2>
      <p>
        {group?.Organizer && group?.Organizer.firstName}{" "}
        {group?.Organizer && group?.Organizer.lastName}
      </p>
      <h2>What we&apos;re about</h2>
      <p>{group?.about}</p>
      <div className="gd-events-container">
        <h2>Events ({groupEventsArr.length})</h2>
        <h3>Upcoming Events:</h3>
        {groupEventsFuture.length ? (
          groupEventsFuture.map((event) => (
            <Link className="gd-link" to={`/events/${event.id}`}>
              <EventDetailsCard event={event} />
            </Link>
          ))
        ) : (
          <h2>No Upcoming Events</h2>
        )}
        <h3>Past Events:</h3>
        {groupEventsPast.length ? (
          groupEventsPast.map((event) => (
            <Link className="gd-link" to={`/events/${event.id}`}>
              <EventDetailsCard event={event} />
            </Link>
          ))
        ) : (
          <h2>No Past Events</h2>
        )}
      </div>
    </div>
  );
}
