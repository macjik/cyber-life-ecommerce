'use server';

import Image from 'next/image';
import AuthForm from '../Components/toggle-form';
import blackCat from '../../public/black-cat.webp';
import styles from './AuthPage.module.css'; 

export default async function AuthPage() {
  return (
    <main className="bg-gradient-to-br from-gray-900 to-gray-700 w-full flex min-h-screen">
      <div className="max-w-xl min-h-screen w-full bg-white shadow-lg p-8">
        <AuthForm />
      </div>

      <div className={`w-full relative hidden md:block ${styles.animatedBackground}`}>
        <div className={styles.particleContainer}>
          {[...Array(50)].map((_, i) => (
            <div key={i} className={styles.particle}></div>
          ))}
        </div>
        <Image
          className="object-contain w-auto h-auto absolute inset-0 mx-auto my-auto"
          src={blackCat}
          quality={100}
          width={400}
          height={400}
          alt="black cat"
          loading="lazy"
          placeholder="blur"
        />
      </div>
    </main>
  );
}
