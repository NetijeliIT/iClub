import { LoginForm } from "../types";
import api from "./api";

export async function login(data: LoginForm) {
    const res = await api.post(`/auth/user/login`, data);
    return res.data;
}