'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DiningExperience, 
  getUserExperiences, 
  getUserStats,
  subscribeToUserExperiences
} from '@/lib/experiences';

export function useDiningExperiences() {
  const { user } = useAuth();
  const [experiences, setExperiences] = useState<DiningExperience[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    upcoming: 0,
    cancelled: 0,
    avgRating: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setExperiences([]);
      setStats({ total: 0, completed: 0, upcoming: 0, cancelled: 0, avgRating: 0 });
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // For testing purposes, add some mock data
        const mockData: DiningExperience[] = [
          {
            id: '1',
            userId: user.uid,
            name: 'Ahad Arif',
            restaurant: 'Cafe Azure',
            date: new Date('2025-09-26'), // Past date - should auto-update
            location: 'Bangalore',
            status: 'upcoming',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: '2', 
            userId: user.uid,
            name: 'Birthday',
            restaurant: 'Empire',
            date: new Date('2025-09-24'), // Past date - should auto-update  
            location: 'Bangalore',
            status: 'upcoming',
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        ];
        
        // For now, use mock data for testing the status update functionality
        // In production, you would fetch real data:
        // const [userExperiences, userStats] = await Promise.all([
        //   getUserExperiences(user.uid),
        //   getUserStats(user.uid)
        // ]);
        
        const allExperiences = mockData;
        
        // Update past-due experiences to completed status
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        
        console.log('Current date for comparison:', currentDate.toISOString().split('T')[0]);
        
        const updatedExperiences = allExperiences.map(exp => {
          const expDate = new Date(exp.date);
          expDate.setHours(0, 0, 0, 0);
          
          console.log(`Experience ${exp.id}: date=${exp.date.toISOString().split('T')[0]}, status=${exp.status}, isPast=${expDate < currentDate}`);
          
          // If experience date is in the past and status is upcoming, mark as completed
          if (expDate < currentDate && exp.status === 'upcoming') {
            console.log(`Auto-updating experience ${exp.id} from ${exp.status} to completed`);
            return { ...exp, status: 'completed' as const };
          }
          return exp;
        });
        
        // Calculate updated stats based on new experience statuses
        const updatedStats = {
          total: updatedExperiences.length,
          completed: updatedExperiences.filter(exp => exp.status === 'completed').length,
          upcoming: updatedExperiences.filter(exp => exp.status === 'upcoming').length,
          cancelled: updatedExperiences.filter(exp => exp.status === 'cancelled').length,
          avgRating: updatedExperiences.reduce((sum, exp) => sum + (exp.rating || 0), 0) / updatedExperiences.length || 0
        };
        
        console.log('Final updated experiences:', updatedExperiences);
        console.log('Final updated stats:', updatedStats);
        
        // Force state update with new array references
        setExperiences([...updatedExperiences]);
        setStats({...updatedStats});
      } catch (err) {
        console.error('Error fetching experiences:', err);
        setError('Failed to load experiences');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up real-time subscription
    const unsubscribe = subscribeToUserExperiences(user.uid, (updatedExperiences) => {
      setExperiences(updatedExperiences);
      
      // Update stats when experiences change
      getUserStats(user.uid).then(setStats).catch(console.error);
    });

    return () => unsubscribe();
  }, [user]);

  const refreshExperiences = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const [userExperiences, userStats] = await Promise.all([
        getUserExperiences(user.uid),
        getUserStats(user.uid)
      ]);
      
      setExperiences(userExperiences);
      setStats(userStats);
    } catch (err) {
      console.error('Error refreshing experiences:', err);
      setError('Failed to refresh experiences');
    } finally {
      setLoading(false);
    }
  };

  return {
    experiences,
    stats,
    loading,
    error,
    refreshExperiences
  };
}
