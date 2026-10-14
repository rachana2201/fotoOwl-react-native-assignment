import * as Crypto from 'expo-crypto';

/**
 * Passwords are never stored in plain text. The email is used as a salt so two
 * users with the same password get different hashes.
 * NOTE: this is a local-only simulation of auth - a real app would do this on a server.
 */
export async function hashPassword(email: string, password: string): Promise<string> {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${email.trim().toLowerCase()}:${password}`,
  );
}
