import { useState, useEffect } from 'react';

/**
 * Media Query Hook
 * Tracks media query matches for responsive design
 * 
 * @param query - Media query string
 * 
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const isMobile = useMediaQuery('(max-width: 768px)');
 *   const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
 *   const isDesktop = useMediaQuery('(min-width: 1025px)');
 * 
 *   return (
 *     <div>
 *       {isMobile && <MobileView />}
 *       {isTablet && <TabletView />}
 *       {isDesktop && <DesktopView />}
 *     </div>
 *   );
 * };
 * ```
 */
export const useMediaQuery = (query: string): boolean => {
    const [matches, setMatches] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return window.matchMedia(query).matches;
        }
        return false;
    });

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const mediaQuery = window.matchMedia(query);

        // Set initial value
        setMatches(mediaQuery.matches);

        // Create event listener
        const handler = (event: MediaQueryListEvent) => {
            setMatches(event.matches);
        };

        // Add listener
        mediaQuery.addEventListener('change', handler);

        // Cleanup
        return () => {
            mediaQuery.removeEventListener('change', handler);
        };
    }, [query]);

    return matches;
};

// Common breakpoints helper
export const useBreakpoints = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
    const isDesktop = useMediaQuery('(min-width: 1025px)');
    const isLargeDesktop = useMediaQuery('(min-width: 1440px)');

    return {
        isMobile,
        isTablet,
        isDesktop,
        isLargeDesktop,
        // Convenience flags
        isMobileOrTablet: isMobile || isTablet,
        isDesktopOrLarger: isDesktop || isLargeDesktop
    };
};
