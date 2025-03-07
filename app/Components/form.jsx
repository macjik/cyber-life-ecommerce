import Logo from './logo';

export default function Form({
  className = '',
  title,
  children,
  action = null,
  onSubmit = null,
  innerRef = null,
}) {
  return (
    <div
      className={`${className} flex items-center justify-center min-h-screen sm-bg-black bg-white`}
    >
      <div className="w-full max-w-md p-8 sm-bg-white sm-shadow-md rounded-lg text-clip">
        <section className="flex items-center justify-center space-x-4">
          <h1 className="text-3xl font-bold text-center">{title.toUpperCase()}</h1>
          <div className="w-20 h-20">
            <Logo />
          </div>
        </section>
        <form onSubmit={onSubmit} ref={innerRef} action={action}>
          {children}
        </form>
      </div>
    </div>
  );
}
