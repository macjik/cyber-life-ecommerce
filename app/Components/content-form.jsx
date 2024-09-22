'use client';

import { useFormState } from 'react-dom';
import Form from './form';
import FormInput from './form-input';
import Select from './select';
import Button from './button';
import { addContent, deleteContent } from '../form-actions/cms';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function ContentForm() {
  const [contentState, addContentAction] = useFormState(addContent, '');
  const router = useRouter();
  const categories = [
    { label: 'Electronics', value: 'electronics' },
    { label: 'Equipment', value: 'equipment' },
    { label: 'Clothes', value: 'clothes' },
  ];

  useEffect(() => {
    if (contentState?.status === 200) {
      router.push('/admin');
    }
  }, [contentState?.status]);

  console.log(contentState);

  return (
    <main className="w-full h-full flex items-center justify-center p-4">
      <Form
        title="Product Details"
        className="w-full max-w-2xl rounded-lg"
        action={addContentAction}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput label="Title" id="title" type="text" className="text-sm" />
          <FormInput label="Price" id="price" type="number" className="text-sm" />
          <FormInput label="Quantity" id="quantity" type="number" className="text-sm" />
          <FormInput label="Discount" id="discount" type="number" className="text-sm" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Select label="Category" id="category" placeholder="Select category" className="text-sm">
            {categories}
          </Select>
          <FormInput label="Image" id="image" type="file" className="text-sm mt-[0.65rem]" />
        </div>

        <FormInput label="Description" id="description" type="text" className="mt-4 text-sm" />

        <Button
          type="submit"
          className="w-full mt-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
        >
          Confirm
        </Button>

        {contentState?.error && <p className="text-red-700 text-sm mt-2">{contentState.error}</p>}
      </Form>
    </main>
  );
}

export function ContentDelete({ id }) {
  const [deleteItemState, deleteItemAction] = useFormState(deleteContent, '');
  console.log(deleteItemState);
  return (
    <form action={deleteItemAction}>
      <input type="hidden" value={id} name="id" />
      <Button type="submit" className="bg-red-500 text-white px-4 py-1 rounded">
        Delete
      </Button>
    </form>
  );
}

export function ContentEdit({ id }) {}
