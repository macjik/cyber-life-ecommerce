'use client';

import { useFormState, useFormStatus } from 'react-dom';
import Form from './form';
import FormInput from './form-input';
import Button from './button';
import {
  addContent,
  deleteCompany,
  deleteContent,
  editCompany,
  editContent,
} from '../form-actions/cms';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner } from './spinner';
import Link from '@/node_modules/next/link';

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

export function ContentForm({ company = null }) {
  const [contentState, addContentAction] = useFormState(addContent, '');
  const router = useRouter();
  const [attributes, setAttributes] = useState([{ name: '', value: '' }]);

  if (contentState?.status === 200) {
    if (company !== null) {
      window.location.href = '/shop-cms';
    } else {
      window.location.href = '/admin';
    }
  }

  function handleAddAttribute(event) {
    event.preventDefault();
    setAttributes((prevAttributes) => [...prevAttributes, { name: '', value: '' }]);
  }

  function handleAttributeChange(index, field, value) {
    setAttributes((prevAttributes) =>
      prevAttributes.map((attr, i) => (i === index ? { ...attr, [field]: value } : attr)),
    );
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
          <FormInput label="Image" id="image" type="file" className="text-sm" />
          <FormInput
            label="IKPU"
            id="category-ikpu"
            type="text"
            className="text-sm"
            maxLength="17"
          />
          <FormInput label="Package code" id="package-code" type="text" className={'text-sm'} />
          <Link
            href="https://tasnif.soliq.uz/"
            fallback="black"
            target="_blank"
            className="underline"
          >
            You can check the IKPU and package code of the product in here
          </Link>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-4">Attributes</h3>
          <FormInput
            label={`Attribute Name`}
            type="text"
            id="attribute-name"
            onChange={(e) => handleAttributeChange('name', e.target.value)}
            className="text-sm"
            required={false}
          />
          {attributes.map((attribute, index) => (
            <div key={index} className="grid grid-cols-2 gap-4 mt-2">
              <FormInput
                label={`Attribute Value ${index + 1}`}
                type="text"
                id="attribute-value"
                value={attribute.value}
                onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                className="text-sm"
                required={false}
              />
            </div>
          ))}
          {company && <input type="hidden" value={company} name="company" />}
          <Button className="bg-gray-300 p-3 mt-4 rounded-md" onClick={handleAddAttribute}>
            Add Attribute +
          </Button>
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

export function ContentEdit({
  id,
  name,
  price,
  quantity,
  discount,
  image,
  description,
  category,
  attributeName,
  attributes,
  ikpu,
  packageCode,
}) {
  const [editItemState, editItemAction] = useFormState(editContent, '');
  const [isEdit, setIsEdit] = useState(false);
  const router = useRouter();
  const [attributeList, setAttributeList] = useState(
    attributes
      ? attributes.map((value) => ({ name: attributeName, value }))
      : [{ name: '', value: '' }],
  );

  function handleEditItem(event) {
    event.preventDefault();
    setIsEdit((prevState) => !prevState);
  }

  useEffect(() => {
    if (editItemState.status === 200) {
      setIsEdit(false);
    }
  }, [editItemState?.status]);

  function handleAddAttribute(event) {
    event.preventDefault();
    setAttributeList((prevAttributes) => [...prevAttributes, { name: '', value: '' }]);
  }

  function handleAttributeChange(index, field, value) {
    setAttributeList((prevAttributes) =>
      prevAttributes.map((attr, i) => (i === index ? { ...attr, [field]: value } : attr)),
    );
  }

  return (
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
              <FormInput defaultValue={category} label="Category" id="category" type="text" />
              <FormInput
                defaultValue={attributeName[0]}
                label="Product Attribute Name"
                id="attribute-name"
                type="text"
                required={false}
                onChange={(e) => handleAttributeChange(0, 'name', e.target.value)}
              />
              {attributeList.map((attr, index) => (
                <div key={index} className="flex mt-2 w-full">
                  <FormInput
                    label={`Attribute Value ${index + 1}`}
                    type="text"
                    id={`attribute-value`}
                    value={attr.value}
                    onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                    className="text-sm"
                    required={false}
                  />
                </div>
              ))}
              <Button className="bg-gray-300 p-3 mt-4 rounded-md" onClick={handleAddAttribute}>
                Add Attribute +
              </Button>
            </div>

            <FormInput label="Image" id="image" type="file" className="text-sm" />
            <FormInput
              label="IKPU"
              id="category-ikpu"
              type="text"
              className="text-sm"
              maxLength="17"
              defaultValue={ikpu}
            />
            <FormInput
              label="Package code"
              id="package-code"
              type="text"
              className={'text-sm'}
              defaultValue={packageCode}
            />
            <Link
              href="https://tasnif.soliq.uz/"
              fallback="black"
              target="_blank"
              className="underline"
            >
              You can check the IKPU and package code of the product in here
            </Link>
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

export function DeleteCompany({ id }) {
  const [deleteCompanyState, deleteCompanyAction] = useFormState(deleteCompany, '');
  console.log(deleteCompanyState);

  return (
    <form action={deleteCompanyAction}>
      <input type="hidden" value={id} name="id" />
      <SubmitButton className="bg-red-600 rounded-none">Delete</SubmitButton>
    </form>
  );
}

export function EditCompany({ id, name, description, slogan, logo }) {
  const [isEdit, setIsEdit] = useState(false);
  const [companyState, editCompanyAction] = useFormState(editCompany, '');

  function handleEdit(event) {
    event.preventDefault();
    setIsEdit((prevState) => !prevState);
  }

  useEffect(() => {
    if (companyState.status === 200) {
      setIsEdit(false);
    }
  }, [companyState?.status]);

  return (
    <>
      {isEdit ? (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-auto">
          <Form
            title="Edit Company"
            className="w-full max-w-2xl rounded-lg"
            action={editCompanyAction}
          >
            <FormInput defaultValue={name} id="name" label="Title" className="text-sm" />
            <FormInput
              defaultValue={description}
              id="description"
              label="Description"
              className="text-sm"
            />
            <FormInput defaultValue={slogan} id="slogan" label="slogan" className="text-sm" />
            <FormInput id="logo" label="Logo" type="file" />
            <input type="hidden" defaultValue={id} name="id" />
            {companyState?.error && (
              <p className="text-red-700 text-sm mt-2">{companyState.error}</p>
            )}
            <div className="w-full grid space-y-4">
              <SubmitButton>Confirm</SubmitButton>
              <Button className="bg-slate-700 text-white rounded-lg" onClick={handleEdit}>
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      ) : (
        <Button className="bg-slate-500 text-white px-4 py-1 rounded-none" onClick={handleEdit}>
          Edit
        </Button>
      )}
    </>
  );
}
