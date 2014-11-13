describe 'Twinky', ->
  it 'should be defined', ->
    expect(Twinky).toBeDefined()

  it 'should have a send method', ->
    expect(Twinky.send).toBeDefined()

  it 'should have a endpoint method', ->
    expect(Twinky.endpoint).toBeDefined()

describe 'send', ->
  server = null

  beforeEach ->
    server = sinon.fakeServer.create()
    server.autoRespond = true
    Twinky.endpoint( 'http://stats.example.com/db/big-metric/series' )

  afterEach ->
    server.restore()

  it 'should send a request', ->
    Twinky.send()

    expect(server.requests.length).toBe(1)

  it 'sends the correct datapoints', ->
    window.performance = { timing: { navigationStart: 10000000, domInteractive: 10000777, domLoading: 10000333 } }
    Twinky.send({page: 'foo', version: '789f0'})

    expect(server.requests[0].requestBody).toEqual(
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

