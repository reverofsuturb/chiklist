import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { removeEvent } from "../../store/events";
import { removeGroup } from "../../store/groups";
import { useNavigate } from "react-router-dom";
import "./DeleteModal.css";

export function DeleteModal({ type, id }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { closeModal } = useModal();
  console.log(type);
  return (
    <div className="delete-modal">
      {type === "event" && (
        <div className="delete-modal">
          <h2 className="delete-h2">Confirm Delete</h2>
          <p>Are you sure you want to remove this event?</p>
          <button
            className="delete-button-yes"
            onClick={() => {
              dispatch(removeEvent(id));
              navigate("/events");
              closeModal();
            }}
          >
            Yes(Delete Event)
          </button>
          <button className="delete-button-no" onClick={() => closeModal()}>
            No, (Keep Event)
          </button>
        </div>
      )}
      {type === "group" && (
        <div>
          <h2 className="delete-h2">Confirm Delete</h2>
          <p>Are you sure you want to remove this group?</p>
          <button
            className="delete-button-yes"
            onClick={() => {
              dispatch(removeGroup(id));
              navigate("/groups");
              closeModal();
            }}
          >
            Yes(Delete Group)
          </button>
          <button className="delete-button-no" onClick={() => closeModal()}>
            No, (Keep Group)
          </button>
        </div>
      )}
    </div>
  );
}
