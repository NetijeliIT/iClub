
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { LoginForm } from "../types";
import { login } from "../services/apiAuth";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const schema = Yup.object().shape({
    phoneNumber: Yup.string()
      .required("Required")
      .matches(/^\+993[0-9]{8}$/, "Phone number must start with +993 followed by 8 digits"),
    password: Yup.string()
      .required("Required")
      .min(8, "Password must be at least 8 characters")
  });

  const { register, formState: { errors }, handleSubmit } = useForm({
    resolver: yupResolver(schema)
  });

  async function loginn(data: LoginForm) {
    try {
      const res = await login(data);
      localStorage.setItem("accessToken", res.response?.accessToken);
      console.log(res);
      toast.success("Success!");
      navigate("/")

    } catch (error) {
      toast.error("Something went wrong!")
    }
  }

  return (
    <div
      className="h-[100dvh] w-full bg-cover sm:background-fill bg-no-repeat flex items-center justify-center"
      style={{
        backgroundImage: "url('/back4.jpg')",
        backgroundSize: "cover",
      }}
    >
      <div className="w-full  absolute bottom-0 sm:static sm:rounded-3xl sm:max-w-[400px] px-6 py-10 bg-white/80 backdrop-blur-md rounded-t-3xl shadow-xl">
        <div className="flex flex-col items-center mb-6">
          {/* <img src="/logo.png" alt="Cafe Logo" className="w-20 h-20 mb-2" /> */}
          <h1 className="text-3xl font-bold text-[#393939]">iClub</h1>
          <p className="text-base text-gray-600">Your daily campus cafe</p>
        </div>
        <form onSubmit={handleSubmit(loginn)} className="space-y-5">
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              type="text"
              {...register("phoneNumber")}
              className={`mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] ${errors.phoneNumber?.message ? "border-red-500" : ""}`}
              placeholder="+993********"
            // defaultValue={defaultValues?.phoneNumber}
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
            className="w-full bg-[#d4af37] text-white py-3 rounded-xl text-base font-semibold tracking-wide shadow-md hover:bg-[#c09c2f] transition-all"
          >
            Log In
          </button>
        </form>
        {/* <p className="text-center text-sm text-gray-600 mt-5">
          Don’t have an account? <a href="#" className="text-[#d4af37] font-semibold">Sign up</a>
        </p> */}
      </div>
    </div>
  );
};

export default LoginPage;
