define ['exports'], (exports) ->

  exports.Caramal = {}

  exports.Caramal.log = (args...) ->

    if exports.Caramal.debug?
      if args.length > 5
        console.log(args[0], args[1], args[2], args[3], args[4], args[5])
      else if args.length > 4
        console.log(args[0], args[1], args[2], args[3], args[4])
      else if args.length > 3
        console.log(args[0], args[1], args[2], args[3])
      else if args.length > 2
        console.log(args[0], args[1], args[2])
      else if args.length > 1
        console.log(args[0], args[1])
      else
        console.log(args[0])


  exports.Caramal