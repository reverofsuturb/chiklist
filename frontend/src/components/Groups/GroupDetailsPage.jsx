import { useDispatch, useSelector } from "react-redux";
import { fetchGroup } from "../../store/groups";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import OpenModalButton from "../OpenModalButton";
import { DeleteModal } from "../DeleteModal";

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
    <>
      <ul>
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
        <li>
          <Link to={`/groups/${group?.id}/edit`}>Edit Group</Link>
        </li>
      </ul>
      <OpenModalButton
        buttonText="Delete Group"
        modalComponent={<DeleteModal type={type} id={groupId} />}
      />
    </>
  );
}
