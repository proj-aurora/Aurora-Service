export interface ResponseBody<T> {
  success: boolean
  data?: T
}

export type AsyncResponseBody<T extends object | undefined = undefined> = Promise<ResponseBody<T>>

