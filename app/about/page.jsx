'use server';

import {getTranslations} from 'next-intl/server';

export default async function AboutPage() {
    const t = await getTranslations('homePage');
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 text-gray-800 p-6">
      <div className="w-full max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 animate-fade-in">
          Mimi {t('title')}
        </h1>

        <p className="text-lg leading-relaxed text-center md:text-left animate-fade-in-delay-1">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat quisquam sapiente voluptatem eveniet veniam reiciendis cum, iusto ipsa vitae, officiis repellendus quod, hic provident et vero eligendi voluptatum dolores! Voluptatem.
        </p>

        <p className="text-lg leading-relaxed text-center md:text-left animate-fade-in-delay-2">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae impedit odit similique rem obcaecati. Laboriosam sed mollitia neque eveniet praesentium, quos reiciendis dolorum ipsum, explicabo recusandae illum ullam ipsa eius.
        </p>

        <p className="text-lg leading-relaxed text-center md:text-left animate-fade-in-delay-3">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident qui in quidem obcaecati expedita id impedit, similique dolores tenetur libero neque doloribus aspernatur recusandae eius eveniet corporis quos. Eveniet, ullam.
        </p>
      </div>
    </div>
  );
}
