import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { fetchGroup } from "../../store/groups";
import { GroupForm } from "./GroupForm";

export function EditGroup() {
  const { user } = useSelector((state)=> state.session)
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const group = useSelector((state) => state.groups[groupId]);
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(fetchGroup(groupId));
  }, [dispatch, groupId]);
if(!group) return <></>;
if (user?.id != group.organizerId) navigate("/")
  return (
    Object.keys(group).length > 1 && (
      <>
        <GroupForm group={group} formType="Edit Group" />
      </>
    )
  );
}
