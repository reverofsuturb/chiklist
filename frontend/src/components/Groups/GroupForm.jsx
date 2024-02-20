import { useState } from "react";
import { useDispatch } from "react-redux";
import { makeGroup, makeGroupImage, putGroup } from "../../store/groups";
import "./GroupForm.css";

export function GroupForm({ group, formType }) {
  const dispatch = useDispatch();
  const [cityState, setCityState] = useState(
    group?.city ? group.city + ", " + group.state : ""
  );
  const [name, setName] = useState(group?.name ? group.name : "");
  const [about, setAbout] = useState(group?.about ? group.about : "");
  const [type, setType] = useState(group?.type ? group.type : "In person");
  const [privateGroup, setPrivateGroup] = useState(
    group?.private ? group.private : false
  );
  const [imageUrl, setImageUrl] = useState("");
  const [errors, setErrors] = useState({});
  const onSubmit = async (e) => {
    e.preventDefault();
    let cityArr = cityState.split(", ");

    if (formType === "Create Group") {
      const newGroup = {
        name,
        about,
        type: type,
        private: privateGroup,
        city: cityArr[0],
        state: cityArr[1],
      };
      const madeGroup = await dispatch(makeGroup(newGroup));
      if (madeGroup && madeGroup.errors) {
        console.log(madeGroup.errors);
        return setErrors(madeGroup.errors);
      }
      // console.log(newGroup);
      const preview = imageUrl ? true : false;
      const groupImage = {
        groupId: madeGroup.id,
        url: imageUrl,
        preview,
      };
      console.log(groupImage);
      dispatch(makeGroupImage(groupImage));
    }
    if (formType === "Edit Group") {
      const editGroup = {
        id: group.id,
        name,
        about,
        type: type,
        private: privateGroup,
        city: cityArr[0],
        state: cityArr[1],
      };
      const editedGroup = await dispatch(putGroup(editGroup));
      if (editedGroup && editedGroup.errors) {
        console.log(editedGroup.errors);
        return setErrors(editedGroup.errors);
      }

      console.log(editedGroup);
    }
  };

  return (
    <div className="gf-container">
      <div className="gf-caption">BECOME AN ORGANIZER</div>
      <h2 className="gf-header">
        We'll walk you through a few steps to build your local community.
      </h2>
      <form className="gf-form" onSubmit={onSubmit}>
        <label className="gf-label">
          First, set your group&apos;s location.
          <span className="gf-span">
            Meetup groups meet locally, in person and online we&apos;ll connect
            you with people in your area, and more can join you online.
          </span>
          <input
            className="gf-input"
            type="text"
            value={cityState}
            placeholder="City, STATE"
            onChange={(e) => setCityState(e.target.value)}
          />
        </label>
        {errors.city && <p className="gf-errors">{errors.city}</p>}
        {errors.state && <p className="gf-errors">{errors.state}</p>}
        <label className="gf-label">
          What will your group&apos;s name be?
          <span className="gf-span">
            Choose a name that will give people a clear idea of what the group
            is about. Feel free to get creative! You can edit this later if you
            change your mind.
          </span>
          <input
            className="gf-input"
            type="text"
            value={name}
            placeholder="What is your group name?"
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        {errors.name && <p className="gf-errors">{errors.name}</p>}
        <label className="gf-label">
          Now describe what your group will be about
          <span className="gf-span">
            People will see this when we promote your group, but you&apos;ll be
            able to add to it later, too.
            <ul>
              <li>What&apos;s the purpose of the group?</li>
              <li>Who should join?</li>
              <li>What will you do at your events</li>
            </ul>
          </span>
          <textarea
            className="gf-textarea"
            type="text"
            value={about}
            placeholder="Please write at least 30 characters"
            onChange={(e) => setAbout(e.target.value)}
          />
        </label>
        {errors.about && <p className="gf-errors">{errors.about}</p>}
        <label className="gf-label">
          Final steps
          <span className="gf-span">
            Is this an in person or online group?
            <select
              className="gf-select"
              onChange={(e) => setType(e.target.value)}
            >
              <option value="In person">In person</option>
              <option value="Online">Online</option>
            </select>
          </span>
          <span className="gf-span">
            Is this group private or public?
            <select
              className="gf-select"
              onChange={(e) => setPrivateGroup(e.target.value)}
            >
              <option value={false}>Public</option>
              <option value={true}>Private</option>
            </select>
          </span>
        </label>
        {errors.private && <p className="gf-errors">{errors.private}</p>}
        <label className="gf-label">
          Please add in image url for your group below:
          <input
            className="gf-input"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            disabled={group ? true : false}
            placeholder="Image url"
          />
        </label>
        <button className="gf-button">
          {formType === "Edit Group" ? "Edit Group" : "Create Group"}
        </button>
      </form>
    </div>
  );
}
