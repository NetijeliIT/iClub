import { CalendarDateRangeIcon } from "@heroicons/react/24/outline";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router";

const Header = () => {
    const count = useSelector((state: any) => state.card.ids);
    const isTeacher = JSON.parse(localStorage.getItem("isTeacher") || "false")
    

    return (
        <header className=" shadow-md sticky top-0 z-10 h-[60px] bg-gray-50 main-grid" style={{ gridColumn: "1/-1" }}>
            <div style={{ gridColumn: "2/3" }}>
                <div className="flex justify-between items-center py-4">
                    <Link to={"/"} className="text-xl font-bold text-[#708238]">iClub</Link>
                    <div className="flex space-x-4">
                        {isTeacher && (
                             <NavLink to={"/calendar"} className={`[&.active]:text-[#708238]`}>
                             <CalendarDateRangeIcon className="w-6 h-6 " />
 
                         </NavLink>
                        )}
                       
                        <NavLink to={"/profile"} className={'[&.active]:text-[#708238]'} >
                            <UserIcon className="w-6 h-6" />
                        </NavLink>
                        <NavLink to={"/cart"} className="relative [&.active]:text-[#708238]">
                            <ShoppingCartIcon className="w-6 h-6" />
                            {count.length > 0 ?
                                <span className="px-1 absolute right-[-10px] top-[-10px] text-sm rounded-full bg-[#708238] text-white text-center">{count.length}</span>
                                : null}
                        </NavLink>
                    </div>
                </div>
            </div>
        </header >
    );
};

export default Header;