// src/MealContext.js
import React, { createContext, useState } from 'react';

export const MealContext = createContext();

export const MealProvider = ({ children }) => {
  const [meals, setMeals] = useState([]);

  const addMeal = (meal) => {
    setMeals([...meals, meal]);
  };

  const deleteMeal = (mealName) => {
    setMeals(meals.filter(meal => meal.mealName !== mealName));
  };

  const editMeal = (updatedMeal) => {
    setMeals(meals.map(meal => (meal.mealName === updatedMeal.mealName ? updatedMeal : meal)));
  };

  return (
    <MealContext.Provider value={{ meals, addMeal, deleteMeal, editMeal }}>
      {children}
    </MealContext.Provider>
  );
};