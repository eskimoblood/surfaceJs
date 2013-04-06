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
    return (calculateValue, param) ->
      range = min + (max - min)
      stepSize = range / (steps - 1);

      for i in [0..steps] by 1
        value = stepSize * i;
        if calculateValue then calculateValue(value, param) else value

  powerMultiply: (angle, param) ->
    Math.pow(angle * param.c, param.d)

  multiply: (angle, factors) ->
    angle * factors

  multiplyFunc: (f) ->
    (angle, factor) -> f(angle * factor)

  addFunc: (f) ->
    (angle, factor) -> f(angle + factor)

  cosH: (angle) ->
    (Math.exp(angle) + Math.exp(-angle)) / 2

  getGeometry: ->
    @createGeometry @calc()

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
    geometry = new THREE.Geometry();
    geometry.dynamic = true;
    geometry.vertices = g.vertices;
    geometry.faces = g.faces;
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    geometry

  calcFace: (phi, theta) ->
    a = phi * @settings.thetaSteps + theta;
    b = a + 1;
    c = (phi + 1) * @settings.thetaSteps + theta ;
    d = c + 1;
    new @Face4(a, c, d,b);

  setDefaults: ->

    setDefault = (key) =>
      !@settings[key]? and @settings[key] = @defaultSettings[key]

    setDefault setting for setting of @defaultSettings
    null