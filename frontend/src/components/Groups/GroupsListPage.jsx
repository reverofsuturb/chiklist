import { useDispatch, useSelector } from "react-redux";
import { fetchGroups } from "../../store/groups";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { GroupDetailsCard } from "./GroupDetailsCard";
import "./GroupsListPage.css";

export function GroupsListPage() {
  const dispatch = useDispatch();
  const groupsObj = useSelector((state) => state.groups);
  const groups = Object.values(groupsObj);

  console.log(groups);
  useEffect(() => {
    dispatch(fetchGroups());
  }, [dispatch]);

  return (
    <div className="gl-container">
      {groups?.map((group) => (
        <Link key={group.id} className="gl-link" to={`/groups/${group.id}`}>
          <GroupDetailsCard group={group} />
        </Link>
      ))}
    </div>
  );
}
