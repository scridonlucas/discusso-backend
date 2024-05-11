export class CustomTokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MyCustomError';
  }
}
