import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeEvent, makeEventImage } from "../../store/events";
import { fetchGroup } from "../../store/groups";
import "./EventForm.css";

export function EventForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { groupId } = useParams();
  // const [venueId, setVenueId] = useState(null);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // const [privateGroup, setPrivateGroup] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [errors, setErrors] = useState({});
  const group = useSelector((state) => state.groups[groupId]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const event = {
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

    const newEvent = await dispatch(makeEvent(event));
    if (newEvent && newEvent.errors) {
      console.log(newEvent.errors);
      return setErrors(newEvent.errors);
    }
    console.log(newEvent);
    const preview = imageUrl ? true : false;
    const eventImage = {
      eventId: newEvent.id,
      url: imageUrl,
      preview,
    };
    console.log(eventImage);
    dispatch(makeEventImage(eventImage));
    navigate(`/events/${newEvent.id}`);
  };

  useEffect(() => {
    dispatch(fetchGroup(groupId));
  }, [dispatch, groupId]);

  return (
    <div className="ef-container">
      <form className="ef-form" onSubmit={onSubmit}>
        <h2>Create an event for {group?.name}</h2>
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
            <option value="">(select one)</option>
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
          <input
            className="ef-input"
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="MM/DD/YYYY HH:mm:AM"
          />
          {errors.startDate && <p className="ef-errors">{errors.startDate}</p>}
        </label>
        <label className="ef-label ef-borderbottom">
          When does your event end?
          <input
            className="ef-input"
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="MM/DD/YYYY HH:mm:PM"
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
        <button className="ef-button">Create Event</button>
      </form>
    </div>
  );
}
