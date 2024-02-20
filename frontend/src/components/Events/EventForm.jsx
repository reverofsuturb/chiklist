import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeEvent, makeEventImage } from "../../store/events";
import { fetchGroup } from "../../store/groups";

export function EventForm() {
  const dispatch = useDispatch();
  const { groupId } = useParams();
  const [venueId, setVenueId] = useState(1);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [privateGroup, setPrivateGroup] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const group = useSelector((state) => state.groups[groupId]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const event = {
      groupId,
      venueId,
      name,
      type,
      capacity,
      price,
      description,
      startDate,
      endDate,
      privateGroup,
    };
    const newEvent = await dispatch(makeEvent(event));
    console.log(newEvent);
    const preview = imageUrl ? true : false;
    const eventImage = {
      eventId: newEvent.id,
      url: imageUrl,
      preview,
    };
    console.log(eventImage);
    dispatch(makeEventImage(eventImage));
  };

  useEffect(() => {
    dispatch(fetchGroup(groupId));
  }, [dispatch, groupId]);

  return (
    <>
      <form onSubmit={onSubmit}>
        <h2>Create an event for {group?.name}</h2>
        <label>
          What is the name of your event?
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Event Name"
          />
        </label>
        <label>
          Where is this event being hosted?
          <input
            type="text"
            value={venueId}
            onChange={(e) => setVenueId(e.target.value)}
            placeholder="Venue"
            disabled={true}
          />
        </label>
        <label>
          Is this an in person or online event?
          <select onChange={(e) => setType(e.target.value)}>
            <option value="In person">In person</option>
            <option value="Online">Online</option>
          </select>
        </label>
        <label>
          Is this event private or public?
          <select onChange={(e) => setPrivateGroup(e.target.value)}>
            <option value={false}>Public</option>
            <option value={true}>Private</option>
          </select>
        </label>
        <label>
          What is the price for your event?
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </label>
        <label>
          What is the capacity for your event?
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
          />
        </label>
        <label>
          When does your event start?
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="MM/DD/YYYY HH:mm:AM"
          />
        </label>
        <label>
          When does your event end?
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="MM/DD/YYYY HH:mm:PM"
          />
        </label>
        <label>
          Please describe your event
          <textarea
            type="text"
            value={description}
            placeholder="Please write at least 30 characters"
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label>
          Please add in image url for your event below:
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </label>
        <button>Create Event</button>
      </form>
    </>
  );
}
