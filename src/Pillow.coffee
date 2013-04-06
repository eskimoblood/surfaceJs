class window.Pillow extends Surface

  getRange: ->
    minPhi: -Math.PI
    maxPhi: Math.PI
    minTheta:  -Math.PI
    maxTheta: Math.PI

  preCalculateLookUps: (lookUpPhi, lookUpTheta) ->
    @sinTheta = lookUpTheta(Math.sin)
    @cosTheta = lookUpTheta(Math.cos)
    @sinPhi = lookUpPhi(Math.sin)
    @cosPhi = lookUpPhi(Math.cos)

  calcVertex: (phi, theta) ->
    new @Vector3(
      @cosTheta[theta],
      @cosPhi[phi],
      @sinTheta[theta] * @sinPhi[phi]
    )