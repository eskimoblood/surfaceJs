class window.Sphere extends Surface

  getRange: ->
    minPhi: 0
    maxPhi: 2 * Math.PI
    minTheta: 0
    maxTheta: Math.PI

  preCalculateLookUps: (lookUpPhi, lookUpTheta) ->
    @sinTheta = lookUpTheta(Math.sin)
    @cosTheta = lookUpTheta(Math.cos)
    @sinPhi = lookUpPhi(Math.sin)
    @cosPhi = lookUpPhi(Math.cos)

  calcVertex: (phi, theta) ->
    new @Vector3(
      @sinTheta[theta] * @cosPhi[phi],
      @sinTheta[theta] * @sinPhi[phi],
      @cosTheta[theta]
    )