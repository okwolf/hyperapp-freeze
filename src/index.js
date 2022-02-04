import deepFreeze from "deep-freeze";

export default function freeze(dispatch) {
  return function frozenDispatch(actionOrState, props) {
    if (typeof actionOrState === "object") {
      deepFreeze(actionOrState);
    }
    return dispatch(actionOrState, props);
  };
}
