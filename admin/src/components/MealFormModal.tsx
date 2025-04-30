import Modal from "./Modal";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Category, MealForm } from "../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { addMeal, updateMeal } from "../services/apiMeal";
import { useState } from "react";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    defaultValues?: MealForm | null;
    cats: any;
}

export default function MealFormModal({ isOpen, onClose, defaultValues, cats }: Props) {
    const queryClient = useQueryClient();
    const [imagePreview, setImagePreview] = useState<string | null>(defaultValues?.image || null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const schema = Yup.object().shape({
        name: Yup.string().required("required"),
        description: Yup.string().required("required"),
        price: Yup.number().required("required"),
        categoryId: Yup.string().required("required"),
    });

    const { register, formState: { errors }, handleSubmit, reset } = useForm<MealForm>({
        resolver: yupResolver(schema),
        defaultValues: defaultValues ?? {},
    });

    const mutation = useMutation({
        mutationFn: (data: { image: FormData, data: MealForm }) => addMeal(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['meal'] });
            toast.success("Created meal!");
            reset();
            setImagePreview(null);
            setSelectedFile(null);
            onClose();
        },
        onError: () => {
            toast.error("Failed to create meal");
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: MealForm) => updateMeal({ id: defaultValues?.id as string, data }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['meal'] });
            toast.success("Success!");
            reset();
            setImagePreview(null);
            setSelectedFile(null);
            onClose();
        },
        onError: () => {
            toast.error("Error updating meal");
        }
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };


    function submit(data: MealForm) {

        if (defaultValues) {
            updateMutation.mutate(data);
        } else {
            const formData = new FormData();
            if (selectedFile) {
                formData.append('image', selectedFile);
            }
            mutation.mutate({ image: formData, data });
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={() => {
            reset();
            setImagePreview(null);
            setSelectedFile(null);
            onClose();
        }} title="Add Meal">
            <form onSubmit={handleSubmit(submit)}>
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        {...register("name")}
                        className={`mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] ${errors.name?.message ? "border-red-500" : ""}`}
                        placeholder="Enter meal name"
                        defaultValue={defaultValues?.name}
                    />
                    {errors.name?.message && <span className="text-red-500 text-xs font-medium">{errors.name?.message}</span>}
                </div>
                <div className="mt-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        id="description"
                        rows={6}
                        {...register("description")}
                        className={`mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] ${errors.description?.message ? "border-red-500" : ""}`}
                        placeholder="Enter description"
                        defaultValue={defaultValues?.description}
                    />
                    {errors.description?.message && <span className="text-red-500 text-xs font-medium">{errors.description?.message}</span>}
                </div>
                <div className="mt-4">
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                        Price
                    </label>
                    <input
                        id="price"
                        type="number"
                        {...register("price")}
                        className={`mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] ${errors.price?.message ? "border-red-500" : ""}`}
                        placeholder="Enter price"
                        defaultValue={defaultValues?.price}
                    />
                    {errors.price?.message && <span className="text-red-500 text-xs font-medium">{errors.price?.message}</span>}
                </div>
                <div className="mt-4">
                    <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                        Category
                    </label>
                    <select
                        id="categoryId"
                        {...register("categoryId")}
                        defaultValue={defaultValues?.categoryId}
                        className={`mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] ${errors.categoryId?.message ? "border-red-500" : ""}`}
                    >
                        <option value="">Select a category</option>
                        {cats?.response?.map((category: Category) => (
                            <option key={category.id} value={category.id}>
                                {category.title}
                            </option>
                        ))}
                    </select>
                    {errors.categoryId?.message && <span className="text-red-500 text-xs font-medium">{errors.categoryId?.message}</span>}
                </div>
                <div className="mt-4">
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                        Image
                    </label>
                    <input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                    />
                    {imagePreview && (
                        <div className="mt-2">
                            <img src={imagePreview} alt="Preview" className="max-w-[200px] h-auto rounded-md" />
                        </div>
                    )}
                </div>
                <button
                    type="submit"
                    disabled={mutation.isPending || updateMutation.isPending}
                    className="bg-[#D4AF37] mt-4 py-2 px-6 rounded text-white cursor-pointer float-right hover:opacity-90 duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {defaultValues ? "Update" : "Add"}
                </button>
            </form>
        </Modal>
    );
}