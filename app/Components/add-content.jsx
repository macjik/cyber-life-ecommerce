'use client';

import { useState } from 'react';
import Button from './button';
import Modal from './modal';

export default function AddContentButton({ className, children }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function toggleModal() {
    setIsModalOpen((prev) => !prev);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  return (
    <>
      <Button onClick={toggleModal} className={className}>
        Add +
      </Button>
      {isModalOpen && <Modal onClose={closeModal}>{children}</Modal>}
    </>
  );
}
