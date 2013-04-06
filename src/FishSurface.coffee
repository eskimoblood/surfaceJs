class window.FishSurface extends Surface

  getRange: ->
    minPhi: 0
    maxPhi: 2 * Math.PI
    minTheta: 0
    maxTheta: Math.PI

  preCalculateLookUps: (lookUpPhi, lookUpTheta) ->
    @sinPhi = lookUpPhi(Math.sin)
    @cosPhi = lookUpPhi(Math.cos)

    @sinTheta = lookUpTheta(Math.sin)
    @cosTheta = lookUpTheta(Math.cos)

    @sinThetaMultiply = lookUpTheta(@multiplyFunc(Math.sin), 2);
    @cosThetaMultiply = lookUpTheta(@multiplyFunc(Math.cos), 2);

  calcVertex: (phi, theta) ->
    new @Vector3(
      (@cosTheta[theta] - @cosThetaMultiply[theta]) * @cosPhi[phi] / 4,
      (@sinTheta[theta] - @sinThetaMultiply[theta]) * @sinPhi[phi] / 4,
      @cosTheta[theta]
    )