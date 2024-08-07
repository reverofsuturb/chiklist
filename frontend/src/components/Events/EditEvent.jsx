import { EventForm } from "./EventForm";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvent } from "../../store/events";

export const EditEvent = () => {
  const { eventId } = useParams();
  const dispatch = useDispatch();

  const event = useSelector((state) => state.events[eventId]);

  useEffect(() => {
    dispatch(fetchEvent(eventId));
  }, [dispatch]);
  return <EventForm formType="Edit Event" event={event} />;
};
