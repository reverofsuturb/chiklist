import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateEvent, makeEvent, makeEventImage } from "../../store/events";
import { fetchUserGroups } from "../../store/groups";
import "./EventForm.css";

export function EventForm({ event, formType }) {
  const { user } = useSelector((state) => state.session);
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  if (!user) navigate("/");
  // const { groupId } = useParams();
  // const [venueId, setVenueId] = useState(null);
  const [name, setName] = useState(event?.name ? event.name : "");
  const [type, setType] = useState(event?.type ? event.type : "");
  const [groupId, setGroupId] = useState(event?.groupId ? event.groupId : "");
  const [capacity, setCapacity] = useState(
    event?.capacity ? event.capacity : 0
  );
  const [price, setPrice] = useState(event?.price ? event.price : 0);
  const [description, setDescription] = useState(
    event?.description ? event.description : ""
  );
  const [startDate, setStartDate] = useState(
    event?.startDate ? event.startDate : ""
  );
  const [endDate, setEndDate] = useState(event?.endDate ? event.endDate : "");
  // const [privateGroup, setPrivateGroup] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [errors, setErrors] = useState({});
  const groups = useSelector((state) => state.groups);
  let groupSelect;
  if (groups) groupSelect = Object.values(groups);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (formType === "Create Event") {
      const newEvent = {
        groupId,
        venueId: null,
        name,
        type,
        capacity,
        price,
        description,
        startDate,
        endDate,
        // privateGroup,
        imageUrl,
      };

      const makeNewEvent = await dispatch(makeEvent(newEvent));
      if (makeNewEvent && makeNewEvent.errors) {
        console.log(makeNewEvent.errors);
        return setErrors(makeNewEvent.errors);
      }
      console.log(makeNewEvent);
      const preview = imageUrl ? true : false;
      const eventImage = {
        eventId: newEvent.id,
        url: imageUrl,
        preview,
      };
      dispatch(makeEventImage(eventImage));
      navigate(`/events/${makeNewEvent.id}`);
    }
    if (formType === "Edit Event") {
      const updatedEvent = {
        id: eventId,
        groupId,
        name,
        type,
        capacity,
        price,
        description,
        startDate,
        endDate,
        // privateGroup,
        imageUrl,
      };

      const editedEvent = await dispatch(updateEvent(updatedEvent));
      if (editedEvent && editedEvent.errors) {
        return setErrors(editedEvent.errors);
      }
      console.log(editedEvent);
      navigate(`/events/${event.id}`);
    }
  };

  useEffect(() => {
    dispatch(fetchUserGroups());
  }, [dispatch]);

  return (
    <div className="ef-container">
      <form className="ef-form" onSubmit={onSubmit}>
        <label className="ef-label ef-borderbottom">
          Which group would you like to make an event for?
          {groupSelect?.length && (
            <select
              className="ef-select"
              onChange={(e) => setGroupId(e.target.value)}
            >
              {groupSelect?.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          )}
        </label>
        <label className="ef-label ef-borderbottom">
          What is the name of your event?
          <input
            className="ef-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Event Name"
          />
          {errors.name && <p className="ef-errors">{errors.name}</p>}
        </label>
        {/* <label className="ef-label">
          Where is this event being hosted?
          <input
            className="ef-input"
            type="text"
            value={venueId}
            onChange={(e) => setVenueId(e.target.value)}
            placeholder="Venue"
            disabled={true}
          />
        </label> */}
        <label className="ef-label">
          Is this an in person or online event?
          <select
            className="ef-select"
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">{type ? `${type}` : "(select one)"}</option>
            <option value="In person">In person</option>
            <option value="Online">Online</option>
          </select>
          {errors.type && <p className="ef-errors">{errors.type}</p>}
        </label>
        {/* <label className="ef-label">
          Is this event private or public?
          <select
            className="ef-select"
            onChange={(e) => setPrivateGroup(e.target.value)}
          >
            <option value="">(select one)</option>
            <option value={false}>Public</option>
            <option value={true}>Private</option>
          </select>
        </label> */}
        <label className="ef-label ef-borderbottom">
          What is the price for your event?
          <input
            className="ef-input"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          {errors.price && <p className="ef-errors">{errors.price}</p>}
        </label>
        <label className="ef-label">
          What is the capacity for your event?
          <input
            className="ef-input"
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
          />
          {errors.capacity && <p className="ef-errors">{errors.capacity}</p>}
        </label>
        <label className="ef-label">
          When does your event start?
          {event?.startDate && (
            <p>Current: {new Date(event.startDate).toDateString()}</p>
          )}
          <input
            className="ef-input"
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          {errors.startDate && <p className="ef-errors">{errors.startDate}</p>}
        </label>
        <label className="ef-label ef-borderbottom">
          When does your event end?
          {event?.endDate && (
            <p>Current: {new Date(event.endDate).toDateString()}</p>
          )}
          <input
            className="ef-input"
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          {errors.endDate && <p className="ef-errors">{errors.endDate}</p>}
        </label>
        <label className="ef-label ef-borderbottom">
          Please add in image url for your event below:
          <input
            className="ef-input"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Image url"
          />
          {errors.imageUrl && <p className="ef-errors">{errors.imageUrl}</p>}
        </label>
        <label className="ef-label">
          Please describe your event
          <textarea
            className="ef-textarea"
            type="text"
            value={description}
            placeholder="Please write at least 30 characters"
            onChange={(e) => setDescription(e.target.value)}
          />
          {errors.description && (
            <p className="ef-errors">{errors.description}</p>
          )}
        </label>
        <button className="ef-button">
          {formType === "Edit Event" ? "Edit Event" : "Create Event"}
        </button>
      </form>
    </div>
  );
}
