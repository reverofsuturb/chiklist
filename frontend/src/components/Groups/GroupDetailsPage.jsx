import { useDispatch, useSelector } from "react-redux";
import { fetchGroup } from "../../store/groups";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

export function GroupDetailsPage() {
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const group = useSelector((state) => state.groups[groupId]);

  console.log(group)
  useEffect(() => {
    dispatch(fetchGroup(groupId));
  }, [dispatch, groupId]);

  return (
    <>
      <h1>{group?.name}</h1>
      <li>{group?.city}</li>
      <li>{group?.state}</li>
      <li>{group?.numMembers}</li>
      <li>{group?.type}</li>
      <li>{group?.about}</li>
    </>
  );
}
