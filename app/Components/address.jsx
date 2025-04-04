'use client';

import Button from './button';
import Form from './form';
import FormInput from './form-input';
import Select from './select';
import { useFormState } from 'react-dom';
import { setAddress } from '../form-actions/address';

export default function AskAdress() {
  const cities = [
    { label: 'Toshkent', value: 'toshkent' },
    { label: 'Toshkent Viloyati', value: 'tashkent-viloyati' },
    { label: 'Sirdaryo', value: 'sirdaryo' },
    { label: 'Andijan', value: 'andijan' },
    { label: 'Ferghana', value: 'ferghana' },
    { label: 'Namangan', value: 'namangan' },
    { label: 'Qashqadaryo', value: 'qashqadaryo' },
    { label: 'Surxandaryo', value: 'surxandaryo' },
    { label: 'Jizzax', value: 'jizzax' },
    { label: 'Navoyi', value: 'navoyi' },
    { label: 'Xorazm', value: 'xorazm' },
    { label: 'Buxoro', value: 'buxoro' },
    { label: 'Qora Qalpoqston', value: 'qora-qalpoqston' },
  ];

  const [addressState, addressAction] = useFormState(setAddress, '');

  return (
    <>
      {addressState?.status !== 200 && (
        <Form action={addressAction} title="Your Address">
          <Select id="city" label="Select Your City" placeholder="Select your city">
            {cities}
          </Select>
          <FormInput id="street" label="Street Name" placeholder="Kal, 19" type="text" />
          {addressState?.error && <p className="text-red-700">{addressState.error}</p>}
          <Button type="submit">Submit</Button>
        </Form>
      )}
    </>
  );
}
