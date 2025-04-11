import { useState } from 'react';

import { validateField } from 'src/utils/validation';

export function useForm<T>(initialState: T) {
  const [formData, setFormData] = useState<T>(initialState);
  const [formError, setFormError] = useState<T>(initialState);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    // Update form data
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    // Validate the field and set error
    const error = validateField(name, value, true);
    setFormError((prevError) => ({ ...prevError, [name]: error }));
  };

  return { formData, formError, handleInputChange, setFormError };
}