/**
 * @jest-environment jsdom
 */
import { app, h } from "hyperapp";
import freeze from "../src";

const createMutatingAppDispatch = (props = {}) =>
  app({
    init: {
      counter: 0,
      canDelete: false,
      child: {
        isFrozen: true,
        canDelete: false
      }
    },
    ...props
  });

const makeGetState = dispatch => () =>
  new Promise(resolve =>
    dispatch(state => {
      resolve(state);
      return state;
    })
  );

const Mutate = state => {
  state.counter++;
  state.canAdd = true;
  delete state.canDelete;

  state.child.isFrozen = false;
  state.child.canAdd = true;
  delete state.child.canDelete;
  return state;
};

const UpBy = (state, by) => ({ ...state, value: state.value + by });

it("is needed because Hyperapp allows state mutations", async () => {
  const dispatch = createMutatingAppDispatch();
  const getState = makeGetState(dispatch);
  dispatch(Mutate);
  expect(await getState()).toEqual({
    counter: 1,
    canAdd: true,
    child: {
      isFrozen: false,
      canAdd: true
    }
  });
});

it("prevents Hyperapp state mutations", async () => {
  const dispatch = createMutatingAppDispatch({ dispatch: freeze });
  const getState = makeGetState(dispatch);
  const state = await getState();
  expect(() => (state.canAdd = true)).toThrowError(/add property/);
  expect(() => delete state.canDelete).toThrowError(/delete property/);
  expect(() => state.counter++).toThrowError(/assign to read only property/);
});

it("prevents Hyperapp state mutations in actions", async () => {
  const dispatch = createMutatingAppDispatch({ dispatch: freeze });
  const getState = makeGetState(dispatch);
  expect(() => dispatch(Mutate)).toThrowError(/assign to read only property/);
  expect(await getState()).toEqual({
    counter: 0,
    canDelete: false,

    child: {
      isFrozen: true,
      canDelete: false
    }
  });
});

it("prevents Hyperapp state mutations in view", done => {
  createMutatingAppDispatch({
    dispatch: freeze,
    view: state => {
      expect(() => (state.canAdd = true)).toThrowError(/add property/);
      expect(() => delete state.canDelete).toThrowError(/delete property/);
      expect(() => state.counter++).toThrowError(
        /assign to read only property/
      );
      done();
      return h("div", {});
    },
    node: document.body
  });
});

it("doesn't interfere with immutable state updates", async () => {
  const dispatch = app({ init: { value: 0 }, dispatch: freeze });
  const getState = makeGetState(dispatch);
  expect(await getState()).toEqual({ value: 0 });
  dispatch(UpBy, 2);
  expect(await getState()).toEqual({ value: 2 });
  dispatch([UpBy, 3]);
  expect(await getState()).toEqual({ value: 5 });
  const frozenState = await getState();
  expect(() => frozenState.value++).toThrowError(
    /assign to read only property/
  );
});
