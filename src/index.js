function deepFreeze(o) {
  Object.freeze(o);

  Object.getOwnPropertyNames(o).forEach(function (prop) {
    if (
      o.hasOwnProperty(prop) &&
      o[prop] !== null &&
      (typeof o[prop] === "object" || typeof o[prop] === "function") &&
      !Object.isFrozen(o[prop])
    ) {
      deepFreeze(o[prop]);
    }
  });

  return o;
}

export default function freeze(dispatch) {
  return function frozenDispatch(actionOrState, props) {
    if (typeof actionOrState === "object") {
      deepFreeze(actionOrState);
    }
    return dispatch(actionOrState, props);
  };
}
