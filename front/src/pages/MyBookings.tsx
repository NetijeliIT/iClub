import { useQuery } from "@tanstack/react-query";
import {  getMyBookings } from "../services/apiBooking";
import { useState } from "react";
import CancelModal from "../components/CancelModal"; // Assuming you have the CancelModal component

const MyBookingsPage = () => {
    const [show, setShow] = useState<string | null>(null);
    const { data, isLoading, error } = useQuery({
        queryKey: ["bookings"],
        queryFn: getMyBookings,
    });

    // Skeleton loader for the booking items
    const BookingSkeleton = () => (
        <div className="border-b border-gray-300 pb-4 px-2">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-1 animate-pulse"></div>
            <div className="h-5 bg-gray-200 rounded w-2/3 mb-1 animate-pulse"></div>
            <div className="h-5 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        </div>
    );

    if (error) return <div>Error loading bookings: {error.message}</div>;

    if (isLoading) {
        return (
            <div>
                <div className="space-y-2 mt-4">
                    {[...Array(3)].map((_, index) => (
                        <BookingSkeleton key={index} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <>
            <CancelModal isOpen={show} onClose={() => setShow(null)} />
            <div>
                <div className="space-y-2 mt-4">
                    {data?.map((booking: any) => (
                        <div
                            key={booking.id}
                            className="border-b border-gray-300 pb-4 px-2"
                        >
                            <div className="flex items-center justify-between">
                                <p className="text-gray-600 text-sm sm:text-base">
                                    {new Date(booking.bookingDate).toLocaleDateString("en-US", {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </p>
                                <p
                                    className={`font-medium text-md capitalize underline ${
                                        booking.status === "CANCELLED"
                                            ? "text-red-500"
                                            : booking.status === "CONFIRMED"
                                            ? "text-green-500"
                                            : "text-[#D4AF37]"
                                    }`}
                                >
                                    {booking.status.toLowerCase()}
                                </p>
                            </div>
                            <p className="text-gray-800 font-medium text-base sm:text-lg">
                                {booking?.details.map((detail: any, index: number) => {
                                    return booking?.details.length === index + 1
                                        ? `${detail.lesson}, ${detail.tv ? "With TV" : "Without TV"}`
                                        : `${detail.lesson}, ${detail.tv ? "With TV" : "Without TV"}, `;
                                })}
                            </p>
                            <div className="flex justify-between items-center">
                                <p className="text-[#D4AF37] font-bold text-base sm:text-lg">
                                    {booking.totalPrice} TMT
                                </p>
                                {booking.status === "PENDING" ? (
                                    <button
                                        onClick={() => setShow(booking.id)}
                                        className="text-red-600 cursor-pointer hover:opacity-90 duration-150"
                                    >
                                        Cancel
                                    </button>
                                ) : null}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default MyBookingsPage;
