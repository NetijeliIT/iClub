import { UserForm } from "../types";
import Modal from "./Modal";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useState } from "react"; // Added for password toggle state
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"; // Assuming you're using Heroicons
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "../services/apiUser";
import toast from "react-hot-toast";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    defaultValues?: UserForm | null;
}

export default function UserFormModal({ isOpen, onClose, defaultValues }: Props) {
    const queryClient = useQueryClient();
    const [showPassword, setShowPassword] = useState(false);

    const schema = Yup.object().shape({
        firstName: Yup.string().required("Required"),
        secondName: Yup.string().required("Required"),
        phoneNumber: Yup.string()
            .required("Required")
            .matches(/^\+993[0-9]{8}$/, "Phone number must start with +993 followed by 8 digits"),
        password: Yup.string()
            .required("Required")
            .min(8, "Password must be at least 8 characters")
        // .matches(
        //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        //     "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        // ),
    });

    const { register, formState: { errors }, handleSubmit, reset } = useForm<UserForm>({
        resolver: yupResolver(schema),
        defaultValues: defaultValues ?? {},
    });

    const mutation = useMutation({
        mutationFn: (data: UserForm) => createUser(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user"] });
            toast.success("Created meal!");
            reset();
            onClose();
        },
        onError: (error) => {
            toast.error("Failed to create meal");
            console.log(error);

        },
    });

    function handle(data: UserForm) {
        console.log(data);
        mutation.mutate(data)
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit(handle)} className="space-y-4">
                <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        First Name
                    </label>
                    <input
                        id="firstName"
                        type="text"
                        {...register("firstName")}
                        className={`mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] ${errors.firstName?.message ? "border-red-500" : ""}`}
                        placeholder="Enter first name"
                        defaultValue={defaultValues?.firstName}
                    />
                    {errors.firstName?.message && <span className="text-red-500 text-xs font-medium">{errors.firstName?.message}</span>}
                </div>
                <div>
                    <label htmlFor="secondName" className="block text-sm font-medium text-gray-700">
                        Last Name
                    </label>
                    <input
                        id="secondName"
                        type="text"
                        {...register("secondName")}
                        className={`mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] ${errors.secondName?.message ? "border-red-500" : ""}`}
                        placeholder="Enter last name"
                        defaultValue={defaultValues?.secondName}
                    />
                    {errors.secondName?.message && <span className="text-red-500 text-xs font-medium">{errors.secondName?.message}</span>}
                </div>
                <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                        Phone Number
                    </label>
                    <input
                        id="phoneNumber"
                        type="text"
                        {...register("phoneNumber")}
                        className={`mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] ${errors.phoneNumber?.message ? "border-red-500" : ""}`}
                        placeholder="+99362430387"
                        defaultValue={defaultValues?.phoneNumber}
                    />
                    {errors.phoneNumber?.message && <span className="text-red-500 text-xs font-medium">{errors.phoneNumber?.message}</span>}
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            {...register("password")}
                            className={`mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] ${errors.password?.message ? "border-red-500" : ""}`}
                            placeholder="********"
                            defaultValue={defaultValues?.password}
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                            ) : (
                                <EyeIcon className="h-5 w-5 text-gray-400" />
                            )}
                        </button>
                    </div>
                    {errors.password?.message && <span className="text-red-500 text-xs font-medium">{errors.password?.message}</span>}
                </div>
                <button
                    type="submit"
                    className="bg-[#D4AF37] mt-4 py-2 px-6 rounded text-white cursor-pointer float-right hover:opacity-90 duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Submit
                </button>
            </form>
        </Modal>
    )
}