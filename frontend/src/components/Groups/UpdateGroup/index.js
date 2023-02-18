import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { getGroupsDetails, updateGroup } from "../../../store/groups";
import "./UpdateGroup.css";

function UpdateGroup() {
  const dispatch = useDispatch();
  const { groupId } = useParams();
  const singleGroup = useSelector((state) => state.groups.singleGroup);


  const city = singleGroup.city;
  const state = singleGroup.state;
  const location = `${city}, ${state}`;

  const type = singleGroup.type;

  const [privateOrPublic, setPrivateOrPublic] = useState('');
  const [imageUrl, setImageUrl] = useState(""); // This is optional
  const [inPersonOrOnline, setInPersonOrOnline] = useState('');
  const [groupLocation, setGroupLocation] = useState(location || '');
  const [groupName, setGroupName] = useState(singleGroup.name || '');
  const [groupDescription, setGroupDescription] = useState(singleGroup.about || '');
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const history = useHistory();
  const currentUser = useSelector((state) => state.session.user);

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    let errors = {};

    if (!groupLocation) {
      errors["groupLocation"] = "Location is required";
    }

    if (!groupName) {
      errors["groupName"] = "Name is required";
    }

    if (groupDescription.length < 50) {
      errors["groupDescription"] = "Description needs 50 or more characters";
    }


    if (Object.keys(errors).length > 0) {
      setErrors(errors);
    } else {
      const cityState = groupLocation.split(",");
      const [city, state] = cityState;
      let isPrivate;

      if (privateOrPublic === "private") {
        setPrivateOrPublic(true)
        isPrivate = true;

      } else {
        setPrivateOrPublic(false)
        isPrivate = false;
      }

       

      const group = {
        id: groupId,
        name: groupName,
        about: groupDescription,
        type: inPersonOrOnline,
        isPrivate: isPrivate,
        city,
        state,
      };
      const singleGroup = await dispatch(updateGroup(group));

      if (singleGroup) {
        setSubmitted(true);
        history.push(`/groups/${singleGroup.id}`);
      }
    }
  };

  useEffect(() => {
    const updateFields = async () => {
      const groupDetails = await dispatch(getGroupsDetails(groupId));
      if (currentUser === null || currentUser.id !== groupDetails.Organizer.id) {
        history.push(`/groups/${groupId}`);
      }
      const privateOrPublic =
        groupDetails.private === true ? "private" : "public";
        setPrivateOrPublic(privateOrPublic);
        setInPersonOrOnline(groupDetails.type)
        setGroupLocation(`${groupDetails.city}, ${groupDetails.state}`);
        setGroupName(groupDetails.name);
        setGroupDescription(groupDetails.about);
    };
    updateFields();
  }, [dispatch]);

  

  

  const isButtonDisabled = !groupName || !groupDescription;

  const buttonClass = isButtonDisabled ? "disabled" : "submit-button";

  return (
    <>
      <form onSubmit={handleSubmit}>
        {Object.keys(errors).length > 0 && (
          <div className="alert error">
            {Object.values(errors).map((error) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        )}
        {submitted && <div className="alert alert-success">Group created!</div>}
        <div className='title-container'> 
        <h1>Update your Group</h1>
        </div>
        <div className="location-create-group">
        <h2>Update your group's location</h2>
        <p>
          Gatherly groups meet locally, in person, and online. We'll connect you
          with people in your area.
        </p>
        {errors["groupLocation"] && (
          <div className="error">{errors["groupLocation"]}</div>
        )}
        <input
          type="text"
          placeholder="City, STATE"
          value={groupLocation}
          onChange={(e) => setGroupLocation(e.target.value)}
        />
        </div>
        <div className="groups-name">

        <h2>What will your group's name be?</h2>
        <p>
          Choose a name that will give people a clear idea of what the group is
          about. <br/> Feel free to get creative! You can edit this later if you
          change your mind.
        </p>
        {errors["groupName"] && (
          <div className="error">{errors["groupName"]}</div>
        )}
        <input
          type="text"
          placeholder="What is your group name?"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        </div>
        <div className="abouts">
          <h2>Describe the purpose of your group.</h2>
          <p>
            People will see this when we promote your group, but you'll be able
            to add to it later, too.
          </p>
          <ol className="list">
            <li>What's the purpose of the group?</li>
            <li>Who should join?</li>
            <li>What will you do at your events?</li>
          </ol>
          {errors["groupDescription"] && (
            <div className="error">{errors["groupDescription"]}</div>
          )}
          <textarea
            name="groupDescription"
            placeholder="Please write at least 50 characters"
            value={groupDescription}
            onChange={(e) => setGroupDescription(e.target.value)}
          />
        </div>

        <div className="final-section">
          <h2>Final steps..</h2>

          <label>Is this an in-person or online group?</label>
          {errors["inPersonOrOnline"] && (
            <div className="error">{errors["inPersonOrOnline"]}</div>
          )}
          <select
            name="inPersonOrOnline"
            value={inPersonOrOnline}
            onChange={(e) => setInPersonOrOnline(e.target.value)}
          >
            <option value="">Select one</option>
            <option value="in person">In Person</option>
            <option value="online">Online</option>
          </select>

          <label>Is this group private or public?</label>
          {errors["privateOrPublic"] && (
            <div className="error">{errors["privateOrPublic"]}</div>
          )}
          <select
            name="privateOrPublic"
            value={privateOrPublic}
            onChange={(e) => setPrivateOrPublic(e.target.value)}
          >
            <option value="">Select one</option>
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>

          {/* <label>Please add an image URL for your group below:</label>
          {errors["imageUrl"] && (
            <div className="error">{errors["imageUrl"]}</div>
          )}
          <input
            type="text"
            name="imageUrl"
            placeholder="Image Url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          /> */}
        </div>

        <button className={buttonClass} type="submit" disabled={isButtonDisabled}>
          Update Group
        </button>
      </form>
    </>
  );
}

export default UpdateGroup;
