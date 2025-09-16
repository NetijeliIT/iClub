import { NavLink, Outlet } from "react-router";

const ProfileContainer = () => {
    const isTeacher = JSON.parse(localStorage.getItem("isTeacher") || "false")

    return (
        <section className="mt-4">
            <div className="flex items-center  text-gray-600 text-center text-lg font-medium">
                <NavLink end to={"/profile"} className={"py-1 px-4 w-full border-b border-gray-500 [&.active]:border-[#D4AF37] [&.active]:bg-[#D4AF37] [&.active]:text-white"}>
                    Profile
                </NavLink>
                <NavLink end to={"/profile/orders"} className={"py-1 px-4 w-full border-b border-gray-500 [&.active]:border-[#D4AF37] [&.active]:bg-[#D4AF37] [&.active]:text-white "}>
                    Orders
                </NavLink>
                {isTeacher && <NavLink end to={"/profile/bookings"} className={"py-1 px-4 w-full border-b border-gray-500 [&.active]:border-[#D4AF37] [&.active]:bg-[#D4AF37] [&.active]:text-white "}>
                    Bookings
                </NavLink>}
            </div>
            <Outlet />
        </section>
    );
};

export default ProfileContainer;