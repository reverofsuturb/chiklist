import { useDispatch, useSelector } from "react-redux";
import { fetchGroup } from "../../store/groups";
import { useEffect } from "react";
import { FaCodeCommit } from "react-icons/fa6";
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
          <div className="gdc-nameloc">
          <h2 className="gdc-name">{group.name}</h2>
          <p className="gdc-location">
            {group.city}, {group.state}
          </p>
          </div>
          <div className="gdc-description">{group.about}</div>
          {group?.Events?.length ? (
            <p className="gdc-eventcount">
              {group.Events.length}{" "}
              {group.Events.length > 1 ? "events" : "event"}{" "}
              <FaCodeCommit className="gdc-dot" />{" "}
              {group.private === true ? "Private" : "Public"}
            </p>
          ) : (
            <p className="gdc-eventcount">
              No events <FaCodeCommit className="gdc-dot" />{" "}
              {group.private === true ? "Private" : "Public"}
            </p>
          )}
        </div>
      </div>

    </div>
  );
}
