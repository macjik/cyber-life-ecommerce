'use client';

import { FaSignOutAlt } from 'react-icons/fa';
import Button from './button';
import { logout } from '../auth/actions';

export default function Logout() {
  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (err) {
      console.error('Error during logout', err);
      return { error: 'Internal server error' };
    }
  };

  return (
    <Button
      className="px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all duration-200 inline-flex max-w-max space-x-4 justify-center"
      onClick={handleLogout}
    >
      <span>Logout</span>
      <FaSignOutAlt size={24} />
    </Button>
  );
}
