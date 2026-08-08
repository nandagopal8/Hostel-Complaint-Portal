/**
 * Utility helpers used across the frontend
 */

// Format a date string to a readable format
export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

// Time ago (e.g., "2 hours ago")
export const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(dateStr);
};

// Get initials from full name
export const getInitials = (name = '') =>
  name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

// Backend image URL
export const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${path}`;
};

// Status badge class
export const getStatusClass = (status) => {
  const map = {
    'Pending': 'badge-pending',
    'Assigned': 'badge-assigned',
    'In Progress': 'badge-inprogress',
    'Resolved': 'badge-resolved',
    'Closed': 'badge-closed',
  };
  return map[status] || 'badge-pending';
};

// Priority badge class
export const getPriorityClass = (priority) => {
  const map = { Low: 'badge-low', Medium: 'badge-medium', High: 'badge-high' };
  return map[priority] || 'badge-low';
};

// Category icons
export const getCategoryIcon = (category) => {
  const map = {
    'Electrical': '⚡',
    'Plumbing': '🔧',
    'Water Supply': '💧',
    'Wi-Fi / Internet': '📶',
    'Furniture': '🪑',
    'Room Cleaning': '🧹',
    'Washroom': '🚿',
    'Mess / Food': '🍽️',
    'Security': '🔒',
    'Others': '📋',
  };
  return map[category] || '📋';
};

// Extract error message from Axios error
export const getErrorMessage = (error) =>
  error?.response?.data?.message || error?.message || 'Something went wrong';
