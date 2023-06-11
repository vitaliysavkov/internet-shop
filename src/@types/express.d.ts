declare namespace Express {
  export interface Request {
    customer: import('../customer/entities/customer.entity').CustomerEntity;
  }
}
