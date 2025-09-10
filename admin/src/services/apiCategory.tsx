import { CategoryForm } from "../types";
import api from "./api";

export async function getCategory(data:{page:number,pageSize:number}) {
    const res = await api.get(`/category`);
    return res.data;
}

export async function addCategory(data: CategoryForm) {
    const res = await api.post('/category', data);
    return res.data;
}

export async function updateCategory({ id, data }: { id: string, data: CategoryForm }) {
    const res = await api.patch(`/category/${id}`, data);
    return res.data;
}

export async function deleteCategory(id: string) {
    const res = await api.delete(`/category/${id}`);
    return res.data;
}