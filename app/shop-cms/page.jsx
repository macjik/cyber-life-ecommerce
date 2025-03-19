'use server';

import Dashboard from '@/app/Components/content-dashboard';
import db, { Op } from '@/models/index';

const { User, item: Item, Category, Item_Attribute } = db;

export default async function ShopCMS({ searchParams }) {
  const { id } = searchParams;

  let user = await User.findOne({
    where: {
      sub: id,
      role: {
        [Op.or]: ['owner', 'admin'],
      },
    },
  });

  if (!user) {
    return <>Unauthorized!</>;
  }
  const company = user.companyId;

  if (company) {
    const items = await Item.findAll({
      where: { companyId: company },
      attributes: [
        'name',
        'description',
        'quantity',
        'image',
        'categoryId',
        'sku',
        'status',
        'discount',
        'createdAt',
        'price',
        'ikpu',
        'packageCode',
        'companyId',
      ],
      include: [
        { model: Category, as: 'itemCategory', attributes: ['name'] },
        { model: Item_Attribute, as: 'itemAttributes', attributes: ['name', 'value', 'type'] },
      ],
    });

    const formattedItems = items.map((item) => item.dataValues);

    return (
      <main className="w-full min-h-screen mt-16">
        <Dashboard company={company}>{formattedItems}</Dashboard>
      </main>
    );
  }
}
