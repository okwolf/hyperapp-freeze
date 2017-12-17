import { app, h } from "hyperapp"
import freeze from "../src"

const createMutatingAppProps = () => [
  {
    counter: 0,
    canDelete: false,
    child: {
      isFrozen: true,
      canDelete: false
    }
  },
  {
    get: () => state => state,
    mutate: () => state => {
      state.counter++
      state.canAdd = true
      delete state.canDelete

      state.child.isFrozen = false
      state.child.canAdd = true
      delete state.child.canDelete
    },
    child: {
      mutate: () => state => {
        state.isFrozen = false
        state.canAdd = true
        delete state.canDelete
      }
    }
  }
]

it("handles no actions", done =>
  freeze(app)(undefined, undefined, () => done()))

it("is needed because Hyperapp allows state mutations", () => {
  const actions = app(...createMutatingAppProps())
  actions.mutate()
  actions.child.mutate()
  expect(actions.get()).toEqual({
    counter: 1,
    canAdd: true,
    child: {
      isFrozen: false,
      canAdd: true
    }
  })
})

it("prevents Hyperapp state mutations", () => {
  const actions = freeze(app)(...createMutatingAppProps())
  const state = actions.get()
  expect(() => (state.canAdd = true)).toThrowError(/add property/)
  expect(() => delete state.canDelete).toThrowError(/delete property/)
  expect(() => state.counter++).toThrowError(/assign to read only property/)
})

it("prevents Hyperapp state mutations in actions", () => {
  const actions = freeze(app)(...createMutatingAppProps())
  expect(actions.mutate).toThrowError(/assign to read only property/)
  expect(actions.child.mutate).toThrowError(/assign to read only property/)
  expect(actions.get()).toEqual({
    counter: 0,
    canDelete: false,
    child: {
      isFrozen: true,
      canDelete: false
    }
  })
})

it("prevents Hyperapp state mutations in view", done =>
  freeze(app)(
    ...createMutatingAppProps(),
    state => {
      expect(() => (state.canAdd = true)).toThrowError(/add property/)
      expect(() => delete state.canDelete).toThrowError(/delete property/)
      expect(() => state.counter++).toThrowError(/assign to read only property/)
      return h("main", {
        oncreate() {
          done()
        }
      })
    },
    document.body
  ))

it("doesn't interfere with immutable state updates", () => {
  const actions = freeze(app)(
    {
      value: 0
    },
    {
      get: () => state => state,
      up: by => state => ({
        value: state.value + by
      }),
      finish: data => {
        expect(data).toEqual({ some: "data" })
        return { other: "data" }
      }
    }
  )
  expect(actions.get()).toEqual({
    value: 0
  })

  expect(actions.up(2)).toEqual({
    value: 2
  })

  const state = actions.get()
  expect(() => state.value++).toThrowError(/assign to read only property/)
  expect(actions.finish({ some: "data" })).toEqual({ other: "data" })
})
