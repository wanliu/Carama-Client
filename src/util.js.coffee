define ['exports'], (exports) ->

  exports.isFunc = (object) ->
    typeof object == 'function'

  exports.isObject = (object) ->
    # 判断是否非window和DOM对象的对象，
    if !obj || obj.toString() != "[object Object]" || obj.nodeType || obj.setInterval
      return false

    # constructor是对创建对象的函数的引用（指针）。对于 Object 对象，该指针指向原始的 Object() 函数
    # 判断obj是否具有isPrototypeOf属性，isPrototypeOf是挂在Object.prototype上的。通过字面量或自定义类（构造器）创建的对象都会继承该属性方法
    if obj.constructor && !obj.hasOwnProperty("constructor") && !obj.constructor.prototype.hasOwnProperty("isPrototypeOf")
      return false

    for key in obj
      ;

    return key == undefined || obj.hasOwnProperty(key)

  exports.generateId = () ->
    Math.abs(Math.random() * Math.random() * Date.now() | 0).toString()
    + Math.abs(Math.random() * Math.random() * Date.now() | 0).toString()

  exports.merge = (target, other) ->
    for k, value of other
      if exports.isObject(value)
        target[v] = {}
        target[v] = exports.merge(target[v], value)
      else
        target[k] = value

    target

  exports.contain = (list, member) ->

    for e in list
      return true if e == memeber

    false

  exports.classify = (klass_string) ->

  class String

    toTitleCase: () ->
      str.replace /\w\S*/g, (txt) ->
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()


