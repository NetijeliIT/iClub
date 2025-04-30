import { useMutation, useQueryClient } from "@tanstack/react-query";
import Modal from "./Modal";
import toast from "react-hot-toast";
import { cancelOrder } from "../services/apiOrder";

type Props = {
    onClose: () => void;
    isOpen: string | null;
}

export default function CancelModal({ onClose, isOpen }: Props) {

    const queryClient = useQueryClient();

    const verifyMutate = useMutation({
        mutationFn: (id: string) => cancelOrder(id),
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
        <Modal isOpen={isOpen ? true : false} onClose={onClose} title="Cancel Order">
            <h2 className="font-medium text-base">Are you sure you want to cancel this order?</h2>
            <div className="flex gap-2 justify-end mt-5">
                <button onClick={onClose} className="text-lg font-medium rounded px-6 py-2 bg-gray-200 ">Close</button>
                <button onClick={() => verifyMutate.mutate(isOpen as string)} className="text-lg font-medium rounded px-6 py-2 bg-red-500  text-white">Cancel</button>
            </div>
        </Modal>
    )
}