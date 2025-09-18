import { PhoneIcon, UserIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "../services/apiUser";
import { logout } from "../services/apiAuth";
import { useNavigate } from "react-router";

const ProfilePage = () => {
    const navigate = useNavigate()
    const { data, isLoading, error } = useQuery({
        queryFn: () => getUser(),
        queryKey: ["user"],
    });

    const InputSkeleton = () => (
        <div className="mt-2">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-1 animate-pulse"></div>
            <div className="border flex gap-2 items-center border-gray-700 rounded-xl overflow-hidden">
                <span className="bg-gray-200 px-2 py-2 border-r border-gray-800">
                    <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
                </span>
                <div className="w-full h-10 bg-gray-200"></div>
            </div>
        </div>
    );

    const ButtonSkeleton = () => (
        <div className="bg-gray-200 text-transparent text-lg font-medium p-2 px-6 rounded float-right mt-4 h-10 w-24 animate-pulse"></div>
    );

    if (error) return <div>Error loading profile: {error.message}</div>;

    if (isLoading) {
        return (
            <div>
                <InputSkeleton />
                <InputSkeleton />
                <InputSkeleton />
                <ButtonSkeleton />
            </div>
        );
    }

    console.log(data);


    return (
        <div>
            <div className="mt-4">
                <label className="text-lg text-gray-700 font-medium" htmlFor="name">
                    Name:
                </label>
                <div className="border flex gap-2 items-center border-gray-700 rounded-xl overflow-hidden">
                    <span className="bg-gray-200 px-2 py-2 border-r border-gray-800">
                        <UserIcon className="w-5 h-5" />
                    </span>
                    <input
                        disabled
                        className="w-full p-1 focus:outline-none text-lg font-medium cursor-not-allowed text-gray-600"
                        id="name"
                        type="text"
                        defaultValue={data?.response?.firstName || ""}
                    />
                </div>
            </div>
            <div className="mt-2">
                <label className="text-lg text-gray-700 font-medium" htmlFor="surname">
                    Surname:
                </label>
                <div className="border flex gap-2 items-center border-gray-700 rounded-xl overflow-hidden">
                    <span className="bg-gray-200 px-2 py-2 border-r border-gray-800">
                        <UserIcon className="w-5 h-5" />
                    </span>
                    <input
                        disabled
                        className="w-full p-1 focus:outline-none text-lg font-medium cursor-not-allowed text-gray-600"
                        id="surname"
                        type="text"
                        defaultValue={data?.response?.secondName || ""}
                    />
                </div>
            </div>
            <div className="mt-2">
                <label className="text-lg text-gray-700 font-medium" htmlFor="phone">
                    Phone:
                </label>
                <div className="border flex gap-2 items-center border-gray-700 rounded-xl overflow-hidden">
                    <span className="bg-gray-200 px-2 py-2 border-r border-gray-800">
                        <PhoneIcon className="w-5 h-5" />
                    </span>
                    <input
                        disabled
                        className="w-full p-1 focus:outline-none text-lg font-medium cursor-not-allowed text-gray-600"
                        id="phone"
                        type="text"
                        defaultValue={data?.response?.phoneNumber || ""}
                    />
                </div>
            </div>
            <button onClick={() => {
                logout()
                localStorage.removeItem("accessToken");
                navigate("/login")
            }} className="bg-[#708238] text-white text-lg font-medium p-2 px-6 rounded float-right mt-4 cursor-pointer hover:opacity-90 transition-all duration-150">
                Log out
            </button>
        </div>
    );
};

export default ProfilePage;