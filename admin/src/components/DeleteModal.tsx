import Modal from "./Modal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  isDeleting?: boolean; // New prop to disable button during deletion
};

export default function DeleteModal({ isOpen, onClose, onDelete, isDeleting = false }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Booking">
      <h2 className="text-lg">Are you sure you want to delete this booking detail?</h2>
      <div className="flex items-center justify-end mt-4 gap-2">
        <button
          onClick={onClose}
          className="bg-gray-200 font-medium text-base p-2 px-4 rounded cursor-pointer hover:opacity-80 duration-150"
          disabled={isDeleting} // Disable Cancel button during deletion
        >
          Cancel
        </button>
        <button
          onClick={onDelete}
          className="bg-red-500 text-white font-medium text-base p-2 px-4 rounded cursor-pointer hover:opacity-80 duration-150 disabled:opacity-50"
          disabled={isDeleting} // Disable Delete button during deletion
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </Modal>
  );
}