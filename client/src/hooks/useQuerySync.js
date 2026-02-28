// This hook provides a way to synchronize query parameters in the URL with React state. It allows you to read the current query parameters, update them, and reset them to default values. The hook uses React Router's `useSearchParams` to manage the query parameters in the URL.

import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useQuerySync(defaults = {}) {
    const [searchParams, setSearchParams] = useSearchParams();

    const query = useMemo(() => {
        const parsed = { ...defaults };
        searchParams.forEach((value, key) => {
            parsed[key] = value;
        });
        return parsed;
    }, [defaults, searchParams]);

    const updateQuery = (patch = {}, options = { replace: false }) => {
        const merged = { ...query, ...patch };
        const nextParams = new URLSearchParams();

        Object.entries(merged).forEach(([key, value]) => {
            if (value === undefined || value === null || value === '') {
                return;
            }
            nextParams.set(key, String(value));
        });

        setSearchParams(nextParams, { replace: options.replace });
    };

    const resetQuery = (options = { replace: false }) => {
        const nextParams = new URLSearchParams();
        Object.entries(defaults).forEach(([key, value]) => {
            if (value === undefined || value === null || value === '') {
                return;
            }
            nextParams.set(key, String(value));
        });
        setSearchParams(nextParams, { replace: options.replace });
    };

    return { query, updateQuery, resetQuery };
}