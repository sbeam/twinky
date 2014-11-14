describe 'Twinky', ->
  it 'should be defined', ->
    expect(Twinky).toBeDefined()

  it 'should have a send method', ->
    expect(Twinky.send).toBeDefined()

  it 'should have a endpoint method', ->
    expect(Twinky.endpoint).toBeDefined()

describe 'send', =>

  beforeEach ->
    @xhr = sinon.useFakeXMLHttpRequest()
    @xhr.requests = []
    @xhr.onCreate =  (xhr)=>
        @xhr.requests.push(xhr)

  afterEach ->
    @xhr.restore()

  it 'should log error when send() is called without an endpoint', ->
    consoleSpy = sinon.stub(console, 'error').returns(null)
    Twinky.send()
    expect(consoleSpy.called).toBeTruthy()

  it 'should send a request', ->
    Twinky.endpoint( 'http://stats.example.com/db/big-metric/series' )
    Twinky.send()

    expect(@xhr.requests.length).toBe(1)
    expect(@xhr.requests[0].url).toEqual 'http://stats.example.com/db/big-metric/series'
    expect(@xhr.requests[0].method).toEqual 'POST'

  it 'sends the correct datapoints', ->
    window.performance = { timing: { navigationStart: 10000000, domInteractive: 10000777, domLoading: 10000333 } }
    Twinky.endpoint( 'http://stats.example.com/db/big-metric/series' )
    Twinky.send({page: 'foo', version: '789f0'})

    expect(@xhr.requests[0].requestBody).toEqual(
        JSON.stringify(
            [
                {
                    "name": "domLoading",
                    "columns": ["value","page","version"],
                    "points": [[333,"foo",'789f0']]
                },
                {
                    "name": "domInteractive",
                    "columns": ["value","page","version"],
                    "points": [[444,"foo",'789f0']]
                },
            ]
        )
    )

