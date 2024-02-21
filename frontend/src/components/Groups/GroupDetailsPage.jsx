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
  const group = useSelector((state) => state.groups[groupId]);
  const groupEvents = useSelector((state) => state.groups);
  const groupEventsArr = Object.values(groupEvents);
  let groupEventIds = []
  groupEventsArr.forEach((event) => groupEventIds.push(group.id))
  console.log(groupEventIds)
  const type = "group";
  console.log(group);
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
            <p>
              Organized by {group?.Organizer && group?.Organizer.firstName}
              {group?.Organizer && group?.Organizer.lastName}
            </p>
          </div>
          <div className="gd-buttons">
            <button>
              <Link to={`/groups/${group?.id}/events/new`}>
                Create an Event
              </Link>
            </button>
            <button>
              <Link to={`/groups/${group?.id}/edit`}>Edit Group</Link>
            </button>
            <OpenModalButton
              buttonText="Delete Group"
              modalComponent={<DeleteModal type={type} id={groupId} />}
            />
          </div>
        </div>
      </div>

      <h2>Organizer</h2>
      <p>
        {group?.Organizer && group?.Organizer.firstName}{" "}
        {group?.Organizer && group?.Organizer.lastName}
      </p>
      <h2>What we&apos;re about</h2>
      <p>{group?.about}</p>
      <h2>Events:</h2>
      <div className="gd-events-container">
        {/* <GroupEventsListPage groupId={group?.id} /> */}
      </div>
    </div>
  );
}
