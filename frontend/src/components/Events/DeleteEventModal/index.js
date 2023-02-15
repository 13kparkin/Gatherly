import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { deleteGroup, getGroupsDetails, getGroups } from "../../../store/groups";
import "./DeleteEventModal.css";



function DeleteEvent({ setShowModal }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const eventId = useParams().eventId;
  const divRef = useRef(null);


  
  const handleDeleteEvent = () => {
    dispatch(deleteGroup(eventId)).then(() => {
      dispatch(getGroups());
    history.push("/events");
    })
  };

  const handleCloseModal = () => {
    setShowModal(false);
    };



  return (
    <div className="modal">
      <h3>Are you sure you want to delete this Event?</h3>
      <button onClick={handleDeleteEvent}>Yes</button>
      <button onClick={handleCloseModal}>No</button>
    </div>
  );
}

export default DeleteEvent;
