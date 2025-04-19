export interface MealType {
    id: number;
    name: string;
    desc: string;
    image: string;
    price: number;
}

export type MealWithCount = MealType & { count: number }
