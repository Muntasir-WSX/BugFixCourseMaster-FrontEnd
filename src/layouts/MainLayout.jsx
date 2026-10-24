import { Outlet } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import { getMeAsync } from "../store/slices/authSlice";
import { fetchMyEnrollments } from "../store/slices/enrollmentSlice";

export default function MainLayout() {
    const dispatch = useDispatch();
    const { token, isAuthenticated, loading } = useSelector((state) => state.auth);
    const attemptedFetchRef = useRef(false);

    useEffect(() => {
        // Prevent infinite re-fetching loops if token exists but authentication check failed
        if (token && !isAuthenticated && !attemptedFetchRef.current && !loading) {
            attemptedFetchRef.current = true;
            dispatch(getMeAsync())
                .unwrap()
                .catch((err) => console.error("Failed to re-authenticate session:", err));
        }
    }, [token, isAuthenticated, loading, dispatch]);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchMyEnrollments())
                .unwrap()
                .catch((err) => console.error("Failed to load user enrollments:", err));
        }
    }, [isAuthenticated, dispatch]);

    return (
        <div className="min-h-screen flex flex-col bg-base-100 text-base-content transition-colors duration-200">
            <Navbar />

            <main className="flex-1 max-w-6xl mx-auto w-full px-2 sm:px-4 py-2 sm:py-4">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}