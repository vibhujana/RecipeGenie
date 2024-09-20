import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import "../styles/Recipe.css";

function Recipe({ recipe, onDelete }) {
    const [expanded, setExpanded] = useState(false);
    const formattedDate = new Date(recipe.created_at).toLocaleDateString("en-US");

    return (
        <Card className="recipe-container mb-3" onClick={() => setExpanded(!expanded)}>
            <Card.Body>
                <Card.Title className="recipe-title">
                    {recipe.title}
                </Card.Title>
                {expanded && (
                    <>
                        <Card.Text className="recipe-ingredients">
                            <strong>Ingredients:</strong> {recipe.ingredients}
                        </Card.Text>
                        <Card.Text className="recipe-instructions">
                            <strong>Instructions:</strong> {recipe.instructions}
                        </Card.Text>
                        <Card.Text className="recipe-preparationTime">
                            <strong>Preparation Time:</strong> {recipe.preparation_time} minutes
                        </Card.Text>
                        <Card.Text className="recipe-cookTime">
                            <strong>Cook Time:</strong> {recipe.cook_time} minutes
                        </Card.Text>
                        <Card.Text className="recipe-servings">
                            <strong>Servings:</strong> {recipe.servings}
                        </Card.Text>
                        <Card.Text className="recipe-nutritionFacts">
                            <strong>Nutritional Facts:</strong> {recipe.nutrition_facts}
                        </Card.Text>
                        <Card.Text className="recipe-date">
                            <strong>Created on:</strong> {formattedDate}
                        </Card.Text>
                    </>
                )}
                <Button variant="danger" onClick={(e) => { e.stopPropagation(); onDelete(recipe.id); }}>
                    Delete
                </Button>
            </Card.Body>
        </Card>
    );
}

export default Recipe;
