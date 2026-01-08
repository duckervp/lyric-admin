import { useRef, useState, useEffect, useCallback } from 'react';

import { shallowEqual } from 'src/utils/check';
import { validateField } from 'src/utils/validation';

import { useAppSelector } from 'src/app/hooks';
import { selectCurrentLang } from 'src/app/api/lang/langSlice';

export type Form<T> = {
  initialState: T;
  requiredFields: string[];
};

export default function useDebounceForm<T extends Record<string, any>>(form: Form<T>) {
  return useCustomDelayDebounceForm(form, 500);
}

export function useCustomDelayDebounceForm<T extends Record<string, any>>(
  form: Form<T>,
  delay: number
) {
  const initialStateRef = useRef(form.initialState);
  const requiredFieldsRef = useRef(form.requiredFields);
  const externalDirtyRef = useRef(false);

  useEffect(() => {
    initialStateRef.current = form.initialState;
    requiredFieldsRef.current = form.requiredFields;
  }, [form.initialState, form.requiredFields]);

  const [formData, setFormData] = useState<T>(form.initialState);
  const [formInitData, setFormInitData] = useState<T>(form.initialState);
  const [formError, setFormError] = useState<Record<keyof T, string>>(
    () =>
      Object.fromEntries(Object.keys(form.initialState).map((k) => [k, ''])) as Record<keyof T, string>
  );

  const [debouncedFields, setDebouncedFields] = useState<Set<string>>(new Set());
  const [forceInvalid, setForceInvalid] = useState(false);

  const formDataRef = useRef<T>(form.initialState);
  const timersRef = useRef<Record<string, NodeJS.Timeout>>({});
  const currentLang = useAppSelector(selectCurrentLang);

  // 🔥 MAIN FIX — each field has its own debounce timer
  const scheduleValidation = useCallback(
    (name: string, value: any) => {
      if (timersRef.current[name]) {
        clearTimeout(timersRef.current[name]);
      }

      setDebouncedFields((prev) => new Set(prev).add(name));

      timersRef.current[name] = setTimeout(() => {
        const error = validateField(
          name,
          value,
          requiredFieldsRef.current.includes(name),
          formDataRef.current,
          currentLang.locale
        );

        setFormError((prev) => ({ ...prev, [name]: error }));
        setDebouncedFields((prev) => {
          const next = new Set(prev);
          next.delete(name);
          return next;
        });

        delete timersRef.current[name];
      }, delay);
    },
    [currentLang.locale, delay]
  );

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setForceInvalid(false);

    const { type, name, value: val, checked } = event.target;
    const value = type === 'checkbox' ? checked : val;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      formDataRef.current = updated;
      return updated;
    });

    setFormError((prev) => ({ ...prev, [name]: '' }));
    scheduleValidation(name, value);
  }, [scheduleValidation]);

  const isValidForm = useCallback(() => {
    const allFilled = requiredFieldsRef.current.every((f) => !!formDataRef.current[f]);
    const noErrors = Object.values(formError).every((v) => !v);
    const noDebouncePending = debouncedFields.size === 0;

    return (
      !forceInvalid &&
      allFilled &&
      noErrors &&
      noDebouncePending &&
      (!shallowEqual(formInitData, formDataRef.current) || externalDirtyRef.current)
    );
  }, [formError, debouncedFields, forceInvalid, formInitData]);

  const resetForm = useCallback((data?: Partial<T>) => {
    Object.values(timersRef.current).forEach(clearTimeout);
    timersRef.current = {};

    const newFormData = { ...initialStateRef.current, ...data };
    setFormInitData(newFormData);
    setFormData(newFormData);
    setFormError(
      Object.fromEntries(Object.keys(initialStateRef.current).map((k) => [k, ''])) as Record<
        keyof T,
        string
      >
    );
    setDebouncedFields(new Set());
    setForceInvalid(false);
    formDataRef.current = newFormData;
  }, []);

  useEffect(() => () => {
    Object.values(timersRef.current).forEach(clearTimeout);
  }, []);

  return {
    formData,
    formError,
    handleInputChange,
    setFormError,
    isValidForm,
    resetForm,
    invalidForm: () => setForceInvalid(true),
    markExternalDirty: () => (externalDirtyRef.current = true),
    clearExternalDirty: () => (externalDirtyRef.current = false),
  };
}
