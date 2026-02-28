/**
 * REFERENCE FILE (COMMENTED) - useJobs Hook Blueprint
 *
 * Purpose:
 * - This file is a reference map to help integrate all folders in client/.
 * - Keep this commented until you start actual implementation.
 *
 * -------------------------------------------------------------
 * HOW ALL CLIENT FOLDERS CONNECT (HIGH LEVEL)
 * -------------------------------------------------------------
 * pages/        -> Screen-level orchestration (JobsListPage, Dashboard, etc.)
 * components/   -> Reusable UI parts (JobCard, Filters, Pagination, Loader)
 * services/     -> API calls only (axios instance + endpoint methods)
 * hooks/        -> Reusable logic/state (useJobs, useQuerySync, useAuth)
 * context/      -> Global app state (AuthContext)
 * utils/        -> Helpers (query builders, constants, formatters)
 *
 * Data flow for jobs listing:
 * JobsListPage -> useQuerySync -> useJobs -> jobService.getJobs -> API
 * API response -> useJobs state -> JobsListPage -> components render UI
 *
 * -------------------------------------------------------------
 * WHERE useJobs IS USED
 * -------------------------------------------------------------
 * 1) pages/jobs/JobsListPage.jsx
 *    - Passes query state (page, limit, search, location, skills, jobType)
 *    - Receives { jobs, pagination, loading, error, refetch }
 *
 * 2) components/jobs/JobFilters.jsx
 *    - Updates query via useQuerySync
 *    - useJobs reacts to query changes and fetches updated jobs
 *
 * 3) components/jobs/Pagination.jsx
 *    - Updates page in query params
 *    - useJobs fetches next/prev page
 *
 * -------------------------------------------------------------
 * EXPECTED BACKEND CONTRACT (from your Node routes)
 * -------------------------------------------------------------
 * GET /jobs?page=1&limit=10&search=&location=&skills=&jobType=
 *
 * Suggested response shape:
 * {
 *   success: true,
 *   data: [ ...jobs ],
 *   pagination: {
 *     currentPage: 1,
 *     limit: 10,
 *     hasNextPage: true,
 *     hasPrevPage: false
 *   }
 * }
 *
 * -------------------------------------------------------------
 * RECOMMENDED REAL IMPLEMENTATION STRUCTURE (UNCOMMENT LATER)
 * -------------------------------------------------------------
 * // import { useEffect, useState, useCallback } from 'react';
 * // import { getJobs } from '../services/jobService';
 * //
 * // export function useJobs(query) {
 * //   const [jobs, setJobs] = useState([]);
 * //   const [pagination, setPagination] = useState({
 * //     currentPage: 1,
 * //     limit: 10,
 * //     hasNextPage: false,
 * //     hasPrevPage: false,
 * //   });
 * //   const [loading, setLoading] = useState(false);
 * //   const [error, setError] = useState('');
 * //
 * //   const fetchJobs = useCallback(async () => {
 * //     try {
 * //       setLoading(true);
 * //       setError('');
 * //       const response = await getJobs(query);
 * //       setJobs(response.data || []);
 * //       setPagination(response.pagination || {});
 * //     } catch (err) {
 * //       setError(err?.response?.data?.error || 'Failed to fetch jobs');
 * //     } finally {
 * //       setLoading(false);
 * //     }
 * //   }, [query]);
 * //
 * //   useEffect(() => {
 * //     fetchJobs();
 * //   }, [fetchJobs]);
 * //
 * //   return { jobs, pagination, loading, error, refetch: fetchJobs };
 * // }
 *
 * -------------------------------------------------------------
 * RELATED FILES TO CREATE/CONNECT
 * -------------------------------------------------------------
 * services/api.js
 *   - axios.create({ baseURL: import.meta.env.VITE_API_URL })
 *   - request interceptor: inject token
 *   - response interceptor: handle 401 auto logout
 *
 * services/jobService.js
 *   - export async function getJobs(params) { return api.get('/jobs', { params }) }
 *
 * hooks/useQuerySync.js
 *   - reads/writes URL query params (page/search/filter)
 *
 * pages/jobs/JobsListPage.jsx
 *   - const { query, updateQuery } = useQuerySync(defaults)
 *   - const { jobs, loading, error, pagination } = useJobs(query)
 *
 * components/common
 *   - Loader.jsx, ErrorState.jsx, EmptyState.jsx
 *
 * -------------------------------------------------------------
 * WHY THIS PATTERN
 * -------------------------------------------------------------
 * - Keeps UI components clean and reusable
 * - Keeps API logic centralized
 * - Makes pagination/filter/search predictable
 * - Supports shareable URLs and browser back/forward behavior
 * - Easy to scale for recruiter/admin dashboards later
 */

 import { useEffect, useMemo, useState } from 'react';
 import { getJobs } from '../services/jobService';

 export function useJobs(query) {
   const [jobs, setJobs] = useState([]);
   const [pagination, setPagination] = useState({
     currentPage: 1,
     limit: 10,
     hasNextPage: false,
     hasPrevPage: false,
   });
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState('');

   const queryKey = useMemo(() => JSON.stringify(query || {}), [query]);

   useEffect(() => {
     const fetchJobs = async () => {
       try {
         setLoading(true);
         setError('');
         const parsedQuery = JSON.parse(queryKey);
         const response = await getJobs(parsedQuery);
         setJobs(response.data || []);
         setPagination(response.pagination || {});
       } catch (err) {
         setError(err?.response?.data?.error || 'Failed to fetch jobs');
       } finally {
         setLoading(false);
       }
     };

     fetchJobs();
   }, [queryKey]);

   return { jobs, pagination, loading, error };
 }