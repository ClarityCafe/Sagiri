/* eslint-disable @typescript-eslint/no-explicit-any */
import { PassThrough } from "node:stream";
import zlib from "node:zlib";
import http from "node:http";
import https from "node:https";
import { URL } from "node:url";
import { isStream } from "is-stream";
import Caseless from "./caseless.js";

function bytesishFrom(_from: any, encoding?: any) {
  if (Buffer.isBuffer(_from)) return _from
  _from = bytesishFrom(_from, encoding)
  return Buffer.from(_from.buffer, _from.byteOffset, _from.byteLength)
}

const compression: any = {
  deflate: function (): zlib.Inflate {
    return zlib.createInflate();
  },
  gzip: function (): zlib.Gunzip {
    return zlib.createGunzip();
  },
  br: function (): zlib.BrotliDecompress {
    return zlib.createBrotliDecompress();
  }
} as const;

const acceptEncoding = Object.keys(compression).join(', ')

const getResponse = (resp: { statusCode: any; statusMessage: any; headers: any; pipe: any }) => {
  const ret: any = new PassThrough()
  ret.statusCode = resp.statusCode
  ret.status = resp.statusCode
  ret.statusMessage = resp.statusMessage
  ret.headers = resp.headers
  ret._response = resp
  if (ret.headers['content-encoding']) {
    const encodings = ret.headers['content-encoding'].split(', ').reverse()
    while (encodings.length) {
      const enc = encodings.shift()
      if (compression[enc]) {
        const decompress = compression[enc]()
        decompress.on('error', (e: ErrorOptions | undefined) => ret.emit('error', new Error('ZBufError', e)))
        resp = resp.pipe(decompress)
      } else {
        break
      }
    }
  }
  return resp.pipe(ret)
}

class StatusError extends Error {
  statusCode: number
  json: any
  text: string
  arrayBuffer: ArrayBuffer
  headers: any
  constructor (res: { statusMessage: string; statusCode: number; json: any; text: string; arrayBuffer: () => ArrayBuffer; headers: any }, ...params: undefined[]) {
    super(...params)

    Error.captureStackTrace(this, StatusError)
    this.name = 'StatusError'
    this.message = res.statusMessage;
    this.statusCode = res.statusCode;
    this.json = res.json;
    this.text = res.text;
    this.arrayBuffer = res.arrayBuffer();
    this.headers = res.headers;
    let buffer: any;

    const get = () => {
      if (!buffer) buffer = this.arrayBuffer;
      return buffer
    }
    Object.defineProperty(this, 'responseBody', { get })
  }
}

const getBuffer = (stream: any) => new Promise((resolve, reject) => {
  const parts: any[] = []
  stream.on('error', reject)
  stream.on('end', () => resolve(Buffer.concat(parts)))
  stream.on('data', (d: any) => parts.push(d))
})

const decodings = (res: { arrayBuffer: () => Promise<any>; text: () => any; json: () => Promise<any> }) => {
  let _buffer: Promise<unknown>
  res.arrayBuffer = () => {
    if (!_buffer) {
      _buffer = getBuffer(res)
      return _buffer
    } else {
      throw new Error('body stream is locked')
    }
  }
  res.text = () => res.arrayBuffer().then((buff: { toString: () => any }) => buff.toString())
  res.json = async () => {
    const str = await res.text()
    try {
      return JSON.parse(str)
    } catch (e) {
      (e as Error).message += `str"${str}"`
      throw e
    }
  }
}

const mkrequest = (statusCodes: any, method: any, encoding: string, baseurl: any, headers?: any, ) => (_url: any, body: any, _headers = {}) => {
  _url = baseurl + (_url || '')
  const parsed = new URL(_url)
  let h
  if (parsed.protocol === 'https:') {
    h = https
  } else if (parsed.protocol === 'http:') {
    h = http
  } else {
    throw new Error(`Unknown protocol, ${parsed.protocol}`)
  }
  const request: {
    path: any;
    port: any;
    method: any;
    headers: any;
    hostname: any;
    auth?: string;
  } = {
    path: parsed.pathname + parsed.search,
    port: parsed.port,
    method: method,
    headers: { ...(headers || {}), ..._headers },
    hostname: parsed.hostname
  }
  if (parsed.username || parsed.password) {
    request.auth = [parsed.username, parsed.password].join(':')
  }
  const c = new Caseless(request.headers);
  if (encoding === 'json') {
    if (!c.get('accept')) {
      c.set('accept', 'application/json')
    }
  }
  if (!c.has('accept-encoding')) {
    c.set('accept-encoding', acceptEncoding)
  }
  return new Promise((resolve, reject) => {
    const req = h.request(request, async (res: any) => {
      res = getResponse(res)
      res.on('error', reject)
      decodings(res)
      res.status = res.statusCode
      if (!statusCodes.has(res.statusCode)) {
        return reject(new StatusError(res))
      }

      if (!encoding) return resolve(res)
      else {
        /* istanbul ignore else */
        if (encoding === 'buffer') {
          resolve(res.arrayBuffer())
        } else if (encoding === 'json') {
          resolve(res.json())
        } else if (encoding === 'string') {
          resolve(res.text())
        }
      }
    })
    req.on('error', reject)
    if (body) {
      if (body instanceof ArrayBuffer || ArrayBuffer.isView(body)) {
        body = bytesishFrom(body);
      }
      if (Buffer.isBuffer(body)) {
        // noop
      } else if (typeof body === 'string') {
        body = Buffer.from(body)
      } else if (isStream(body)) {
        body.pipe(req)
        body = null
      } else if (typeof body === 'object') {
        if (!c.has('content-type')) {
          req.setHeader('content-type', 'application/json')
        }
        body = Buffer.from(JSON.stringify(body))
      } else {
        reject(new Error('Unknown body type.'))
      }
      if (body) {
        req.setHeader('content-length', body.length)
        req.end(body)
      }
    } else {
      req.end()
    }
  })
}

export default mkrequest;
