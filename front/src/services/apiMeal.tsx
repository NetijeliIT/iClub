import api from "./api";

export async function getMeal({ page = 1, pageSize = 10 }: { page?: number, pageSize?: number }) {
    const res = await api.get(`/product`, {
        params: { page: page, take: pageSize },
    });
    return res.data;
}
