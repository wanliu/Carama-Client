define ['core', 'chat/channel', 'exports'], (Caramal, Channel, exports) ->

  class Group extends Channel
    commands: [
      'open',
      'join'
    ]

    type: Channel.TYPES['group']

  exports.Group = Group






