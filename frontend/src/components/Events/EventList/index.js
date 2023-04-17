import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getEvents } from "../../../store/events";
import "./EventList.css";

function EventList() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.events);
  const events = data.allEvents.Events;
  const [event, setEvent] = useState("");

  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch]);

  if (!events) {
    return null;
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

  // convert the date to a readable format
  const convertDate = (date) => {
    const newDate = new Date(date);
    const month = newDate.toLocaleString("default", { month: "long" });
    const day = newDate.getDate();
    const year = newDate.getFullYear();
    return `${month} ${day}, ${year}`;
  };




  // today's date
  const today = new Date();


  return (
    <>
      <div className="event-list">
        <div
          className="event-list_header"
          style={{ color: "teal", textDecoration: "underline" }}
        >
          <h1>Events</h1>
        </div>
        <Link to="/groups" style={{ textDecoration: "none" }}>
          <div
            className="group-list_header"
            style={{ color: "grey", textDecoration: "none" }}
          >
            <h1>Groups</h1>
          </div>
        </Link>
      </div>
      <div className="event-list_caption">
        <h3>Events in Meetup</h3>
      </div>
      <div className="event-list_items">
        <div key={event.id}>
          {upcomingEvents.length &&
            upcomingEvents.map((event) => (
              <Link
                to={`/events/${event.id}`}
                key={event.id}
                style={{ color: "black" }}
              >
                <div className="event-list_item" key={event.id}>
                  <img src={event.previewImage} />
                  <div className="event-info">
                    <h3 className="event-name">{event.name}</h3>
                    <p className="event-city">{event.Venue.city}</p>
                    <p className="event-state">{event.Venue.state}</p>
                    <p className="about">{event.description}</p>

                    <p className="upcoming-event-date">{convertDate(event.startDate)} - {convertDate(event.endDate)} </p>


                    <p className="event-events">
                      {event.numAttending <= 1
                        ? `${event.numAttending} Attending`
                        : `${event.numAttending} Attending`}
                    </p>
                    <p className="dot">&#903;</p>
                    <p className="event-private">
                      {event.private ? "Private" : "Public"}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </>
  );
}

export default EventList;
