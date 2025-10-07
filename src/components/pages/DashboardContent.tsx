'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BackButton from '@/components/layout/BackButton';

interface DiningExperience {
  id: string;
  location: string;
  date: string;
  groupType: string;
  vibe: string;
  budget: string;
  imageUrl: string;
  restaurantsFound: number;
  status: 'upcoming' | 'completed' | 'planning';
  isFavorite?: boolean;
}

// Mock data for dining experiences
const mockExperiences: DiningExperience[] = [
  {
    id: '1',
    location: 'Cafe Azure, Bangalore',
    date: '2025-09-26', // Past date - should auto-update to completed
    groupType: 'couple',
    vibe: 'romantic',
    budget: 'Upscale',
    imageUrl: '/restaurant-background.svg',
    restaurantsFound: 12,
    status: 'upcoming'
  },
  {
    id: '2',
    location: 'Empire, Bangalore',
    date: '2025-09-24', // Past date - should auto-update to completed
    groupType: 'friends',
    vibe: 'loud-af',
    budget: 'Moderate',
    imageUrl: '/restaurant-background.svg',
    restaurantsFound: 8,
    status: 'upcoming'
  },
  {
    id: '3',
    location: 'Brooklyn, New York',
    date: '2025-09-08',
    groupType: 'family',
    vibe: 'casual',
    budget: 'Budget-friendly',
    imageUrl: '/restaurant-background.svg',
    restaurantsFound: 15,
    status: 'completed',
    isFavorite: true
  },
  {
    id: '4',
    location: 'San Francisco, California',
    date: '2025-10-15', // Future date
    groupType: 'solo',
    vibe: 'chill',
    budget: 'Moderate',
    imageUrl: '/restaurant-background.svg',
    restaurantsFound: 6,
    status: 'upcoming'
  },
  {
    id: '5',
    location: 'Los Angeles, California',
    date: '2025-11-05', // Future date
    groupType: 'friends',
    vibe: 'energetic',
    budget: 'Upscale',
    imageUrl: '/restaurant-background.svg',
    restaurantsFound: 10,
    status: 'upcoming',
    isFavorite: true
  }
];

const vibeEmojis = {
  'romantic': '💕',
  'chill': '😌',
  'loud-af': '🔥',
  'energetic': '🎉',
  'upscale': '✨',
  'casual': '👕'
};

const groupTypeEmojis = {
  'solo': '🧑‍🍳',
  'couple': '💑',
  'friends': '👥',
  'family': '👨‍👩‍👧‍👦'
};

