class window.Shell extends Surface

  getRange: ->
    minPhi: 0
    maxPhi: 2 * Math.PI
    minTheta: 0
    maxTheta: 2 * Math.PI

  defaultSettings:
    innerRadius: 1
    outerRadius: 2
    height: 5
    spirals: 3

  preCalculateLookUps: (lookUpPhi, lookUpTheta) ->
    @identityTheta = lookUpTheta()
    @sinPhi = lookUpPhi(Math.sin)
    @cosPhi = lookUpPhi(Math.cos)
    @sinThetaMultiply = lookUpTheta(@multiplyFunc(Math.sin), @settings.spirals);
    @cosThetaMultiply = lookUpTheta(@multiplyFunc(Math.cos), @settings.spirals);

  calcVertex: (phi, theta) ->
    f = @settings.outerRadius * (1 - @identityTheta[theta] / Math.PI * 2)
    new @Vector3(
       f * @cosThetaMultiply[theta] * ((1 + @cosPhi[phi]) + @settings.innerRadius),
       f * @sinThetaMultiply[theta] * ((1 + @cosPhi[phi]) + @settings.innerRadius),
       @settings.height * (@identityTheta[theta] / Math.PI * 2) + f * @sinPhi[phi]
    )