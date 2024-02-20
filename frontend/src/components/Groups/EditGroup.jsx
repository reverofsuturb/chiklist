import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { fetchGroup } from "../../store/groups";
import { GroupForm } from "./GroupForm";

export function EditGroup() {
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const group = useSelector((state) => state.groups[groupId]);

  useEffect(() => {
    dispatch(fetchGroup(groupId));
  }, [dispatch, groupId]);
if(!group) return <></>;
  return (
    Object.keys(group).length > 1 && (
      <>
        <GroupForm group={group} formType="Edit Group" />
      </>
    )
  );
}
