'use server';

import Link from 'next/link';
import { FaUser, FaShoppingCart, FaCog, FaHome } from 'react-icons/fa';
import { AiFillControl } from "react-icons/ai";

export default async function NavBar({ children = null, icon = null, userRole = null }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 z-50">
      <Link href="/user" className="flex flex-col items-center text-gray-600 hover:text-blue-500">
        <FaUser size={24} />
        <span className="text-xs">User</span>
      </Link>
      <Link href="/" className="flex flex-col items-center text-gray-600 hover:text-blue-500">
        <FaHome size={24} />
        <span className="text-xs">Home</span>
      </Link>
      <Link href="/cart" className="flex flex-col items-center text-gray-600 hover:text-blue-500">
        <FaShoppingCart size={24} />
        <span className="text-xs">Cart</span>
      </Link>
      <Link
        href="/settings"
        className="flex flex-col items-center text-gray-600 hover:text-blue-500"
      >
        <FaCog size={24} />
        <span className="text-xs">Settings</span>
      </Link>
      {userRole === 'admin' && (
        <Link
          href="/admin"
          className="flex flex-col items-center text-gray-600 hover:text-blue-500"
        >
          <AiFillControl size={24} />
          <span className="text-xs">CMS</span>
        </Link>
      )}
      {children && (
        <Link
          href={`/${children.toLowerCase()}`}
          className="flex flex-col items-center text-gray-600 hover:text-blue-500"
        >
          {icon}
          <span className="text-xs">{children}</span>
        </Link>
      )}
    </nav>
  );
}
