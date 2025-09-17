import api from "./api";

export async function getBookings(date:string) {
    
    const res = await api.post(`/bookings/date`,{
        bookingDate:date
    });
    console.log(res.data);
    
    return res.data;
}

export async function createBooking(data:any){
    console.log(data);
    
    const res = await api.post(`/bookings`,data);
    return res.data;
}

export async function updateBooking(data:any) {
    console.log(data);

    const res = await api.post(`/bookings/${data.id}/details`,{
            tv:data.tv,
            lesson:data.lesson
    });
    return res.data;
}

export async function getMyBookings() {
    const res = await api.get(`/bookings/details/my`);
    return res.data;
}

export async function deleteBooking(data:{bookingId:string,detailsId:string}) {
    const res = await api.delete(`/bookings/${data.bookingId}/details/${data.detailsId}`);
    return res.data;
}