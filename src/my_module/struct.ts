import { SetState } from "immer/dist/internal"
import { useState, useEffect, Dispatch, SetStateAction } from "react"

class IMap<k, v> {
  private entries: Array<[k, v]> = []

  constructor(initalValue?: Array<[k, v]>) {
    this.entries = initalValue || []
  }
  /**
   * getEntry
   */
  public getEntry() {
    return this.entries
  }

  get(key: k) {
    for (let element of this.entries) {
      if (element[0] === key) {
        return element[1]
      }
    }
  }

  set(key: k, value: v) {
    for (let element of this.entries) {
      if (element[0] === key) {
        element[1] = value
        return this
      }
    }
    this.entries.push([key, value])
    return this
  }

  clear() {
    this.entries = []
  }

  delete(key: k) {
    let index
    for (let i = 0; i < this.entries.length; i++) {
      if (this.entries[i][0] === key) {
        index = i
        break
      }
    }

    if (index !== undefined) {
      this.entries.splice(index, 1)
      return true
    }
    return false
  }

  forEach(cb: (v: v, k: k, m: Map<k, v>) => void) {
    for (let element of this.entries) {
      cb && cb(element[1], element[0], this as any)
    }
  }

  keys() {
    let keys = []
    for (let element of this.entries) {
      keys.push(element[0])
    }
    return keys
  }

  values() {
    let values = []
    for (let element of this.entries) {
      values.push(element[0])
    }
    return values
  }

  has(key: k) {
    for(let element of this.entries) {
      if (element[0] === key) {
        return true
      }
    }
    return false
  }

  [Symbol.iterator]() {
    let index = 0
    return {
      next: () => {
        if (index < this.entries.length) {
          return { value: this.entries[index++] , done: false }
        } else {
          return { value: undefined, done: true }
        }
      },
    }
  }

  get size() {
    return this.entries.length
  }

  get [Symbol.toStringTag]() {
    return 'Map'
  }
} 

class ISet {

}

interface IStoreOptions {
  name: string,
}

interface Actions<S> {
  [key: string]: () => SetState
}
interface Middleware {
  (actions: string, payload: any[], store: IStore<any, any>, isAsync: boolean):
    | void
    | (() => any)
}
class IStore<S, A> {
  readonly DEFAULT_STORE_NAME = 'outis-store'

  private key: string = this.DEFAULT_STORE_NAME
  private state: S
  private actions: A
  private dispatchs: Set<Dispatch<SetStateAction<S>>> = new Set()
  private transientState!: S
  private commitedState!: S
  private middlewareCBs: ReturnType<Middleware>[] = []

  constructor(s: S, a: A, o?: IStoreOptions) {
    this.state = s
    this.actions = a
    if (o) {
      this.key = o.name
    }
  }
  /**
   * useSharedStore
   */
  public useSharedStore(initialState: S): any {
    const [state, setState] = useState(this.transientState || initialState)
    this.useSharedEffect(state, setState)
    this.useMiddlewareEffect(state)
    return [state, this.actions]
  }

  /**
   * useSharedEffect
   */
  public useSharedEffect(state: S, setState: Dispatch<SetStateAction<S>>) {
    this.transientState = this.transientState || state
    useEffect(() => {
      this.commitedState = state
      this.dispatchs.add(setState)
      return () => {
        this.dispatchs.delete(setState)
      };
    }, [state]);
  }

  /**
   * useMiddlewareEffect
   */
  public useMiddlewareEffect(state: S) {
    useEffect(() => {
      this.middlewareCBs.forEach(f => {
        typeof f === 'function' && f()
      });
      this.middlewareCBs = []
    });
  }

  /**
   * getState
   */
  public getState(): S {
    return this.state
  }

  /**
   * getActions
   */
  public getActions(): A {
    return this.actions
  }

  get name() {
    return this.key
  }
}

export {
  IMap, ISet, IStore
}