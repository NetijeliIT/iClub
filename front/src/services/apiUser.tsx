import api from "./api";

export async function getUser() {
    const res = await api.get(`/auth/user/me`);
    return res.data;
}
