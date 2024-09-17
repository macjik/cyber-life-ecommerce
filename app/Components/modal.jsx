export default function Modal({ children, className = '', onClose }) {
  const handleClickOutside = (e) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  return (
    <div
      className={`${className} fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 w-full h-full`}
      onClick={handleClickOutside}
    >
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg overflow-auto relative p-4">
        {children}
      </div>
    </div>
  );
}
