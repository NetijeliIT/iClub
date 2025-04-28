import { useForm } from "react-hook-form"
import { LoginForm } from "../types"
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { login } from "../services/apiAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

export default function LoginPage() {
    const navigate = useNavigate();
    const schema = Yup.object().shape({
        username: Yup.string().required("required"),
        password: Yup.string().required("required"),
    })

    const { register, formState: { errors }, handleSubmit } = useForm({
        resolver: yupResolver(schema)
    })

    async function handleLogin(data: LoginForm) {
        const user = await login(data);
        localStorage.setItem("accessToken", user?.response?.accessToken);
        toast.success("Success!");
        navigate("/")
    }


    return (
        <section className="bg-gradient-to-br from-[#D4AF37] to-[#F4D03F] w-screen h-screen flex items-center justify-center">
            <form onSubmit={handleSubmit(handleLogin)} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login</h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            id="username"
                            type="username"
                            {...register("username")}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                            placeholder="Enter your Username"
                        />
                        {errors.username?.message && <span className="text-red-500 text-xs font-medium">{errors.username?.message}</span>}

                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            {...register("password")}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                            placeholder="Enter your password"
                        />
                        {errors.password?.message && <span className="text-red-500 text-xs font-medium">{errors.password?.message}</span>}

                    </div>
                    <button
                        type="submit"
                        className="w-full mt-2 cursor-pointer bg-[#D4AF37] text-white py-2 px-4 rounded-md hover:bg-[#b89730] transition-colors duration-200"
                    >
                        Sign In
                    </button>
                </div>
            </form>
        </section>
    )
}