'use client';

import Form from './form';
import FormInput from './form-input';
import Select from './select';

export default function AddressModal() {
  return (
    <Form title="Address">
      <Select options={['Tashkent']}></Select>
      <FormInput id="street" label="Street" type="text" />
    </Form>
  );
}
