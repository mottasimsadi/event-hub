'use client';

import { useState, useEffect, useMemo, useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaCalendarAlt, FaMapMarkerAlt, FaSearch, FaFilter, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { AuthContext } from '@/components/providers/AuthProvider';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
  price: number;
  organizer: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(6);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: 'all', // all, free, paid
    sortBy: 'date', // date, price-asc, price-desc, title
  });
  // Use AuthContext for authentication status
  const { user, loading: authLoading } = useContext(AuthContext);
  
  // Force re-render when user auth state changes
  const [authState, setAuthState] = useState<boolean>(!!user);
  
  useEffect(() => {
    // Update auth state whenever user changes
    setAuthState(!!user);
    
    // Also check auth status when component mounts or when auth state might have changed
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setAuthState(false);
          return;
        }
        
        // Verify token with API
        const response = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();
        setAuthState(data.authenticated);
      } catch (error) {
        console.error('Auth check error:', error);
        setAuthState(false);
      }
    };
    
    checkAuthStatus();
  }, [user]);

  // Handle search input change
  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
  }

  // Handle price range filter change
  function handlePriceRangeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setFilters({...filters, priceRange: e.target.value});
  }

  // Handle sort by filter change
  function handleSortByChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setFilters({...filters, sortBy: e.target.value});
  }

  // Toggle filter panel visibility
  function toggleFilterPanel() {
    setFilterOpen(!filterOpen);
  }

  // Function to fetch events
  async function fetchEvents() {
    try {
      const response = await fetch('/api/events');
      if (!response.ok) {
        // Instead of throwing an error, set events to empty array
        setEvents([]);
        return;
      }
      const data = await response.json();
      setEvents(data.events || []);
    } catch (err: any) {
      // Instead of setting error, set events to empty array
      setEvents([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Reset to first page when search term or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  // Filter function for event search
  function filterEventBySearch(event: Event, term: string): boolean {
    const matchesSearch = 
      event.title.toLowerCase().includes(term.toLowerCase()) ||
      event.description.toLowerCase().includes(term.toLowerCase()) ||
      event.location.toLowerCase().includes(term.toLowerCase());
    
    // Price filter
    let matchesPrice = true;
    if (filters.priceRange === 'free') {
      matchesPrice = event.price === 0;
    } else if (filters.priceRange === 'paid') {
      matchesPrice = event.price > 0;
    }
    
    return matchesSearch && matchesPrice;
  }

  // Sort function for events
  function sortEvents(a: Event, b: Event): number {
    // Sort results
    switch (filters.sortBy) {
      case 'date':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  }

  // Apply filters and search
  const filteredEvents = useMemo(() => {
    // Ensure events is an array before filtering
    if (!Array.isArray(events)) return [];
    
    return events
      .filter(event => filterEventBySearch(event, searchTerm))
      .sort(sortEvents);
  }, [events, searchTerm, filters]);

  // Get current events for pagination
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  
  // Change page
  function paginate(pageNumber: number) {
    setCurrentPage(pageNumber);
  }
  
  // Go to next or previous page
  function nextPage() {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  }
  
  function prevPage() {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex mb-8" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
              <svg className="w-3 h-3 mr-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
              </svg>
              Home
            </Link>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
              </svg>
              <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">Events</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Upcoming Events</h1>
        
        {/* Force re-render when auth state changes by using authState */}
        <div key={authState ? 'user' : 'guest'}>
          {authState && user ? (
            <Link 
              href="/dashboard/events/create" 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center gap-2"
            >
            <FaCalendarAlt /> Create Event
            </Link>
          ) : (
            <Link 
              href="/auth/login?callbackUrl=/dashboard/events/create" 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center gap-2"
            >
              <FaCalendarAlt /> Sign in to create events
            </Link>
          )}
        </div>
      </div>
      
      {/* Search and filter bar */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search events by title, description or location"
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md w-full focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          <button 
            onClick={toggleFilterPanel}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md transition-colors md:w-auto w-full"
          >
            <FaFilter className="h-4 w-4" />
            <span>Filters</span>
          </button>
        </div>
        
        {/* Filter options */}
        {filterOpen && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-md border border-gray-200 dark:border-gray-700 mb-4 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price Range</label>
                <select 
                  value={filters.priceRange}
                  onChange={handlePriceRangeChange}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">All Prices</option>
                  <option value="free">Free Events</option>
                  <option value="paid">Paid Events</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort By</label>
                <select 
                  value={filters.sortBy}
                  onChange={handleSortByChange}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="date">Date (Upcoming)</option>
                  <option value="price-asc">Price (Low to High)</option>
                  <option value="price-desc">Price (High to Low)</option>
                  <option value="title">Title (A-Z)</option>
                </select>
              </div>
            </div>
          </div>
        )}
        
        {/* Results count */}
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredEvents.length > 0 ? indexOfFirstEvent + 1 : 0}-{Math.min(indexOfLastEvent, filteredEvents.length)} of {filteredEvents.length} events
        </div>
      </div>

      {/* No events found */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
          <div className="flex flex-col items-center justify-center space-y-4">
            <svg className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
            <p className="text-gray-600 dark:text-gray-400 text-xl mb-6">
              {searchTerm ? 'No events match your search.' : 'No events found.'}
            </p>
            {user ? (
              <Link 
                href="/dashboard/events/create" 
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Create a new event
              </Link>
            ) : (
              <Link href="/login?callbackUrl=/dashboard/events/create" className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                </svg>
                Sign in to create events
              </Link>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentEvents.map((event) => (
              <div key={event._id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700">
                <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
                  {event.image ? (
                    <Image 
                      src={event.image} 
                      alt={event.title} 
                      width={400}
                      height={200}
                      className="w-full h-full object-cover"
                      priority={currentPage === 1}
                    />
                  ) : (
                    <Image 
                      src={`https://picsum.photos/seed/event-${event._id}/400/200`} 
                      alt={event.title} 
                      width={400}
                      height={200}
                      className="w-full h-full object-cover"
                      priority={currentPage === 1}
                    />
                  )}
                  {event.price === 0 && (
                    <div className="absolute top-0 right-0 bg-green-500 text-white px-2 py-1 text-xs font-bold">
                      FREE
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{event.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{event.description}</p>
                  
                  <div className="flex items-center text-gray-500 dark:text-gray-400 mb-2">
                    <FaCalendarAlt className="mr-2" />
                    <span>{new Date(event.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-500 dark:text-gray-400 mb-4">
                    <FaMapMarkerAlt className="mr-2" />
                    <span>{event.location}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {event.price === 0 ? 'Free' : `$${event.price.toFixed(2)}`}
                    </span>
                    
                    <Link 
                      href={`/events/${event._id}`}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FaChevronLeft className="h-3 w-3" />
                  <span>Previous</span>
                </button>
                
                <div className="hidden md:flex space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => {
                    function handlePaginationClick() {
                      paginate(number);
                    }
                    
                    return (
                      <button
                        key={number}
                        onClick={handlePaginationClick}
                        className={`px-3 py-2 rounded-md ${currentPage === number ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'} transition-colors`}
                      >
                        {number}
                      </button>
                    );
                  })}
                </div>
                
                <div className="md:hidden flex items-center space-x-1">
                  <span className="text-gray-700 dark:text-gray-300">{currentPage} of {totalPages}</span>
                </div>
                
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span>Next</span>
                  <FaChevronRight className="h-3 w-3" />
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
}