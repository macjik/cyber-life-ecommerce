'use server';

import db from '@/models/index';

const { User, Company } = db;

export default async function Companies({ searchParams }) {
  const { id } = searchParams;
  let isAdmin = await User.findOne({ where: { sub: id } });
  let companies = await Company.findAll({ attributes: ['id', 'name', 'description', 'logo'] });

  if (isAdmin.role !== 'admin') {
    return <>Unauthorized!</>;
  }

  return <>Admin</>;
}
