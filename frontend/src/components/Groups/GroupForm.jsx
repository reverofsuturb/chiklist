function GroupForm() {
  return (
  <>
  <form onSubmit={onSubmit}>
    <label>
      First, set your group's location. <span>Meetup groups meet locally, in person and online we'll connect you with people in your area, and more can join you online.</span>
      <input type="text" value={}  placeholder="City, STATE"/>
    </label>
    </form></>
  )
}

export default GroupForm
