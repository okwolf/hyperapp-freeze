import { app, h } from "hyperapp"
import freeze from "../src"

window.requestAnimationFrame = process.nextTick

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

test("without actions", done =>
  freeze(app)({
    init() {
      done()
    }
  }))

it("is needed because Hyperapp allows state mutations", done =>
  app(
    Object.assign(createMutatingApp(), {
      init(state, actions) {
        actions.mutate()
        actions.child.mutate()
        expect(state).toEqual({
          counter: 1,
          canAdd: true,
          child: {
            isFrozen: false,
            canAdd: true
          }
        })
        done()
      }
    })
  ))

it("prevents Hyperapp state mutations in actions", done =>
  freeze(app)(
    Object.assign(createMutatingApp(), {
      init(state, actions) {
        expect(actions.mutate).toThrowError(
          /Cannot assign to read only property/
        )
        expect(actions.child.mutate).toThrowError(
          /Cannot assign to read only property/
        )
        expect(state).toEqual({
          counter: 0,
          canDelete: false,
          child: {
            isFrozen: true,
            canDelete: false
          }
        })
        done()
      }
    })
  ))

it("prevents Hyperapp state mutations in module actions", done =>
  freeze(app)({
    init(state, actions) {
      expect(actions.mutating.mutate).toThrowError(
        /Cannot assign to read only property/
      )
      expect(actions.mutating.child.mutate).toThrowError(
        /Cannot assign to read only property/
      )
      expect(state).toEqual({
        mutating: {
          counter: 0,
          canDelete: false,
          child: {
            isFrozen: true,
            canDelete: false
          }
        }
      })
      done()
    },
    modules: { mutating: createMutatingApp() }
  }))

it("prevents Hyperapp state mutations in view", done =>
  freeze(app)(
    Object.assign(createMutatingApp(), {
      view(state) {
        expect(() => (state.canAdd = true)).toThrowError(/Cannot add property/)
        expect(() => delete state.canDelete).toThrowError(
          /Cannot delete property/
        )
        expect(() => state.counter++).toThrowError(
          /Cannot assign to read only property/
        )
        return h("main", {
          oncreate() {
            done()
          }
        })
      }
    })
  ))

test("doesn't interfere with immutable state updates", done =>
  freeze(app)({
    init(state, actions) {
      expect(state).toEqual({
        value: 0
      })

      expect(actions.up()).toEqual({
        value: 1
      })

      done()
    },
    state: {
      value: 0
    },
    actions: {
      up: state => ({
        value: state.value + 1
      })
    }
  }))
