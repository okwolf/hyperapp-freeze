import deepFreeze from "deep-freeze"

export default function(app) {
  return function(props) {
    function enhanceActions(actions) {
      return Object.keys(actions || {}).reduce(function(otherActions, name) {
        var action = actions[name]
        otherActions[name] =
          typeof action === "function"
            ? function(data) {
              return function(state) {
                return function(actions) {
                  deepFreeze(state)
                  var result = action(data)
                  result = typeof result === "function" ? result(state) : result
                  result = typeof result === "function" ? result(actions) : result
                  return result
                }
              }
            }
            : enhanceActions(action)
        return otherActions
      }, {})
    }

    props.actions = enhanceActions(props.actions)
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
