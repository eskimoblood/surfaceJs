class window.Horn extends Surface

  getRange: ->
    minPhi: 0
    maxPhi: 2 * Math.PI
    minTheta: 0
    maxTheta: 1

  preCalculateLookUps: (lookUpPhi, lookUpTheta) ->
    @identityTheta = lookUpTheta()
    @sinPhi = lookUpPhi(Math.sin)
    @cosPhi = lookUpPhi(Math.cos)
    @sinThetaMultiply = lookUpTheta(@multiplyFunc(Math.sin), Math.PI * 2);
    @cosThetaMultiply = lookUpTheta(@multiplyFunc(Math.cos), Math.PI * 2);

  calcVertex: (phi, theta) ->
    new @Vector3(
      (2 + @identityTheta[theta] * @cosPhi[phi]) * @sinThetaMultiply[theta],
      (2 + @identityTheta[theta] * @cosPhi[phi]) * @cosThetaMultiply[theta] + 2 * @identityTheta[theta],
      @identityTheta[theta] * @sinPhi[phi]
    )