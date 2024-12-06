'use client';

export default function FormInput({
  className,
  id,
  label,
  type,
  onChange = null,
  innerRef = null,
  ...props
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        onChange={onChange}
        required
        autoComplete="off"
        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm from-input ${className}`}
        ref={innerRef}
        {...props}
      />
    </div>
  );
}
