import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getEvents } from '../../../store/events';
import './EventList.css'

function EventList(){
    const dispatch = useDispatch();
    const data = useSelector((state) => state.events);
    const events = data.allEvents.Events;
    const [event, setEvent] = useState("");
  
    useEffect(() => {
      dispatch(getEvents());
    }, [dispatch]);
  
    if (!events && events[0].Venue) {
      return null;
    }

    console.log(events[0])
  
    return (
      <>
        <div className="event-list">
          <div className="event-list_header" style={{color: 'teal', textDecoration: 'underline'}}>
            <h1>Events</h1>
          </div>
          <Link to="/groups/grouplist" style={{ textDecoration: 'none' }} >
          <div className="group-list_header" style={{color: 'grey', textDecoration: 'none'}}>
            <h1>Groups</h1>
          </div>
          </Link>
        </div>
        <div className="event-list_caption">
          <h3>Events in Meetup</h3>
        </div>
        <div className="event-list_items">
          <div key={event.id}>
            {events.length &&
              events.map((event) => (
                <Link to={`/event/${event.id}`} key={event.id} style={{color:'black'}}>
                <div className="event-list_item" key={event.id}>
                  <img src={event.previewImage} />
                  <div className="event-info">
                    <h3 className="event-name">{event.name}</h3>
                    <p className="event-city">{event.Venue.city}</p>
                    <p className="event-state">{event.Venue.state}</p>
                    <p className="about">{event.description}</p>
                    <p className="event-events">
                      {event.numAttending <= 1 ? `${event.numAttending} Attending` : `${event.numAttending} Attending`} 
                    </p>
                    <p className="dot">&#903;</p> 
                    <p className="event-private" >
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

export default EventList