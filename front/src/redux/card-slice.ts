
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { MealType, MealWithCount } from "../types";


export type CardInitialState = {
    meals: MealWithCount[],
    ids: string[]
}

const initialState = {
    meals: [],
    ids: []
} as CardInitialState;

export const card = createSlice({
    name: "card",
    initialState,
    reducers: {
        addToCard: (state, action: PayloadAction<MealType>) => {
            const mealToAdd: MealWithCount = { ...action.payload, count: 1 };
            state.meals.push(mealToAdd)
            state.ids.push(mealToAdd.id)
        },
        removeFromCard: (state, action: PayloadAction<string>) => {
            let meals = state.meals.filter((el: any) => el.id !== action.payload)
            let ids = state.ids.filter((el) => el !== action.payload);
            state.meals = meals
            state.ids = ids
        },
        incrementCount: (state, action: PayloadAction<string>) => {
            const existingMeal = state.meals.find((meal: any) => meal.id === action.payload);
            if (existingMeal) {
                existingMeal.count = (existingMeal.count ?? 1) + 1;
            }
        },
        decrementCount: (state, action: PayloadAction<string>) => {
            const existingMeal = state.meals.find(meal => meal.id === action.payload);
            if (existingMeal && existingMeal?.count > 1) {
                existingMeal.count = existingMeal.count - 1
            } else {
                let meals = state.meals.filter((el: any) => el.id !== action.payload)
                let ids = state.ids.filter((el) => el !== action.payload);
                state.meals = meals
                state.ids = ids
            }
        },
        emptyCard: (state) => {
            state.meals = [];
            state.ids = []
        }
    }
})

export const { addToCard, removeFromCard, incrementCount, decrementCount, emptyCard } = card.actions;
export default card.reducer