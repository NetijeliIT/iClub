import Header from "./Header";
import { Outlet } from "react-router";

export default function MainContainer() {
    return (
        <main className="min-h-screen main-grid">
            <Header />
            <Outlet />
        </main>
    )
}