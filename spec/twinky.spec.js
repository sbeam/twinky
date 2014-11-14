(function() {
  var _this = this;

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
    beforeEach(function() {
      var _this = this;
      this.xhr = sinon.useFakeXMLHttpRequest();
      this.xhr.requests = [];
      return this.xhr.onCreate = function(xhr) {
        return _this.xhr.requests.push(xhr);
      };
    });
    afterEach(function() {
      return this.xhr.restore();
    });
    it('should log error when send() is called without an endpoint', function() {
      var consoleSpy;
      consoleSpy = sinon.stub(console, 'error').returns(null);
      Twinky.send();
      return expect(consoleSpy.called).toBeTruthy();
    });
    it('should send a request', function() {
      Twinky.endpoint('http://stats.example.com/db/big-metric/series');
      Twinky.send();
      expect(this.xhr.requests.length).toBe(1);
      expect(this.xhr.requests[0].url).toEqual('http://stats.example.com/db/big-metric/series');
      return expect(this.xhr.requests[0].method).toEqual('POST');
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
      return expect(this.xhr.requests[0].requestBody).toEqual(JSON.stringify([
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
