export default function Modal({ children, className = '' }) {
  return (
    <div className={`${className} fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 w-max-w h-max-h`}>
      <div className="bg-white w-full h-full md:w-1/2 p-8 rounded-lg shadow-lg overflow-auto">
        {children}
      </div>
    </div>
  );
}
