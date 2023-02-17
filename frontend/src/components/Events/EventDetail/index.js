import { Link, useHistory } from "react-router-dom";
import "./EventDetail.css";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
  getEvents,
  getEventsDetails,
  deleteEvent,
} from "../../../store/events";
import DeleteEventModal from "../DeleteEventModal";
import { getGroupsDetails } from "../../../store/groups";

function EventDetail() {
  const dispatch = useDispatch();
  const { eventId } = useParams();
  let event = useSelector((state) => state.events.singleEvent);
  const getLoggedInUser = useSelector((state) => state.session.user);
  let buttonVisibilityOrganizer;
  const [showModal, setShowModal] = useState(false);
  const divRef = useRef(null);
  const history = useHistory();
  let groupId = event.groupId;
  
  const handleShowModal = () => {
    setShowModal(true);
  };

  useEffect(() => {

    async function getData() {
    event = await dispatch(getEventsDetails(eventId));

    }

    getData();

    function handleCloseModal(event) {
      if (divRef.current && !divRef.current.contains(event.target)) {
        setShowModal(false);
      }
    }

    document.addEventListener("mousedown", handleCloseModal);
    return () => {
      document.removeEventListener("mousedown", handleCloseModal);
    };
  }, [dispatch, divRef]);


  if (!event || event?.id !== Number(eventId) || !event.GroupImages) {
    return null;
  }

  let image;

  if (event.GroupImages.length === 1) {
     image = event.GroupImages[0];
  }

  console.log(event.EventImages)


  const buttonVisibility =
    getLoggedInUser === null || event?.GroupOrganizer?.id === getLoggedInUser?.id;

  if (getLoggedInUser !== null) {
    buttonVisibilityOrganizer =
      getLoggedInUser !== null &&
      event?.GroupOrganizer?.id === getLoggedInUser?.id;
  }

  // time and date formatting

  const [startDateString, startTimeString] = event.startDate.split("T");
  const [endDateString, endTimeString] = event.endDate.split("T");

  const startDateObj = new Date(startDateString);
  const startTimeObj = new Date(`1970-01-01T${startTimeString}`);
  const endDateObj = new Date(endDateString);
  const endTimeObj = new Date(`1970-01-01T${endTimeString}`);

  const startDateFormatted = startDateObj.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const endDateFromatted = endDateObj.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const startTimeFormatted = startTimeObj.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
  });

  const endTimeFormatted = endTimeObj.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
  });


  const price = event.price.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <>
      {showModal && (
        <div ref={divRef} className="delete-event-modal">
          <DeleteEventModal setShowModal={setShowModal} /> 
        </div>
      )}
      <section className="event-detail-container">
        <div className="event-detail_bread-crumb">
          <Link to="/events"> &#60; events</Link>
          <h1>{event.name}</h1>
          <p>Hosted by: {event.GroupOrganizer.firstName} {event.GroupOrganizer.lastName}</p>
        </div>
        <section className='main-container'>
        <div className="event-banner">
          <img className="event-detail_event-image" src={image.url} />
        
        <div>
        <Link className="group-card_details" style={{color: 'black', textDecoration: 'none'}} to={`/groups/${event.groupId}`}>
          <img className="group-card-img" src={event.GroupImages[0]?.url}/>
          <h3 className="group-name"> {event.Group.name}</h3>
          <span className="private"> {event.Group.private ? "Private" : "Public"}</span>
          </Link>
        </div>

        <div className="event-detail_event-info">

        <div className="event-info-box_row">
            <i className="far fa-clock"> 
            <span className="start"> Start {`${startDateFormatted}`} &#183; {` ${startTimeFormatted}`} </span> <br/>
              <span className="end">End {`${endDateFromatted}`} &#183; {` ${endTimeFormatted}`} </span>

              </i>
          

          </div>

          <div className="event-info-box_row">
            <i className="fas fa-money-bill-wave">
            <span className="price">{event.price === 0 ? "FREE" : `${price}`}</span>
            </i>
          </div>
          <div className="event-info-box_row">
            <i className="fas fa-map-marker-alt">
            <span className="locations">{event.location === "online" ? "Online" : "In person"}</span>
            </i>
          </div>

        </div>

        

        <div className="event-detail_event-join">
          <button className="join" onClick={() => alert('function coming soon')} style={{ display: buttonVisibility ? "none" : "block" }}>
            Join the Event
          </button>
          <div className="organizer-only">
            {/* <button
              style={{ display: buttonVisibilityOrganizer ? "block" : "none" }}
              onClick={() => history.push(`/groups/${groupId}/events/new`)}
            >
              Create Event
            </button> */}
            <button
              style={{ display: buttonVisibilityOrganizer ? "block" : "none" }}
              onClick={handleShowModal}
            >
              Delete
            </button>
          </div>
        </div>
        
        </div>

        <section className="bottom">
        {/* <div className="event-detail_event-status">
          <p>{event.private ? "Private" : "Public"}</p>
        </div>
        <div className="event-detail_event-members">
          <p>
            {event.numAttending <= 1
              ? `${event.numAttending} Attending`
              : `${event.numAttending} Attending`}
          </p>
        </div> */}
       

          <div className="event-detail_event-description">
          <h2>Details</h2>
          <p>{event.description}</p>
          </div>

        </section>
        </section>
        
      </section>
  
    </>
  );
}

export default EventDetail;
