define ['exports'], (exports) ->

  exports.Caramal = {}

  exports.Caramal.log = (msg) ->

    if Caramal.debug?
      console.log(msg)

