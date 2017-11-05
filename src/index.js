import deepFreeze from "deep-freeze"

export default function(app) {
  return function(props) {
    function enhanceActions(actions) {
      return Object.keys(actions || {}).reduce(function(otherActions, name) {
        var action = actions[name]
        otherActions[name] =
          typeof action === "function"
            ? function(state, actions) {
                deepFreeze(state)
                return action(state, actions)
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
      props.view = function(state) {
        deepFreeze(state)
        return originalView.apply(null, arguments)
      }
    }
    var appActions = app(props)

    return appActions
  }
}
