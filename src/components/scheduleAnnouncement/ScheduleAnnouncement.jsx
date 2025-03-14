import React from 'react'

function ScheduleAnnouncement({announcementItem}) {
  return (
    <div><h1 className="text-3xl font-bold text-[#fff]">Schedule</h1>{announcementItem.scheduleAnnouncement}</div>
  )
}

export default ScheduleAnnouncement