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

function GroupDetail() {
  const dispatch = useDispatch();
  const { groupId } = useParams();
  const group = useSelector((state) => state.groups.singleGroup);
  const getLoggedInUser = useSelector((state) => state.session.user);
  let buttonVisibilityOrganizer;
  const [showModal, setShowModal] = useState(false);
  const divRef = useRef(null);


    
  const handleShowModal = () => {
    setShowModal(true);
  };
  

  useEffect(() => {
    if (!group.Organizer) dispatch(getGroupsDetails(groupId));
    

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

  

  if (!group.GroupImages || !group.Organizer) {
    return null;
  }

  const buttonVisibility =
    getLoggedInUser === null || group.Organizer.id === getLoggedInUser.id;

  if (getLoggedInUser !== null) {
    buttonVisibilityOrganizer =
      getLoggedInUser !== null && group?.Organizer.id === getLoggedInUser.id;
  }

  return (
    <>
      {showModal &&
      <div ref={divRef} className="delete-group-modal"> 
      <DeleteGroupModal setShowModal={setShowModal} /> 
      </div>}
      <div className="group-detail_banner-details">
        <div className="group-detail_bread-crumb">
          <p> &#62; </p>
          <Link to="/groups/grouplist">Groups</Link>
        </div>
        <div className="group-detail_group-image">
          <img src={group.GroupImages[0].url} />
        </div>
        <div className="group-detail_group-name">
          <h1>{group.name}</h1>
        </div>
        <div className="group-detail_group-location">
          <p>{group.city}</p>
        </div>
        <div className="group-detail_group-about">
          <p>What we are about</p>
          <p>{group.about}</p>
        </div>
        <div className="group-detail_group-event-number">
          <p>
            {group.numEvents <= 1
              ? `${group.numEvents} Event`
              : `${group.numEvents} Events`}
          </p>
        </div>
        <p className="dot">&#903;</p>
        <div className="group-detail_group-status">
          <p>{group.private ? "Private" : "Public"}</p>
        </div>
        <div className="group-detail_group-members">
          <p>
            {group.numMembers <= 1
              ? `${group.numMembers} Member`
              : `${group.numMembers} Members`}
          </p>
        </div>
        <div className="group-detail_group-join">
          <button style={{ display: buttonVisibility ? "none" : "block" }}>
            Join the Group
          </button>
          <div className="organizer-only">
            <button
              style={{ display: buttonVisibilityOrganizer ? "block" : "none" }}
            >
              Create event
            </button>
            <button
              style={{ display: buttonVisibilityOrganizer ? "block" : "none" }}
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
        <div className="group-detail_organizer">
          <p>Organized by</p>
          <p>{group.Organizer.firstName}</p>
          <p>{group.Organizer.lastName}</p>
        </div>
      </div>
    </>
  );
}

export default GroupDetail;
