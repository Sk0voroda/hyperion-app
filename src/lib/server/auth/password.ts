import { sha256 } from '@oslojs/crypto/sha2';
import { encodeHexLowerCase } from '@oslojs/encoding';

export const hashPassword = (password: string) => {
	return encodeHexLowerCase(sha256(new TextEncoder().encode(password)));
};
export const isPasswordValid = (loginPassword: string, userPassword: string) =>
	userPassword === encodeHexLowerCase(sha256(new TextEncoder().encode(loginPassword)));
