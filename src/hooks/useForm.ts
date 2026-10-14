import { useCallback, useMemo, useState } from 'react';
import type { FieldErrors } from '../utils/validation';

/**
 * Tiny form helper: keeps values, runs a pure validator and only *shows*
 * an error once the field was touched or the form was submitted.
 */
export function useForm<T extends object>(
  initialValues: T,
  validate: (values: T) => FieldErrors<T>,
) {
  const [values, setValues] = useState<T>(initialValues);
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);

  const allErrors = useMemo(() => validate(values), [values, validate]);

  const errors = useMemo(() => {
    const visible: FieldErrors<T> = {};
    (Object.keys(allErrors) as (keyof T)[]).forEach((key) => {
      if (submitted || touched[key]) visible[key] = allErrors[key];
    });
    return visible;
  }, [allErrors, touched, submitted]);

  const setValue = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const touch = useCallback((key: keyof T) => {
    setTouched((prev) => (prev[key] ? prev : { ...prev, [key]: true }));
  }, []);

  /** Marks everything as submitted; runs `onValid` only if there are no errors. */
  const handleSubmit = useCallback(
    (onValid: (values: T) => void | Promise<void>) => async () => {
      setSubmitted(true);
      if (Object.keys(allErrors).length === 0) await onValid(values);
    },
    [allErrors, values],
  );

  const reset = useCallback(
    (next: T = initialValues) => {
      setValues(next);
      setTouched({});
      setSubmitted(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return { values, errors, setValue, touch, handleSubmit, reset };
}
