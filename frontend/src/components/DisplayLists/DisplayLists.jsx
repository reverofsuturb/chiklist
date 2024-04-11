import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./DisplayLists.css";

export function DisplayLists() {
  const [message, setMessage] = useState("");
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/events") setMessage("events");
    if (location.pathname === "/groups") setMessage("groups");
  }, [location]);
  return (
    <div className="dl-container">
      <div className="dl-link-container">
        <Link
          className={
            message === "events" ? "dl-link-e dl-link" : "dl-link dl-link-f"
          }
          to="/events"
        >
          Events
        </Link>
        <Link
          className={
            message === "groups" ? "dl-link-g dl-link" : "dl-link dl-link-h"
          }
          to="/groups"
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
