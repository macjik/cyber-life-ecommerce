import db from '@/models/index';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import Loading from './Components/loading';
import { getTranslations } from 'next-intl/server';

const { item: Item, Category } = db;

export default async function Home() {
  let items;

  try {
    items = await Item.findAll({
      attributes: [
        'name',
        'description',
        'quantity',
        'image',
        'categoryId',
        'status',
        'discount',
        'createdAt',
        'price',
      ],
      include: [{ model: Category, as: 'itemCategory', attributes: ['name'] }],
    });
  } catch (err) {
    console.error(err);
  }

  const t = await getTranslations('homePage');
  return (
    <Suspense fallback={<Loading />}>
      <main className="w-full flex flex-col items-center pt-4 pb-20 space-y-12">
        <section className="w-full max-w-4xl h-1/3 flex flex-col justify-center items-center text-center space-y-4">
          <h1 className="text-5xl font-extrabold text-gray-900">Mimi: {t('title')}</h1>
          <p className="text-lg text-gray-700">{t('slogan')}</p>
        </section>

        <section className="w-full max-w-4xl flex flex-col justify-center items-center space-y-8">
          <h2 className="text-3xl font-semibold text-gray-800">{t('featured-deals')}</h2>
          <div className="flex justify-center flex-wrap gap-6">
            {items && items.length > 0 ? (
              items.map((item, index) => (
                <Link href={`/${item.itemCategory.name}/${item.name}`} key={index}>
                  <div className="border w-64 h-4xl p-4 rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out">
                    <div className="w-full h-64 overflow-hidden">
                      <Image
                        priority
                        quality={100}
                        width={256}
                        height={256}
                        className="object-cover w-full h-full"
                        src={item.image}
                        alt={`${item.name} image`}
                      />
                    </div>
                    <h3 className="font-bold text-2xl text-gray-900 mb-2">{item.name}</h3>
                    <p className="text-gray-700 text-base mb-2 truncate">{item.description}</p>
                    <p className="text-xl font-semibold text-gray-800 mb-4">
                      {item.price}UZS
                      {item.discount > 0 && (
                        <span className="text-green-600">(-{item.discount}%)</span>
                      )}
                    </p>
                    <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 w-full transition-colors duration-300 ease-in-out">
                      {t('join')}
                    </button>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-lg text-gray-700">{t('no-featured-deals')}</p>
            )}
          </div>
        </section>
        <section className="w-full max-w-4xl h-max-h flex flex-col justify-center items-center text-center space-y-4">
          <h2 className="text-3xl font-semibold text-gray-800">{t('instruction-header')}</h2>
          <ol className="no-markers text-left ms-24 list-decimal space-y-2 text-lg text-gray-700">
            <li>{t('instruction-1')}</li>
            <li>{t('instruction-2')}</li>
            <li>{t('instruction-3')}</li>
          </ol>
        </section>
      </main>
    </Suspense>
  );
}
