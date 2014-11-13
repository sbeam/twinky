Twinky = ->
  EVENTS = ['navigationStart', 'redirectStart', 'redirectEnd', 'fetchStart', 'domainLookupStart', 'domainLookupEnd', \
            'connectStart', 'connectEnd', 'secureConnectionStart', 'requestStart', 'responseStart', 'responseEnd', \
            'domLoading', 'domInteractive', 'domContentLoadedEventStart', 'domContentLoadedEventEnd', \
            'domComplete', 'loadEventStart', 'loadEventEnd']

  corsSupported = ->
      (window.XMLHttpRequest and (window.XMLHttpRequest.defake or 'withCredentials' of new window.XMLHttpRequest()))

  xhrRequest = ->
      if corsSupported()
        new window.XMLHttpRequest
      else if window.XDomainRequest?
        new window.XDomainRequest # CORS support for IE9

  timings = ->
      deltas = {}
      if window.performance?.timing?
          for event in EVENTS
              if typeof window.performance.timing[event] is 'number' and window.performance.timing[event] > 0
                  if typeof lastEvent != 'undefined'
                      deltas[event] = (window.performance.timing[event] - window.performance.timing[lastEvent])
                  lastEvent = event

      deltas

  columnize = (metrics, tags)->
      columns = ['value']
      columns.push tag for tag of tags
      data_points = []
      for name, value of metrics
          points = [value]
          points.push tags[tag] for tag of tags
          data_points.push { name: name, columns: columns, points: points }

      data_points

  influxdb_api_endpoint = null

  @send = (tags)->
    if typeof influxdb_api_endpoint is 'undefined'
        console?.error 'Twinky: Not sending. You must call Twinky.endpoint() with the InfluxDB URL'
        return

    if document.readyState in ['uninitialized', 'loading']      # The data isn't fully ready until document load
        window.addEventListener? 'load', =>
            setTimeout =>
                send.call(@)
            , 500
        , false

        return false

    req = xhrRequest()
    req.open 'POST', influxdb_api_endpoint, true

    req.setRequestHeader 'Content-Type', 'application/javascript'

    req.send columnize(timings(), tags)

  @endpoint = (url) ->
    influxdb_api_endpoint = url

  @




@Twinky = new Twinky()
