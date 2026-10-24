import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CoursesPagination({ page, totalPages, setPage }) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center items-center gap-2 pt-4">
            <div className="join border border-base-300 shadow-sm">
                <button
                    className="join-item btn btn-sm btn-outline"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                >
                    <ChevronLeft className="w-4 h-4" /> Prev
                </button>

                <button className="join-item btn btn-sm btn-ghost no-animation">
                    Page {page} of {totalPages}
                </button>

                <button
                    className="join-item btn btn-sm btn-outline"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                >
                    Next <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}