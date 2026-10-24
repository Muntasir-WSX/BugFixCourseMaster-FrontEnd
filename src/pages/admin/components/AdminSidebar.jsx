import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    BookOpen,
    PlusCircle,
    Users,
    ClipboardList,
    BarChart3,
    Video,
    Menu,
    X,
    UserCheck,
} from "lucide-react";

export default function AdminSidebar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const Item = ({ to, label, Icon, end = true, onClick, showLabel = true }) => {
        const linkClass = ({ isActive }) => {
            const baseClasses = "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200";
            if (isActive) {
                return `${baseClasses} bg-primary text-primary-content font-semibold shadow-md`;
            }
            return `${baseClasses} text-base-content font-medium hover:bg-primary/20 hover:text-primary`;
        };

        return (
            <NavLink
                to={to}
                end={end}
                onClick={onClick}
                className={linkClass}
            >
                <Icon className="w-5 h-5 shrink-0" />
                {showLabel && <span className="text-sm sm:text-base">{label}</span>}
            </NavLink>
        );
    };

    const menuItems = [
        { to: "/admin", label: "Overview", Icon: LayoutDashboard, end: true },
        { to: "/admin/courses", label: "Manage Courses", Icon: BookOpen, end: true },
        { to: "/admin/courses/create", label: "Add Course", Icon: PlusCircle, end: true },
        { to: "/admin/video-classes", label: "Video Classes", Icon: Video, end: true },
        { to: "/admin/enrollments", label: "Enrollments", Icon: UserCheck, end: true },
        { to: "/admin/assignments", label: "Assignments", Icon: ClipboardList, end: true },
        { to: "/admin/analytics", label: "Analytics", Icon: BarChart3, end: true },
        { to: "/admin/users", label: "Manage Users", Icon: Users, end: true },
    ];

    return (
        <>
            {/* Mobile menu trigger bar */}
            <div className="lg:hidden fixed top-16 left-0 right-0 z-40 bg-base-200 border-b border-base-300 px-4 py-2 shadow-sm flex items-center">
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="btn btn-sm btn-ghost gap-2 text-base-content"
                    aria-label="Toggle Navigation Menu"
                >
                    {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    <span className="font-semibold">Admin Menu</span>
                </button>
            </div>

            {/* Mobile slide-over drawer */}
            {mobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-50 bg-black/50 transition-opacity"
                    onClick={() => setMobileMenuOpen(false)}
                >
                    <aside
                        className="bg-base-200 border-r border-base-300 w-64 h-full p-4 space-y-2 overflow-y-auto shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4 pb-2 border-b border-base-300">
                            <h2 className="font-bold text-lg text-base-content">Admin Menu</h2>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="btn btn-sm btn-ghost btn-circle"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-1">
                            {menuItems.map((item) => (
                                <Item
                                    key={item.to}
                                    to={item.to}
                                    label={item.label}
                                    Icon={item.Icon}
                                    end={item.end}
                                    onClick={() => setMobileMenuOpen(false)}
                                    showLabel={true}
                                />
                            ))}
                        </div>
                    </aside>
                </div>
            )}

            {/* Desktop persistent sidebar */}
            <aside className="hidden lg:block bg-base-200 border-r border-base-300 min-h-screen w-64 p-4 space-y-1 shrink-0 shadow-lg">
                <div className="px-3 py-2 mb-2 font-bold text-lg text-base-content border-b border-base-300">
                    Admin Panel
                </div>
                {menuItems.map((item) => (
                    <Item
                        key={item.to}
                        to={item.to}
                        label={item.label}
                        Icon={item.Icon}
                        end={item.end}
                    />
                ))}
            </aside>
        </>
    );
}