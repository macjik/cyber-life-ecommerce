import Image from 'next/image';
import AddContentButton from './Components/add-content-button';

export default async function Home() {
  return (
    <main className="w-full h-full p-6">
      <h1 className="font-bold text-3xl text-center">Manage Product Content</h1>
      <div className="flex w-100 p-2 mt-14">
        <AddContentButton />
      </div>
    </main>
  );
}
