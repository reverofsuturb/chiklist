import { Link } from "react-router-dom";
import "./Landing.css";

export function Landing() {
  return (
    <div>
      <div className="la-topbanner">
        <div>PEOPLE PLATFORM</div>
        <div>PICTURE</div>
      </div>
      <div className="la-bottombanner">
        <h1 className="la-bottomtitle">HOW MEETUP WORKS!</h1>
        <div className="la-bottomintro">
          <Link to="/groups">SEE ALL GROUPS</Link>
          <Link to="/events">FIND AN EVENT</Link>
          <Link to="/groups/new">START A NEW GROUP</Link>
        </div>
        <button className="la-bottombutton">JOIN MEETUP</button>
      </div>
    </div>
  );
}
