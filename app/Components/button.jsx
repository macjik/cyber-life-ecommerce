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
        w-full px-2 md:px-4 font-semibold text-base shadow-sm transition-all duration-200`}
      onClick={onClick}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
