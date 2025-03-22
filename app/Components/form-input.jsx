'use client';

export default function FormInput({
  className = null,
  id,
  label,
  type,
  onChange = null,
  innerRef = null,
  ...props
}) {
  return (
    <div className={`my-2 ${className || null}`}>
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
        className={`w-full px-3 border-[0.5px] border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 from-input ${className}`}
        ref={innerRef}
        {...props}
      />
    </div>
  );
}
