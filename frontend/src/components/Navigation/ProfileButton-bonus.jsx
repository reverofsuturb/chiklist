import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import { NavLink } from "react-router-dom";
import { FaHouseChimneyWindow } from "react-icons/fa6";
import "./Navigation.css";

function ProfileButton({ user }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    navigate("/");
    closeMenu();
  };

  const ulClassName =
    "profile-dropdown profile-items" + (showMenu ? "" : " hidden");

  return (
    <>
      <button className="profile-button" onClick={toggleMenu}>
        <FaHouseChimneyWindow
          className={showMenu ? "profile-icon-salmon" : "profile-icon-black"}
        />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <p>Hello, {user.firstName}</p>
            {user.username === user.firstName + " " + user.lastName ? (
              <li>{user.username}</li>
            ) : (
              <>
                <li>{user.username}</li>
                <li>
                  {user.firstName} {user.lastName}
                </li>
              </>
            )}
            <li>{user.email}</li>
            <br />
            {/*<li>
              <NavLink className="profile-link " to="/groups/current" disabled={true} >Your groups</NavLink>
            </li>
            <li>
              <NavLink className="profile-link" to="/events/current" disabled={true}>Your events</NavLink>
            </li> */}
            <li>
              <NavLink className="profile-link" to="/groups">
                View groups
              </NavLink>
            </li>
            <li>
              <NavLink className="profile-link" to="/events">
                View events
              </NavLink>
            </li>
            <br />
            <li>
              <button className="profile-logout-button" onClick={logout}>
                Log Out
              </button>
            </li>
          </>
        ) : (
          <>
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
