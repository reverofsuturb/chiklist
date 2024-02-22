import { useState } from "react";
import { Link } from "react-router-dom";
import "./DisplayLists.css";

export function DisplayLists() {
  const [message, setMessage] = useState("");
  return (
    <div className="dl-container">
      <div className="dl-link-container">
        <Link
          className="dl-link"
          to="/events"
          onClick={() => setMessage("events")}
        >
          Events
        </Link>
        <Link
          className="dl-link"
          to="/groups"
          onClick={() => setMessage("groups")}
        >
          Groups
        </Link>
      </div>
      <div>
        {message === "events" && <p>Events in Meetup</p>}
        {message === "groups" && <p>Groups in Meetup</p>}
      </div>
    </div>
  );
}
