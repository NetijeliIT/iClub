export interface LoginForm {
    username: string;
    password: string;
}

export interface CategoryForm {
    id?: string;
    title: string;
    // description: string;
}

export interface MealForm {
    id?: string;
    name: string;
    price: number;
    description: string;
    categoryId: string;
}

export interface UserForm {
    id?: string;
    firstName: string;
    secondName: string;
    phoneNumber: string;
    password: string;
}

export type Category = {
    id?: string;
    title: string;
    // description: string;
    createdAt: Date;
}

export type Meal = {
    id?: string;
    name: string;
    price: number;
    description: string;
    categoryId: string;
}
