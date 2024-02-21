import { useDispatch, useSelector } from "react-redux";
import { fetchGroup } from "../../store/groups";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import OpenModalButton from "../OpenModalButton";
import { DeleteModal } from "../DeleteModal";
import "./GroupDetailsPage.css";

export function GroupDetailsPage() {
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const group = useSelector((state) => state.groups[groupId]);
  const navigate = useNavigate();
  const type = "group";
  console.log(group);
  useEffect(() => {
    dispatch(fetchGroup(groupId));
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
      <h2>What we're about</h2>
      <p>{group?.about}</p>
      <h2>Events:</h2>
      <div>
        <Link to={`/groups/${group?.id}/events`}>Group Events</Link>
      </div>
    </div>
  );
}