export default function MyDiningExperiences() {
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'completed' | 'favorites'>('all');
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [experiences, setExperiences] = useState(mockExperiences);

  // Update experience status based on current date
  useEffect(() => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    setExperiences(prevExperiences => {
      return prevExperiences.map(exp => {
        const expDate = new Date(exp.date);
        expDate.setHours(0, 0, 0, 0);
        
        // If experience date is in the past and status is upcoming, mark as completed
        if (expDate < currentDate && exp.status === 'upcoming') {
          return { ...exp, status: 'completed' as const };
        }
        return exp;
      });
    });
  }, []);

  // Handle dropdown menu actions
  const handleEditExperience = (experienceId: string) => {
    console.log('Edit experience:', experienceId);
    setDropdownOpen(null);
    alert('Edit functionality would be implemented here. You could change the date, location, or other details.');
  };

  const handleDeleteExperience = (experienceId: string) => {
    if (window.confirm('Are you sure you want to delete this experience? This action cannot be undone.')) {
      setExperiences(prev => prev.filter(exp => exp.id !== experienceId));
      setDropdownOpen(null);
    }
  };

  const toggleDropdown = (experienceId: string) => {
    setDropdownOpen(dropdownOpen === experienceId ? null : experienceId);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.dropdown-container')) {
        setDropdownOpen(null);
      }
    };
    
    if (dropdownOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [dropdownOpen]);

  const filteredExperiences = activeTab === 'all' 
    ? experiences 
    : activeTab === 'favorites'
    ? experiences.filter(exp => exp.isFavorite === true)
    : experiences.filter(exp => exp.status === activeTab);

  return (
    <div className="min-h-screen bg-gray-50 pt-16 relative">
      <BackButton />
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Reservations</h1>
              <p className="text-gray-600 mt-1">Manage your vibe-matched dining adventures</p>
            </div>
            <Link
              href="/create-experience"
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              Create New Experience
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs */}
        <div className="flex space-x-6 mb-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-2 border-b-2 transition-colors ${
              activeTab === 'all'
                ? 'border-red-500 text-red-600 font-medium'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            All Experiences
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`pb-2 border-b-2 transition-colors ${
              activeTab === 'upcoming'
                ? 'border-red-500 text-red-600 font-medium'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`pb-2 border-b-2 transition-colors ${
              activeTab === 'completed'
                ? 'border-red-500 text-red-600 font-medium'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`pb-2 border-b-2 transition-colors ${
              activeTab === 'favorites'
                ? 'border-red-500 text-red-600 font-medium'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            ⭐ Favorites
          </button>
        </div>

        {/* Experiences Grid */}
        {filteredExperiences.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No dining experiences yet</h3>
            <p className="text-gray-600 mb-8">Create your first vibe-matched dining experience!</p>
            <Link
              href="/create-experience"
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              Get Started
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredExperiences.map((experience) => (
              <div
                key={experience.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              >
                {/* Experience Image */}
                <div className="relative h-48 bg-gradient-to-r from-orange-400 to-red-500">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-4xl mb-2">
                        {vibeEmojis[experience.vibe as keyof typeof vibeEmojis] || '🍽️'}
                      </div>
                      <div className="text-2xl">
                        {groupTypeEmojis[experience.groupType as keyof typeof groupTypeEmojis]}
                      </div>
                    </div>
                  </div>
                  
                  {/* Status Badge and Dropdown */}
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      experience.status === 'upcoming' 
                        ? 'bg-blue-100 text-blue-800'
                        : experience.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {experience.status.charAt(0).toUpperCase() + experience.status.slice(1)}
                    </span>
                    
                    {/* Three Dots Menu */}
                    <div className="relative dropdown-container">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDropdown(experience.id);
                        }}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors border border-white/30"
                        title="More options"
                      >
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                      
                      {/* Dropdown Menu */}
                      {dropdownOpen === experience.id && (
                        <div 
                          className="absolute right-0 top-10 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20 min-w-[140px]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => handleEditExperience(experience.id)}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteExperience(experience.id)}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Experience Details */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {experience.location}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {new Date(experience.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </p>

                  <div className="space-y-3">
                    {/* Group & Vibe */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">Group:</span>
                        <span className="font-medium capitalize">{experience.groupType}</span>
                        <span>{groupTypeEmojis[experience.groupType as keyof typeof groupTypeEmojis]}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">Vibe:</span>
                        <span className="font-medium capitalize">{experience.vibe.replace('-', ' ')}</span>
                        <span>{vibeEmojis[experience.vibe as keyof typeof vibeEmojis]}</span>
                      </div>
                    </div>

                    {/* Budget & Restaurants Found */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">💰 Budget:</span>
                        <span className="font-medium">{experience.budget}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">🎯 Found:</span>
                        <span className="font-medium">{experience.restaurantsFound} spots</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex space-x-3">
                    <button className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors font-medium">
                      {experience.status === 'completed' ? 'View Details' : 'View Restaurants'}
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      {experience.status === 'completed' ? 'Book Again' : 'Edit'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <div className="text-2xl mb-2">🍽️</div>
              <h4 className="font-medium text-gray-900">Find Tonight&apos;s Spot</h4>
              <p className="text-sm text-gray-600">Quick dinner recommendation for tonight</p>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <div className="text-2xl mb-2">💕</div>
              <h4 className="font-medium text-gray-900">Date Night Planner</h4>
              <p className="text-sm text-gray-600">Romantic spots for you and your partner</p>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <div className="text-2xl mb-2">👥</div>
              <h4 className="font-medium text-gray-900">Group Hangout</h4>
              <p className="text-sm text-gray-600">Perfect spots for friend gatherings</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
