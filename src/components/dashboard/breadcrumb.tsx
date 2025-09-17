'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaChevronRight } from 'react-icons/fa';

export default function Breadcrumb() {
  const pathname = usePathname();
  
  // Skip rendering breadcrumbs on the main dashboard page
  if (pathname === '/dashboard') {
    return null;
  }
  
  // Generate breadcrumb segments
  const segments = pathname.split('/').filter(Boolean);
  
  // Create breadcrumb items with proper paths, but skip the 'dashboard' segment
  const breadcrumbs = segments
    .filter((segment, index) => !(index === 0 && segment === 'dashboard'))
    .map((segment, index, filteredSegments) => {
      // Calculate the correct path including any skipped segments
      const segmentIndex = segments.indexOf(segment);
      const path = `/${segments.slice(0, segmentIndex + 1).join('/')}`;
      
      // Format the segment for display (capitalize, replace hyphens with spaces)
      const formattedSegment = segment
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
      
      return {
        label: formattedSegment,
        path,
        isLast: index === filteredSegments.length - 1,
      };
    });

  return (
    <nav className="flex mb-4" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
          >
            <FaHome className="mr-2 w-4 h-4" />
            Dashboard
          </Link>
        </li>
        
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={index}>
            <div className="flex items-center">
              <FaChevronRight className="w-3 h-3 text-gray-400 mx-1" />
              {breadcrumb.isLast ? (
                <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                  {breadcrumb.label}
                </span>
              ) : (
                <Link
                  href={breadcrumb.path}
                  className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                >
                  {breadcrumb.label}
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}