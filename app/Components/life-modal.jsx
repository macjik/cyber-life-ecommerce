'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Form from './form';
import FormInput from './form-input';
import { useFormState, useFormStatus } from 'react-dom';
import { invoiceReq } from '../form-actions/invoice';
import { Spinner } from './spinner';
import Button from './button';

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

export default function LifeModal({ placeholder = '' }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [invoiceReqState, invoiceReqAction] = useFormState(invoiceReq, '');

  const params = new URLSearchParams(searchParams.toString());

  if (invoiceReqState.status === 200) {
    params.delete('service');
    router.push(`?${params.toString()}`);
  }

  const handleCancel = () => {
    params.delete('service');
    router.push(`?${params.toString()}`);
  };

  const service = searchParams.get('service');
  const id = searchParams.get('id');

  console.log(invoiceReqState);
  console.log(placeholder);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-6 rounded-lg w-full max-w-lg relative">
        <Form title={service} action={invoiceReqAction} className="w-full gap-3">
          <FormInput
            className="w-full"
            inputMode="tel"
            id="target"
            placeholder={placeholder}
            type="tel"
          />
          <FormInput
            className="w-full"
            inputMode="tel"
            id="amount"
            placeholder="1000-999 000 UZS"
            type="number"
            maxLength="6"
            minLength="3"
            label="Amount"
          />
          <input type="hidden" value={id} name="id" />
          <input type="hidden" value={service} name="service" />
          <div className="flex justify-end space-x-4">
            <SubmitButton>Confirm</SubmitButton>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md shadow-md hover:bg-gray-400 focus:outline-none"
            >
              Cancel
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
