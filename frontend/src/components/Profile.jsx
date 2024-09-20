import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import "../styles/Profile.css";

function Profile({ profile, onDelete }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const formattedDate = new Date(profile.created_at).toLocaleDateString("en-US");

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <Card className="profile-container mb-3" onClick={handleToggle} style={{ cursor: 'pointer' }}>
            <Card.Header>
                <h5 className="profile-title">{profile.title}</h5>
            </Card.Header>
            {isExpanded && (
                <Card.Body>
                    <p className="profile-ingredients"><strong>Ingredients:</strong> {profile.ingredients}</p>
                    <p className="profile-tools"><strong>Tools:</strong> {profile.tools}</p>
                    <p className="profile-budget"><strong>Budget:</strong> {profile.budget}</p>
                    <p className="profile-cookTime"><strong>Cook Time:</strong> {profile.cookTime}</p>
                    <p className="profile-date"><strong>Created on:</strong> {formattedDate}</p>
                    <Button variant="danger" onClick={(e) => { e.stopPropagation(); onDelete(profile.id); }}>Delete</Button>
                </Card.Body>
            )}
        </Card>
    );
}

export default Profile;
