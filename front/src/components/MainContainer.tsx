import Header from "./Header";
import { Outlet } from "react-router";

export default function MainContainer() {
    return (
        <main className="min-h-screen main-grid bg-gray-50">
            <Header />
            <Outlet />
        </main>
    )
}