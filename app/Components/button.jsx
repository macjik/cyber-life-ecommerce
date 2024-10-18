'use client';

export default function Button({
  children,
  className = '',
  onClick = null,
  type = 'button',
  disabled = null,
  ...props
}) {
  return (
    <button
      disabled={disabled}
      className={`${className} 
        w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2  focus:ring-offset-2`}
      onClick={onClick}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
