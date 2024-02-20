import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton-bonus";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <nav>
      <div className="logo">Meet Up</div>
      <div className="homelinks">
      {isLoaded && (
        <div>
          <ProfileButton user={sessionUser} />
        </div>

      )}
      <div>
        <NavLink to="/">Home</NavLink>
      </div>
      <li>
        <NavLink to="/groups/current">Your groups</NavLink>
      </li>
      <li>
        <NavLink to="/events/current">Your events</NavLink>
      </li>
      </div>
    </nav>
  );
}

export default Navigation;
