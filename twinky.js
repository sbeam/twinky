(function() {
  var Twinky;

  Twinky = function() {
    var EVENTS, columnize, corsSupported, influxdb_api_endpoint, timings, xhrRequest;
    EVENTS = ['navigationStart', 'redirectStart', 'redirectEnd', 'fetchStart', 'domainLookupStart', 'domainLookupEnd', 'connectStart', 'connectEnd', 'secureConnectionStart', 'requestStart', 'responseStart', 'responseEnd', 'domLoading', 'domInteractive', 'domContentLoadedEventStart', 'domContentLoadedEventEnd', 'domComplete', 'loadEventStart', 'loadEventEnd'];
    corsSupported = function() {
      return window.XMLHttpRequest && (window.XMLHttpRequest.defake || 'withCredentials' in new window.XMLHttpRequest());
    };
    xhrRequest = function() {
      if (corsSupported()) {
        return new window.XMLHttpRequest;
      } else if (window.XDomainRequest != null) {
        return new window.XDomainRequest;
      }
    };
    timings = function() {
      var deltas, event, lastEvent, _i, _len, _ref;
      deltas = {};
      if (((_ref = window.performance) != null ? _ref.timing : void 0) != null) {
        for (_i = 0, _len = EVENTS.length; _i < _len; _i++) {
          event = EVENTS[_i];
          if (typeof window.performance.timing[event] === 'number' && window.performance.timing[event] > 0) {
            if (typeof lastEvent !== 'undefined') {
              deltas[event] = window.performance.timing[event] - window.performance.timing[lastEvent];
            }
            lastEvent = event;
          }
        }
      }
      return deltas;
    };
    columnize = function(metrics, tags) {
      var columns, data_points, name, points, tag, value;
      columns = ['value'];
      for (tag in tags) {
        columns.push(tag);
      }
      data_points = [];
      for (name in metrics) {
        value = metrics[name];
        points = [value];
        for (tag in tags) {
          points.push(tags[tag]);
        }
        data_points.push({
          name: name,
          columns: columns,
          points: [points]
        });
      }
      return data_points;
    };
    influxdb_api_endpoint = null;
    this.send = function(tags) {
      var req, _ref,
        _this = this;
      if (typeof influxdb_api_endpoint === 'undefined') {
        if (typeof console !== "undefined" && console !== null) {
          console.error('Twinky: Not sending. You must call Twinky.endpoint() with the InfluxDB URL');
        }
        return;
      }
      if ((_ref = document.readyState) === 'uninitialized' || _ref === 'loading') {
        if (typeof window.addEventListener === "function") {
          window.addEventListener('load', function() {
            return setTimeout(function() {
              return _this.send.call(_this, tags);
            }, 500);
          }, false);
        }
        return false;
      }
      req = xhrRequest();
      req.open('POST', influxdb_api_endpoint, true);
      req.setRequestHeader('Content-Type', 'application/javascript');
      return req.send(JSON.stringify(columnize(timings(), tags)));
    };
    this.endpoint = function(url) {
      return influxdb_api_endpoint = url;
    };
    return this;
  };

  this.Twinky = new Twinky();

}).call(this);
