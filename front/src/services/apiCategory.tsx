import api from "./api";

export async function getCategory() {
    const res = await api.get(`/category`);
    return res.data;
}

export async function getCategoryById(id: string) {
    const res = await api.get(`/category/${id}`);
    return res.data;
}


