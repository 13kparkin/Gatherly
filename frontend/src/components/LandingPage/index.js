import { useSelector } from "react-redux";
import "./LandingPage.css";

function LandingPage() {
  const sessionUser = useSelector((state) => state.session.user);

  const handleStartGroupClick = (e) => {
    e.preventDefault();
    console.log("start group clicked");
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
          <img src="" alt="group of people" />
        </div>
      </div>
      <div className="landing-page_section-2">
        <h2 className="landing-page_section-2_title">Find Gatherings</h2>
        <p className="landing-page_section-2_caption">Gatherly is for all</p>
      </div>
      <div className="landing-page_section-3">
        <div className="landing-page_section-3_column">
          <div className="landing-page_section-3_column_icon">
            <img src="" alt="icon" />
          </div>
          <div className="landing-page_section-3_column_link">
            <a href="#">See all Groups</a>
          </div>
          <div className="landing-page_section-3_column_caption">
            <p>Find Gatherings you're interested in</p>
          </div>
        </div>
        <div className="landing-page_section-3_column">
          <div className="landing-page_section-3_column_icon">
            <img src="" alt="icon" />
          </div>
          <div className="landing-page_section-3_column_link">
            <a href="#">Find an event</a>
          </div>
          <div className="landing-page_section-3_column_caption">
            <p>Explore upcoming events and activities</p>
          </div>
        </div>
        <div className="landing-page_section-3_column">
          <div className="landing-page_section-3_column_icon">
            <img src="" alt="icon" />
          </div>
          <div className="landing-page_section-3_column_link">
            {!sessionUser ? (
              <a href="#" className="disabled">
                Start a group
              </a>
            ) : (
              <a href="#" onClick={handleStartGroupClick}>
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
