export class SWRError extends Error {
  info: string;
  status: number;

  constructor(message: string, info: string, status: number) {
    super(message);
    this.info = info;
    this.status = status;
  }
}
