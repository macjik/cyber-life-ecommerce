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
        w-full px-0 md:px-4 py-0 md:py-2 font-semibold text-base shadow-sm`}
      onClick={onClick}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
