export function Spinner({ className }) {
  return (
    <div className="w-full flex justify-center">
      <div
        className={`${className} border-t-transparent border-solid border-white border-4 rounded-full w-5 h-5 animate-spin`}
      ></div>
    </div>
  );
}
