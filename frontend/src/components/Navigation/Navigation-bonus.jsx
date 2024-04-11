import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton-bonus";
import "./Navigation.css";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);
  const navigate = useNavigate()
  const css = "omb-login-signup-button";
  return (
    <nav>
      <div className="nav-logo">
        <NavLink to="/">
          <img
            className="nav-img"
            src="https://res.cloudinary.com/drozfc2tz/image/upload/v1708502041/Chiklist/openart-image_szKagZOO_1708500784165_raw_edwqj5.jpg"
            alt="Michael Chiklis surrounded by Chickpeas"
          />
        </NavLink>
        <div className="nav-titlebox">
          <h1 className="nav-title">
            The <span className="nav-chik">Chik</span>list
          </h1>
          {sessionUser && (
            <h4>
              Hey, {sessionUser.firstName}. A bricklayer lays bricks. I&apos;m
              an actor, that&apos;s what I do.{" "}
            </h4>
          )}
        </div>
      </div>
      <div className="nav-homelinks">
        {isLoaded && (
          <div>
            {sessionUser === null ? (
              <div>
                <OpenModalButton
                  buttonText="Log In"
                  modalComponent={<LoginFormModal />}
                  css={css}
                />
                <OpenModalButton
                  buttonText="Sign Up"
                  modalComponent={<SignupFormModal />}
                  css={css}
                />
              </div>
            ) : (
              <div className="nav-loaded">

                  <button className="nav-create-button" onClick={()=>navigate('/groups/new')}>Create a Group</button>

                <ProfileButton user={sessionUser} />
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
