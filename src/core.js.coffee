define ['exports'], (exports) ->

  exports.Caramal = {}

  exports.Caramal.log = (args...) ->

    if exports.Caramal.debug?
      console.log.apply(@, args)

  exports.Caramal