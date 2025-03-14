// src/hooks/useAnnouncements.js
import { useQuery } from '@tanstack/react-query';
import { getAnnouncements } from '@/actions/admin/getAnnouncements';

// Define a function to fetch announcements
const fetchAnnouncements = async () => {
  const { announcements } = await getAnnouncements();
  return announcements;
};

// Create a custom hook to use the announcements data
export const useAnnouncements = () => {
  return useQuery(['announcements'], fetchAnnouncements);
};
