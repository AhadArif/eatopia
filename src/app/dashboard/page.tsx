'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Navbar';
import { ScrollAnimatedSection } from '@/components/animation/AnimatedSection';
import { SimpleMouseTracker } from '@/components/animation/SimpleMouseTracker';
import { useDiningExperiences } from '@/hooks/useDiningExperiences';
import BackButton from '@/components/layout/BackButton';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
    const { experiences, stats, loading } = useDiningExperiences();
  
  // Debug: Log what experiences we're rendering
  useEffect(() => {
    console.log('Dashboard received experiences:', experiences.map(exp => ({ id: exp.id, status: exp.status, date: exp.date })));
  }, [experiences]);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState<{ type: 'edit' | 'delete' | null, experience: typeof experiences[0] | null }>({ type: null, experience: null });
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
  }, [user, router]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.dropdown-container')) {
        if (dropdownTimeout) clearTimeout(dropdownTimeout);
        setDropdownOpen(null);
      }
    };
    
    if (dropdownOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [dropdownOpen, dropdownTimeout]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeout) clearTimeout(dropdownTimeout);
    };
  }, [dropdownTimeout]);

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black/90">
      <BackButton />
      <SimpleMouseTracker />
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header Section */}
        <ScrollAnimatedSection animation="slideUp" delay={200}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-4xl font-roboto text-black dark:text-white mb-2">
                My Reservations
              </h1>
              <p className="text-lg font-roboto text-gray-600 dark:text-gray-300">
                Manage your dining adventures and culinary journeys
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Link
                href="/create-experience"
                className="inline-flex items-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-roboto rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New Experience
              </Link>
            </div>
          </div>
        </ScrollAnimatedSection>

        {/* Quick Stats */}
        <ScrollAnimatedSection animation="slideUp" delay={400}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-black/80 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-roboto text-gray-500 dark:text-gray-400">Total Experiences</p>
                  <p className="text-2xl font-roboto text-black dark:text-white">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-black/80 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-roboto text-gray-500 dark:text-gray-400">Completed</p>
                  <p className="text-2xl font-roboto text-black dark:text-white">{stats.completed}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-black/80 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-roboto text-gray-500 dark:text-gray-400">Upcoming</p>
                  <p className="text-2xl font-roboto text-black dark:text-white">{stats.upcoming}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-black/80 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-roboto text-gray-500 dark:text-gray-400">Avg Rating</p>
                  <p className="text-2xl font-roboto text-black dark:text-white">{stats.avgRating || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollAnimatedSection>

        {/* Navigation Tabs */}
        <ScrollAnimatedSection animation="slideUp" delay={600}>
          <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
            <nav className="-mb-px flex space-x-8">
              <button className="border-orange-500 text-orange-600 dark:text-orange-400 whitespace-nowrap py-4 px-1 border-b-2 font-roboto text-sm">
                All Experiences
              </button>
              <button className="border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-roboto text-sm">
                Upcoming
              </button>
              <button className="border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-roboto text-sm">
                Completed
              </button>
              <button className="border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-roboto text-sm">
                Favorites
              </button>
            </nav>
          </div>
        </ScrollAnimatedSection>



        {/* Experiences List */}
        {loading ? (
          <ScrollAnimatedSection animation="fadeIn" delay={800}>
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          </ScrollAnimatedSection>
        ) : experiences.length === 0 ? (
          <ScrollAnimatedSection animation="fadeIn" delay={800}>
            <div className="text-center py-20">
              <div className="w-32 h-32 bg-orange-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg className="w-16 h-16 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-3xl font-roboto text-black dark:text-white mb-4">
                Ready for Your First <span className="text-orange-500">Adventure</span>?
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 font-roboto max-w-md mx-auto leading-relaxed mb-10">
                Transform ordinary meals into extraordinary memories. Start your culinary journey today!
              </p>
              <Link 
                href="/create-experience"
                className="inline-flex items-center bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-2xl font-roboto text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg"
              >
                Create Your First Experience
              </Link>
              
              {/* Additional encouragement */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="font-roboto text-black dark:text-white mb-2">Plan Ahead</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-roboto">Schedule upcoming dining experiences</p>
                </div>
                
                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <h4 className="font-roboto text-black dark:text-white mb-2">Capture Memories</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-roboto">Document your favorite moments</p>
                </div>
                
                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <h4 className="font-roboto text-black dark:text-white mb-2">Rate & Review</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-roboto">Share your dining experiences</p>
                </div>
              </div>
            </div>
          </ScrollAnimatedSection>
        ) : (
          <div className="space-y-6">
            {experiences.map((experience, index) => (
              <ScrollAnimatedSection key={experience.id} animation="slideUp" delay={800 + (index * 100)}>
                <div 
                  className="bg-white dark:bg-black/80 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300 group relative"
                  data-experience-id={experience.id}
                  style={{ zIndex: dropdownOpen === experience.id ? 99999 : 1 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-roboto text-black dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                          {experience.name}
                        </h3>
                        <p className="text-sm font-roboto text-gray-600 dark:text-gray-300">
                          {experience.restaurant}
                        </p>
                        <p className="text-sm font-roboto text-gray-500 dark:text-gray-400">
                          {experience.location} • {experience.date.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-roboto ${
                        experience.status === 'upcoming' 
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          : experience.status === 'completed'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}>
                        {(() => {
                          console.log(`Rendering experience ${experience.id} with status: ${experience.status}`);
                          return experience.status.charAt(0).toUpperCase() + experience.status.slice(1);
                        })()}
                      </span>
                      {experience.rating && (
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < experience.rating! ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      )}
                      <div className="relative dropdown-container" style={{ zIndex: 10000 }}>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            const experienceId = experience.id || null;
                            
                            if (dropdownOpen === experienceId) {
                              // Close if already open
                              setDropdownOpen(null);
                              if (dropdownTimeout) clearTimeout(dropdownTimeout);
                            } else {
                              // Open and set auto-close timer
                              setDropdownOpen(experienceId);
                              if (dropdownTimeout) clearTimeout(dropdownTimeout);
                              
                              const timeout = setTimeout(() => {
                                setDropdownOpen(null);
                              }, 4000); // Auto-close after 4 seconds
                              setDropdownTimeout(timeout);
                            }
                          }}
                          className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors relative z-50"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                        
                        {/* Dropdown Menu */}
                        {dropdownOpen === experience.id && (
                          <div 
                            className="absolute top-8 right-0 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-3 min-w-[160px] backdrop-blur-sm animate-in slide-in-from-top-2 duration-200 z-[99999]"
                            onClick={(e) => e.stopPropagation()}
                            onMouseEnter={() => {
                              // Cancel auto-close when hovering over dropdown
                              if (dropdownTimeout) {
                                clearTimeout(dropdownTimeout);
                                setDropdownTimeout(null);
                              }
                            }}
                            onMouseLeave={() => {
                              // Restart auto-close timer when leaving dropdown
                              const timeout = setTimeout(() => {
                                setDropdownOpen(null);
                              }, 2000); // Shorter timeout after leaving
                              setDropdownTimeout(timeout);
                            }}
                            style={{
                              zIndex: 99999,
                              position: 'absolute',
                              right: 0,
                              top: '100%',
                              marginTop: '8px',
                              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1), 0 0 20px rgba(255, 165, 0, 0.2)'
                            }}
                          >
                            <button
                              onClick={() => {
                                if (dropdownTimeout) clearTimeout(dropdownTimeout);
                                setModalOpen({ type: 'edit', experience });
                                setDropdownOpen(null);
                              }}
                              className="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400 flex items-center gap-3 transition-all duration-200 rounded-lg mx-2"
                            >
                              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </div>
                              <div>
                                <div className="font-medium">Edit</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Modify details</div>
                              </div>
                            </button>
                            <button
                              onClick={() => {
                                if (dropdownTimeout) clearTimeout(dropdownTimeout);
                                setModalOpen({ type: 'delete', experience });
                                setDropdownOpen(null);
                              }}
                              className="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-3 transition-all duration-200 rounded-lg mx-2"
                            >
                              <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </div>
                              <div>
                                <div className="font-medium">Delete</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Remove permanently</div>
                              </div>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollAnimatedSection>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {modalOpen.type === 'edit' && modalOpen.experience && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Experience</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Modify your dining experience details</p>
                  </div>
                </div>
                <button
                  onClick={() => setModalOpen({ type: null, experience: null })}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">{modalOpen.experience.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{modalOpen.experience.restaurant}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{modalOpen.experience.location} • {modalOpen.experience.date.toLocaleDateString()}</p>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Edit functionality is coming soon! You&apos;ll be able to modify the date, location, restaurant, and other details of your dining experience.
                </p>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setModalOpen({ type: null, experience: null })}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    // Future: Implement actual edit functionality
                    setModalOpen({ type: null, experience: null });
                  }}
                  className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors font-medium"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {modalOpen.type === 'delete' && modalOpen.experience && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Experience</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">This action cannot be undone</p>
                  </div>
                </div>
                <button
                  onClick={() => setModalOpen({ type: null, experience: null })}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">{modalOpen.experience.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{modalOpen.experience.restaurant}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{modalOpen.experience.location} • {modalOpen.experience.date.toLocaleDateString()}</p>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Are you sure you want to delete this dining experience? This will permanently remove all associated data and cannot be recovered.
                </p>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setModalOpen({ type: null, experience: null })}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    console.log('Delete experience:', modalOpen.experience?.id);
                    // Future: Implement actual delete functionality
                    // refreshExperiences();
                    setModalOpen({ type: null, experience: null });
                  }}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors font-medium"
                >
                  Delete Experience
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
