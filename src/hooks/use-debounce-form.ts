import { useRef, useState, useEffect, useCallback } from 'react';

import { shallowEqual } from 'src/utils/check';
import { validateField } from 'src/utils/validation';

import { useAppSelector } from 'src/app/hooks';
import { selectCurrentLang } from 'src/app/api/lang/langSlice';

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
    () =>
      Object.fromEntries(Object.keys(form.initialState).map((key) => [key, ''])) as Record<
        keyof T,
        string
      >
  );

  const [inputValue, setInputValue] = useState<{
    name: string;
    value: string | boolean;
  } | null>(null);
  const [debouncedFields, setDebouncedFields] = useState<Set<string>>(new Set());

  const [forceInvalid, setForceInvalid] = useState<boolean>(false);

  // Keep a mutable copy of formData
  const formDataRef = useRef<T>(form.initialState);

  // Debounce the input value
  const debouncedInput = useDebounce(inputValue, delay);

  const currentLang = useAppSelector(selectCurrentLang);

  // Update form data and validate when debounced input changes
  useEffect(() => {
    if (debouncedInput) {
      const { name, value } = debouncedInput;

      // Validate the field and set error
      const error = validateField(
        name,
        value as string,
        form.requiredFields.includes(name),
        formDataRef.current,
        currentLang.locale
      );
      setFormError((prevError) => ({ ...prevError, [name]: error }));

      // Remove the field from debouncedFields since it's being updated
      setDebouncedFields((prev) => {
        const updated = new Set(prev);
        updated.delete(name);
        return updated;
      });
    }
  }, [debouncedInput, form.requiredFields, currentLang]);

  useEffect(() => {
    setFormData(form.initialState);
    formDataRef.current = form.initialState;
    setFormError(
      Object.fromEntries(Object.keys(form.initialState).map((key) => [key, ''])) as Record<
        keyof T,
        string
      >
    );
    setInputValue(null);
    setDebouncedFields(new Set());
  }, [form.initialState]);

  useEffect(() => {
    if (shallowEqual(formDataRef.current, form.initialState)) return; // avoid overwriting manual edits
    setFormData(form.initialState);
    formDataRef.current = form.initialState;
  }, [form.initialState]);

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { type, name, value: val, checked } = event.target;

    const value = type === 'checkbox' ? checked : val;

    if (['text', 'password', 'number', 'email', 'gender', 'store-select', 'custom'].includes(type)) {
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
    // console.log("requiredF", form.requiredFields);

    const allFilled = form.requiredFields.every((field) => formDataRef.current[field]);
    // console.log("allFilled", allFilled);

    const noErrors = Object.values(formError).every((val) => !val);
    // console.log("noErrors", noErrors);

    const noDebouncePending = debouncedFields.size === 0;
    // console.log("noDebouncePending", noDebouncePending);

    return !forceInvalid && allFilled && noErrors && noDebouncePending && !shallowEqual(form.initialState, formDataRef.current);
  };

  const resetForm = useCallback(
    (data?: Partial<typeof form.initialState>) => {
      const newFormData = { ...form.initialState, ...data };
      setFormData(newFormData);
      setFormError(
        Object.fromEntries(Object.keys(form.initialState).map((key) => [key, ''])) as Record<
          keyof T,
          string
        >
      );
      setInputValue(null);
      setDebouncedFields(new Set());
      formDataRef.current = newFormData; // Reset the ref copy
    },
    [form]
  );

  const invalidForm = () => setForceInvalid(true);

  return { formData, formError, handleInputChange, setFormError, isValidForm, resetForm, invalidForm };
}
