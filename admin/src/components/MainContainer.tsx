import { Outlet } from "react-router";
import Header from "./Header";
import SideNav from "./SideNav";

export default function MainContainer() {
    return (
        <main className="flex">
            <SideNav />
            <div className="w-full main-grid overflow-y-scroll">
                <Header />
                <Outlet />
            </div>
        </main>
    )
}