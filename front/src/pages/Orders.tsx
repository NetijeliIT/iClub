import { useQuery } from "@tanstack/react-query";
import { getMyOrders } from "../services/apiOrder";

const OrdersPage = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["order"],
        queryFn: () => getMyOrders(),
    });

    // Skeleton loader for a single order item
    const OrderSkeleton = () => (
        <div className="border-b border-gray-300 pb-4 px-2">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-1 animate-pulse"></div>
            <div className="h-5 bg-gray-200 rounded w-2/3 mb-1 animate-pulse"></div>
            <div className="h-5 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        </div>
    );

    if (error) return <div>Error loading orders: {error.message}</div>;

    if (isLoading) {
        return (
            <div className="">
                <div className="space-y-2 mt-4">
                    {[...Array(3)].map((_, index) => (
                        <OrderSkeleton key={index} />
                    ))}
                </div>
            </div>
        );
    }

    console.log(data);



    return (
        <div className="">
            <div className="space-y-2 mt-4">
                {data.response?.map((order: any) => (
                    <div
                        key={order.id}
                        className="border-b border-gray-300 pb-4 px-2"
                    >
                        <div className="flex items-center justify-between">
                            <p className="text-gray-600 text-sm sm:text-base">
                                {new Date(order.createdAt).toLocaleDateString("en-US", {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </p>
                            <p className="font-medium text-[#D4AF37]">{order.status}</p>
                        </div>
                        <p className="text-gray-800 font-medium text-base sm:text-lg">
                            {console.log(order.orderItems)
                            }
                            {order?.orderItems.map((el: any, index: number) => {
                                return order?.orderItems.length == index + 1 ? `${el.quantity}x ${el.product.name}` : `${el.quantity}x ${el.product.name}, `;
                            })}
                        </p>
                        <p className="text-[#D4AF37] font-bold text-base sm:text-lg">
                            {order.totalPrice} TMT
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrdersPage;