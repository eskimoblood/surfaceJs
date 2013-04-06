class window.EnnepersSurface extends Surface

  getRange: ->
    minPhi: -2
    maxPhi: 2
    minTheta: -2
    maxTheta: 2

  preCalculateLookUps: (lookUpPhi, lookUpTheta) ->
    @identityTheta = lookUpTheta()
    @identityPhi = lookUpPhi()

    @sqTheta = lookUpTheta(Math.pow, 2);
    @sqPhi = lookUpPhi(Math.pow, 2);

    @pow3Theta = lookUpTheta(Math.pow, 3);
    @pow3Phi = lookUpPhi(Math.pow, 3);

  calcVertex: (phi, theta) ->
    new @Vector3(
      @identityPhi[phi] * (1 + @sqTheta[theta]) - @pow3Phi[phi] / 3,
      @identityTheta[theta] * (1 + @sqPhi[phi]) - @pow3Theta[theta] / 3,
      @sqPhi[phi] * @sqTheta[theta]
    )