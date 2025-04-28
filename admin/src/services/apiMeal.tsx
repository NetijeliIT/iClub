import { MealForm } from "../types";
import api from "./api";

export async function getMeal({ page = 1, pageSize = 10 }: { page?: number, pageSize?: number }) {
    const res = await api.get(`/product`, {
        params: { page: page, take: pageSize },
    });
    return res.data;
}

export async function addMeal(data: MealForm) {
    const res = await api.post('/product', data);
    return res.data;
}

export async function updateMeal({ data, id }: { id: string, data: MealForm }) {
    const res = await api.patch(`/product/${id}`, data);
    return res.data;
}


export async function deleteMeal(id: string) {
    const res = await api.delete(`/product/${id}`);
    return res.data
}