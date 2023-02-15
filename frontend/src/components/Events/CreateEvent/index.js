import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { createEvent, getEventsDetails } from '../../../store/events';
import { getGroupsDetails } from '../../../store/groups';
import './CreateEvent.css';


function CreateEvent(){
    const dispatch = useDispatch()
    const [eventName, setEventName] = useState('');
    const [eventType, setEventType] = useState('In person');
    const [eventPrivacy, setEventPrivacy] = useState('Public');
    const [eventPrice, setEventPrice] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [description, setDescription] = useState('');
    const groupId = useParams().groupId;
    const group = useSelector(state => state.groups.singleGroup);



    const [errors, seterrors] = useState({});
    const history = useHistory();


  
    const handleSubmit = async (event) => {
      event.preventDefault();
  
      const errors = {};
  
      if (!eventName) {
        errors.eventName = 'Event name is required';
      }
  
      if (!startDate) {
        errors.startDate = 'Start date is required';
      }
  
      if (!endDate) {
        errors.endDate = 'End date is required';
      }
  
      if (!description || description.length < 50) {
        errors.description = 'Description needs 50 or more characters';
      }
  
      if (Object.keys(errors).length > 0) {
        seterrors(errors);
        return;
      }

      const newEvent = {
        venueId: 2,
        name: eventName,
        type: eventType.toLowerCase(),
        capacity: 1,
        price: parseInt(eventPrice),
        startDate,
        endDate,
        imageUrl,
        description
      };
      
      const singleEvent = await dispatch(createEvent(newEvent,groupId));

    
      

        if (singleEvent) {
            history.push(`/events/${singleEvent.id}`);
        }
      
    };

    useEffect(() => {
      dispatch(getGroupsDetails(groupId));
    }, [dispatch]);


    const isButtonDisabled = !eventName || !description;
  
    return (
      <form onSubmit={handleSubmit}>
        <h1>Create a new event for {group.name}</h1>
  
        <div>
          <label htmlFor="eventName">What is the name of your event?</label>
          <input
            type="text"
            id="eventName"
            placeholder="Event Name"
            value={eventName}
            onChange={(event) => setEventName(event.target.value)}
          />
          {errors.eventName && <div className='errors'>{errors.eventName}</div>}
        </div>
  
        <div>
          <label htmlFor="eventType">Is this an in-person or online group?</label>
          <select id="eventType" value={eventType} onChange={(event) => setEventType(event.target.value)}>
            <option value="In person">In person</option>
            <option value="Online">Online</option>
          </select>
        </div>
  
        {/* <div>
          <label htmlFor="eventPrivacy">Is this event private or public?</label>
          <select id="eventPrivacy" value={eventPrivacy} onChange={(event) => setEventPrivacy(event.target.value)}>
            <option value="Private">Private</option>
            <option value="Public">Public</option>
          </select>
        </div> */}
  
        <div>
          <label htmlFor="eventPrice">What is the price for your event?</label>
          <input
            type="number"
            id="eventPrice"
            placeholder="0"
            value={eventPrice}
            onChange={(event) => setEventPrice(event.target.value)}
          />
        </div>
  
        <div>
          <label htmlFor="startDate">When does your event start?</label>
          <input
            type="text"
            id="startDate"
            placeholder="MM/DD/YYYY, HH:mm AM"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
          />
          {errors.startDate && <div className='errors'>{errors.startDate}</div>}
        </div>
  
        <div>
          <label htmlFor="endDate">When does your event end?</label>
            <input
             type="text"
             id="endDate"
             placeholder="MM/DD/YYYY, HH:mm PM"
             value={endDate}
             onChange={(event) => setEndDate(event.target.value)}
           />
           {errors.endDate && <div className='errors'>{errors.endDate}</div>}
           </div>
         
           <div>
             <label htmlFor="imageUrl">Please add an image URL for your event below:</label>
             <input
               type="text"
               id="imageUrl"
               placeholder="Image URL"
               value={imageUrl}
               onChange={(event) => setImageUrl(event.target.value)}
             />
             {errors.imageUrl && <div className='errors'>{errors.imageUrl}</div>}
           </div>
         
           <div>
             <label htmlFor="description">Please describe your event</label>
             <textarea
               id="description"
               placeholder="Please include at least 50 characters."
               value={description}
               onChange={(event) => setDescription(event.target.value)}
             />
             {errors.description && <div className='errors'>{errors.description}</div>}
           </div>
         
           <button type="submit" disabled={isButtonDisabled}>
             Create Event
           </button>
         </form>
         );
}

export default CreateEvent