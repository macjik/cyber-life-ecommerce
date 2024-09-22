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
        className={`${className} mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm from-input`}
        ref={innerRef}
        {...props}
      />
    </div>
  );
}
