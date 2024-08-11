import { useDispatch, useSelector } from "react-redux";
import { fetchEvent } from "../../store/events";
import { fetchGroup } from "../../store/groups";
import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import OpenModalButton from "../OpenModalButton/";
import { DeleteModal } from "../DeleteModal";
import { FaRegClock } from "react-icons/fa6";
import { FaCodeCommit } from "react-icons/fa6";
import { FaSackDollar } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import { FaAnglesLeft } from "react-icons/fa6";

import "./EventDetailsPage.css";

export function EventDetailsPage() {
  const dispatch = useDispatch();
  const { eventId } = useParams();
  const { user } = useSelector((state) => state.session);
  const event = useSelector((state) => state.events[eventId]);
  const group = useSelector((state) => state.groups[event?.groupId]);
  const startDate = new Date(event?.startDate).toDateString();
  const startTime = new Date(event?.startDate).toLocaleTimeString();
  const endDate = new Date(event?.endDate).toDateString();
  const endTime = new Date(event?.endDate).toLocaleTimeString();
  const type = "event";
  const css = "omb-delete-button";
  useEffect(() => {
    dispatch(fetchEvent(eventId));
    dispatch(fetchGroup(event?.groupId));
  }, [dispatch, eventId, event?.groupId]);

  return (
    <div className="ed-container">
      <Link className="ed-link" to="/events">
        <div className="ed-link-text">
          <FaAnglesLeft className="ed-link-icon" />
          Events
        </div>
      </Link>

      <h2 className="ed-name">{event?.name}</h2>
      <p className="ed-host">
        Hosted by: {group?.Organizer && group?.Organizer.firstName}{" "}
        {group?.Organizer && group?.Organizer.lastName}
      </p>
      <div className="ed-banner">
        <div className="ed-img-container">
          <img
            className="ed-img"
            src={event?.EventImages && `${event?.EventImages.url}`}
            alt=""
          />
        </div>

        <div className="ed-info-container">
          <Link className="ed-link" to={`/groups/${event?.groupId}`}>
            <div className="ed-group-info">
              {group?.GroupImages && (
                <img className="ed-group-img" src={group?.GroupImages[0].url} />
              )}
              <div className="ed-group-nametype">
                <p className="ed-group-name">{group?.name}</p>
                <p className="ed-group-type">{group?.type}</p>
              </div>
            </div>
          </Link>
          <div className="ed-event-info">
            <div className="ed-datetime">
              <FaRegClock className="ed-clock" />
              <p>
                Start: {startDate} <FaCodeCommit className="ed-dot" />
                {startTime}
                <br />
                End: {endDate} <FaCodeCommit className="ed-dot" /> {endTime}
              </p>
            </div>
            <div className="ed-price">
              <FaSackDollar className="ed-moneyicon" />
              {event?.price && event?.price > 0 ? `$${event?.price}` : "FREE"}
            </div>
            <div className="ed-type">
              <FaLocationDot className="ed-locdot" />
              {event?.type}
            </div>
          </div>
          {user?.id == group?.organizerId && (
            <div className="ed-buttons">
              {/* <Link className="ed-link" to={`/events/${event?.id}/edit`}> */}
                <button
                  className="ed-updatebutton"
                  onClick={() => alert("Feature coming soon")}
                >
                  Update Event
                </button>
              {/* </Link> */}
              <OpenModalButton
                css={css}
                buttonText="Delete Event"
                modalComponent={<DeleteModal type={type} id={eventId} />}
              />
            </div>
          )}
        </div>
      </div>
      <h2 className="ed-description">Description</h2>
      <p className="ed-description-text">{event?.description}</p>
    </div>
  );
}
