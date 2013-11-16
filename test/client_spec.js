define(['socket.io', 'caramal', 'chat/manager'], function(io, Caramal){
	var url = 'http://localhost:5001',
		options ={
		  // transports: ['websocket'],
		  'force new connection': true
		},
		client = Caramal.connect(url, options);


	// Caramal.MessageManager.setClient(client);

	// describe("io", function() {

	// 	it ("defined CaramalClient", function(){
	// 		expect(Caramal.Client).toBeDefined();
	// 	});

	// 	// it ("can respond to connect method", function(done){
	// 	// 	client.on('connect', function(client) {
	// 	// 		expect(client).toBeDefined();
	// 	// 		done();
	// 	// 	});
	// 	// });

	// 	it ("can respond to subscribe method", function(done){
	// 		expect(client.subscribe).toEqual(jasmine.any(Function));
	// 	});

	// 	it ("can respond to unsubscribe method", function(done){
	// 		expect(client.unsubscribe).toEqual(jasmine.any(Function));
	// 	});

	// 	it ("can respond to emit method", function(done){
	// 		expect(client.emit).toEqual(jasmine.any(Function));
	// 	});

	// });

	describe("io send", function() {
		it ("send message", function(done){
			client = Caramal.connect(url, options);
			// var cli = Caramal.connect(url, options);
			Caramal.MessageManager.setClient(client);
			client.on('connect', function(){
				client.emit('message', JSON.stringify({action: 'join', room: 'test'}));
				setTimeout(function(){
					done()}, 1000);
			})

		});
	});

})
