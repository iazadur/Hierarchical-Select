import { OptionType } from '../types';

interface Cache {
    [key: string]: {
        data: OptionType[];
        timestamp: number;
    };
}

// Cache for API responses with expiration
const cache: Cache = {};
const CACHE_EXPIRATION = 5 * 60 * 1000; // 5 minutes

/**
 * Debounce function to prevent rapid successive calls
 */
export const debounce = <F extends (...args: any[]) => any>(
    func: F,
    waitFor: number
): ((...args: Parameters<F>) => void) => {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    return (...args: Parameters<F>): void => {
        if (timeout !== null) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => func(...args), waitFor);
    };
};

/**
 * Fetch options for a field based on parent value
 * Caches responses to avoid redundant API calls
 */
export const fetchOptionsWithCache = async (
    fetchFn: (parentValue: any) => Promise<OptionType[]> | OptionType[],
    parentValue: any,
    cacheKey: string
): Promise<OptionType[]> => {
    // Check if we have a valid cache entry
    const cacheEntry = cache[cacheKey];
    const now = Date.now();

    if (cacheEntry && now - cacheEntry.timestamp < CACHE_EXPIRATION) {
        return cacheEntry.data;
    }

    try {
        const result = await fetchFn(parentValue);

        // Cache the result
        cache[cacheKey] = {
            data: result,
            timestamp: now,
        };

        return result;
    } catch (error) {
        // If cache exists, return it even if expired as a fallback
        if (cacheEntry) {
            return cacheEntry.data;
        }
        throw error;
    }
};

/**
 * Clears the cache for a specific key or all cache if no key provided
 */
export const clearCache = (cacheKey?: string): void => {
    if (cacheKey) {
        delete cache[cacheKey];
    } else {
        Object.keys(cache).forEach((key) => {
            delete cache[key];
        });
    }
}; 