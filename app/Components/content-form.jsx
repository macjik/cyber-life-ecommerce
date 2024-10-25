'use client';

import { useFormState, useFormStatus } from 'react-dom';
import Form from './form';
import FormInput from './form-input';
import Button from './button';
import { addContent, deleteContent, editContent } from '../form-actions/cms';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner } from './spinner';

function SubmitButton({ children, className = '' }) {
  const { pending } = useFormStatus();
  return (
    <Button
      className={`${className} bg-blue-600 text-white rounded-lg`}
      type="submit"
      disabled={pending}
    >
      {pending ? <Spinner /> : children}
    </Button>
  );
}

export function ContentForm() {
  const [contentState, addContentAction] = useFormState(addContent, '');
  const router = useRouter();

  if (contentState?.status === 200) {
    router.push('/admin');
  }

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
          <FormInput label="Category" id="category" type="text" className="text-sm" />
          {/* <Select label="Category" id="category" placeholder="Select category" className="text-sm">
            {categories}
          </Select> */}
          <FormInput label="Image" id="image" type="file" className="text-sm" />
        </div>

        <FormInput label="Description" id="description" type="text" className="mt-4 text-sm" />

        <SubmitButton>Confirm</SubmitButton>

        {contentState?.error && <p className="text-red-700 text-sm mt-2">{contentState.error}</p>}
      </Form>
    </main>
  );
}

export function ContentDelete({ id }) {
  const [deleteItemState, deleteItemAction] = useFormState(deleteContent, '');
  return (
    <form action={deleteItemAction}>
      <input type="hidden" value={id} name="id" />
      <SubmitButton className="bg-red-600">Delete</SubmitButton>
    </form>
  );
}

export function ContentEdit({ id, name, price, quantity, discount, image, description, category }) {
  const [editItemState, editItemAction] = useFormState(editContent, '');
  const [isEdit, setIsEdit] = useState(false);
  const router = useRouter();

  function handleEditItem(event) {
    event.preventDefault();
    setIsEdit((prevState) => !prevState);
  }

  useEffect(() => {
    if (editItemState.status === 200) {
      setIsEdit(false);
    }
  }, [editItemState?.status, isEdit]);

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {isEdit ? (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
          <Form
            title="Product Details"
            className="w-full max-w-2xl rounded-lg"
            action={editItemAction}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="hidden" value={id} name="id" />
              <FormInput
                defaultValue={name}
                label="Title"
                id="title"
                type="text"
                className="text-sm"
              />
              <FormInput
                defaultValue={price}
                label="Price"
                id="price"
                type="number"
                className="text-sm"
              />
              <FormInput
                defaultValue={quantity}
                label="Quantity"
                id="quantity"
                type="number"
                className="text-sm"
              />
              <FormInput
                defaultValue={discount}
                label="Discount"
                id="discount"
                type="number"
                className="text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* <Select
                label="Category"
                id="category"
                placeholder="Select category"
                className="text-sm"
              >
                {categories}
              </Select> */}
              <FormInput defaultValue={category} label="Category" id="category" type="text" />

              <FormInput label="Image" id="image" type="file" className="text-sm" />
            </div>
            <FormInput
              defaultValue={description}
              label="Description"
              id="description"
              type="text"
              className="mt-4 text-sm"
            />

            {editItemState?.error && (
              <p className="text-red-700 text-sm mt-2">{editItemState.error}</p>
            )}
            <div className="w-full grid space-y-4">
              <SubmitButton>Confirm</SubmitButton>
              <Button className="bg-slate-700 text-white rounded-lg" onClick={handleEditItem}>
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      ) : (
        <Button onClick={handleEditItem} className="bg-slate-500 text-white px-4 py-1 rounded">
          Edit
        </Button>
      )}
    </>
  );
}
