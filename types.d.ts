// Temporary until my types get pulled into @types.
declare module 'bent' {
  import { PassThrough, Stream } from 'stream';

  type HttpMethod =
    | 'GET'
    | 'POST'
    | 'DELETE'
    | 'PUT'
    | 'PATCH'
    | 'HEAD'
    | 'OPTIONS'
    | 'CONNECT'
    | 'TRACE';
  type StatusCode = number;
  type BaseUrl = string;
  interface Headers {
    [key: string]: any;
  }

  // Type first
  function bent(
    type: 'string',
    ...args: bent.Options[]
  ): bent.RequestFunction<string>;
  function bent(
    type: 'buffer',
    ...args: bent.Options[]
  ): bent.RequestFunction<Buffer | ArrayBuffer>;
  function bent(
    type: 'json',
    ...args: bent.Options[]
  ): bent.RequestFunction<bent.Json>;

  // Method or url first
  function bent(
    baseUrl: string,
    type: 'string',
    ...args: bent.Options[]
  ): bent.RequestFunction<string>;
  function bent(
    baseUrl: string,
    type: 'buffer',
    ...args: bent.Options[]
  ): bent.RequestFunction<Buffer | ArrayBuffer>;
  function bent(
    baseUrl: string,
    type: 'json',
    ...args: bent.Options[]
  ): bent.RequestFunction<bent.Json>;
  function bent(
    baseUrl: string,
    ...args: bent.Options[]
  ): bent.RequestFunction<bent.ValidResponse>;

  function bent(
    ...args: bent.Options[]
  ): bent.RequestFunction<bent.ValidResponse>;

  namespace bent {
    type RequestFunction<T extends ValidResponse> = (
      url: string,
      body?: RequestBody
    ) => Promise<T>;
    type Options = HttpMethod | StatusCode | Headers | BaseUrl;
    type RequestBody = string | Stream | Buffer | ArrayBuffer | Json;
    type NodeResponse = PassThrough & {
      statusCode: number;
      statusMessage: string;
      headers: Headers;
    };
    type FetchResponse = Response & { statusCode: number };
    type BentResponse = NodeResponse | FetchResponse;

    type Json = { [key: string]: any; [key: number]: any } | any[];
    type ValidResponse = BentResponse | string | Buffer | ArrayBuffer | Json;
  }

  export = bent;
}
