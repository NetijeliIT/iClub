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
    image?: string;
}

export interface BookingForm {
    id?: string;
    bookingDate: string;
    details: {
        id: string;
        lesson: string;
        tv: boolean;
        userId: string;
        bookingId: string;
        user: {
            id: string;
            firstName: string;
            secondName: string;
            studentId: string;
            department: string;
            isTeacher: boolean;
            phoneNumber: string;
            createdAt: string;
            updatedAt: string;
        };
        createdAt: string;
        updatedAt: string;
    }[];
    createdAt: string;
    updatedAt: string;
}


export interface UserForm {
    id?: string;
    firstName: string;
    secondName: string;
    phoneNumber: string;
    password: string;
    isTeacher: boolean;
    department?: string;
    studentId?:string; 
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

export type Order = {
    id: string;
    orderItems: { quantity: number; product: { name: string } }[];
    status: string;
    user: { firstName: string; secondName: string; phoneNumber: string };
}
