import { useState, useEffect } from 'react';
import api from '../api';
import Profile from '../components/Profile';
import "../styles/Profiles.css";
import NavBar from "../components/Navbar";
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

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
            .then((res) => { setProfiles(res.data); console.log(res.data); })
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
    };

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
    };

    return (
        <Container>
            <NavBar />
            <Row>
                <Col md={8}>
                    <h2 className="mt-4">Profiles</h2>
                    {profiles.map((profile) => (
                        <Profile profile={profile} onDelete={deleteProfile} key={profile.id} />
                    ))}
                </Col>
                <Col md={4}>
                    <h2 className="mt-4">Create a Profile</h2>
                    <Form onSubmit={createProfile} className="mb-4">
                        <Form.Group controlId="title">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={title}
                                required
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="ingredients">
                            <Form.Label>Ingredients</Form.Label>
                            <Form.Control
                                as="textarea"
                                value={ingredients}
                                required
                                onChange={(e) => setIngredients(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="tools">
                            <Form.Label>Tools</Form.Label>
                            <Form.Control
                                as="textarea"
                                value={tools}
                                required
                                onChange={(e) => setTools(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="budget">
                            <Form.Label>Budget</Form.Label>
                            <Form.Control
                                type="number"
                                value={budget}
                                required
                                onChange={(e) => setBudget(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="cookTime">
                            <Form.Label>Cook Time</Form.Label>
                            <Form.Control
                                type="number"
                                value={cookTime}
                                required
                                onChange={(e) => setCookTime(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="skillLevel">
                            <Form.Label>Skill Level</Form.Label>
                            <Form.Control
                                as="select"
                                value={skillLevel}
                                required
                                onChange={(e) => setSkillLevel(e.target.value)}
                            >
                                {skillLevels.map((level) => (
                                    <option key={level} value={level}>{level}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="dietaryRestrictions">
                            <Form.Label>Dietary Restrictions</Form.Label>
                            <Form.Control
                                type="text"
                                value={dietaryRestrictions}
                                required
                                onChange={(e) => setDietaryRestrictions(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">Create Profile</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default Profiles;
