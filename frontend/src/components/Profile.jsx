import React from "react"
import "../styles/Profile.css"

function Profile({ profile, onDelete }) {
    const formattedDate = new Date(profile.created_at).toLocaleDateString("en-US");

    return <div className="profile-container">
        <p className="profile-title">{profile.title}</p>
        <p className="profile-ingredients">{profile.ingredients}</p>
        <p className="profile-tools">{profile.tools}</p>
        <p className="profile-budget">{profile.budget}</p>
        <p className="profile-cookTime">{profile.cookTime}</p>
        <p className="profile-date">{formattedDate}</p>
        <button className="profile-delete" onClick={() => onDelete(profile.id)}>Delete</button>
    </div>
}

export default Profile;