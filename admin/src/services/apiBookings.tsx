import api from "./api";

export async function getBookings({page,pageSize}:{page:number,pageSize:number}) {
    const res = await api.get(`/bookings/admin`,   {
        params: { page: page, take: pageSize }});
    return res.data;
}

export async function deleteBooking({ bookingId, detailId }: { bookingId: string; detailId: string }) {
    try {
      const res = await api.delete(`/bookings/admin/${bookingId}/details/${detailId}`);
      return res.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to delete booking detail");
    }
  }