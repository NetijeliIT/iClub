import Modal from "./Modal";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { CategoryForm } from "../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addCategory, updateCategory } from "../services/apiCategory";
import toast from "react-hot-toast";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    defaultValues?: CategoryForm | null;
}

export default function CategoryFormModal({ isOpen, onClose, defaultValues }: Props) {
    const queryClient = useQueryClient();


    const schema = Yup.object().shape({
        title: Yup.string().required("required"),
        // description: Yup.string().required("required")
    })

    const { register, formState: { errors }, handleSubmit, reset } = useForm({
        resolver: yupResolver(schema),
        defaultValues: defaultValues ?? {}
    })

    const mutation = useMutation({
        mutationFn: (data: CategoryForm) => addCategory(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['category'] });
            toast.success("Success!")
            reset()
            onClose()

        },
        onError: () => {
            toast.error("Error creating category");
        }
    });

    const updateMutation = useMutation({
        mutationFn: (data: CategoryForm) => updateCategory({ id: defaultValues?.id as string, data }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['category'] });
            toast.success("Success!")
            reset()
            onClose()
        },
        onError: (error) => {
            console.log(error);
            toast.error("Error updating category");
        }
    });

    console.log(defaultValues);


    function submit(data: CategoryForm) {
        if (defaultValues) {
            updateMutation.mutate(data);
        } else {
            mutation.mutate(data)
        }
        // toast.success("Created category!");
    }

    return (
        <Modal isOpen={isOpen} onClose={() => {
            reset()
            onClose()
        }} title="Add Category">
            <form onSubmit={handleSubmit(submit)}>
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Title
                    </label>
                    <input
                        id="title"
                        type="title"
                        {...register("title")}
                        className={`mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#708238] focus:border-[#708238] ${errors.title?.message ? "border-red-500" : ""}`}
                        placeholder="Enter your title"
                        defaultValue={defaultValues?.title}
                    />
                    {errors.title?.message && <span className="text-red-500 text-xs font-medium">{errors.title?.message}</span>}

                </div>
                {/* <div className="mt-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        id="description"
                        rows={4}
                        {...register("description")}
                        className={`mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#708238] focus:border-[#708238] ${errors.title?.message ? "border-red-500" : ""}`}
                        placeholder="Enter your description"
                    />
                    {errors.description?.message && <span className="text-red-500 text-xs font-medium">{errors.description?.message}</span>}

                </div> */}
                <button type="submit" className="bg-[#708238] mt-4 py-2 px-6 rounded text-white cursor-pointer float-right hover:opacity-90 duration-150">
                    {defaultValues ? "Update" : "Add"}
                </button>
            </form>
        </Modal>
    )
}