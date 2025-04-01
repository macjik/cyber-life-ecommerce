'use server';

import Link from 'next/link';
import Button from './button';
import { ContentDelete, ContentEdit } from './content-form';
import CopyButtonLink from './copy-button-link';
import { getTranslations } from 'next-intl/server';
// import client from '../services/redis';

export default async function Dashboard({ children, company = null }) {
  const t = await getTranslations('Admin');
  // const currentExRate = await client.get('exchange-rate');

  return (
    <div className="p-4 w-full bg-white shadow-md">
      <div className="flex justify-center w-full mb-3 space-x-4">
        {/* <Link href={!company && '?exchange_rate=1'}>
          <Button className="text-white bg-blue-600 rounded">¥ = {currentExRate || 0}</Button>
        </Link> */}
        <Link href={company ? `/admin/cms?company=${company}` : '/admin/cms'}>
          <Button className="bg-indigo-600 text-white rounded-lg p-1">{t('add')} +</Button>
        </Link>
        {!company && (
          <Link href="/companies">
            <Button className="bg-orange-600 text-white rounded-lg">Partner</Button>
          </Link>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="text-center p-2">{t('title')}</th>
              <th className="text-center p-2">{t('category')}</th>
              <th className="text-center p-2">{t('price')}</th>
              <th className="text-center p-2">{t('discount')}</th>
              <th className="text-center p-2">{t('description')}</th>
              <th className="text-center p-2">{t('quantity')}</th>
              <th className="text-center p-2">{t('status')}</th>
              <th className="text-center p-2">{t('link')}</th>
              <th className="text-center p-2">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {children.map((item) => (
              <tr key={item.sku} className="hover:bg-gray-100">
                <td className="p-2 text-center text-sm">{item.name}</td>
                <td className="p-2 text-center text-sm">{item.itemCategory.name}</td>
                <td className="p-2 text-center text-sm w-auto whitespace-nowrap">
                  {`${item.price}`}UZS
                </td>
                <td className="p-2 text-center text-sm">
                  {item.discount ? `${item.discount}%` : 'N/A'}
                </td>
                <td className="p-2 text-center text-sm truncate max-w-xs">{item.description}</td>
                <td className="p-2 text-center text-sm">{item.quantity.toString()}</td>
                <td className="p-2 text-center text-sm">{item.status}</td>
                <td className="p-2 text-center text-sm whitespace-nowrap">
                  <CopyButtonLink
                    item={`/${item.itemCategory.name.replace(/\s+/g, '-')}/${item.name.replace(/\s+/g, '-')}`}
                  />
                </td>
                <td className="p-2 text-center text-sm whitespace-nowrap">
                  <div className="inline-flex space-x-2">
                    <ContentDelete id={item.sku} />
                    <ContentEdit
                      id={item.sku}
                      category={item.itemCategory.name}
                      price={item.price}
                      quantity={item.quantity}
                      name={item.name}
                      discount={item.discount}
                      image={item.image}
                      description={item.description}
                      attributeName={item.itemAttributes.map((attr) => attr.name)}
                      attributes={item.itemAttributes.map((attr) => attr.value)}
                      ikpu={item.ikpu}
                      packageCode={item.packageCode}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
