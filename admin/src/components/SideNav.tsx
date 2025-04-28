import { ShoppingCartIcon, SquaresPlusIcon } from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/outline";
import { RectangleStackIcon } from "@heroicons/react/24/outline";
import { CalendarDateRangeIcon } from "@heroicons/react/24/outline";
import { HomeIcon } from "@heroicons/react/24/outline";
import { NavLink } from "react-router";

export default function SideNav() {
    return (
        <aside className="w-72 h-screen p-4 bg-[#D4AF37]">
            <h2 className="text-3xl font-semibold text-white">iClub</h2>
            <nav className="mt-4 w-full space-y-1">
                <NavLink to={"/"} className={'p-2 text-lg text-white font-medium w-full flex gap-1 items-center hover:bg-white/20 transition-all duration-150 [&.active]:bg-white/20'}>
                    <HomeIcon className="w-6 h-6 " />
                    Dashboard
                </NavLink>
                <NavLink to={"/order"} className={'p-2 text-lg text-white font-medium w-full flex gap-1 items-center hover:bg-white/20 transition-all duration-150 [&.active]:bg-white/20'}>
                    <ShoppingCartIcon className="w-6 h-6 " />
                    Orders
                </NavLink>
                <NavLink to={"/meal"} className={'p-2 text-lg text-white font-medium w-full flex gap-1 items-center hover:bg-white/20 transition-all duration-150 [&.active]:bg-white/20'}>
                    <RectangleStackIcon className="w-5 h-5" />
                    Meals
                </NavLink>
                <NavLink to={"/category"} className={'p-2 text-lg text-white font-medium w-full flex gap-1 items-center hover:bg-white/20 transition-all duration-150 [&.active]:bg-white/20'}>
                    <SquaresPlusIcon className="w-6 h-6 " />
                    Categories
                </NavLink>
                <NavLink to={"/user"} className={'p-2 text-lg text-white font-medium w-full flex gap-1 items-center hover:bg-white/20 transition-all duration-150 [&.active]:bg-white/20'}>
                    <UserIcon className="w-6 h-6 " />
                    Users
                </NavLink>
                <NavLink to={"/lesson"} className={'p-2 text-lg text-white font-medium w-full flex gap-1 items-center hover:bg-white/20 transition-all duration-150 [&.active]:bg-white/20'}>
                    <CalendarDateRangeIcon className="w-5 h-5" />
                    Lessons
                </NavLink>

            </nav>
        </aside>
    )
}