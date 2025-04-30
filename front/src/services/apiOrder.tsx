import { MealWithCount } from "../types";
import api from "./api";

export async function placeOrder(data: { orderItems: MealWithCount[] }) {
    const res = await api.post(`/orders`, data);
    return res.data;
}

export async function getMyOrders() {
    const res = await api.get("/orders/my");
    return res.data
}

export async function cancelOrder(id: string) {
    const res = await api.patch(`/orders/${id}/cancel`)
}