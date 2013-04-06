class window.SuperDuperShape extends Surface

  getRange: ->
    minPhi: -Math.PI / 2 * @settings.c2
    maxPhi: Math.PI / 2 * @settings.c2
    minTheta: -Math.PI * @settings.c1
    maxTheta: Math.PI * @settings.c1

  defaultSettings:
    t1: 0
    d1: 0
    m1: 6
    n11: 8
    n12: 15
    n13: 30
    t2: 0
    d2: 0
    m2: 4
    n21: 12
    n22: 10
    n23: 10
    c1: 2
    c2: 4
    c3: 1

  preCalculateLookUps: (lookUpPhi, lookUpTheta) ->

    @sinTheta = lookUpTheta(Math.sin)
    @cosTheta = lookUpTheta (Math.cos)

    @theta = lookUpTheta()
    @phi = lookUpPhi()

    preset1 = {
      m: @settings.m1
      n1: @settings.n11
      n2: @settings.n12
      n3: @settings.n13
    }

    preset2 = {
      m: @settings.m2
      n1: @settings.n21
      n2: @settings.n22
      n3: @settings.n23
    }

    @r1 = lookUpTheta(@superFormular, preset1)
    @r2 = lookUpPhi(@superFormular, preset2)

    @d1 = lookUpTheta(@powerMultiply, {c: @settings.c1, d: @settings.d1})
    @d2 = lookUpTheta(@powerMultiply, {c: @settings.c2, d: @settings.d2})

    @t2 = lookUpTheta(@multiply, @settings.t2 * @settings.c2)
    @t2c = Math.pow(@settings.c2, @settings.d2) * @settings.t2 * @settings.c2 / 2


  superFormular: (angle, preset) ->
    s1 = Math.pow(Math.abs(Math.cos(preset.m * angle / 4)), preset.n2)
    s2 = Math.pow(Math.abs(Math.sin(preset.m * angle / 4)), preset.n3)
    Math.pow(s1 + s2, -1 / preset.n1)

  calcVertex: (phi, theta) ->
    v2 = @phi[phi] + @settings.c3 * @theta[theta]
    a = @r1[theta] * (@settings.t1 + @d1[theta] * @r2[phi] * Math.cos(v2))

    new @Vector3(
      a * @sinTheta[theta],
      a * @cosTheta[theta],
      @d2[theta] * (@r2[phi] * Math.sin(v2) - @t2[theta]) + @t2c
    )