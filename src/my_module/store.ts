import { IMap, ISet, IStore } from './struct' 
import { SetStateAction, Dispatch } from 'react'
import produce, { Patch, Draft, isDraftable, applyPatches } from 'immer'
import { SetState } from 'immer/dist/internal'

type Updatters<S> = Dispatch<SetStateAction<S>>
type IProxy<S, A extends Actions<S>> = {
  [K in keyof A]: () => void
}
interface Actions<S> {
  [key: string]: (...payload: any[]) => (draft: Draft<S>) => void | S | Promise<void | S>
}
interface IPersistedStorage<S> {
  generateKey(name: string): string,
  get(key: string): S | null,
  set(key: string, value: S): void,
}

interface IStoreOptions {
  name: string,
}

const DEFAULT_STORE_NAME = 'outis-store'
const store: IMap<string, any> = new IMap()
const defaultStorage = {
  generateKey: (name: string) => {
    return name
  },
  get: (key: string) => {
    store.get(key)
  },
  set: (key: string, value: any) => {
    store.set(key, value)
  }
}


export function createStore<S, R extends Actions<S>>(
  initialState: S,
  reducers: R,
  options?: IStoreOptions 
) {
  let storage = defaultStorage as IPersistedStorage<S>
  let name = options?.name || DEFAULT_STORE_NAME
  // get key
  let key = storage.generateKey(DEFAULT_STORE_NAME)
  // use a set to cache all updaters that share this state
  let updaters = new Set<Updatters<S>>()

  // shared state's current value
  let transientState: S
  let commitedState: S

  // proxy which dispatch actions
  let proxy: IProxy<S, R>

  // changes
  let changes: Patch[] = []
  let inverseChanges: Patch[] = []

  function performUpdate(state: S) {
    if (isDraftable(state)) {
      const result = applyPatches(transientState, changes)
      changes = []
      inverseChanges = []
      transientState = result
    } else {
      transientState = state
    }

    // update peristed storage even though there is no component alive
    // if (updaters.size === 0) {
    //   console &&
    //     console.warn &&
    //     console.warn(
    //       'No alive component to respond this update, just sync to storage if needful'
    //     )
    //   isPersisted && storage.set(key, transientState)
    // } else {
      updaters.forEach(setState => setState(transientState))
    // }
  }
  const mapActions = (key: string) => (...args: any[]) => {
    const setState = reducers[key](...args) as any
    const result = produce(
      transientState,
      setState,
      (patches, inversePatches) => {
        changes.push(...patches)
        inverseChanges.push(...inversePatches)
      }
    )
    if (typeof Promise !== 'undefined' && result instanceof Promise) {
      result.then(performUpdate)
    } else {
      performUpdate(result)
    }
  }

  // 检查是否支持 proxy
  if (typeof Proxy !== undefined) {
    proxy = new Proxy(reducers, {
      get(target, key, desc) {
        return mapActions(key as string)
      }
    })
  } else {
    proxy = Object.keys(reducers).reduce(
      (pre: any, key: string) => {
        pre[key] = mapActions(key)
        return pre
      },
      {} as R
    )
  }

  // state
  let store: IStore<S, IProxy<S, R>> = new IStore(initialState, proxy, { name })

  return store.useSharedStore(initialState)
}