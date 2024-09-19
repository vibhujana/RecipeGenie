import React from "react";
import "../styles/Recipe.css";

function Recipe({ recipe, onDelete }) {
    const formattedDate = new Date(recipe.created_at).toLocaleDateString("en-US");

    return (
        <div className="recipe-container">
            <p className="recipe-title">{recipe.title}</p>
            <p className="recipe-ingredients">{recipe.ingredients}</p>
            <p className="recipe-instructions">{recipe.instructions}</p>
            <p className="recipe-preparationTime">Preparation Time: {recipe.preparation_time} minutes</p>
            <p className="recipe-cookTime">Cook Time: {recipe.cook_time} minutes</p>
            <p className="recipe-servings">Servings: {recipe.servings}</p>
            <p className="recipe-nutritionFacts">{recipe.nutrition_facts}</p>
            <p className="recipe-date">Created on: {formattedDate}</p>
            <button className="recipe-delete" onClick={() => onDelete(recipe.id)}>Delete</button>
        </div>
    );
}

export default Recipe;
