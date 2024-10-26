import Logo from './logo';

export default function Loading() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="animate-pulse">
        <div className="h-32 w-32 sm:h-28 sm:w-28 md:h-36 md:w-36 lg:h-48 lg:w-48">
          <Logo />
          <p className="text-center">Loading...</p>
        </div>
      </div>
    </div>
  );
}
