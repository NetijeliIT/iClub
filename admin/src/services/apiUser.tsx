import { UserForm } from "../types";
import api from "./api";

export async function getUser() {
    const res = await api.get(`/user`);
    return res.data;
}

export async function createUser(data: UserForm) {
    const res = await api.post('/user', data);
    return res.data;
}

export async function deleteUser(id: string) {
    const res = await api.delete(`/user/${id}`);
    return res.data;
}