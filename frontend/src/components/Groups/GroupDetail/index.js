import { Link, useHistory } from "react-router-dom";
import "./GroupDetail.css";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
  getGroups,
  getGroupsDetails,
  deleteGroup,
} from "../../../store/groups";
import DeleteGroupModal from "../DeleteGroupModal";
import { getEventsDetailsByGroupId } from "../../../store/events";

function GroupDetail() {
  const dispatch = useDispatch();
  const { groupId } = useParams();
  const group = useSelector((state) => state.groups.singleGroup);
  const getLoggedInUser = useSelector((state) => state.session.user);
  const allEventsByGroup = useSelector((state) => state.events.allEventsByGroup);
  const events = allEventsByGroup.Events;
  let buttonVisibilityOrganizer;
  const [showModal, setShowModal] = useState(false);
  const divRef = useRef(null);
  const history = useHistory();
  const [event, setEvent] = useState("");


  const handleShowModal = () => {
    setShowModal(true);
  };
  const handleUpdateGroup = () => {
    history.push(`/groups/${group.id}/edit`);
  };
  const handleCreateEvent = () => {
    history.push(`/groups/${group.id}/events/new`);
  };

  useEffect(() => {
    dispatch(getGroupsDetails(groupId));
    dispatch(getEventsDetailsByGroupId(groupId));

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

  if (!group.GroupImages || !group.Organizer || group.id !== Number(groupId)) {
    return null;
  }

  const buttonVisibility =
    getLoggedInUser === null || group.Organizer.id === getLoggedInUser.id;

  if (getLoggedInUser !== null) {
    buttonVisibilityOrganizer =
      getLoggedInUser !== null && group?.Organizer.id === getLoggedInUser.id;
  }

  // Sort the events array by date
  const sortedEvents = events.slice().sort((a, b) => {
    const aStartDate = new Date(a.startDate);
    const bStartDate = new Date(b.startDate);
    if (aStartDate < bStartDate) {
      return -1;
    } else if (aStartDate > bStartDate) {
      return 1;
    } else {
      const aEndDate = new Date(a.endDate);
      const bEndDate = new Date(b.endDate);
      if (aEndDate < bEndDate) {
        return -1;
      } else if (aEndDate > bEndDate) {
        return 1;
      } else {
        return 0;
      }
    }
  });

  // Split the sorted events array into upcoming and past events
  const upcomingEvents = sortedEvents.filter((event) => {
    return new Date(event.endDate) >= new Date();
  });

  // sort the past events
  const pastEvents = sortedEvents.filter((event) => {
    return new Date(event.endDate) < new Date();
  });

  upcomingEvents.push(...pastEvents);

  return (
    <>
      {showModal && (
        <div ref={divRef} className="delete-group-modal">
          <DeleteGroupModal setShowModal={setShowModal} />
        </div>
      )}
      <section>
        <div className="group-detail_bread-crumb">
          <p> &#60; <Link to="/groups">Groups</Link> </p>
        </div>
        
        <div className="flex">
          <img className="group-detail_group-image" src={group.GroupImages[0].url} />
          <div className="group-detail_group-banner-right">
          <h1>{group.name}</h1>
          <p>{group.city}</p>
          <p>
            <span> 
            {group.numEvents <= 1
              ? `${group.numEvents} Event`
              : `${group.numEvents} Events`}  </span>  <span> &#903; </span>  <span> {group.private ? "Private" : "Public"} </span>
          </p>

          <p>Organized by {group.Organizer.firstName} {group.Organizer.lastName}</p>
          <button style={{ display: buttonVisibility ? "none" : "block" }}>
            Join the Group
          </button>
          </div>
          </div>
          </section>

        <section className="grey">

          <h2> Organizer </h2>
          <p className="small">{group.Organizer.firstName} {group.Organizer.lastName}</p>

        <div className="group-detail_group-about">
          <h2>What we are about</h2>
          <p>{group.about}</p>
        </div>

      

        <div className="group-detail_group-members">
          <p>
            {group.numMembers <= 1
              ? `${group.numMembers} Member`
              : `${group.numMembers} Members`}
          </p>
        </div>
        <div className="group-detail_group-join">
          
          <div className="organizer-only">
            <button
              style={{ display: buttonVisibilityOrganizer ? "block" : "none" }}
              onClick={handleCreateEvent}
            >
              Create event
            </button>
            <button
              style={{ display: buttonVisibilityOrganizer ? "block" : "none" }}
              onClick={handleUpdateGroup}
            >
              Update
            </button>
            <button
              style={{ display: buttonVisibilityOrganizer ? "block" : "none" }}
              onClick={handleShowModal}
            >
              Delete
            </button>
          </div>
        </div>
        


      <div className="event-list_details">
        <h2>Events</h2>
        <div key={event.id}>
          {upcomingEvents.length &&
            upcomingEvents.map((event) => (
              <Link
                to={`/events/${event.id}`}
                key={event.id}
                style={{ color: "black" }}
              >
                <div className="events-list_item" key={event.id}>
                  <img src={event.previewImage} />
                  <div className="events-info">
                    <h3 className="events-name">{event.name}</h3>
                    <p className="events-city">{event.Venue.city}</p>
                    <p className="events-state">{event.Venue.state}</p>
                    <p className="events-about">{event.description}</p>
                    <p className="events-events">
                      {event.numAttending <= 1
                        ? `${event.numAttending} Attending`
                        : `${event.numAttending} Attending`}
                    </p>
                    <p className="dot">&#903;</p>
                    <p className="events-private">
                      {event.private ? "Private" : "Public"}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
      </section>
    </>
  );
}

export default GroupDetail;
