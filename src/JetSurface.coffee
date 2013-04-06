class window.JetSurface extends Surface

  getRange: ->
    minPhi: 0
    maxPhi: 2 * Math.PI
    minTheta: 0
    maxTheta: Math.PI

  preCalculateLookUps: (lookUpPhi, lookUpTheta) ->
    @sinTheta = lookUpTheta(Math.sin)
    @coshTheta = lookUpTheta(@cosH)
    @sinPhi = lookUpPhi(Math.sin)
    @cosPhi = lookUpPhi(Math.cos)

  calcVertex: (phi, theta) ->
    new @Vector3(
      (1 - @coshTheta[theta]) * @sinTheta[theta]* @cosPhi[phi] / 2,
      50 *(1 - @coshTheta[theta]) * @sinTheta[theta] * @sinPhi[phi] / 2,
      @coshTheta[theta]
    )