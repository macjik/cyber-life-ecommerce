'use server';

import db from '@/models/index';
import UserProfile from '../Components/user-profile';
import SubNav from '../Components/sub-nav';
import { FaShoppingCart, FaCommentDots, FaHandshake, FaLink, FaLanguage } from 'react-icons/fa';
import { getTranslations } from 'next-intl/server';

const User = db.User;

export default async function UserPage({ searchParams }) {
  const userId = searchParams?.id;
  const user = await User.findOne({ where: { sub: userId } });

  const { name, phone, address, sub, id, image, role } = user;

  const t = await getTranslations('profile');
  return (
    <main className="w-full min-h-screen flex-row justify-center items-center overflow-hidden">
      <UserProfile name={name} userId={id} phone={phone} address={address} image={image} />
      <SubNav faIcon={<FaShoppingCart size={24} />} link="/my-cart">
        {t('orders')}
      </SubNav>
      {/* <SubNav faIcon={<FaCommentDots size={24} />} link="/feedback">
        My feedback
        </SubNav> */}
      {role !== 'owner' ? (
        <SubNav faIcon={<FaHandshake size={24} />} link="/shop">
          {t('partnership')}
        </SubNav>
      ) : (
        <SubNav faIcon={<FaHandshake size={24} />} link="https://t.me/uuid40">
          {t('partnership')}
        </SubNav>
      )}
      {/* <SubNav faIcon={<FaLink size={24} />} link="/invite">
        Invite Link
      </SubNav> */}
      {/* <SubNav faIcon={<FaLanguage size={24} />} link="/lang">
        Language
      </SubNav> */}
    </main>
  );
}
