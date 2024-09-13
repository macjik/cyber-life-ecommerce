'use client';

import { useState } from 'react';
import Button from './button';
import Form from './form';
import FormInput from './form-input';
import Select from './select';

export default function AddressModal() {
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

  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <>
      {!formSubmitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-full h-full md:w-1/2 p-8 rounded-lg shadow-lg overflow-auto">
            <Form onSubmit={handleSubmit} title="Your Address">
              <Select id="select" label="Select Your City" placeholder="Select your city">
                {cities}
              </Select>
              <FormInput id="street" label="Street Name" placeholder="Kal, 19" type="text" />
              <Button type="submit">Submit</Button>
            </Form>
          </div>
        </div>
      )}
    </>
  );
}
