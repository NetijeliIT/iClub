import { UserForm } from "../types";
import api from "./api";

export async function getUser(data:{page:number,pageSize:number}) {
    const res = await api.get(`/user`,{
        params:{
            page:data.page,
            take:data.pageSize
        }
    });
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