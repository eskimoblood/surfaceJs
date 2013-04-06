class window.DoubleCone extends Surface

  getRange: ->
    minPhi: 0
    maxPhi: Math.PI * 2
    minTheta: -1
    maxTheta: 1

  preCalculateLookUps: (lookUpPhi, lookUpTheta) ->
    @identyTheta = lookUpTheta()
    @cosPhi = lookUpPhi(Math.cos)
    @cosPhiAdd = lookUpPhi(@addFunc(Math.cos), Math.PI * 2 / 3);
    @cosPhiSubtract = lookUpPhi(@addFunc(Math.cos), -Math.PI * 2 / 3);

  calcVertex: (phi, theta) ->
    new @Vector3(
      @identyTheta[theta] * @cosPhi[phi],
      (@identyTheta[theta] - 1) * @cosPhiAdd[phi];
      (1 - @identyTheta[theta]) * @cosPhiSubtract[phi]
    )