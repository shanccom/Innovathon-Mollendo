import { SubmitRegistration } from '../../application/useCases/SubmitRegistration';
import { AppsScriptRegistrationRepository } from '../repositories/AppsScriptRegistrationRepository';
import { FakeRegistrationRepository } from '../repositories/FakeRegistrationRepository';
import { env } from '../config/env';

// Composition root: single place where the app picks its concrete adapters.
function buildRegistrationRepository() {
  if (env.useFakeRegistration || !env.appsScriptUrl) return new FakeRegistrationRepository();
  return new AppsScriptRegistrationRepository();
}

export const container = {
  submitRegistration: new SubmitRegistration(buildRegistrationRepository()),
};
