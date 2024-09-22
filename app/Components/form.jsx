export default function Form({
  className = '',
  title,
  children,
  action = null,
  onSubmit = null,
  innerRef = null,
}) {
  return (
    <div className={`${className} flex items-center justify-center min-h-screen`}>
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">{title}</h1>
        <form className="space-y-6" onSubmit={onSubmit} ref={innerRef} action={action}>
          {children}
        </form>
      </div>
    </div>
  );
}
