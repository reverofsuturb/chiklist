import { useDispatch, useSelector } from "react-redux";
import { fetchGroups } from "../../store/groups";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export function GroupsListPage() {
  const dispatch = useDispatch();
  const groupsObj = useSelector((state) => state.groups);
  const groups = Object.values(groupsObj);

  console.log(groups);
  useEffect(() => {
    dispatch(fetchGroups());
  }, [dispatch]);

  return (
    <>
      <ul>
        {groups.map((group) => (
          <>
            <Link to={`/groups/${group.id}`}>
              <h1>{group.name}</h1>
            </Link>
            <li>{group.city}</li>
            <li>{group.state}</li>
            <li>{group.numMembers}</li>
            <li>{group.type}</li>
            <li>{group.about}</li>
          </>
        ))}
      </ul>
    </>
  );
}
