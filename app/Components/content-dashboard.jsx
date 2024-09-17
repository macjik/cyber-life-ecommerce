'use server';

import AddContent from './add-content';
import Button from './button';
import Form from './form';
import FormInput from './form-input';
import Select from './select';

export default async function Dashboard({ children }) {
  const categories = [
    { label: 'Electronics', value: 'electronics' },
    { label: 'Equipment', value: 'equipment' },
    { label: 'Clothes', value: 'clothes' },
  ];
  return (
    <div className="mt-20 p-4 w-full bg-white shadow-md">
      <div className="flex justify-center w-full mb-3">
        <AddContent className="max-w-32">
          <Form title="Product details">
            <FormInput label="Title" id="title" type="text" />
            <FormInput label="Price" id="price" type="number" />
            <FormInput label="Image" id="image" type="file" />
            <Select label="Category" value="category" id="category" placeholder="Select category">
              {categories}
            </Select>
            <FormInput label="Discount for each customer" id="discount" type="number" />
          <Button type="submit">Confirm</Button>
          </Form>
        </AddContent>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="text-center p-2">Title</th>
              <th className="text-center p-2">Price</th>
              <th className="text-center p-2">Discount</th>
              <th className="text-center p-2">Description</th>
              <th className="text-center p-2">Quantity</th>
              <th className="text-center p-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {children.map((item) => (
              <tr key={item.id} className="hover:bg-gray-100">
                <td className="p-2 text-center text-sm">{item.title}</td>
                <td className="p-2 text-center text-sm w-auto whitespace-nowrap">${item.price}</td>
                <td className="p-2 text-center text-sm">
                  {item.discount ? `${item.discount}%` : 'N/A'}
                </td>
                <td className="p-2 text-center text-sm truncate max-w-xs">{item.description}</td>
                <td className="p-2 text-center text-sm">{item.quantity}</td>
                <td className="p-2 text-center text-sm whitespace-nowrap">
                  <div className="inline-flex space-x-2">
                    <Button className="bg-red-500 text-white px-4 py-1 rounded">Delete</Button>
                    <Button className="bg-slate-500 text-white px-4 py-1 rounded">Edit</Button>
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
