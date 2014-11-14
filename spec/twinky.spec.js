(function() {
  describe('Twinky', function() {
    it('should be defined', function() {
      return expect(Twinky).toBeDefined();
    });
    it('should have a send method', function() {
      return expect(Twinky.send).toBeDefined();
    });
    return it('should have a endpoint method', function() {
      return expect(Twinky.endpoint).toBeDefined();
    });
  });

  describe('send', function() {
    var server;
    server = null;
    beforeEach(function() {
      server = sinon.fakeServer.create();
      return server.autoRespond = true;
    });
    afterEach(function() {
      return server.restore();
    });
    it('should error without an endpoint', function() {
      var consoleSpy;
      consoleSpy = sinon.stub(console, 'error').returns(null);
      Twinky.send();
      return expect(consoleSpy.called).toBeTruthy();
    });
    it('should send a request', function() {
      Twinky.endpoint('http://stats.example.com/db/big-metric/series');
      Twinky.send();
      return expect(server.requests.length).toBe(1);
    });
    return it('sends the correct datapoints', function() {
      window.performance = {
        timing: {
          navigationStart: 10000000,
          domInteractive: 10000777,
          domLoading: 10000333
        }
      };
      Twinky.endpoint('http://stats.example.com/db/big-metric/series');
      Twinky.send({
        page: 'foo',
        version: '789f0'
      });
      return expect(server.requests[0].requestBody).toEqual(JSON.stringify([
        {
          "name": "domLoading",
          "columns": ["value", "page", "version"],
          "points": [[333, "foo", '789f0']]
        }, {
          "name": "domInteractive",
          "columns": ["value", "page", "version"],
          "points": [[444, "foo", '789f0']]
        }
      ]));
    });
  });

}).call(this);
