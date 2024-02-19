import "./Landing.css";

function Landing() {
  return (
    <div>
      <div className="la-topbanner">
        <div>PEOPLE PLATFORM</div>
        <div>PICTURE</div>
      </div>
      <div className="la-bottombanner">
        <h1 className="la-bottomtitle">HOW MEETUP WORKS</h1>
        <div className="la-bottomintro">
          <div>SEE ALL GROUPS</div>
          <div>FIND AN EVENT</div>
          <div>START A NEW GROUP</div>
        </div>
        <button className="la-bottombutton">JOIN MEETUP</button>
      </div>
    </div>
  );
}

export default Landing;
