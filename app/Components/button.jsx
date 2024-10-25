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
        w-full px-4 py-2 font-semibold shadow-sm`}
      onClick={onClick}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
