import Modal from "./Modal";

type Props = {
    isOpen: boolean | string;
    onClose: () => void;
    onDelete: () => void;
}

export default function DeleteModal({ isOpen, onClose, onDelete }: Props) {

    return (
        <Modal isOpen={isOpen ? true : false} onClose={onClose} title={`Delete`}>
            {/* <form> */}
            <h2 className="text-lg">Are you sure you want to delete this user!</h2>
            <div className="flex items-center justify-end mt-4 gap-2">
                <button onClick={onClose} className="bg-gray-200 font-medium text-base p-2 px-4 rounded cursor-pointer hover:opacity-80 duration-150">Cancel</button>
                <button onClick={() => {
                    onDelete()
                    onClose()
                }} className="bg-red-500 text-white font-medium text-base p-2 px-4 rounded cursor-pointer hover:opacity-80 duration-150">Delete</button>
            </div>
            {/* </form> */}

        </Modal>
    )
}