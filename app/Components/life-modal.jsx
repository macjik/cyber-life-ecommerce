'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Form from './form';
import FormInput from './form-input';
import { useFormState, useFormStatus } from 'react-dom';
import { invoiceReq } from '../form-actions/invoice';

export default function LifeModal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [invoiceReqState, invoiceReqAction] = useFormState(invoiceReq, '');

  const handleCancel = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('operator');
    router.push(`?${params.toString()}`);
  };

  const service = searchParams.get('operator');
  const id = searchParams.get('id');

  console.log(invoiceReqState);
  return (
    <Form title={service} action={invoiceReqAction} className="">
      <div className="w-full inline-flex mt-4">
        <div className="bg-slate-300 text-gray-600 border-2 rounded-l border-gray-300 h-9 font-medium text-center p-1 text-sm">
          +998
        </div>
        <FormInput
          className="border-l-0 h-9 w-full flex-grow rounded-l-none font-medium text-gray-700"
          inputMode="tel"
          id="phone"
          placeholder="(xx) xxx-xx-xx"
          type="tel"
          maxLength="9"
        />
      </div>
      <FormInput
        className="w-full"
        inputMode="tel"
        id="amount"
        placeholder=""
        type="number"
        maxLength="6"
        minLength="3"
        label="Amount"
      />
      <input type="hidden" value={id} name="id" />
      <input type="hidden" value={service} name="service" />
      <div className="flex justify-end space-x-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none"
          type="submit"
        >
          Confirm
        </button>
        <button
          onClick={handleCancel}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md shadow-md hover:bg-gray-400 focus:outline-none"
        >
          Cancel
        </button>
      </div>
    </Form>
  );
}
