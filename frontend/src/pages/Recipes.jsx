import { useState, useEffect } from 'react';
import api from '../api';
import Recipe from '../components/Recipe';
import "../styles/Recipes.css";
import LoadingIndicator from '../components/LoadingIndicator';
import NavBar from "../components/Navbar";
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';

function Recipes() {
    const [recipes, setRecipes] = useState([]);
    const [profiles, setProfiles] = useState([]);
    const [profileId, setProfileId] = useState('');
    const [overrides, setOverrides] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getRecipes();
        getProfiles();
    }, []);

    const getRecipes = () => {
        api.get("/api/recipes/")
        .then((res) => {
            setRecipes(res.data);
        })
        .catch((err) => alert(err));
    };

    const getProfiles = () => {
        api.get("/api/profiles/")
        .then((res) => {
            setProfiles(res.data);
        })
        .catch((err) => alert(err));
    }

    const deleteRecipe = (id) => {
        api.delete(`/api/recipes/delete/${id}/`)
        .then((res) => {
            if (res.status === 204) {
                alert('Recipe deleted');
                getRecipes();  // Refresh after deletion
            } else {
                alert('Recipe deletion failed');
            }
        }).catch((error) => alert(error));
    }

    const createRecipe = (e) => {
        setLoading(true);
        e.preventDefault();
        const newRecipeData = {
            profile_id: profileId,
            overrides: overrides,
            title: "Sample Recipe",  // Provide these values for now
            ingredients: "Sample ingredients",
            instructions: "Sample instructions",
            preparation_time: 10,
            cook_time: 20,
            servings: 4,
            nutrition_facts: "Sample nutrition facts"
        };
    
        api.post("/api/recipes/", newRecipeData)
        .then((res) => {
            if (res.status === 201) {
                alert('Recipe created');
                getRecipes();  // Refresh after creation
            } else {
                alert('Recipe creation failed');
            }
            setLoading(false);
        })
        .catch((error) => {
            setLoading(false);
            alert('Error: ' + (error.response?.data?.detail || error.message));
        });
    }

    return (
        <Container>
            <NavBar />
            <Row className="my-4">
                <Col>
                    <h2>Recipes</h2>
                    {recipes.length === 0 ? (
                        <p>No recipes available.</p>
                    ) : (
                        recipes.map((recipe) => (
                            <Recipe recipe={recipe} onDelete={deleteRecipe} key={recipe.id} />
                        ))
                    )}
                </Col>
            </Row>
            <Row className="my-4">
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>Create a Recipe</Card.Title>
                            <Form onSubmit={createRecipe}>
                                <Form.Group controlId="profileId">
                                    <Form.Label>Select Profile</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={profileId}
                                        required
                                        onChange={(e) => setProfileId(e.target.value)}
                                    >
                                        <option value="">--Select Profile--</option>
                                        {profiles.map((profile) => (
                                            <option key={profile.id} value={profile.id}>
                                                {profile.title} {/* Assuming profiles have a 'title' attribute */}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="overrides">
                                    <Form.Label>Overrides (optional)</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={overrides}
                                        onChange={(e) => setOverrides(e.target.value)}
                                        placeholder='Enter any customizations or overrides as text'
                                    />
                                </Form.Group>
                                {loading && <LoadingIndicator />}
                                <Button variant="primary" type="submit" className="mt-3">
                                    Create Recipe
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Recipes;
