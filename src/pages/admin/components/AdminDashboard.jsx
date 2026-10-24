import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { getMe } from "../../../services/auth.api";
import AdminRoute from "../../../routes/AdminRoute";
import AdminSidebar from "./AdminSidebar";

export default function AdminDashboard() {
    const [me, setMe] = useState(null);

    useEffect(() => {
        const loadMe = async () => {
            try {
                const res = await getMe();
                setMe(res.data);
            } catch (err) {
                console.error("Failed to load user:", err);
            }
        };
        loadMe();
    }, []);

    return (
        <AdminRoute me={me}>
            <div className="w-full max-w-none flex flex-col lg:flex-row min-h-[80vh]">
                {/* Single Sidebar Instance Handling Desktop & Mobile Drawer */}
                <AdminSidebar />

                {/* Content Area with Top Padding Offset for Mobile Menu Bar */}
                <main className="flex-1 p-3 sm:p-4 lg:p-5 pt-14 lg:pt-5 bg-base-100 w-full min-w-0">
                    <Outlet />
                </main>
            </div>
        </AdminRoute>
    );
}