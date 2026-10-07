import { useCallback, useState } from 'react';
import { createEmptyRegistration } from '../../domain/entities/Registration';
import {
  getFirstInvalidField,
  validateRegistrationField,
  validateStep,
} from '../../domain/validation/registrationRules';
import {
  RegistrationValidationError,
  RegistrationDuplicateError,
} from '../../domain/errors/registrationErrors';
import { container } from '../../infrastructure/di/container';

// Form state machine for the 3-step registration wizard.
export function useRegistrationForm() {
  const [step, setStep] = useState(1);
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

    setErrors((current) => ({
      ...current,
      [name]: validateRegistrationField(name, nextValue, values),
    }));
  }, [values]);

  const handleToggleContributionArea = useCallback((areaTitle) => {
    setValues((current) => {
      const currentAreas = current.contributionAreas || [];
      const exists = currentAreas.includes(areaTitle);
      const nextAreas = exists
        ? currentAreas.filter((item) => item !== areaTitle)
        : [...currentAreas, areaTitle];

      return { ...current, contributionAreas: nextAreas };
    });
    setErrors((current) => (current.contributionAreas ? { ...current, contributionAreas: '' } : current));
  }, []);

  const nextStep = useCallback(() => {
    const stepErrors = validateStep(step, values);
    if (Object.keys(stepErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...stepErrors }));
      const firstInvalid = getFirstInvalidField(stepErrors);
      if (firstInvalid) {
        document.getElementById(`field-${firstInvalid}`)?.focus();
      }
      return false;
    }

    setErrors({});
    setStep((current) => Math.min(current + 1, 3));
    window.scrollTo({ top: 120, behavior: 'smooth' });
    return true;
  }, [step, values]);

  const prevStep = useCallback(() => {
    setErrors({});
    setStep((current) => Math.max(current - 1, 1));
    window.scrollTo({ top: 120, behavior: 'smooth' });
  }, []);

  const goToStep = useCallback((targetStep) => {
    if (targetStep < 1 || targetStep > 3) return;
    // Allow going backwards freely; validate current if going forward
    if (targetStep < step) {
      setErrors({});
      setStep(targetStep);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } else if (targetStep > step) {
      const stepErrors = validateStep(step, values);
      if (Object.keys(stepErrors).length === 0) {
        setStep(targetStep);
        window.scrollTo({ top: 120, behavior: 'smooth' });
      } else {
        setErrors((prev) => ({ ...prev, ...stepErrors }));
      }
    }
  }, [step, values]);

  const handleSubmit = useCallback(
    async (event) => {
      if (event) event.preventDefault();
      setMessage('');

      // Validate Step 3 first
      const step3Errors = validateStep(3, values);
      if (Object.keys(step3Errors).length > 0) {
        setErrors((prev) => ({ ...prev, ...step3Errors }));
        const firstInvalid = getFirstInvalidField(step3Errors);
        if (firstInvalid) {
          document.getElementById(`field-${firstInvalid}`)?.focus();
        }
        return;
      }

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
          if (focus) {
            document.getElementById(`field-${focus}`)?.focus();
          }
          return;
        }

        if (error instanceof RegistrationDuplicateError || error?.isDuplicate) {
          setMessage(
            error.message ||
              'Este correo o DNI ya ha sido registrado previamente. Tu postulación para la Innovathon Mollendo 2026 ya está recibida y en proceso de revisión.'
          );
          setStatus('duplicate');
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
    setStep(1);
  }, []);

  return {
    step,
    values,
    errors,
    status,
    message,
    receipt,
    nextStep,
    prevStep,
    goToStep,
    handleChange,
    handleBlur,
    handleToggleContributionArea,
    handleSubmit,
    reset,
  };
}

