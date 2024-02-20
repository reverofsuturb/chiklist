import { useDispatch, useSelector } from "react-redux";
import { fetchGroup, removeGroup } from "../../store/groups";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export function GroupDetailsPage() {
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const group = useSelector((state) => state.groups[groupId]);
  const navigate = useNavigate();

  console.log(group);
  useEffect(() => {
    dispatch(fetchGroup(groupId));
  }, [dispatch, groupId]);

  return (
    <>
      <h1>Name: {group?.name}</h1>
      <li>City: {group?.city}</li>
      <li>State: {group?.state}</li>
      <li>Number of Members: {group?.numMembers}</li>
      <li>Type: {group?.type}</li>
      <li>About: {group?.about}</li>
      <li>
        <Link to={`/groups/${group?.id}/events`}>Group Events</Link>
      </li>
      <li>
        <Link to={`/groups/${group?.id}/events/new`}>Create an Event</Link>
      </li>
      <button
        onClick={() => {
          dispatch(removeGroup(groupId));
          navigate("/groups");
        }}
      >
        Delete Group
      </button>
    </>
  );
}
