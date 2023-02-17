import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { createEvent, getEventsDetails } from '../../../store/events';
import { getGroupsDetails } from '../../../store/groups';
import './CreateEvent.css';


function CreateEvent(){
    const dispatch = useDispatch()
    const [eventName, setEventName] = useState('');
    const [eventType, setEventType] = useState('Selcect one');
    // const [eventPrivacy, setEventPrivacy] = useState('Public');
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

      if (!imageUrl) {
        errors.imageUrl = 'Image URL is required';
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


    const isButtonDisabled = !eventName || !description 

    const button = isButtonDisabled ? 'disableds' : 'submit-buttons';
  
    return (
      <form onSubmit={handleSubmit}>
        <div className='events-title'>
        <h1>Create a new event for {group.name}</h1>
        {errors.eventName && <div className='errors'>{errors.eventName}</div>}
          <label htmlFor="eventName">What is the name of your event?</label>
          <div className='event-create-name'>
          <input
            type="text"
            id="eventName"
            placeholder="Event Name"
            value={eventName}
            onChange={(event) => setEventName(event.target.value)}
          />
          
          </div>
        </div>
  
        <div className='section-one'>
          <div className='event-type'>
          <label htmlFor="eventType">Is this an in-person or online group?</label>
          <div className='event-type-selction'>
          <select id="eventType" value={eventType} onChange={(event) => setEventType(event.target.value)}>
          <option value="Select one">Select One </option>
            <option value="In person">In person</option>
            <option value="Online">Online</option>
          </select>
          </div>
        </div>
        {/* <div>
          <label htmlFor="eventPrivacy">Is this event private or public?</label>
          <select id="eventPrivacy" value={eventPrivacy} onChange={(event) => setEventPrivacy(event.target.value)}>
            <option value="Private">Private</option>
            <option value="Public">Public</option>
          </select>
        </div> */}
  
        <div className='event-price'>
          <label htmlFor="eventPrice">What is the price for your event?</label>
          <div className='event-price-selection'>
          <input
            type="number"
            id="eventPrice"
            placeholder="0"
            value={eventPrice}
            onChange={(event) => setEventPrice(event.target.value)}
          />
          </div>
          </div>
        </div>
  
        <div className='start-date'>
        {errors.startDate && <div className='errors'>{errors.startDate}</div>}
          <label htmlFor="startDate">When does your event start?</label>
          <div className='start-date-selection'>
          <input
            type="text"
            id="startDate"
            placeholder="MM/DD/YYYY, HH:mm AM"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
          />
          
          </div>
          {errors.endDate && <div className='errors'>{errors.endDate}</div>}
          <label htmlFor="endDate">When does your event end?</label>
          <div className='end-date-selection'>
            <input
             type="text"
             id="endDate"
             placeholder="MM/DD/YYYY, HH:mm PM"
             value={endDate}
             onChange={(event) => setEndDate(event.target.value)}
           />
           </div>
          </div>
         
           <div className='event-image'>
           {errors.imageUrl && <div className='errors'>{errors.imageUrl}</div>}
             <label htmlFor="imageUrl">Please add an image URL for your event below:</label>
              <div className='image-url'>
             <input
               type="text"
               id="imageUrl"
               placeholder="Image URL"
               value={imageUrl}
               onChange={(event) => setImageUrl(event.target.value)}
             />
             
           </div>
            </div>
         
           <div className='description'>
           {errors.description && <div className='errors'>{errors.description}</div>}
             <label htmlFor="description">Please describe your event</label>
              <div className='description-box'>
             <textarea
               id="description"
               placeholder="Please include at least 50 characters."
               value={description}
               onChange={(event) => setDescription(event.target.value)}
             />
             
           </div>
            </div>
         
           <button className={button} type="submit" disabled={isButtonDisabled}>
             Create Event
           </button>
         </form>
         );
}

export default CreateEvent