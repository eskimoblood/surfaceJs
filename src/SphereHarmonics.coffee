class window.SphereHarmonics extends Surface

  getRange: ->
    minPhi: 0
    maxPhi: Math.PI
    minTheta: 0
    maxTheta: 2 * Math.PI

  defaultSettings:
    m0: 10
    m1: 10
    m2: 0
    m3: 5
    m4: 5
    m5: 40
    m6: 0
    m7: 0

  r: (angle, settings)->
    Math.pow(Math.sin(settings[0] * angle), settings[1]) + Math.pow(Math.cos(settings[2] * angle), settings[3])

  preCalculateLookUps: (lookUpPhi, lookUpTheta) ->
    @sinTheta = lookUpTheta(Math.sin)
    @cosTheta = lookUpTheta(Math.cos)
    @sinPhi = lookUpPhi(Math.sin)
    @cosPhi = lookUpPhi(Math.cos)
    @r1 = lookUpPhi(@r, [@settings.m0, @settings.m1, @settings.m2, @settings.m3])
    @r2 = lookUpTheta(@r, [@settings.m4, @settings.m5, @settings.m6, @settings.m7])


  calcVertex: (phi, theta) ->
    new @Vector3(
      (@r1[phi] + @r2[theta]) * @sinPhi[phi] * @cosTheta[theta],
      (@r1[phi] + @r2[theta]) * @cosPhi[phi],
      (@r1[phi] + @r2[theta]) * @sinPhi[phi] * @sinTheta[theta]
    )