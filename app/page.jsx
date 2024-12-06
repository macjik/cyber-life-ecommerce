import db from '@/models/index';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import Loading from './Components/loading';
import { getTranslations } from 'next-intl/server';

const { item: Item, Category, Company } = db;

export default async function Home({ searchParams }) {
  const { shop } = searchParams;
  let items;
  let company;

  if (shop) {
    try {
      items = await Item.findAll({
        where: { companyId: shop },
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
          'companyId',
        ],
        include: [
          { model: Category, as: 'itemCategory', attributes: ['name'] },
          {
            model: Company,
            as: 'company',
            attributes: ['id', 'name', 'slogan', 'description', 'logo'],
          },
        ],
      });
      company = await Company.findOne({ where: { id: shop } });
    } catch (err) {
      console.error(err);
    }

    items = items.map((item) => ({
      ...item.toJSON(),
      name: item.name.replace(/-/g, ' '),
    }));

    const t = await getTranslations('homePage');
    return (
      <Suspense fallback={<Loading />}>
        <main className="w-full flex flex-col items-center pt-4 pb-20 space-y-6 min-h-screen">
          <section className="w-full max-w-4xl h-1/3 flex flex-col justify-center items-center text-center space-y-4">
            <h1 className="text-5xl font-extrabold text-gray-900">
              {company.name || <>Mimi: {t('title')}</>}
            </h1>
            <p className="text-lg text-gray-700">{company.slogan || <>{t('slogan')}</>}</p>
            {/* <div className="mb-4 md:mb-0 w-full h-full flex justify-center items-center mt-10 md:mt-10"> */}
            {/* <img
                src="/transparent-mimi-logo.png"
                alt="mimi logo"
                quality={70}
                width={70}
                height={100}
                className="object-contain"
              /> */}
            {/* </div> */}
          </section>
          <section className="w-full max-w-4xl flex flex-col justify-center items-center space-y-8">
            <div className="w-full flex items-center space-x-4 justify-center">
              {/* <h1 className="text-3xl font-bold text-gray-800">{company.name}</h1> */}
              <Image
                priority
                width={100}
                height={100}
                className="object-cover rounded-full w-28 h-28"
                src={company.logo}
                alt={`${company.name} image`}
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 text-center">{company.description}</h3>
            {/* <p className="text-xl font-medium text-gray-800">{company.slogan}</p> */}
            <h2 className="text-3xl font-semibold text-gray-800">{t('featured-deals')}</h2>
            <div className="flex justify-center flex-wrap gap-6">
              {items && items.length > 0 ? (
                items.map((item, index) => (
                  <Link
                    href={`/${item.itemCategory.name.replace(/\s+/g, '-')}/${item.name.replace(/\s+/g, '-')}`}
                    key={index}
                  >
                    <div className="border w-64 flex flex-col h-full p-4 rounded-lg shadow-lg bg-white border-blue-200 hover:shadow-xl transition-shadow duration-300 ease-in-out">
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
                      <h3 className="font-bold text-xl text-gray-900 my-2 truncate">{item.name}</h3>
                      <p className="text-gray-700 text-base mb-2 truncate">{item.description}</p>
                      <p className="text-xl font-semibold text-gray-800 mb-4">
                        {Math.floor(item.price).toLocaleString()} UZS
                        {item.discount > 0 && (
                          <span className="text-green-600"> (-{Math.floor(item.discount)}%)</span>
                        )}
                      </p>
                      <div className="mt-auto">
                        <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 w-full transition-colors duration-300 ease-in-out">
                          {t('join')}
                        </button>
                      </div>
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
        'companyId',
      ],
      include: [{ model: Category, as: 'itemCategory', attributes: ['name'] }],
    });
  } catch (err) {
    console.error(err);
  }

  items = items.map((item) => ({
    ...item.toJSON(),
    name: item.name.replace(/-/g, ' '),
  }));

  const t = await getTranslations('homePage');
  return (
    <Suspense fallback={<Loading />}>
      <main className="w-full flex flex-col items-center pt-4 pb-20 space-y-6 min-h-screen">
        <section className="w-full max-w-4xl h-1/3 flex flex-col justify-center items-center text-center space-y-4">
          <h1 className="text-5xl font-extrabold text-gray-900">Mimi: {t('title')}</h1>
          <p className="text-lg text-gray-700">{t('slogan')}</p>
          {/* <div className="mb-4 md:mb-0 w-full h-full flex justify-center items-center mt-10 md:mt-10"> */}
          {/* <img
              src="/transparent-mimi-logo.png"
              alt="mimi logo"
              quality={70}
              width={70}
              height={100}
              className="object-contain"
            /> */}
          {/* </div> */}
        </section>
        <section className="w-full max-w-4xl flex flex-col justify-center items-center space-y-8">
          <h2 className="text-3xl font-semibold text-gray-800">{t('featured-deals')}</h2>
          <div className="flex justify-center flex-wrap gap-6">
            {items && items.length > 0 ? (
              items.map((item, index) => (
                <Link
                  href={`/${item.itemCategory.name.replace(/\s+/g, '-')}/${item.name.replace(/\s+/g, '-')}`}
                  key={index}
                >
                  <div className="border w-64 flex flex-col p-4 rounded-lg shadow-lg bg-white border-blue-200 hover:shadow-xl transition-shadow duration-300 ease-in-out h-full">
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
                    <h3 className="font-bold text-xl text-gray-900 my-2 truncate">{item.name}</h3>
                    <p className="text-gray-700 text-base mb-2 truncate">{item.description}</p>
                    <p className="text-xl font-semibold text-gray-800 mb-4">
                      {Math.floor(item.price).toLocaleString()} UZS
                      {item.discount > 0 && (
                        <span className="text-green-600"> (-{Math.floor(item.discount)}%)</span>
                      )}
                    </p>
                    <div className="mt-auto">
                      <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 w-full transition-colors duration-300 ease-in-out">
                        {t('join')}
                      </button>
                    </div>
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
