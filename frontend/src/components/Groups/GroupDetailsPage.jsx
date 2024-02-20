import { useDispatch, useSelector } from "react-redux";
import { fetchGroup } from "../../store/groups";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

export function GroupDetailsPage() {
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const group = useSelector((state) => state.groups[groupId]);

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
      <Link to={`/groups/${group.id}/events`}>Group Events</Link>
    </>
  );
}
