import * as crypto from 'crypto';


//salt = Random(salt(base64))
export function pollute(): string {
  return crypto.randomBytes(5).toString('base64');
}

//password = password(sha256) + salt
export function polluteVeil(password: string, salt: string): string {
  const hash = crypto.createHmac('sha256', salt);
  hash.update(password);
  return hash.digest('hex');
}

export function randomValue() {
  return crypto.randomUUID().toString()
}