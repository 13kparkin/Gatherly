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
  const allEventsByGroup = useSelector(
    (state) => state.events.allEventsByGroup
  );
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
  let sortedEvents;
  let startDateFormatted;
  let startTimeFormatted;
  let endDateFormatted;
  let endTimeFormatted;
  let upcomingEvents;
  let totalUpcomingEvents;
  let pastEvents;
  let totalPastEvents;

  const date = (event) => {
    const [startDateString, startTimeString] = event.startDate.split("T");

    const startDateObj = new Date(startDateString);
    const startTimeObj = new Date(`1970-01-01T${startTimeString}`);

    startDateFormatted = startDateObj.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    startTimeFormatted = startTimeObj.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
    });

    return {
      startDateFormatted,
      startTimeFormatted,
    };
  };

  if (events !== undefined) {
    sortedEvents = events
      .slice()
      .sort((a, b) => {
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
      })
      .map((event) => {
        const { startDateFormatted, startTimeFormatted } = date(event);
        return {
          ...event,
          startDateFormatted,
          startTimeFormatted,
        };
      });
    // Split the sorted events array into upcoming and past events
    upcomingEvents = sortedEvents.filter((event) => {
      return new Date(event.endDate) >= new Date();
    });

    totalUpcomingEvents = upcomingEvents.length;

    // sort the past events
    pastEvents = sortedEvents.filter((event) => {
      return new Date(event.endDate) < new Date();
    });

    totalPastEvents = pastEvents.length;
  }

  const handleJoinGroup = () => {
    alert("Function coming soon!");
  };

  return (
    <>
      {showModal && (
        <div ref={divRef} className="delete-group-modal">
          <DeleteGroupModal setShowModal={setShowModal} />
        </div>
      )}
      <section className="top-section">
        <div className="group-detail_bread-crumb">
          <p>
            {" "}
            &#60; <Link to="/groups">Groups</Link>{" "}
          </p>
        </div>

        <div className="flex">
          <img
            className="group-detail_group-image"
            src={group.GroupImages[0].url}
          />
          <div className="group-detail_group-banner-right">
            <h1>{group.name}</h1>
            <p>{group.city}</p>
            <p>
              <span>
                {group.numEvents <= 1
                  ? `${group.numEvents} Event`
                  : `${group.numEvents} Events`}{" "}
              </span>{" "}
              <span> &#903; </span>{" "}
              <span> {group.isPrivate ? "Private" : "Public"} </span>
            </p>

            <p>
              Organized by {group.Organizer.firstName}{" "}
              {group.Organizer.lastName}
            </p>
            <section className="buttons">
              <span>
                <button
                  className="join-group-button"
                  onClick={handleJoinGroup}
                  style={{ display: buttonVisibility ? "none" : "block" }}
                >
                  Join the Group
                </button>
              </span>
              <span>
                <button
                  className="create-button"
                  style={{
                    display: buttonVisibilityOrganizer ? "block" : "none",
                  }}
                  onClick={handleCreateEvent}
                >
                  Create event
                </button>
              </span>
              <span>
                <button
                  className="update-button"
                  style={{
                    display: buttonVisibilityOrganizer ? "block" : "none",
                  }}
                  onClick={handleUpdateGroup}
                >
                  Update
                </button>
              </span>
              <span>
                <button
                  className="delete-button"
                  style={{
                    display: buttonVisibilityOrganizer ? "block" : "none",
                  }}
                  onClick={handleShowModal}
                >
                  Delete
                </button>
              </span>
            </section>
          </div>
        </div>
      </section>

      <section className="grey">
        <section className="bottom-section">
          <h2> Organizer </h2>
          <p className="small">
            {group.Organizer.firstName} {group.Organizer.lastName}
          </p>

          <div className="group-detail_group-about">
            <h2>What we are about</h2>
            <p>{group.about}</p>
          </div>

          {/* <div className="group-detail_group-members">
          <p>
            {group.numMembers <= 1
              ? `${group.numMembers} Member`
              : `${group.numMembers} Members`}
          </p>
        </div> */}

          <div
            style={
              upcomingEvents === undefined
                ? { display: "none" }
                : { display: "block" }
            }
            className="upcoming-event-list_details"
          >
            {totalUpcomingEvents && (
              <>
                <h2>Upcoming Events ({totalUpcomingEvents})</h2>
                <div key={event.id}>
                  {upcomingEvents &&
                    upcomingEvents.map((event) => (
                      <Link
                        to={`/events/${event.id}`}
                        key={event.id}
                        style={{ color: "black", textDecoration: "none" }}
                      >
                        <div className="events-list_item" key={event.id}>
                          <img src={event.previewImage} />
                          <div className="events-info">
                            <p className="events-date">
                              {`${date(event).startDateFormatted} • ${
                                date(event).startTimeFormatted
                              }`}{" "}
                            </p>
                            <h3 className="events-name">{event.name}</h3>
                            <p className="events-city">{`${event.Venue.city}, ${event.Venue.state}`}</p>
                            <p className="events-about">{event.description}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>

                <div>
                  <div
                    className="past-event-list_details"
                    style={
                      pastEvents.length < 1
                        ? { display: "none" }
                        : { display: "block" }
                    }
                  >
                    <h2>Past Events ({totalPastEvents}) </h2>
                    <div key={event.id}>
                      {pastEvents &&
                        pastEvents.map((event) => (
                          <Link
                            to={`/events/${event.id}`}
                            key={event.id}
                            style={{ color: "black", textDecoration: "none" }}
                          >
                            <div className="events-list_item" key={event.id}>
                              <img src={event.previewImage} />
                              <div className="events-info">
                                <p className="events-date">
                                  {` ${date(event).startDateFormatted} • ${
                                    date(event).startTimeFormatted
                                  }`}{" "}
                                </p>
                                <h3 className="events-name">{event.name}</h3>
                                <p className="events-city">{`${event.Venue.city}, ${event.Venue.state}`}</p>
                                <p className="events-about">
                                  {event.description}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </section>
    </>
  );
}

export default GroupDetail;
