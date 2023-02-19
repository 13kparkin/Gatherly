import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { deleteGroup, getGroupsDetails, getGroups } from "../../../store/groups";
import "./DeleteGroupModal.css";



function DeleteGroup({ setShowModal }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const groupId = useParams().groupId;
  const divRef = useRef(null);


  
  const handleDeleteGroup = () => {
    dispatch(deleteGroup(groupId)).then(() => {
      dispatch(getGroups());
    history.push("/groups");
    })
  };

  const handleCloseModal = () => {
    setShowModal(false);
    };



  return (
    <div className="modal">
      <h3>Are you sure you want to delete this group?</h3>
      <button className="delete-button-model" onClick={handleDeleteGroup}>Yes</button>
      <button className="delete-button-model" onClick={handleCloseModal}>No</button>
    </div>
  );
}

export default DeleteGroup;
