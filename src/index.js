import deepCopy from "deepcopy"
import deepFreeze from "deep-freeze"

export default function(app) {
  function freeze(value) {
    return deepFreeze(deepCopy(value))
  }
  return function(props) {
    function enhanceActions(actions) {
      return Object.keys(actions || {}).reduce(function(otherActions, name) {
        var action = actions[name]
        otherActions[name] =
          typeof action === "function"
            ? function(state, actions, data) {
                var frozenState = freeze(state)
                var result = action(frozenState, actions, data)
                return deepCopy(result)
              }
            : enhanceActions(action)
        return otherActions
      }, {})
    }

    function enhanceModules(module) {
      module.actions = enhanceActions(module.actions)

      Object.keys(module.modules || {}).map(function(name) {
        enhanceModules(module.modules[name])
      })
    }

    enhanceModules(props)
    if (props.view) {
      var originalView = props.view
      props.view = function(state, actions) {
        var frozenState = freeze(state)
        return originalView(frozenState, actions)
      }
    }
    var appActions = app(props)

    return appActions
  }
}
