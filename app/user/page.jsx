'use server';

import db from '@/models/index';
import UserProfile from '../Components/user-profile';
import SubNav from '../Components/sub-nav';
import { FaShoppingCart, FaCommentDots, FaHandshake, FaLink, FaLanguage } from 'react-icons/fa';
db.sequelize.sync();
const User = db.User;

export default async function UserPage({ searchParams }) {
  const userId = searchParams?.id;
  const user = await User.findOne({ where: { sub: userId } });

  const { phone, address, sub } = user;

  return (
    <main className="w-full h-full flex-row justify-center items-center">
      <UserProfile id={userId} phone={phone} address={address} />
      <SubNav faIcon={<FaShoppingCart size={24} />} link={`/cart?=${userId}`}>
        My orders
      </SubNav>
      <SubNav faIcon={<FaCommentDots size={24} />} link={`/feedback?=${userId}`}>
        My feedback
      </SubNav>
      <SubNav faIcon={<FaHandshake size={24} />} link={`/partner?=${userId}`}>
        Partnership
      </SubNav>
      <SubNav faIcon={<FaLink size={24} />} link={`/invite?=${userId}`}>
        Invite Link
      </SubNav>
      <SubNav faIcon={<FaLanguage size={24} />} link={`/invite?=${userId}`}>
        Language
      </SubNav>
    </main>
  );
}
