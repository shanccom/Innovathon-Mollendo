// Compare mailbox identities without changing the address used for confirmation.
export function emailIdentity(value) {
  const email = String(value ?? '').trim().toLowerCase();
  const [local, domain] = email.split('@');
  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    return `${local.split('+')[0].replaceAll('.', '')}@gmail.com`;
  }
  return email;
}

export function registrationsOverlap(a, b) {
  const emails = [a.personalEmail, a.institutionalEmail].map(emailIdentity).filter(Boolean);
  return a.dni === b.dni || [b.personalEmail, b.institutionalEmail]
    .map(emailIdentity).some((email) => email && emails.includes(email));
}
