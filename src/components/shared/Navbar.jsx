import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { getToken, clearToken } from "../../utils/auth";
import { getMe } from "../../services/auth.api";

export default function Navbar() {
    const navigate = useNavigate();
    const token = getToken();
    const [me, setMe] = useState(null);

    // Standardized NavLink active state generator
    const navLinkClass = ({ isActive }) =>
        isActive
            ? "text-primary font-semibold"
            : "text-base-content/80 hover:text-primary transition-colors";

    const handleLogout = () => {
        clearToken();
        setMe(null);
        navigate("/", { replace: true });
    };

    useEffect(() => {
        let isMounted = true;
        const loadMe = async () => {
            if (!token) {
                if (isMounted) setMe(null);
                return;
            }
            try {
                const res = await getMe();
                if (isMounted) setMe(res.data);
            } catch {
                clearToken();
                if (isMounted) setMe(null);
            }
        };
        loadMe();

        return () => {
            isMounted = false;
        };
    }, [token]);

    const initials = useMemo(() => {
        if (!me?.name) return "U";
        return me.name
            .trim()
            .split(" ")
            .map((w) => w[0])
            .filter(Boolean)
            .slice(0, 2)
            .join("")
            .toUpperCase();
    }, [me?.name]);

    const isDevBypass = localStorage.getItem("dev_bypass") === "true";

    return (
        <header className="sticky top-0 z-50 bg-base-100/90 backdrop-blur border-b border-base-300">
            <div className="navbar max-w-6xl mx-auto px-2">
                {/* LEFT: Logo */}
                <div className="navbar-start">
                    <Logo />
                </div>

                {/* CENTER: Desktop menu */}
                <div className="navbar-center hidden md:flex">
                    <ul className="menu menu-horizontal gap-1">
                        <li>
                            <NavLink className={navLinkClass} to="/">
                                Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink className={navLinkClass} to="/courses">
                                Courses
                            </NavLink>
                        </li>

                        {token && me ? (
                            <li>
                                <NavLink
                                    className={navLinkClass}
                                    to={me.role === "admin" ? "/admin" : "/student"}
                                >
                                    Dashboard
                                </NavLink>
                            </li>
                        ) : isDevBypass ? (
                            <>
                                <li>
                                    <NavLink className={navLinkClass} to="/student">
                                        Student Portal
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink className={navLinkClass} to="/admin">
                                        Admin Portal
                                    </NavLink>
                                </li>
                            </>
                        ) : null}
                    </ul>
                </div>

                {/* RIGHT */}
                <div className="navbar-end gap-2">
                    {/* Theme Toggle */}
                    <ThemeToggle />

                    {/* Desktop actions if NOT logged in */}
                    {!token && (
                        <div className="hidden md:flex gap-2">
                            <Link to="/login" className="btn btn-sm btn-ghost">
                                Login
                            </Link>
                            <Link to="/register" className="btn btn-sm btn-primary">
                                Enroll Now
                            </Link>
                        </div>
                    )}

                    {/* Desktop avatar if logged in */}
                    {token && me && (
                        <div className="hidden md:block dropdown dropdown-end">
                            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                                <div className="w-9 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold">
                                    {initials}
                                </div>
                            </label>

                            <ul
                                tabIndex={0}
                                className="dropdown-content mt-3 p-3 shadow bg-base-100 rounded-box w-60 border border-base-300 space-y-1"
                            >
                                <div className="px-2 pb-2">
                                    <p className="font-semibold truncate">{me.name}</p>
                                    <p className="text-sm text-base-content/70 truncate">{me.email}</p>
                                    <span className="badge badge-outline text-xs mt-2 capitalize">{me.role}</span>
                                </div>

                                <div className="my-2 border-t border-base-300" />

                                <li>
                                    <Link to={me.role === "admin" ? "/admin" : "/student"}>
                                        Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/profile">Profile</Link>
                                </li>
                                <li>
                                    <button onClick={handleLogout} className="text-error w-full text-left">
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}

                    {/* Mobile menu dropdown */}
                    <div className="dropdown dropdown-end md:hidden">
                        <label tabIndex={0} className="btn btn-ghost btn-circle" aria-label="Toggle Navigation">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </label>

                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content mt-3 p-3 shadow bg-base-100 rounded-box w-60 border border-base-300 max-h-[85vh] overflow-y-auto z-50"
                        >
                            <li>
                                <NavLink className={navLinkClass} to="/">
                                    Home
                                </NavLink>
                            </li>
                            <li>
                                <NavLink className={navLinkClass} to="/courses">
                                    Courses
                                </NavLink>
                            </li>

                            {token && me && (
                                <li>
                                    <NavLink
                                        className={navLinkClass}
                                        to={me.role === "admin" ? "/admin" : "/student"}
                                    >
                                        Dashboard
                                    </NavLink>
                                </li>
                            )}

                            <div className="my-2 w-full border-t border-base-300" />

                            {!token ? (
                                <div className="flex flex-col gap-2 pt-1">
                                    <Link to="/login" className="btn btn-ghost btn-sm w-full">
                                        Login
                                    </Link>
                                    <Link to="/register" className="btn btn-primary btn-sm w-full">
                                        Enroll Now
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <div className="flex flex-col items-center gap-1 py-2 px-1 text-center">
                                        <div className="w-10 h-10 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold mb-1">
                                            {initials}
                                        </div>
                                        <p className="font-semibold text-sm truncate max-w-full">{me?.name}</p>
                                        <p className="text-xs text-base-content/70 truncate max-w-full">{me?.email}</p>
                                    </div>

                                    <div className="my-2 w-full border-t border-base-300" />

                                    <li>
                                        <Link to="/profile">Profile</Link>
                                    </li>
                                    <li>
                                        <button onClick={handleLogout} className="text-error w-full text-left">
                                            Logout
                                        </button>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </header>
    );
}