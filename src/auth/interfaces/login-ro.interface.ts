import { CustomerEntity } from '../../customer/entities/customer.entity';

export interface LoginRO {
  customer: CustomerEntity;
  tokens: Tokens;
}

interface Tokens {
  accessToken: Token;
  refreshToken: Token;
}

interface Token {
  value: string;
  expiresIn: number;
}
