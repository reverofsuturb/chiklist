import { useDispatch, useSelector } from "react-redux";
import { fetchUserGroups } from "../../store/groups";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { GroupDetailsCard } from "./GroupDetailsCard";

export function UserGroupsListPage() {
  const dispatch = useDispatch();
  const groupsObj = useSelector((state) => state.groups);
  const groups = Object.values(groupsObj);

  console.log(groups);
  useEffect(() => {
    dispatch(fetchUserGroups());
  }, [dispatch]);

  return (
    <div className="ugl-container">
      {groups?.map((group) => (
        <Link className="ugl-link" to={`/groups/${group.id}`}>
          <GroupDetailsCard group={group} />
        </Link>
      ))}
    </div>
  );
}
