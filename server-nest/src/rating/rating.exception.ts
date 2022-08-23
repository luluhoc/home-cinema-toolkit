interface IMessage {
  msg: string;
}
export class RatingException {
  error: boolean;
  errors: [IMessage];
  code: number;
  constructor(code: number, message: string) {
    (this.error = true),
      (this.errors = [
        {
          msg: message,
        },
      ]),
      (this.code = code);
  }
}
