define ['exports'], (exports) ->
	class MessageBuffer
		constructor: () ->
			@signal_lamp = new SignalLamb()
			@disk = new MessageDisk()
			@buffer = new Buffer()
			# @getUnread()

		setUnreadCount: (count) ->
			@unReadCount = count
			@signal_lamp.addCount(@unReadCount)
			@buffer.fetch()

	class SignalLamb
		constractor: (options) ->
			_.extend(@, options)
			@state = 'on'
			@count = 0

		turnOn: () ->
			@state = 'on'

		turnOff: () ->
			@state = 'off'
			@count = 0

		isLight: () ->
			@state is 'on'

		bindShow: (showCount) ->
			@showCount = showCount if typeof(showCount) is 'function'

		addCount: (count) ->
			if @isLight
				@count += count
				@showCount(@count) if @showCounts

	class MessageDisk
		constructor: () ->
			@messages = {}
			@msgTimes = []

		addMessages: (messages) ->
			for msg in messages
				@messages[msg.time] = msg
				@msgTimes.push(msg.time)

	class Buffer
		constructor: () ->
			@messages = []
			@historyFetchedCount = 0
			@fetchLength = 25
			@fetchFlag = false
			# @allFitched = true

		setHistoryUnreadCount: (historyUnreadCount) ->
			@historyUnreadCount = historyUnreadCount
			# @allFitched = false if @historyUnreadCount > @historyFetchedCount

		setFetchLength: (length) ->
			@fetchLength = length if length > 0

		fetch: () ->
			if messages.length < @fetchLength
				@fetchFlag = false

		drain: () ->
			@return = @messages
			@messages = []
			@fetchHistory if @fetchFlag
			@return