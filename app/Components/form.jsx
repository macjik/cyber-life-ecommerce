export default function Form({
  className = '',
  title,
  children,
  action = null,
  onSubmit = null,
  innerRef = null,
}) {
  return (
    <div className={`${className} flex items-center justify-center min-h-screen sm-bg-none bg-white`}>
      <div className="w-full max-w-md p-8 sm-bg-white sm-shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-4">{title.toUpperCase()}</h1>
        <form className="space-y-6" onSubmit={onSubmit} ref={innerRef} action={action}>
          {children}
        </form>
      </div>
    </div>
  );
}
