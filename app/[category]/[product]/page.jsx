import Button from '@/app/Components/button';
import Loading from '@/app/Components/loading';
import db from '@/models/index';
import Link from '@/node_modules/next/link';
import { Suspense } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { getTranslations } from 'next-intl/server';
import trackInviteChain from '@/app/helper/track-invites';
import calculateDiscount from '@/app/helper/calculate-discount';
import Image from '@/node_modules/next/image';
import ImageSwiper from '@/app/Components/swiper';

const { item: Item, Invite, Company } = db;
//get company and companies seperate page
export default async function ItemPage({ params, searchParams }) {
  const { product } = params;
  const { invite } = searchParams;
  const t = await getTranslations();

  const decodedProduct = decodeURIComponent(product);

  const [existingItem, existingInvite] = await Promise.all([
    Item.findOne({
      where: { name: decodedProduct },
      include: [
        {
          model: Company,
          as: 'company',
          attributes: ['id', 'name', 'description', 'slogan', 'logo'],
        },
      ],
    }),
    invite
      ? Invite.findOne({
          where: { inviteCode: invite },
          attributes: ['id'],
          include: [
            {
              model: Company,
              as: 'company',
              attributes: ['id', 'name', 'description', 'slogan', 'logo'],
            },
          ],
        })
      : null,
  ]);

  if (!existingItem) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-red-600 text-lg text-center">{t('error.product')}</p>
      </div>
    );
  }

  const { name, description, image, discount, quantity, category, price, status, company } =
    existingItem;

  let totalBuyers = 0;
  let discountApplied;
  if (existingInvite?.id) {
    const inviteChain = await trackInviteChain(existingInvite.id);
    totalBuyers = inviteChain.length;
    discountApplied = calculateDiscount(discount, price, totalBuyers);
  }

  console.log(image);

  return (
    <div className="min-h-screen p-4 md:p-6 w-full max-w-7xl mx-auto">
      <Suspense fallback={<Loading />}>
        <div className="w-full flex flex-col gap-6 md:gap-8 mt-10">
          <div className="w-full flex justify-center">
            <div className="relative w-full max-w-md aspect-square">
              <ImageSwiper images={image} />
            </div>
          </div>
          <div className="w-full flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{name}</h1>
            <p className="text-gray-600 mb-4">{category}</p>

            <div className="flex items-center gap-4 mb-4">
              <span
                className={`text-2xl font-bold ${discountApplied ? 'text-red-600' : 'text-gray-900'}`}
              >
                {discountApplied || price} UZS
              </span>
              {discountApplied && (
                <span className="text-lg text-gray-500 line-through">{price} UZS</span>
              )}
              {discount > 0 && !discountApplied && (
                <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded">
                  {t('discount')}
                </span>
              )}
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-4">{description}</p>
              <p className="text-sm text-gray-500">
                {t('Admin.quantity')}: {quantity - totalBuyers || quantity}
              </p>
              <p
                className={`text-sm font-medium ${status === 'available' ? 'text-green-600' : 'text-red-600'}`}
              >
                {t(status)}
              </p>
            </div>
            {company && (
              <div className="mt-auto mb-6 py-4 bg-white shadow-lg rounded-lg flex flex-col items-center w-full">
                <Link
                  href={`/?shop=${company.id}`}
                  className="flex flex-col items-center w-full px-4"
                >
                  <div className="w-16 h-16 md:w-24 md:h-24 rounded-full overflow-hidden shadow-md">
                    <Image
                      src={company.logo}
                      alt={`${company.name} logo`}
                      quality={100}
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <p className="mt-2 text-lg font-semibold text-gray-800 text-center">
                    {company.name}
                  </p>
                  <p className="text-sm text-gray-600 italic text-center">{company.slogan}</p>
                </Link>
              </div>
            )}
            <div className="w-full">
              {discount > 0 && (
                <p className="w-full text-center mb-4 bg-green-600 text-white font-semibold rounded p-2 md:p-3 text-sm md:text-base">
                  {t('invite-friends')}
                </p>
              )}
              <Link
                href={`/cart/${product}${invite ? `?invite=${invite}` : ''}`}
                className="block w-full"
              >
                <Button className="w-full bg-blue-600 text-white text-lg md:text-xl hover:bg-blue-500 transition duration-300 ease-in-out inline-flex items-center justify-center gap-2 md:gap-4 rounded-lg px-4 py-2 md:py-3">
                  {t('add-cart')}
                  <FaShoppingCart size={20} className="md:size-6" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  );
}
