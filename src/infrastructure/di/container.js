import { SubmitRegistration } from '../../application/useCases/SubmitRegistration.js';
import { AppsScriptRegistrationRepository } from '../repositories/AppsScriptRegistrationRepository.js';
import { FakeRegistrationRepository } from '../repositories/FakeRegistrationRepository.js';
import { env } from '../config/env.js';

// Composition root: single place where the app picks its concrete adapters.
function buildRegistrationRepository() {
  if (env.useFakeRegistration || !env.appsScriptUrl) return new FakeRegistrationRepository();
  return new AppsScriptRegistrationRepository();
}

export const container = {
  submitRegistration: new SubmitRegistration(buildRegistrationRepository()),
};
