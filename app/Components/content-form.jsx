'use client';

import { useFormState } from 'react-dom';
import AddContentButton from './add-content';
import Form from './form';
import FormInput from './form-input';
import Select from './select';
import Button from './button';
import { addContent } from '../form-actions/content-actions';

export default function ContentForm() {
  const [contentState, addContentAction] = useFormState(addContent, '');
  const categories = [
    { label: 'Electronics', value: 'electronics' },
    { label: 'Equipment', value: 'equipment' },
    { label: 'Clothes', value: 'clothes' },
  ];

  console.log(contentState);

  return (
    <AddContentButton className="max-w-32">
      {/* {contentState?.status !== 200} */}
      <Form title="Product details" action={addContentAction}>
        <FormInput label="Title" id="title" type="text" />
        <FormInput label="Price" id="price" type="number" />
        <FormInput label="Image" id="image" type="file" />
        <Select label="Category" id="category" placeholder="Select category">
          {categories}
        </Select>
        <FormInput label="Discount for each customer" id="discount" type="number" />
        <FormInput label="Quantity" id="quantity" type="number" />
        <FormInput label="Description" id="description" type="description" />
        <Button type="submit">Confirm</Button>
        {contentState?.error && <p className="text-red-700">{contentState.error}</p>}
      </Form>
    </AddContentButton>
  );
}
