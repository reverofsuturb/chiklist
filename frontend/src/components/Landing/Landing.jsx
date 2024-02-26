import { Link } from "react-router-dom";
import OpenModalButton from "../OpenModalButton";
import { useModal } from "../../context/Modal";
import SignupFormModal from "../SignupFormModal";
import { useSelector } from "react-redux/es/hooks/useSelector";
import "./Landing.css";

export function Landing() {
  const { closeMenu } = useModal();
  const { user } = useSelector((state) => state.session);
  const css = "omb-signup-button-big";
  console.log(user);
  return (
    <div>
      <div className="la-topbanner">
        <div className="la-introtext">
          <h1>
            The <span className="la-chik">Chik</span>list
          </h1>
          <p>
            Do you wake up in the morning breathing Michael? Do you find
            yourself writing down Chikpeas instead of chickpeas on your grocery
            list? It&apos;s about time you joined The{" "}
            <span className="la-chik">Chik</span>list, the world&apos;s best
            resource for Michael Chiklis fandom and group activities.
          </p>
        </div>
        <div>
          {" "}
          <img
            className="la-intropic"
            src="https://res.cloudinary.com/drozfc2tz/image/upload/v1708502034/Chiklist/openart-image_jmoE5O07_1708501823220_raw_qpxc6m.jpg"
            alt="Michael Chiklis in striped clothing flashing peace signs with a floating pineapple"
          />
        </div>
      </div>
      <div className="la-bottombanner">
        <div className="la-bottomtitle">
          <h2 className="la-middletitle">Let&apos;s get down to Chiklis</h2>
          <p>Find millions of others who enjoy Chiklis as much as you</p>
        </div>
        <div className="la-bottomintro">
          <div className="la-pic-container">
            <Link className="la-link" to="/groups">
              <img
                className="la-runningpic"
                src="https://res.cloudinary.com/drozfc2tz/image/upload/v1708531769/Chiklist/openart-image_QamfqVA5_1708502191681_raw_bnicna.jpg"
                alt="Michael Chiklis with a moustache running with his friends cosplaying 80s jazzercise aerobic uniforms"
              />
              <p className="la-caption-title">See all Groups</p>
              <p className="la-caption">Never run alone (or without style)</p>
            </Link>
          </div>
          <div className="la-pic-container">
            <Link className="la-link" to="/events">
              <img
                className="la-bearpic"
                src="https://res.cloudinary.com/drozfc2tz/image/upload/v1708531766/Chiklist/openart-image_6wnjh6IO_1708502274688_raw_kvujzx.jpg"
                alt="Michael Chiklis with a chainsaw, they are chopping down trees with a bear who has become their friend"
              />
              <p className="la-caption-title">Find an Event </p>
              <p className="la-caption">Feelin like a bear in the woods?</p>
            </Link>
          </div>
          <div
            className={
              user === null ? "la-pic-container-disabled" : "la-pic-container"
            }
          >
            <Link
              className={user === null ? "la-link-disabled" : "la-link"}
              to={user === null ? "/" : "/groups/new"}
            >
              <img
                className="la-writingpic"
                src="https://res.cloudinary.com/drozfc2tz/image/upload/v1708502038/Chiklist/openart-image_r-6amR74_1708500320132_raw_wdjtxq.jpg"
                alt="Michael Chiklis writing in a cafe, he is sporting a robust hairstyle with dreadlocks"
              />
              <p
                className={
                  user === null
                    ? "la-caption-title-disabled"
                    : "la-caption-title"
                }
              >
                Start a Group
              </p>
              <p
                className={user === null ? "la-caption-disabled" : "la-caption"}
              >
                Become a Chiklis&apos; ambassador
              </p>
            </Link>
          </div>
        </div>
        {user === null && (
          <OpenModalButton
            buttonText="Join Today"
            onItemClick={closeMenu}
            modalComponent={<SignupFormModal />}
            css={css}
          />
        )}
      </div>
    </div>
  );
}
