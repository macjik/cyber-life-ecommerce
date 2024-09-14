// AddContentButton.js
'use client';

import { useState } from 'react';
import ContentModal from './content-modal';

export default function AddContentButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function toggleModal() {
    setIsModalOpen((prev) => !prev);
  }

  return (
    <>
      <button
        onClick={toggleModal}
        className="w-20 h-28 bg-transparent border-2 border-dashed border-gray-500 text-gray-600 font-semibold text-lg rounded-lg hover:bg-gray-100 hover:text-gray-800 transition-colors duration-300 flex items-center justify-center"
      >
        Add +
      </button>
      {isModalOpen && <ContentModal />}
    </>
  );
}
