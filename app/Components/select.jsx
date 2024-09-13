export default function Select({
  label,
  children,
  value,
  onChange = null,
  placeholder,
  className = '',
  id,
}) {
  return (
    <div>
      <label htmlFor={id} className=" max-w-max block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <select
        required
        id={id}
        name={id}
        className={`${className} w-full p-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black`}
        value={value}
        onChange={onChange}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {children.map((option, idx) => (
          <option key={idx} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
