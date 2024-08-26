/* eslint-disable @typescript-eslint/no-explicit-any */
export default class Caseless {
  dict: any;
  constructor(dict: any) {
    this.dict = dict || {}
  }
  set(name: any, value: any, clobber?: boolean) {
    if (typeof name === 'object') {
      for (const i in name) {
        this.set(i, name[i], value)
      }
    } else {
      if (typeof clobber === 'undefined') clobber = true
      const has = this.has(name)

      if (!clobber && has) this.dict[has] = this.dict[has] + ',' + value
      else this.dict[has || name] = value
      return has
    }
    return null;
  }
  has(name: string) {
    const keys = Object.keys(this.dict);
    name = name.toLowerCase();
    for (let i=0;i<keys.length;i++) {
      if (keys[i].toLowerCase() === name) return keys[i]
    }
    return false
  }
  get(name: string) {
    name = name.toLowerCase()
    let result, _key
    const headers = this.dict
    Object.keys(headers).forEach(function (key) {
      _key = key.toLowerCase()
      if (name === _key) result = headers[key]
    })
    return result
  }
  swap(name: string) {
    const has = this.has(name)
    if (has === name) return
    if (!has) throw new Error('There is no header than matches "'+name+'"')
    this.dict[name] = this.dict[has]
    delete this.dict[has]
  }

  del(name: string) {
    name = String(name).toLowerCase()
    let deleted = false
    let changed = 0
    const dict = this.dict
    Object.keys(this.dict).forEach(function(key) {
      if (name === String(key).toLowerCase()) {
        deleted = delete dict[key]
        changed += 1
      }
    })
    return changed === 0 ? true : deleted
  }
}

export function httpify (resp: { setHeader: (key: any, value: any, clobber: any) => any; hasHeader: (key: any) => any; getHeader: (key: any) => any; removeHeader: (key: any) => any; headers: any }, headers: any) {
  const c = new Caseless(headers)
  resp.setHeader = function (key, value, clobber) {
    if (typeof value === 'undefined') return
    return c.set(key, value, clobber)
  }
  resp.hasHeader = function (key) {
    return c.has(key)
  }
  resp.getHeader = function (key) {
    return c.get(key)
  }
  resp.removeHeader = function (key) {
    return c.del(key)
  }
  resp.headers = c.dict
  return c
}
