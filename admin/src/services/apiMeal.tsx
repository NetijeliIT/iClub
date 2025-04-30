import { MealForm } from "../types";
import api from "./api";

export async function getMeal({ page = 1, pageSize = 10 }: { page?: number, pageSize?: number }) {
    const res = await api.get(`/product`, {
        params: { page: page, take: pageSize },
    });
    return res.data;
}

export async function addMeal({ data, image }: { data: MealForm, image: FormData }) {
    const res = await api.post('/product', data);
    await api.post(`/product/${res.data?.response?.id}/image`, image, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    return res.data;
}

export async function updateMeal({ data, id }: { id: string, data: MealForm }) {
    const res = await api.patch(`/product/${id}`, data);
    return res.data;
}

export async function deleteMeal(id: string) {
    const res = await api.delete(`/product/${id}`);
    // await api.delete(`/product/${id}/image`);
    return res.data;
}