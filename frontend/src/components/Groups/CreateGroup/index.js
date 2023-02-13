import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { createGroup } from "../../../store/groups";
import "./CreateGroup.css";

function CreateGroup() {
  const dispatch = useDispatch();
  let [privateOrPublic, setPrivateOrPublic] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [inPersonOrOnline, setInPersonOrOnline] = useState("");
  const [groupLocation, setGroupLocation] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const history = useHistory();
  const currentUser = useSelector((state) => state.session.user)

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
    if (!inPersonOrOnline) {
        errors["inPersonOrOnline"] = "Please select in person or online";
    }
    if (!privateOrPublic) {
        errors["privateOrPublic"] = "Please select private or public";
    }
    if (!imageUrl) {
      errors["imageUrl"] = "Image is required";
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
    } else {
      const cityState = groupLocation.split(",");
      const [city, state] = cityState;

        if (privateOrPublic === "private") {
            privateOrPublic = true;
        } else {
            privateOrPublic = false;
        }

      const group = {
        name: groupName,
        about: groupDescription,
        type: inPersonOrOnline,
        isPrivate: privateOrPublic,
        city,
        state,
        imageUrl,
      };
      const singleGroup = await dispatch(createGroup(group, currentUser))

      if (singleGroup) {
        setSubmitted(true);
        history.push(`/groups/${singleGroup.id}`);
      }
      
    }
  };

  const isButtonDisabled = !groupName || !groupDescription;

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
        <h1>Start a New Group</h1>
        <h2>Set your group's location</h2>
        <p>
          Meetup groups meet locally, in person, and online. We'll connect you
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

        <h2>What will your group's name be?</h2>
        <p>
          Choose a name that will give people a clear idea of what the group is
          about. Feel free to get creative! You can edit this later if you
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
        <div className="section">
          <h2>Describe the purpose of your group.</h2>
          <p>
            People will see this when we promote your group, but you'll be able
            to add to it later, too.
          </p>
          <ol>
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
          <p>Final steps..</p>
        </div>
        <div className="section">
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
            <option value="In Person">In Person</option>
            <option value="Online">Online</option>
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
            <option value="Private">Private</option>
            <option value="Public">Public</option>
          </select>

          <label>Please add an image URL for your group below:</label>
          {errors["imageUrl"] && (
            <div className="error">{errors["imageUrl"]}</div>
          )}
          <input
            type="text"
            name="imageUrl"
            placeholder="Image Url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>

        <button type="submit" disabled={isButtonDisabled}>
          Create Group
        </button>
      </form>
    </>
  );
}

export default CreateGroup;
