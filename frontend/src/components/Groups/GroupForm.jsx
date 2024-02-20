import { useState } from "react";
import { useDispatch } from "react-redux";
import { makeGroup, makeGroupImage, putGroup } from "../../store/groups";

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
      console.log(newGroup);
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
      console.log(editedGroup);
    }
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <label>
          First, set your group's location.
          <span>
            Meetup groups meet locally, in person and online we'll connect you
            with people in your area, and more can join you online.
          </span>
          <input
            type="text"
            value={cityState}
            placeholder="City, STATE"
            onChange={(e) => setCityState(e.target.value)}
          />
        </label>
        <label>
          What will your group's name be?
          <span>
            Choose a name that will give people a clear idea of what the group
            is about. Feel free to get creative! You can edit this later if you
            change your mind.
          </span>
          <input
            type="text"
            value={name}
            placeholder="What is your group name?"
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Now describe what your group will be about
          <span>
            People will see this when we promote your group, but you'll be able
            to add to it later, too.
            <ul>
              <li>What's the purpose of the group?</li>
              <li>Who should join?</li>
              <li>What will you do at your events</li>
            </ul>
          </span>
          <textarea
            type="text"
            value={about}
            placeholder="Please write at least 30 characters"
            onChange={(e) => setAbout(e.target.value)}
          />
        </label>
        <label>
          Final steps
          <span>
            Is this an in person or online group?
            <select onChange={(e) => setType(e.target.value)}>
              <option value="In person">In person</option>
              <option value="Online">Online</option>
            </select>
          </span>
          <span>
            Is this group private or public?
            <select onChange={(e) => setPrivateGroup(e.target.value)}>
              <option value={false}>Public</option>
              <option value={true}>Private</option>
            </select>
          </span>
        </label>
        <label>
          Please add in image url for your group below:
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            disabled={group ? true : false}
          />
        </label>
        <button>{formType === "Edit Group" ? "Edit Group" : "Create Group"}</button>
      </form>
    </>
  );
}
