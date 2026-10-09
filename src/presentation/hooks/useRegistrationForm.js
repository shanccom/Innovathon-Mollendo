import { useCallback, useRef, useState } from 'react';
import { createEmptyRegistration } from '../../domain/entities/Registration';
import {
  getFirstInvalidField,
  validateRegistrationField,
  validateStep,
  validateRegistration,
  STEP_FIELDS,
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
  const submitting = useRef(false);

  const showErrors = useCallback((fieldErrors) => {
    setErrors(fieldErrors);
    const first = getFirstInvalidField(fieldErrors);
    const invalidStep = Object.entries(STEP_FIELDS).find(([, fields]) => fields.includes(first));
    if (invalidStep) setStep(Number(invalidStep[0]));
    requestAnimationFrame(() => document.getElementById(`field-${first}`)?.focus());
  }, []);

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
    if (submitting.current) return false;
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
    if (submitting.current) return;
    setErrors({});
    setStep((current) => Math.max(current - 1, 1));
    window.scrollTo({ top: 120, behavior: 'smooth' });
  }, []);

  const goToStep = useCallback((targetStep) => {
    if (submitting.current || targetStep < 1 || targetStep > 3) return;
    // Allow going backwards freely; validate current if going forward
    if (targetStep < step) {
      setErrors({});
      setStep(targetStep);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } else if (targetStep > step) {
      const stepErrors = {};
      for (let current = 1; current < targetStep; current++) {
        Object.assign(stepErrors, validateStep(current, values));
      }
      if (Object.keys(stepErrors).length === 0) {
        setStep(targetStep);
        window.scrollTo({ top: 120, behavior: 'smooth' });
      } else {
        showErrors(stepErrors);
      }
    }
  }, [step, values, showErrors]);

  const handleSubmit = useCallback(
    async (event) => {
      if (event) event.preventDefault();
      if (submitting.current) return;
      setMessage('');

      const formErrors = validateRegistration(values);
      if (Object.keys(formErrors).length > 0) {
        showErrors(formErrors);
        return;
      }

      submitting.current = true;
      setStatus('submitting');

      try {
        const confirmation = await container.submitRegistration.execute(values);
        setReceipt({ ...confirmation, values });
        setStatus('success');
      } catch (error) {
        if (error instanceof RegistrationValidationError) {
          const fieldErrors = Object.fromEntries(Object.entries(error.fieldErrors).filter(([key]) => key !== 'focus'));
          showErrors(fieldErrors);
          setStatus('idle');
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
      } finally {
        submitting.current = false;
      }
    },
    [values, showErrors],
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

