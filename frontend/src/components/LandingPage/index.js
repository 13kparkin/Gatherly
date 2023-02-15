import { useSelector } from "react-redux";
import "./LandingPage.css";
import landingPage1 from "../../images/landingPage/landingPage1.jpg";
import landingPage2 from "../../images/landingPage/landingPage2.jpg";
import landingPage3 from "../../images/landingPage/landingPage3.jpg";
import landingPage4 from "../../images/landingPage/landingPage4.jpg";
import GroupList from "../Groups/GroupList";
import { Link, Route, useHistory } from "react-router-dom";

function LandingPage() {
  const sessionUser = useSelector((state) => state.session.user);
  const history = useHistory()

  const handleStartGroupClick = (e) => {
    e.preventDefault();
    history.push("/groups/new")
  };

  const handleButtonJoinClick = (e) => {
    e.preventDefault();
    console.log("join button clicked");
  };

  return (
    <div className="landing-page">
      <div className="landing-page_section-1">
        <div className="landing-page_section-1_text">
          <h1 className="landing-page_section-1_text_title">
            Gather with new people and find new friends
          </h1>
          <p className="landing-page_section-1_text_intro">
            Gatherly brings people together in thousands of cities to do more of
            what they want to do but together.
          </p>
        </div>
        <div className="landing-page_section-1_image">
          <img src={landingPage1} alt="group of people" />
        </div>
      </div>
      <div className="landing-page_section-2">
        <h2 className="landing-page_section-2_title">Find Gatherings</h2>
        <p className="landing-page_section-2_caption">Gatherly is for all</p>
      </div>
      <div className="landing-page_section-3">
        <div className="landing-page_section-3_column">
          <div className="landing-page_section-3_column_icon">
            <img src={landingPage2} alt="icon" />
          </div>
          <div className="landing-page_section-3_column_link">
            <Link to='../Groups/GroupList'>See all Groups</Link>
          </div>
          <div className="landing-page_section-3_column_caption">
            <p>Find Gatherings you're interested in</p>
          </div>
        </div>
        <div className="landing-page_section-3_column">
          <div className="landing-page_section-3_column_icon">
            <img src={landingPage3} alt="icon" />
          </div>
          <div className="landing-page_section-3_column_link">
            <Link to="/events">Find an event</Link>  {// TODO: Click "Find an event" to go to Events List Page
            }
          </div>
          <div className="landing-page_section-3_column_caption">
            <p>Explore upcoming events and activities</p>
          </div>
        </div>
        <div className="landing-page_section-3_column">
          <div className="landing-page_section-3_column_icon">
            <img src={landingPage4} alt="icon" />
          </div>
          <div className="landing-page_section-3_column_link">
            {!sessionUser ? (
              <Link to="/" className="disabled">
                Start a group
              </Link>
            ) : (
              <a href="/" onClick={handleStartGroupClick}>
                Start a group
              </a>
            )}
          </div>
          <div className="landing-page_section-3_column_caption">
            <p>Start something new with new people</p>
          </div>
        </div>
      </div>
      <div className="landing-page_section-4">
        <button onClick={handleButtonJoinClick} className="landing-page_section-4_button">Join Gatherly</button>
      </div>
    </div>
  );
}

export default LandingPage;
