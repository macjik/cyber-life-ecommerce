import Button from '@/app/Components/button';
import Loading from '@/app/Components/loading';
import Product from '@/app/Components/product';
import db from '@/models/index';
import Link from '@/node_modules/next/link';
import { Suspense } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { getTranslations } from 'next-intl/server';
import trackInviteChain from '@/app/helper/track-invites';
import calculateDiscount from '@/app/helper/calculate-discount';
import Image from '@/node_modules/next/image';

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
      <div className="min-h-screen">
        <p>{t('error.product')}</p>
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

  return (
    <div className="min-h-screen">
      <Suspense fallback={<Loading />}>
        <Product
          itemName={name}
          itemDescription={description}
          itemCategory={category}
          itemPrice={discountApplied || price}
          originalPrice={discountApplied && price}
          itemQuantity={quantity - totalBuyers || quantity}
          itemSrc={image}
          itemStatus={status}
          itemDiscount={discount}
        >
          <Link href={`/?shop=${company.id}`}>
            <p>Shop: {company.name}</p>
            <div className="h-10 w-64">
              <Image
                src={company.logo}
                alt={`${company.name} logo`}
                quality={100}
                width={100}
                height={100}
                className="object-contain w-full h-full"
              />
            </div>
          </Link>
          <p className="w-full text-center mb-2 bg-green-600 text-white font-semibold rounded p-3">
            {t('invite-friends')}
          </p>
          <Link href={`/cart/${product}${invite ? `?invite=${invite}` : ''}`}>
            <Button className="bg-blue-600 text-white text-xl hover:bg-blue-500 transition duration-300 ease-in-out inline-flex items-center justify-center gap-4 rounded-lg">
              {t('add-cart')}
              <FaShoppingCart size={24} className="text-right" />
            </Button>
          </Link>
        </Product>
      </Suspense>
    </div>
  );
}
