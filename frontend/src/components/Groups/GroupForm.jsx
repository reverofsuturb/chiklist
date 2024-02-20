import { useState } from "react";
import { useDispatch } from "react-redux";
import { makeGroup, makeGroupImage } from "../../store/groups";

export function GroupForm() {
  const dispatch = useDispatch();
  const [cityState, setCityState] = useState("");
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [type, setType] = useState("In person");
  const [privateGroup, setPrivateGroup] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    let cityArr = cityState.split(", ");

    const group = {
      name,
      about,
      type: type,
      private: privateGroup,
      city: cityArr[0],
      state: cityArr[1],
    };
    const newGroup = await dispatch(makeGroup(group));
    console.log(newGroup);
    const preview = imageUrl ? true : false;
    const groupImage = {
      groupId: newGroup.id,
      url: imageUrl,
      preview,
    };
    console.log(groupImage);
    dispatch(makeGroupImage(groupImage));
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
          />
        </label>
        <button>Create Group</button>
      </form>
    </>
  );
}
