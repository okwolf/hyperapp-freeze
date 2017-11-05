import { app, h } from "hyperapp"
import freeze from "../src"

const createMutatingApp = () => ({
  state: {
    counter: 0,
    canDelete: false,
    child: {
      isFrozen: true,
      canDelete: false
    }
  },
  actions: {
    get: state => state,
    mutate(state) {
      state.counter++
      state.canAdd = true
      delete state.canDelete

      state.child.isFrozen = false
      state.child.canAdd = true
      delete state.child.canDelete
    },
    child: {
      mutate(state) {
        state.isFrozen = false
        state.canAdd = true
        delete state.canDelete
      }
    }
  }
})

it("handles no actions", done =>
  freeze(app)({
    view: () => done()
  }))

it("is needed because Hyperapp allows state mutations", () => {
  const actions = app(createMutatingApp())
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
  const actions = freeze(app)(createMutatingApp())
  const state = actions.get()
  expect(() => (state.canAdd = true)).toThrowError(/add property/)
  expect(() => delete state.canDelete).toThrowError(/delete property/)
  expect(() => state.counter++).toThrowError(/assign to read only property/)
})

it("prevents Hyperapp state mutations in actions", () => {
  const actions = freeze(app)(createMutatingApp())
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

it("prevents Hyperapp state mutations in module actions", () => {
  const actions = freeze(app)({
    actions: {
      get: state => state
    },
    modules: { mutating: createMutatingApp() }
  })
  expect(actions.mutating.mutate).toThrowError(/assign to read only property/)
  expect(actions.mutating.child.mutate).toThrowError(
    /assign to read only property/
  )
  expect(actions.get()).toEqual({
    mutating: {
      counter: 0,
      canDelete: false,
      child: {
        isFrozen: true,
        canDelete: false
      }
    }
  })
})

it("prevents Hyperapp state mutations in view", done =>
  freeze(app)(
    Object.assign(createMutatingApp(), {
      view(state) {
        expect(() => (state.canAdd = true)).toThrowError(/add property/)
        expect(() => delete state.canDelete).toThrowError(/delete property/)
        expect(() => state.counter++).toThrowError(
          /assign to read only property/
        )
        return h("main", {
          oncreate() {
            done()
          }
        })
      }
    })
  ))

it("doesn't interfere with immutable state updates", () => {
  const actions = freeze(app)({
    state: {
      value: 0
    },
    actions: {
      get: state => state,
      up: state => by => ({
        value: state.value + by
      })
    }
  })
  expect(actions.get()).toEqual({
    value: 0
  })

  expect(actions.up(2)).toEqual({
    value: 2
  })

  const state = actions.get()
  expect(() => state.value++).toThrowError(/assign to read only property/)
})
