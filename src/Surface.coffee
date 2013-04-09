class window.Surface

  constructor: (@settings) ->
    @setDefaults()
    range = @getRange()
    lookUpPhi = @lookUp(@settings.phiSteps, range.minPhi, range.maxPhi)
    lookUpTheta = @lookUp(@settings.thetaSteps, range.minTheta, range.maxTheta)
    @preCalculateLookUps(lookUpPhi, lookUpTheta)


  Vector3: THREE.Vector3
  Face4: THREE.Face4

  lookUp: (steps, min, max) ->
    range = min + (max - min)
    stepSize = range / (steps - 1);
    return (calculateValue, param) ->
      for i in [0..steps] by 1
        value = stepSize * i;
        if calculateValue then calculateValue(value, param) else value

  powerMultiply: (angle, param) -> Math.pow(angle * param.c, param.d)

  multiply: (angle, factors) -> angle * factors

  multiplyFunc: (f) -> (angle, factor) -> f(angle * factor)

  addFunc: (f) -> (angle, factor) -> f(angle + factor)

  cosH: (angle) -> (Math.exp(angle) + Math.exp(-angle)) / 2

  getGeometry: -> @createGeometry @calc()

  calc: ->
    vertices = []
    faces = []
    for i in [0..@.settings.phiSteps - 1] by 1
      for j in [0..@.settings.thetaSteps - 1] by 1
        vertices.push(@calcVertex(i, j))
        if i < @.settings.phiSteps - 1 and j < @.settings.thetaSteps - 1
          faces.push(@calcFace(i, j))
    {
    vertices: vertices
    faces: faces
    }

  createGeometry: (g)->
    geometry = new THREE.Geometry()
    geometry.dynamic = true
    geometry.vertices = g.vertices
    geometry.faces = g.faces
    geometry.vertexColors = g.colors
    geometry.colors = g.colors
    geometry.colorsNeedUpdate = true
    geometry.computeFaceNormals()
    geometry.computeVertexNormals()
    geometry

  calcFace: (phi, theta) ->
    a = phi * @settings.thetaSteps + theta;
    b = a + 1;
    c = (phi + 1) * @settings.thetaSteps + theta;
    d = c + 1;
    ca = @colorsBetween(@settings.colors, phi / @settings.phiSteps)
    cb = @colorsBetween(@settings.colors, (phi + 1) / @settings.phiSteps)
    face = new @Face4(a, c, d, b)
    face.vertexColors = [ca, cb, cb, ca]
    face


  setDefaults: ->

    setDefault = (key) =>
      !@settings[key]? and @settings[key] = @defaultSettings[key]

    setDefault setting for setting of @defaultSettings
    null

  calcColorArray: (colors, stepSize) ->
    for i in [0..stepSize]
      @colorsBetween(colors, i / stepSize)

  colorBetween: (startColor, endColor, step) ->
    c = @calcColor(startColor, endColor, step)
    new THREE.Color(c(24) + c(16) + c(8) + c(0))

  calcColor: (startColor, endColor, step) ->
    (bit) ->
      start = startColor >> bit & 0xFF
      end = endColor >> bit & 0xFF
      (start + (end - start) * step) << bit

  colorsBetween: (colors, step) ->
    if (step <= 0)
      colors[0];

    length = colors.length
    if (step >= 1)
      colors[length - 1]

    a =  Math.floor(length * step)
    f = 1 / length
    newStep = (step - (a * f)) / f;
    nextA = a + 1;
    if (nextA >= length)
      nextA = 0;
    @colorBetween(colors[a], colors[nextA], newStep);