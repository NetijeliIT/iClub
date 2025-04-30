import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Order } from "../types";
import Modal from "./Modal";
import { updateStatusOrder } from "../services/apiOrder";
import toast from "react-hot-toast";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    details: Order;
}


export default function UpdateStatusOrderModal({ isOpen, onClose, details }: Props) {
    const queryClient = useQueryClient();

    const verifyMutate = useMutation({
        mutationFn: (data: { id: string, status: string }) => updateStatusOrder({ id: data.id, status: data.status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['order'] });
            toast.success("Updated order status!");
            onClose()
        },
        onError: (errr) => {
            console.log(errr);

            toast.error("Failed to update order status");
        },
    });

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Accept or cancel order!">
            {details?.status === "VERIFIED" || details?.status === "CANCELLED" ?
                <div>You already {details?.status.toLowerCase()}!</div>
                :
                <>
                    <div className="text-lg font-medium mb-4">{details?.orderItems.map((el: any, index: number) => {
                        return details?.orderItems.length == index + 1 ? `${el.quantity}x ${el.product.name}` : `${el.quantity}x ${el.product.name}, `;
                    })}</div>
                    <div className="flex justify-between items-center">
                        <button onClick={() => verifyMutate.mutate({ id: details.id, status: "CANCELLED" })} className="text-lg px-6 py-2 bg-red-500 rounded text-white">
                            Cancel
                        </button>
                        <button onClick={() => verifyMutate.mutate({ id: details.id, status: "VERIFIED" })} className="text-lg px-6 py-2 bg-green-500 rounded text-white">Accept</button>
                    </div>
                </>
            }
        </Modal>
    )
}