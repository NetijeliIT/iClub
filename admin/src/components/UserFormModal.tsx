import { Resolver } from "react-hook-form";
import { Category, UserForm } from "../types";
import Modal from "./Modal";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUser, getDeparments } from "../services/apiUser";
import toast from "react-hot-toast";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    defaultValues?: UserForm | null;
}

export default function UserFormModal({ isOpen, onClose, defaultValues }: Props) {
    const queryClient = useQueryClient();
    const [showPassword, setShowPassword] = useState(false);
    const [isTeacher, setIsTeacher] = useState(defaultValues?.isTeacher ?? false);

    const {data} = useQuery({
        queryKey:["department"],
        queryFn:()=> getDeparments()
    });

    console.log(data);
    

    const schema = Yup.object().shape({
        firstName: Yup.string().required("Required"),
        secondName: Yup.string().required("Required"),
        phoneNumber: Yup.string()
            .required("Required")
            .matches(/^\+993[0-9]{8}$/, "Phone number must start with +993 followed by 8 digits"),
        password: Yup.string()
            .required("Required")
            .min(8, "Password must be at least 8 characters"),
        isTeacher: Yup.boolean().required(),
        department: Yup.string().when("isTeacher", {
            is: true,
            then: (schema) => schema.required("Department is required for teachers"),
            otherwise: (schema) => schema.optional(),
        }),
        studentId: Yup.string().when("isTeacher", {
            is: false,
            then: (schema) => schema.required("Student ID is required for students"),
            otherwise: (schema) => schema.optional(),
        }),
    });

    const { register, formState: { errors }, handleSubmit, reset, setValue } = useForm<UserForm>({
        resolver: yupResolver(schema) as Resolver<UserForm>,
        defaultValues: defaultValues ?? { isTeacher: false },
    });

    const mutation = useMutation({
        mutationFn: (data: UserForm) => createUser(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user"] });
            toast.success("Created user!");
            reset();
            onClose();
        },
        onError: (error) => {
            toast.error("Failed to create user");
            console.log(error);
        },
    });

    function handle(data: UserForm) {
        mutation.mutate(data);
    }

    const handleTeacherToggle = (checked: boolean) => {
        setIsTeacher(checked);
        setValue("isTeacher", checked, { shouldValidate: true });
    };

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
                <div className="mt-4">
                    <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                        Department
                    </label>
                    <select
                        id="categoryId"
                        {...register("department")}
                        defaultValue={defaultValues?.department}
                        className={`mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] ${errors.categoryId?.message ? "border-red-500" : ""}`}
                    >
                        <option value="">Select a departments</option>
                        {data?.response?.map((category: Category) => (
                            <option key={category.title} value={category.title}>
                                {category.title}
                            </option>
                        ))}
                    </select>
                    {errors.department?.message && <span className="text-red-500 text-xs font-medium">{errors.department?.message}</span>}
                </div>
                    <div>
                    <label htmlFor="isTeacher" className="block text-sm font-medium text-gray-700">
                        User Type
                    </label>
                    <div className="mt-2 flex items-center">
                        <span className="text-sm text-gray-600 mr-3">Student</span>
                        <label
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 cursor-pointer ${
                                isTeacher ? "bg-[#D4AF37]" : "bg-gray-200"
                            }`}
                        >
                            <input
                                id="isTeacher"
                                type="checkbox"
                                {...register("isTeacher")}
                                className="hidden"
                                onChange={(e) => handleTeacherToggle(e.target.checked)}
                                defaultChecked={defaultValues?.isTeacher}
                            />
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                                    isTeacher ? "translate-x-6" : "translate-x-1"
                                }`}
                            />
                        </label>
                        <span className="text-sm text-gray-600 ml-3">Teacher</span>
                    </div>
                    {errors.isTeacher?.message && <span className="text-red-500 text-xs font-medium">{errors.isTeacher?.message}</span>}
                </div>
                {isTeacher?
                null
                :
                <div>
                <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">
                    Student ID
                </label>
                <input
                    id="studentId"
                    type="text"
                    {...register("studentId")}
                    className={`mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] ${errors.studentId?.message ? "border-red-500" : ""}`}
                    placeholder="Enter student ID"
                    defaultValue={defaultValues?.studentId}
                />
                {errors.studentId?.message && <span className="text-red-500 text-xs font-medium">{errors.studentId?.message}</span>}
            </div>
                }
                        
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