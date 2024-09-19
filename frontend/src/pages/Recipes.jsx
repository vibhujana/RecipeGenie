import { useState, useEffect } from 'react';
import api from '../api';
import Recipe from '../components/Recipe';
import "../styles/Recipes.css";
import LoadingIndicator from '../components/LoadingIndicator'

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
            console.log(res.data);
        })
        .catch((err) => alert(err));
    };

    const getProfiles = () => {
        api.get("/api/profiles/")
        .then((res) => {
            setProfiles(res.data);
            console.log(res.data);
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
        setLoading(true)
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
            setLoading(false)
        })
        .catch((error) => {
            if (error.response) {
                console.error('Error response:', error.response);
                alert('Error: ' + (error.response.data.detail || error.response.statusText));
            } else if (error.request) {
                console.error('Error request:', error.request);
                alert('No response received from the server.');
            } else {
                console.error('Error message:', error.message);
                alert('Error: ' + error.message);
            }
        });
    }
    
    

    return (
        <div>
            <div>
                <h2>Recipes</h2>
                {recipes.map((recipe) => (
                    <Recipe recipe={recipe} onDelete={deleteRecipe} key={recipe.id} />
                ))}
            </div>
            <h2>Create a Recipe</h2>
            <form onSubmit={createRecipe}>
                <label htmlFor="profileId">Select Profile</label>
                <br />
                <select
                    id="profileId"
                    value={profileId}
                    required
                    onChange={(e) => setProfileId(e.target.value)}
                >
                    <option value="">--Select Profile--</option>
                    {profiles.map((profile) => (
                        <option key={profile.id} value={profile.id}>
                            {profile.title} {/* Assuming profiles have a 'name' attribute */}
                        </option>
                    ))}
                </select>
                <br />
                <label htmlFor="overrides">Overrides (optional)</label>
                <br />
                <textarea
                    id="overrides"
                    value={overrides}  // Bind to the string value of overrides
                    onChange={(e) => setOverrides(e.target.value)}  // Update as a string
                    placeholder='Enter any customizations or overrides as text'
                />
                <br />
                {loading && <LoadingIndicator />}
                <input type="submit" value="Create Recipe" />
            </form>
        </div>
    );
}

export default Recipes;