class window.MoebiusStrip extends Surface

  getRange: ->
    minPhi: -1
    maxPhi: 1
    minTheta: 0
    maxTheta: Math.PI * 2

  preCalculateLookUps: (lookUpPhi, lookUpTheta) ->
    @sinTheta = lookUpTheta(Math.sin)
    @cosTheta = lookUpTheta(Math.cos)
    @sinThetaMultiply = lookUpTheta(@multiplyFunc(Math.sin), .5)
    @cosThetaMultiply = lookUpTheta(@multiplyFunc(Math.cos), .5)
    @identityPhi = lookUpPhi()

  calcVertex: (phi, theta) ->
    new @Vector3(
      @cosTheta[theta] + (@identityPhi[phi] * @cosThetaMultiply[theta]),
      @sinTheta[theta] + (@identityPhi[phi] * @sinThetaMultiply[theta]),
      @identityPhi[phi] * @sinThetaMultiply[theta]
    )