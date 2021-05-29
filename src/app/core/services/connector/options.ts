export interface Options {
  rejectUnauthorized: boolean,
  headers: {
    Accept: string,
    Authorization: string
  },
  url: string
}
