class window.MoebiusStrip extends Surface

  getRange: ->
    minPhi: -.4
    maxPhi: .4
    minTheta: 0
    maxTheta: Math.PI * 2

  preCalculateLookUps: (lookUpPhi, lookUpTheta) ->
    @sinTheta = lookUpTheta(Math.sin)
    @cosTheta = lookUpTheta(Math.cos)
    @sinThetaMultiply = lookUpTheta(@multiplyFunc(Math.sin), 0.5)
    @cosThetaMultiply = lookUpTheta(@multiplyFunc(Math.cos), 0.5)
    @identityPhi = lookUpPhi(@multiply, 1)

  calcVertex: (phi, theta) ->
    new @Vector3(
      @cosTheta[theta] * (1 + @identityPhi[phi] * @cosThetaMultiply[theta]),
      @sinTheta[theta] + (1 + @identityPhi[phi] * @cosThetaMultiply[theta]),
      @identityPhi[phi] * @sinThetaMultiply[theta]
    )