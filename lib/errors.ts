export class SagiriError extends Error {
  constructor(code: number, message: string) {
    super(`${message} (${code})`);
    this.name = "SagiriError";
  }
}

export class SagiriClientError extends SagiriError {
  constructor(code: number, message: string) {
    super(code, message);
    this.name = "SagiriClientError";
  }
}

export class SagiriServerError extends SagiriError {
  constructor(code: number, message: string) {
    super(code, message);
    this.name = "SagiriServerError";
  }
}
