import { Search, RotateCcw } from "lucide-react";

export default function CoursesFilters({
    search,
    setSearch,
    sort,
    setSort,
    category,
    setCategory,
    tags,
    setTags,
    onSearchSubmit,
    onResetFilters
}) {
    return (
        <div className="bg-base-100 border border-base-300 rounded-2xl p-4 shadow-sm space-y-4">
            {/* Top Search Bar */}
            <form onSubmit={onSearchSubmit} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
                    <input
                        className="input input-bordered pl-10 w-full"
                        placeholder="Search by course title or instructor name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary px-6 sm:w-auto">
                    Search
                </button>
            </form>

            {/* Filter Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-base-200">
                {/* Sort */}
                <select
                    className="select select-bordered w-full"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                >
                    <option value="">Sort by price</option>
                    <option value="price_asc">Price: Low → High</option>
                    <option value="price_desc">Price: High → Low</option>
                </select>

                {/* Category */}
                <input
                    className="input input-bordered w-full"
                    placeholder="Category (e.g. Web, AI)"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />

                {/* Tags */}
                <input
                    className="input input-bordered w-full"
                    placeholder="Tags (e.g. react, node)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                />
            </div>

            {(sort || category || tags || search) && (
                <div className="flex justify-end pt-1">
                    <button
                        type="button"
                        onClick={onResetFilters}
                        className="btn btn-ghost btn-xs text-base-content/60 gap-1 hover:text-error"
                    >
                        <RotateCcw className="w-3 h-3" /> Reset Filters
                    </button>
                </div>
            )}
        </div>
    );
}