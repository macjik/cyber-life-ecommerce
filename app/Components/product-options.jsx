'use client';

import { useFormState } from 'react-dom';
import { selectOption } from '../form-actions/options';

export default function ProductOptions({ orderId, children }) {
  const [optionState, optionAction] = useFormState(selectOption, null);

  function handleProductOption(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append('option', event.target.name);
    formData.append('id', event.target.id);
    formData.append('value', children);

    optionAction(formData);
  }

  console.log(optionState);

  return (
    <button
      onClick={handleProductOption}
      name="option"
      id={orderId}
      className={`inline-block px-4 py-2 rounded-full ms-2 border-2 border-orange-400 
        ${optionState?.status === 200 ? 'bg-orange-400 text-white' : ''}
        ${optionState?.status === false ? 'bg-orange-400 text-white' : ''}
        ${optionState?.status !== 200 && optionState?.status !== false ? 'text-orange-400 border-2 border-orange-400' : ''}
        hover:bg-orange-400 hover:text-white`}
    >
      {children}
    </button>
  );
}
