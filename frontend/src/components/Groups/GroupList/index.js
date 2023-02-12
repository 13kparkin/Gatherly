import "./GroupList.css";
import { getGroups } from "../../../store/groups";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function GroupList() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.groups);
  const groups = data.Groups;
  const [group, setGroup] = useState("");

  useEffect(() => {
    dispatch(getGroups());
  }, [dispatch]);

  if (!groups) {
    return null;
  }

  return (
    <>
      <div className="group-list">
        <div className="event-list_header">
          <h1>Events</h1>
        </div>
        <div className="group-list_header">
          <h1>Groups</h1>
        </div>
      </div>
      <div className="group-list_caption">
        <h3>Groups in Meetup</h3>
      </div>
      <div className="group-list_items">
        <div key={group.id}>
          {groups.length &&
            groups.map((group) => (
              <Link to={`/groups/${group.id}`} key={group.id} style={{color:'black'}}>
              <div className="group-list_item" key={group.id}>
                <img src={group.previewImage} />
                <div className="group-info">
                  <h3 className="group-name">{group.name}</h3>
                  <p className="group-city">{group.city}</p>
                  <p className="about">{group.about}</p>
                  <p className="group-events">
                    {group.numEvents <= 1 ? `${group.numEvents} Event` : `${group.numEvents} Events`} 
                  </p>
                  <p className="dot">&#903;</p> 
                  <p className="group-private" >
                  {group.private ? "Private" : "Public"}
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

export default GroupList;


