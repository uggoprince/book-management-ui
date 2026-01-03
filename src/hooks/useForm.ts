import { useState, useCallback, type ChangeEvent } from 'react';

interface FormValues {
  [key: string]: string;
}

interface FormErrors {
  [key: string]: string;
}

type ValidationRules = {
  [key: string]: (value: string) => string;
};

/**
 * Custom hook for form state management
 * Provides values, errors, and handlers for controlled form inputs
 */
export const useForm = (initialValues: FormValues) => {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});

  // Handle input change
  const handleChange = useCallback((
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    setErrors((prev) => {
      if (prev[name]) {
        return {
          ...prev,
          [name]: '',
        };
      }
      return prev;
    });
  }, []);

  // Validate form against provided rules
  const validate = useCallback((rules: ValidationRules): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(rules).forEach((field) => {
      const error = rules[field](values[field] || '');
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values]);

  // Reset form to initial values
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  return {
    values,
    errors,
    handleChange,
    setValues,
    setErrors,
    validate,
    reset,
  };
};
