define(['main'], function() {
	describe("io", function() {

		it ("can respond to connect method", function(){
			expect(Client.io.connect).toBeDefined();
		})

		it ("can have Bab Class", function() {
			expect(Client.Bar).toBeDefined();
		})

		it ("can open io connect", function() {
			var socket = Client.io.connect('http://localhost');
			expect(socket).not.toBe(null);
		})
	})	
})
