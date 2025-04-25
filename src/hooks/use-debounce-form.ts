import { useRef, useState, useEffect, useCallback } from 'react';

import { validateField } from 'src/utils/validation';

import { useDebounce } from './use-debounce';

export default function useDebounceForm<T extends Record<string, any>>(form: Form<T>) {
  return useCustomDelayDebounceForm(form, 500);
}

export type Form<T> = {
  initialState: T;
  requiredFields: string[];
};

export function useCustomDelayDebounceForm<T extends Record<string, any>>(
  form: Form<T>,
  delay: number
) {
  const [formData, setFormData] = useState<T>(form.initialState);
  const [formError, setFormError] = useState<Record<keyof T, string>>(
    Object.keys(form.initialState).reduce(
      (acc, key) => {
        acc[key as keyof T] = '';
        return acc;
      },
      {} as Record<keyof T, string>
    )
  );

  const [inputValue, setInputValue] = useState<{
    name: string;
    value: string | boolean;
  } | null>(null);
  const [debouncedFields, setDebouncedFields] = useState<Set<string>>(new Set());

  // Keep a mutable copy of formData
  const formDataRef = useRef<T>(form.initialState);

  // Debounce the input value
  const debouncedInput = useDebounce(inputValue, delay);

  // Update form data and validate when debounced input changes
  useEffect(() => {
    if (debouncedInput) {
      const { name, value } = debouncedInput;

      // Validate the field and set error
      const error = validateField(
        name,
        value,
        form.requiredFields.includes(name),
        formDataRef.current
      );
      setFormError((prevError) => ({ ...prevError, [name]: error }));

      // Remove the field from debouncedFields since it's being updated
      setDebouncedFields((prev) => {
        const updated = new Set(prev);
        updated.delete(name);
        return updated;
      });
    }
  }, [debouncedInput, form.requiredFields]);

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { type, name, value: val, checked } = event.target;
    console.log(type);

    const value = type === 'checkbox' ? checked : val;

    if (['text', 'password'].includes(type)) {
      setInputValue({ name, value });

      setFormError((prevError) => ({ ...prevError, [name]: '' }));

      // Add the field to the debouncedFields set
      setDebouncedFields((prev) => new Set(prev).add(name));
    }

    // Update form data
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      formDataRef.current = updatedData; // Update the ref copy
      return updatedData;
    });
  }, []);

  const isValidForm = () => {
    const allFilled = form.requiredFields.every((field) => formDataRef.current[field]);

    const noErrors = Object.values(formError).every((val) => !val);
    
    const noDebouncePending = debouncedFields.size === 0;

    return allFilled && noErrors && noDebouncePending;
  };

  const resetForm = useCallback(
    (data?: Partial<typeof form.initialState>) => {
      const newFormData = { ...form.initialState, ...data };
      setFormData(newFormData);
      setFormError(form.initialState);
      setInputValue(null);
      setDebouncedFields(new Set());
      formDataRef.current = newFormData; // Reset the ref copy
    },
    [form]
  );

  return { formData, formError, handleInputChange, setFormError, isValidForm, resetForm };
}
