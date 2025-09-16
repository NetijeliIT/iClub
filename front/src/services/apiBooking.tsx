import api from "./api";

export async function getBookings(date:string) {
    
    const res = await api.post(`/bookings/date`,{
        bookingDate:date
    });
    console.log(res.data);
    
    return res.data;
}

export async function createBooking(data:any){
    const res = await api.post(`/bookings`,data);
    return res.data;
}

export async function updateBooking(data:any) {
    const res = await api.post(`/bookings/${data.id}/details`,data);
    return res.data;
}

export async function getMyBookings() {
    const res = await api.get(``);
    return res.data;
}