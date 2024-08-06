import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { makeGroup, makeGroupImage, putGroup } from "../../store/groups";
import "./GroupForm.css";

export function GroupForm({ group, formType }) {
  const { user } = useSelector((state) => state.session)
  const dispatch = useDispatch();
  const navigate = useNavigate();
if (!user) navigate('/')
  const [cityState, setCityState] = useState(
    group?.city ? group.city + ", " + group.state : ""
  );
  const [name, setName] = useState(group?.name ? group.name : "");
  const [about, setAbout] = useState(group?.about ? group.about : "");
  const [type, setType] = useState(group?.type ? group.type : "");
  const [privateGroup, setPrivateGroup] = useState(
    group?.private === false || group?.private === true ? group.private : ""
  );
  const [imageUrl, setImageUrl] = useState(
    group?.GroupImages[0]?.id ? group.GroupImages[0].url : ""
  );
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
        imageUrl,
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
      navigate(`/groups/${madeGroup.id}`);
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
        imageUrl,
      };
      const editedGroup = await dispatch(putGroup(editGroup));
      if (editedGroup && editedGroup.errors) {
        console.log(editedGroup.errors);
        return setErrors(editedGroup.errors);
      }
      console.log(editedGroup);
      navigate(`/groups/${editedGroup.id}`);
    }
  };

  return (
    <div className="gf-container">
      <div className="gf-caption">BECOME AN ORGANIZER</div>
      <h2 className="gf-header">
        We&apos;ll walk you through a few steps to build your local community.
      </h2>
      <form className="gf-form" onSubmit={onSubmit}>
        <label className="gf-label">
          Set your group&apos;s location.
          <span className="gf-span">
            Meetup groups meet locally, in person, and online. We&apos;ll
            connect you with people in your area.
          </span>
          <input
            className="gf-input"
            type="text"
            value={cityState}
            placeholder="City, STATE"
            onChange={(e) => setCityState(e.target.value)}
          />
          {errors.city && <p className="gf-errors">{errors.city}</p>}
          {errors.state && <p className="gf-errors">{errors.state}</p>}
        </label>
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
          {errors.name && <p className="gf-errors">{errors.name}</p>}
        </label>
        <label className="gf-label">
          Describe the purpose of your group.
          <span className="gf-span">
            People will see this when we promote your group, but you&apos;ll be
            able to add to it later, too.
            <ul className="gf-list">
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
          {errors.about && <p className="gf-errors">{errors.about}</p>}
        </label>
        <label className="gf-label">
          Final steps
          <span className="gf-span">
            Is this an in person or online group?
            <select
              className="gf-select"
              onChange={(e) => setType(e.target.value)}
              value={type}
            >
              <option value="">(select one)</option>
              <option value="In person">In person</option>
              <option value="Online">Online</option>
            </select>
          </span>
          {errors.type && <p className="gf-errors">{errors.type}</p>}
          <span className="gf-span">
            Is this group private or public?
            <select
              className="gf-select"
              onChange={(e) => setPrivateGroup(e.target.value)}
              value={privateGroup}
            >
              <option value="">(select one)</option>
              <option value={false}>Public</option>
              <option value={true}>Private</option>
            </select>
          </span>
          {errors.private && <p className="gf-errors">{errors.private}</p>}
        </label>
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
          {errors.imageUrl && <p className="gf-errors">{errors.imageUrl}</p>}
        </label>
        <button className="gf-button">
          {formType === "Edit Group" ? "Edit Group" : "Create Group"}
        </button>
      </form>
    </div>
  );
}
