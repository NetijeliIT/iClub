export interface MealType {
    id: string;
    name: string;
    description: string;
    image: string;
    price: number;
}

export type MealWithCount = MealType & { count: number }

export interface LoginForm {
    phoneNumber: string;
    password: string;
}

export interface CategoryType {
    id?: string;
    title: string;
}