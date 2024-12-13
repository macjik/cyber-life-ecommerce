'use client';

import { useFormState, useFormStatus } from 'react-dom';
import FormInput from './form-input';
import { Spinner } from './spinner';
import Button from './button';
import { useState } from 'react';
import { useSearchParams, useRouter } from '@/node_modules/next/navigation';
import Form from './form';
import Image from '@/node_modules/next/image';

function SubmitButton({ children, className = '' }) {
  const { pending } = useFormStatus();
  return (
    <Button
      className={`${className} bg-blue-600 text-white rounded-lg px-4 py-2`}
      type="submit"
      disabled={pending}
    >
      {pending ? <Spinner /> : children}
    </Button>
  );
}

export default function SetCurrency() {
  const [uzsValue, setUzsValue] = useState('');
  const [cnyValue, setCnyValue] = useState('');
  const [exchangeRate, setExchangeRate] = useState(1800);
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const router = useRouter();

  // Format numbers with spaces
  const formatNumber = (value) => {
    if (!value) return '0';
    return parseFloat(value).toLocaleString('en-US').replace(/,/g, ' ');
  };

  const handleUzsChange = (event) => {
    const uzs = parseFloat(event.target.value);
    setUzsValue(event.target.value);

    if (!isNaN(uzs) && uzs > 0) {
      const calculatedCny = (uzs / exchangeRate).toFixed(2);
      setCnyValue(calculatedCny);
    } else {
      setCnyValue('');
    }
  };

  const handleExchangeRateChange = (event) => {
    const rate = parseFloat(event.target.value);
    setExchangeRate(event.target.value);

    if (!isNaN(rate) && rate > 0 && uzsValue) {
      const calculatedCny = (parseFloat(uzsValue) / rate).toFixed(2);
      setCnyValue(calculatedCny);
    }
  };

  const handleCancel = () => {
    params.delete('exchange_rate');
    router.push(`?${params.toString()}`);
  };

  return (
    <Form action={() => {}} title="Currency Conversion">
      {/* Display Section */}
      <div className="bg-gray-100 p-4 rounded-lg shadow space-y-4">
        <div className="flex justify-center items-center space-x-2">
          <Image
            width={24}
            height={24}
            src="/flags/uz-flag.png"
            alt="Uzbekistan Flag"
            className="w-6 h-6 rounded-full"
          />
          <p className="text-2xl font-bold">
            UZS: <span>{formatNumber(uzsValue)}</span>
          </p>
        </div>
        <div className="flex justify-center items-center space-x-2">
          <Image
            width={24}
            height={24}
            src="/flags/zh-flag.png"
            alt="China Flag"
            className="w-6 h-6 rounded-full"
          />
          <p className="text-2xl font-bold">
            CNY: <span>{formatNumber(cnyValue)}</span>
          </p>
        </div>
      </div>

      {/* Input Section */}
      <div className="mt-6 space-y-4">
        <FormInput
          value={uzsValue}
          className="w-full"
          id="uzs"
          type="number"
          label="Amount in UZS"
          onChange={handleUzsChange}
          placeholder="Enter amount in UZS"
        />
        <FormInput
          value={exchangeRate}
          className="w-full"
          id="exchange-rate"
          type="number"
          label="Exchange Rate (UZS to CNY)"
          onChange={handleExchangeRateChange}
          placeholder="Enter exchange rate"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between mt-6">
        <SubmitButton className="w-1/2 mr-2">Confirm</SubmitButton>
        <Button
          className="w-1/2 border border-blue-600 text-blue-600 rounded-lg px-4 py-2"
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </div>
    </Form>
  );
}
