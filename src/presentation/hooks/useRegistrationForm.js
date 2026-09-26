import { useCallback, useState } from 'react';
import { createEmptyRegistration } from '../../domain/entities/Registration';
import { validateRegistrationField } from '../../domain/validation/registrationRules';
import { RegistrationValidationError } from '../../domain/errors/registrationErrors';
import { container } from '../../infrastructure/di/container';

// Form state machine for the registration page; delegates persistence to the use case.
export function useRegistrationForm() {
  const [values, setValues] = useState(createEmptyRegistration);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [receipt, setReceipt] = useState(null);

  const handleChange = useCallback((event) => {
    const { name, value, type, checked } = event.target;
    const nextValue = type === 'checkbox' ? checked : value;

    setValues((current) => ({ ...current, [name]: nextValue }));
    setErrors((current) => (current[name] ? { ...current, [name]: '' } : current));
  }, []);

  const handleBlur = useCallback((event) => {
    const { name, value, type, checked } = event.target;
    const nextValue = type === 'checkbox' ? checked : value;

    setErrors((current) => ({ ...current, [name]: validateRegistrationField(name, nextValue, values) }));
  }, [values]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setMessage('');
      setStatus('submitting');

      try {
        const confirmation = await container.submitRegistration.execute(values);
        setReceipt({ ...confirmation, values });
        setStatus('success');
      } catch (error) {
        if (error instanceof RegistrationValidationError) {
          const { focus, ...fieldErrors } = error.fieldErrors;
          setErrors(fieldErrors);
          setStatus('idle');
          document.getElementById(`field-${focus}`)?.focus();
          return;
        }

        setMessage(error.message ?? 'No pudimos completar tu registro. Inténtalo nuevamente.');
        setStatus('error');
      }
    },
    [values],
  );

  const reset = useCallback(() => {
    setValues(createEmptyRegistration());
    setErrors({});
    setMessage('');
    setReceipt(null);
    setStatus('idle');
  }, []);

  const isTeam = values.participationType === 'team';

  return { values, errors, status, message, receipt, isTeam, handleChange, handleBlur, handleSubmit, reset };
}
