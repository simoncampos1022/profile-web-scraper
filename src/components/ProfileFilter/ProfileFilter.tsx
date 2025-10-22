import { FilterModel } from "@/types";

const ProfileFilter = ({
  filter,
  handleChange,
  onSearch,
  onReset,
  loading,
}: {
  filter: FilterModel;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch?: () => void;
  onReset?: () => void;
  loading?: boolean;
}) => {
  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSearch?.();
        }}
        className="flex flex-col"
      >
        <div className="flex items-center justify-between">
          
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Keyword */}
          <div className="flex flex-col gap-1">
            <label htmlFor="keyword" className="text-sm font-medium text-gray-600 dark:text-gray-300">Keyword</label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
                </svg>
              </span>
              <input
                type="text"
                name="keyword"
                id="keyword"
                value={(filter?.keyword as string) || ""}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm bg-white dark:bg-gray-800"
                placeholder="e.g. AI, React, seed, fundraising"
                aria-label="Keyword"
              />
            </div>
          </div>

          {/* Name */}
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-sm font-medium text-gray-600 dark:text-gray-300">User Name</label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a7.5 7.5 0 0115 0" />
                </svg>
              </span>
              <input
                type="text"
                name="name"
                id="name"
                value={filter?.name || ""}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm bg-white dark:bg-gray-800"
                placeholder="Enter name"
                aria-label="User Name"
              />
            </div>
          </div>

          {/* Age */}
          <div className="flex flex-col gap-1">
            <label htmlFor="age" className="text-sm font-medium text-gray-600 dark:text-gray-300">Age (min)</label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m3 0A7.5 7.5 0 1112 4.5 7.5 7.5 0 0119.5 12z" />
                </svg>
              </span>
              <input
                type="number"
                name="age"
                id="age"
                min={0}
                value={(filter?.age as number) ?? 0}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm bg-white dark:bg-gray-800"
                placeholder="e.g. 21"
                aria-label="Minimum Age"
              />
            </div>
          </div>

          {/* Location */}
          <div className="flex flex-col gap-1">
            <label htmlFor="location" className="text-sm font-medium text-gray-600 dark:text-gray-300">Location</label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.5-7.5 10.5-7.5 10.5S4.5 18 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </span>
              <input
                type="text"
                name="location"
                id="location"
                value={filter?.location || ""}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm bg-white dark:bg-gray-800"
                placeholder="City, Country"
                aria-label="Location"
              />
            </div>
          </div>

          {/* Funding */}
          <div className="flex flex-col gap-1">
            <label htmlFor="funding" className="text-sm font-medium text-gray-600 dark:text-gray-300">Funding Status</label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                </svg>
              </span>
              <input
                type="text"
                name="funding"
                id="funding"
                value={filter?.funding || ""}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm bg-white dark:bg-gray-800"
                placeholder="e.g. bootstrapped, seed, series A"
                aria-label="Funding Status"
              />
            </div>
          </div>
          
          <div className="flex justify-between gap-4 items-end">
            <button
              type="button"
              onClick={() => onReset?.()}
              disabled={loading}
              className="px-4 py-1 w-1/2 h-10 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              title="Reset filters"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-1/2 h-10 items-center gap-2 px-4 py-2 text-sm rounded-md bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              title="Search"
            >
              {loading ? (
                <span className="inline-block h-4 w-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
                </svg>
              )}
              <span>Search</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileFilter;
