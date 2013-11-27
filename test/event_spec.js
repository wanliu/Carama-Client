define(['event'], function(Event){
  var event = new Event


  describe("Event", function(){

    it ("add listener", function(done){
      event.addEventListener('message', function(msg){
        msg.should.eql('hi')
        done();
      });

      event.emit('message', 'hi', done)

    });

    it ("remove listener", function() {

      var bind_func = function(msg){
        console.log(msg)
      };

      event.addEventListener('remove_message', bind_func)

      var listeners = event._listeners['remove_message'],
        old_length = listeners.length;

      event.removeEventListener('remove_message', bind_func)

      listeners.length.should.be.below(old_length);
    });

    it ("call callback with context", function(done) {

      data = {
        msg: 'hi'
      }

      event.addEventListener('with_context', function() {
        this.msg.should.eql('hi');
        done();
      }, data);


      event.emit('with_context', 'hi')
    });

    it ("call callback with context use on", function(done) {

      data = {
        msg: 'hi'
      }

      event.on('with_context', function() {
        this.msg.should.eql('hi');
        done();
      }, data);


      event.emit('with_context', 'hi')
    });

  });

});