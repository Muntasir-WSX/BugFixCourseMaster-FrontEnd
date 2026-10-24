import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getCourses } from "../../services/courses.api";
import CoursesFilters from "./CoursesFilters";
import CoursesGrid from "./CoursesGrid";
import CoursesPagination from "./CoursesPagination";

export default function CoursesSection() {
    const { user } = useSelector((state) => state.auth);
    const [courses, setCourses] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Filter & query parameters
    const [page, setPage] = useState(1);
    const [limit] = useState(8);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("");
    const [category, setCategory] = useState("");
    const [tags, setTags] = useState("");

    const fetchCourses = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const params = {
                page,
                limit,
                search: search.trim() || undefined,
                sort: sort || undefined,
                category: category.trim() || undefined,
                tags: tags.trim() || undefined,
            };

            const res = await getCourses(params);
            setCourses(res.data.courses || []);
            setTotalPages(res.data.totalPages || 1);
        } catch (err) {
            setError("Failed to load courses. Please try again later.");
        } finally {
            setLoading(false);
        }
    }, [page, limit, search, sort, category, tags]);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    const onSearchSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        fetchCourses();
    };

    const handleResetFilters = () => {
        setSearch("");
        setSort("");
        setCategory("");
        setTags("");
        setPage(1);
    };

    return (
        <div className="space-y-6">
            <CoursesFilters
                search={search}
                setSearch={setSearch}
                sort={sort}
                setSort={(val) => { setSort(val); setPage(1); }}
                category={category}
                setCategory={(val) => { setCategory(val); setPage(1); }}
                tags={tags}
                setTags={(val) => { setTags(val); setPage(1); }}
                onSearchSubmit={onSearchSubmit}
                onResetFilters={handleResetFilters}
            />

            {/* Loading state */}
            {loading && (
                <div className="flex justify-center items-center py-16">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            )}

            {/* Error state */}
            {error && (
                <div className="alert alert-error shadow-md">
                    <span>{error}</span>
                </div>
            )}

            {/* Empty state */}
            {!loading && !error && courses.length === 0 && (
                <div className="rounded-2xl border border-base-300 bg-base-100 p-12 text-center shadow-sm">
                    <h3 className="text-xl font-bold text-base-content">No courses found</h3>
                    <p className="mt-2 text-sm text-base-content/70">
                        Try adjusting your search terms or clearing your filters.
                    </p>
                    <button
                        onClick={handleResetFilters}
                        className="btn btn-outline btn-sm mt-4"
                    >
                        Clear Filters
                    </button>
                </div>
            )}

            {/* Course Grid & Admin Actions */}
            {!loading && !error && courses.length > 0 && (
                <>
                    <CoursesGrid courses={courses} />

                    {user?.role === "admin" && (
                        <div className="flex justify-center pt-6">
                            <Link to="/admin/courses" className="btn btn-primary btn-wide shadow-md">
                                Manage Courses
                            </Link>
                        </div>
                    )}
                </>
            )}

            {/* Pagination Controls */}
            {!loading && !error && (
                <CoursesPagination
                    page={page}
                    totalPages={totalPages}
                    setPage={setPage}
                />
            )}
        </div>
    );
}