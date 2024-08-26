/**
 * Represents an error specific to the Sagiri library.
 */
export class SagiriError extends Error {
  constructor(code: number, message: string) {
    super(`${message} (${code})`);
    this.name = "SagiriError";
  }
}

/**
 * Represents an error specific to the Sagiri client.
 */
export class SagiriClientError extends SagiriError {
  constructor(code: number, message: string) {
    super(code, message);
    this.name = "SagiriClientError";
  }
}

/**
 * Represents a error specific to the SauceNAO API.
 * @extends SagiriError
 */
export class SagiriServerError extends SagiriError {
  constructor(code: number, message: string) {
    super(code, message);
    this.name = "SagiriServerError";
  }
}
