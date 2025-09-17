import api from "./api";

export async function getOrders({page,pageSize}:{page:number,pageSize:number}) {
    const res = await api.get(`/orders`,   {
        params: { page: page, take: pageSize }});
    return res.data;
}
export async function updateStatusOrder(data: { id: string, status: string }) {
    const res = await api.patch(`/orders/${data.id}`, { status: data.status });
    return res.data;
}

export async function completeOrder(data: { id: string }) {
    const res = await api.patch(`/orders/admin/${data.id}/complete`);
    return res.data;
}

export async function cancelOrder(data: { id: string }) {
    const res = await api.patch(`/orders/admin/${data.id}/cancel`);
    return res.data;
}