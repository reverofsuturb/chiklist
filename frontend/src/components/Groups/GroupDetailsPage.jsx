import { useDispatch, useSelector } from "react-redux";
import { fetchGroup, fetchGroupEvents } from "../../store/groups";
import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { FaAnglesLeft } from "react-icons/fa6";
import { FaCodeCommit } from "react-icons/fa6";
import OpenModalButton from "../OpenModalButton";
import { DeleteModal } from "../DeleteModal";
import { EventDetailsCard } from "../Events/EventDetailsCard";
import "./GroupDetailsPage.css";

export function GroupDetailsPage() {
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.session);
  const group = useSelector((state) => state.groups[groupId]);
  const groupEvents = useSelector((state) => state.groups.events);
  const css = "omb-delete-button";
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
  const sortedFuture = groupEventsFuture.sort((a, b) => {
    return new Date(b.startDate) - new Date(a.startDate);
  });

  const sortedPast = groupEventsPast.sort((a, b) => {
    return new Date(b.startDate) - new Date(a.startDate);
  });
  const type = "group";

  useEffect(() => {
    dispatch(fetchGroup(groupId));
    dispatch(fetchGroupEvents(groupId));
  }, [dispatch, groupId]);

  return (
    <div className="gd-container">
      <div className="gd-banner">
        <div className="gd-img-container">
          <Link className="gd-link" to="/groups">
            <div className="gd-link-text">
              <FaAnglesLeft className="gd-link-icon" /> Groups
            </div>
          </Link>
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
              <Link
                className="gd-button-link"
                to={`/groups/${group?.id}/events/new`}
              >
                <button className="gd-button "> Create an Event </button>
              </Link>

              <Link className="gd-button-link" to={`/groups/${group?.id}/edit`}>
                <button className="gd-button">Edit Group </button>
              </Link>

              <OpenModalButton
                buttonText="Delete Group"
                modalComponent={<DeleteModal type={type} id={groupId} />}
                css={css}
              />
            </div>
          )}
          {user?.id != group?.organizerId && user !== null ? (
            <div className="gd-buttons">
              <button
                className="gd-join-button"
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
      <div className="gd-splash">
        <h2 className="gd-organizer">Organizer</h2>
        <p className="gd-orgname">
          {group?.Organizer && group?.Organizer.firstName}{" "}
          {group?.Organizer && group?.Organizer.lastName}
        </p>
        <h2 className="gd-about-title">What we&apos;re about</h2>
        <p className="gd-about">{group?.about}</p>
        <div className="gd-events-container">
          <h2 className="gd-events">
            Events ({groupEventsArr.length}){" "}
            <FaCodeCommit className="gd-icon" /> {group?.type}
          </h2>
          <h3 className="gd-upcoming">Upcoming Events:</h3>
          {sortedFuture.length ? (
            sortedFuture.map((event) => (
              <Link
                key={event.id}
                className="gd-link"
                to={`/events/${event.id}`}
              >
                <EventDetailsCard event={event} />
              </Link>
            ))
          ) : (
            <h2 className="gd-no-events">No Upcoming Events</h2>
          )}
          <h3 className="gd-past">Past Events:</h3>
          {sortedPast.length ? (
            sortedPast.map((event) => (
              <Link
                key={event.id}
                className="gd-link"
                to={`/events/${event.id}`}
              >
                <EventDetailsCard event={event} />
              </Link>
            ))
          ) : (
            <h2 className="gd-no-events">No Past Events</h2>
          )}
        </div>
      </div>
    </div>
  );
}
