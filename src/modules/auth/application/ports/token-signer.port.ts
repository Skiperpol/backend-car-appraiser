export type AccessTokenPayload = {
  sub: number;
  email: string;
};

export interface TokenSignerPort {
  signAccessToken(payload: AccessTokenPayload): string;
}

export const TOKEN_SIGNER = Symbol('TOKEN_SIGNER');
