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
//needs a different action
export default function VisaModal() {
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
  return (
    <Form title={service} action={invoiceReqAction} className="">
      <FormInput
        className="w-full"
        inputMode="tel"
        id="target"
        placeholder={'something'}
        type="tel"
        // maxLength="9"
      />
      <FormInput className="w-full" id="image" type="file" label="passport" />
      <FormInput className="w-full" id="image" type="file" label="visa" />
      <FormInput className="w-full" id="image" type="file" label="other document" />
      {/* <FormInput
        className="w-full"
        inputMode="tel"
        id="amount"
        placeholder="1000-999 000 UZS"
        type="number"
        maxLength="6"
        minLength="3"
        label="Amount"
      /> */}
      <input type="hidden" value={300_000} name="amout" />
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
  );
}
