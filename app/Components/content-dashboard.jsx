'use server';

import Link from 'next/link';
import Button from './button';
import { ContentDelete, ContentEdit } from './content-form';
import CopyButtonLink from './copy-button-link';

export default async function Dashboard({ children }) {
  return (
    <div className="p-4 w-full bg-white shadow-md">
      <div className="flex justify-center w-full mb-3">
        <Link href="/admin/cms">
          <Button className="bg-indigo-600 text-white rounded-lg">Add +</Button>
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="text-center p-2">Title</th>
              <th className="text-center p-2">Category</th>
              <th className="text-center p-2">Price</th>
              <th className="text-center p-2">Discount</th>
              <th className="text-center p-2">Description</th>
              <th className="text-center p-2">Quantity</th>
              <th className="text-center p-2">Status</th>
              <th className="text-center p-2">Link</th>
              <th className="text-center p-2">Actions</th>
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
