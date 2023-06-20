export interface JWT {
  payload: JWTPayload;
  signature: string;
  header: JWTHeader;
}

interface JWTPayload {
  sub: string;
  aud: string;
  exp: number;
  iat: number;
}

interface JWTHeader {
  alg: string;
  typ: 'JWT';
}
