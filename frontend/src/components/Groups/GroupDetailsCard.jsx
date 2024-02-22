import { useDispatch, useSelector } from "react-redux";
import { fetchGroup } from "../../store/groups";
import { useEffect } from "react";
import "./GroupDetailsCard.css";

export function GroupDetailsCard({ group }) {
  const dispatch = useDispatch();
  // const group = useSelector((state) => state.groups[groupId]);
  const startDate = new Date(group?.startDate).toDateString();
  const startTime = new Date(group?.startDate).toLocaleTimeString();

  // useEffect(() => {
  //   dispatch(fetchGroup(groupId));
  // }, [groupId]);

  return (
    <div className="gdc-card">
      <div className="gdc-img-info">
        <div className="gdc-img-container">
          <img className="gdc-img" src={group.previewImage} />
        </div>
        <div className="gdc-info-container">
          <h2>{group?.name}</h2>
          <p style={{ color: "grey" }}>
            {group?.city} {group?.state}
          </p>
        </div>
      </div>
      <div className="gdc-description">{group?.about}</div>
    </div>
  );
}
