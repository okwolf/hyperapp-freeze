import deepFreeze from "deep-freeze"

var isFn = function(value) {
  return typeof value === "function"
}

function enhanceActions(actionsTemplate) {
  return Object.keys(actionsTemplate || {}).reduce(function(
    otherActions,
    name
  ) {
    var action = actionsTemplate[name]
    otherActions[name] = isFn(action)
      ? function(data) {
          return function(state, actions) {
            deepFreeze(state)
            var result = action(data)
            result = isFn(result) ? result(state, actions) : result
            return result
          }
        }
      : enhanceActions(action)
    return otherActions
  },
  {})
}

export default function(app) {
  return function(initialState, actionsTemplate, view, container) {
    var enhancedActions = enhanceActions(actionsTemplate)
    var enhancedView = isFn(view)
      ? function(state) {
          deepFreeze(state)
          return view.apply(null, arguments)
        }
      : undefined

    var appActions = app(initialState, enhancedActions, enhancedView, container)
    return appActions
  }
}
