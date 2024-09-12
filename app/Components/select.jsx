export default function Select({
  label,
  options,
  value,
  onChange,
  placeholder,
  customClasses = '',
}) {
  return (
    <div className={`relative w-full ${customClasses}`}>
      {label && <label className="block mb-2 text-sm font-medium text-gray-700">{label}</label>}
      <select
        className="w-full p-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        value={value}
        onChange={onChange}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option, idx) => (
          <option key={idx} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
