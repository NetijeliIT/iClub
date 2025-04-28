import api from "./api";

export async function getOrders() {
    const res = await api.get(`/orders`);
    return res.data;
}
export async function updateStatusOrder(data: { id: string, status: string }) {
    const res = await api.patch(`/orders/${data.id}`, { status: data.status });
    return res.data;
}