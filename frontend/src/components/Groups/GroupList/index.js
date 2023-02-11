import "./GroupList.css";
import { getGroups } from "../../../store/groups";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

function GroupList() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.groups);
  const groups = data.Groups;
  const [group, setGroup] = useState("");

  useEffect(() => {
    dispatch(getGroups());
  }, [dispatch]);

  //   if (groups) return null;
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
        <div className="group-list_item" key={group.id}>
          {groups !== null &&
            groups.map((group) => (
              <div className="group-list_item" key={group.id}>
                {group.name}
                {group.about}
                {group.city}
                {group.numMembers}
                {`${group.private}`}
                <img src={group.previewImage} />
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default GroupList;
