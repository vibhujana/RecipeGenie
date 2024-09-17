import { useState, useEffect } from 'react';
import api from '../api';

function Profiles() {
    const [profiles, setProfiles] = useState([]);
    const [title, setTitle] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [tools, setTools] = useState('');
    const [budget, setBudget] = useState(0);
    const [cookTime, setCookTime] = useState(0);
    const [skillLevel, setSkillLevel] = useState('Beginner');
    const [dietaryRestrictions, setDietaryRestrictions] = useState('');

    const skillLevels = ['Beginner', 'Intermediate', 'Advanced'];

    useEffect(() => {
        getProfiles();
    }, []);

    const getProfiles = () => {
        api.get("/api/profiles/")
        .then((res) => {setProfiles(res.data); console.log(res.data);})
        .catch((err) => alert(err));
    };

    const deleteProfile = (id) => {
        api.delete(`/api/profiles/delete/${id}/`).then((res) => {
            if (res.status === 204) {
                alert('Profile deleted');
                getProfiles();  // Refresh profiles after deletion
            } else {
                alert('Profile deletion failed');
            }
        }).catch((error) => alert(error));
    }

    const createProfile = (e) => {
        e.preventDefault();
        const newProfile = {
            title,
            ingredients,
            tools,
            budget,
            cook_time: cookTime,
            skill_level: skillLevel,
            dietary_restrictions: dietaryRestrictions
        };

        api.post("/api/profiles/", newProfile).then((res) => {
            if (res.status === 201) {
                alert('Profile created');
                getProfiles();  // Refresh profiles after creation
            } else {
                alert('Profile creation failed');
            }
        }).catch((error) => alert(error));
    }

    return (
        <div>
            <h2>Profiles</h2>
                <ul>
                    {profiles.map(profile => (
                        <li key={profile.id}>
                            {profile.title} 
                            <button onClick={() => deleteProfile(profile.id)}>Delete</button>
                        </li>
                    ))}
                </ul>

            <h2>Create a Profile</h2>
            <form onSubmit={createProfile}>
                <label htmlFor="title">Title</label>
                <br />
                <input 
                    type="text" 
                    id="title"
                    value={title} 
                    required
                    onChange={(e) => setTitle(e.target.value)} 
                />
                <br />
                <label htmlFor="ingredients">Ingredients</label>
                <br />
                <textarea
                    id="ingredients"
                    value={ingredients}
                    required
                    onChange={(e) => setIngredients(e.target.value)}
                />
                <br />
                <label htmlFor="tools">Tools</label>
                <br />
                <textarea
                    id="tools"
                    value={tools}
                    required
                    onChange={(e) => setTools(e.target.value)}
                />
                <br />
                <label htmlFor="budget">Budget</label>
                <br />
                <input 
                    type="number" 
                    id="budget"
                    value={budget} 
                    required
                    onChange={(e) => setBudget(e.target.value)}
                />
                <br />
                <label htmlFor="cookTime">Cook Time</label>
                <br />
                <input 
                    type="number" 
                    id="cookTime"
                    value={cookTime} 
                    required
                    onChange={(e) => setCookTime(e.target.value)}
                />
                <br />
                <label htmlFor="skillLevel">Skill Level</label>
                <br />
                <select 
                    id="skillLevel"
                    value={skillLevel} 
                    required
                    onChange={(e) => setSkillLevel(e.target.value)}
                >
                    {skillLevels.map((level) => (
                        <option key={level} value={level}>{level}</option>
                    ))}
                </select>
                <br />
                <label htmlFor="dietaryRestrictions">Dietary Restrictions</label>
                <br />
                <input 
                    type="text" 
                    id="dietaryRestrictions"
                    value={dietaryRestrictions} 
                    required
                    onChange={(e) => setDietaryRestrictions(e.target.value)}
                />
                <br />
                <input type="submit" value="Create Profile" />
            </form>

        </div>
    );
}

export default Profiles;
