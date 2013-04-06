(function() {
  var _ref, _ref1, _ref10, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.Surface = (function() {
    function Surface(settings) {
      var lookUpPhi, lookUpTheta, range;

      this.settings = settings;
      this.setDefaults();
      range = this.getRange();
      lookUpPhi = this.lookUp(this.settings.phiSteps, range.minPhi, range.maxPhi);
      lookUpTheta = this.lookUp(this.settings.thetaSteps, range.minTheta, range.maxTheta);
      this.preCalculateLookUps(lookUpPhi, lookUpTheta);
    }

    Surface.prototype.Vector3 = THREE.Vector3;

    Surface.prototype.Face4 = THREE.Face4;

    Surface.prototype.lookUp = function(steps, min, max) {
      return function(calculateValue, param) {
        var i, range, stepSize, value, _i, _results;

        range = min + (max - min);
        stepSize = range / (steps - 1);
        _results = [];
        for (i = _i = 0; _i <= steps; i = _i += 1) {
          value = stepSize * i;
          if (calculateValue) {
            _results.push(calculateValue(value, param));
          } else {
            _results.push(value);
          }
        }
        return _results;
      };
    };

    Surface.prototype.powerMultiply = function(angle, param) {
      return Math.pow(angle * param.c, param.d);
    };

    Surface.prototype.multiply = function(angle, factors) {
      return angle * factors;
    };

    Surface.prototype.multiplyFunc = function(f) {
      return function(angle, factor) {
        return f(angle * factor);
      };
    };

    Surface.prototype.addFunc = function(f) {
      return function(angle, factor) {
        return f(angle + factor);
      };
    };

    Surface.prototype.cosH = function(angle) {
      return (Math.exp(angle) + Math.exp(-angle)) / 2;
    };

    Surface.prototype.getGeometry = function() {
      return this.createGeometry(this.calc());
    };

    Surface.prototype.calc = function() {
      var faces, i, j, vertices, _i, _j, _ref, _ref1;

      vertices = [];
      faces = [];
      for (i = _i = 0, _ref = this.settings.phiSteps - 1; _i <= _ref; i = _i += 1) {
        for (j = _j = 0, _ref1 = this.settings.thetaSteps - 1; _j <= _ref1; j = _j += 1) {
          vertices.push(this.calcVertex(i, j));
          if (i < this.settings.phiSteps - 1 && j < this.settings.thetaSteps - 1) {
            faces.push(this.calcFace(i, j));
          }
        }
      }
      return {
        vertices: vertices,
        faces: faces
      };
    };

    Surface.prototype.createGeometry = function(g) {
      var geometry;

      geometry = new THREE.Geometry();
      geometry.dynamic = true;
      geometry.vertices = g.vertices;
      geometry.faces = g.faces;
      geometry.computeFaceNormals();
      geometry.computeVertexNormals();
      return geometry;
    };

    Surface.prototype.calcFace = function(phi, theta) {
      var a, b, c, d;

      a = phi * this.settings.thetaSteps + theta;
      b = a + 1;
      c = (phi + 1) * this.settings.thetaSteps + theta;
      d = c + 1;
      return new this.Face4(a, c, d, b);
    };

    Surface.prototype.setDefaults = function() {
      var setDefault, setting,
        _this = this;

      setDefault = function(key) {
        return (_this.settings[key] == null) && (_this.settings[key] = _this.defaultSettings[key]);
      };
      for (setting in this.defaultSettings) {
        setDefault(setting);
      }
      return null;
    };

    return Surface;

  })();

  window.DoubleCone = (function(_super) {
    __extends(DoubleCone, _super);

    function DoubleCone() {
      _ref = DoubleCone.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    DoubleCone.prototype.getRange = function() {
      return {
        minPhi: 0,
        maxPhi: Math.PI * 2,
        minTheta: -1,
        maxTheta: 1
      };
    };

    DoubleCone.prototype.preCalculateLookUps = function(lookUpPhi, lookUpTheta) {
      this.identyTheta = lookUpTheta();
      this.cosPhi = lookUpPhi(Math.cos);
      this.cosPhiAdd = lookUpPhi(this.addFunc(Math.cos), Math.PI * 2 / 3);
      return this.cosPhiSubtract = lookUpPhi(this.addFunc(Math.cos), -Math.PI * 2 / 3);
    };

    DoubleCone.prototype.calcVertex = function(phi, theta) {
      return new this.Vector3(this.identyTheta[theta] * this.cosPhi[phi], (this.identyTheta[theta] - 1) * this.cosPhiAdd[phi], (1 - this.identyTheta[theta]) * this.cosPhiSubtract[phi]);
    };

    return DoubleCone;

  })(Surface);

  window.EnnepersSurface = (function(_super) {
    __extends(EnnepersSurface, _super);

    function EnnepersSurface() {
      _ref1 = EnnepersSurface.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    EnnepersSurface.prototype.getRange = function() {
      return {
        minPhi: -2,
        maxPhi: 2,
        minTheta: -2,
        maxTheta: 2
      };
    };

    EnnepersSurface.prototype.preCalculateLookUps = function(lookUpPhi, lookUpTheta) {
      this.identityTheta = lookUpTheta();
      this.identityPhi = lookUpPhi();
      this.sqTheta = lookUpTheta(Math.pow, 2);
      this.sqPhi = lookUpPhi(Math.pow, 2);
      this.pow3Theta = lookUpTheta(Math.pow, 3);
      return this.pow3Phi = lookUpPhi(Math.pow, 3);
    };

    EnnepersSurface.prototype.calcVertex = function(phi, theta) {
      return new this.Vector3(this.identityPhi[phi] * (1 + this.sqTheta[theta]) - this.pow3Phi[phi] / 3, this.identityTheta[theta] * (1 + this.sqPhi[phi]) - this.pow3Theta[theta] / 3, this.sqPhi[phi] * this.sqTheta[theta]);
    };

    return EnnepersSurface;

  })(Surface);

  window.FishSurface = (function(_super) {
    __extends(FishSurface, _super);

    function FishSurface() {
      _ref2 = FishSurface.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    FishSurface.prototype.getRange = function() {
      return {
        minPhi: 0,
        maxPhi: 2 * Math.PI,
        minTheta: 0,
        maxTheta: Math.PI
      };
    };

    FishSurface.prototype.preCalculateLookUps = function(lookUpPhi, lookUpTheta) {
      this.sinPhi = lookUpPhi(Math.sin);
      this.cosPhi = lookUpPhi(Math.cos);
      this.sinTheta = lookUpTheta(Math.sin);
      this.cosTheta = lookUpTheta(Math.cos);
      this.sinThetaMultiply = lookUpTheta(this.multiplyFunc(Math.sin), 2);
      return this.cosThetaMultiply = lookUpTheta(this.multiplyFunc(Math.cos), 2);
    };

    FishSurface.prototype.calcVertex = function(phi, theta) {
      return new this.Vector3((this.cosTheta[theta] - this.cosThetaMultiply[theta]) * this.cosPhi[phi] / 4, (this.sinTheta[theta] - this.sinThetaMultiply[theta]) * this.sinPhi[phi] / 4, this.cosTheta[theta]);
    };

    return FishSurface;

  })(Surface);

  window.Horn = (function(_super) {
    __extends(Horn, _super);

    function Horn() {
      _ref3 = Horn.__super__.constructor.apply(this, arguments);
      return _ref3;
    }

    Horn.prototype.getRange = function() {
      return {
        minPhi: 0,
        maxPhi: 2 * Math.PI,
        minTheta: 0,
        maxTheta: 1
      };
    };

    Horn.prototype.preCalculateLookUps = function(lookUpPhi, lookUpTheta) {
      this.identityTheta = lookUpTheta();
      this.sinPhi = lookUpPhi(Math.sin);
      this.cosPhi = lookUpPhi(Math.cos);
      this.sinThetaMultiply = lookUpTheta(this.multiplyFunc(Math.sin), Math.PI * 2);
      return this.cosThetaMultiply = lookUpTheta(this.multiplyFunc(Math.cos), Math.PI * 2);
    };

    Horn.prototype.calcVertex = function(phi, theta) {
      return new this.Vector3((2 + this.identityTheta[theta] * this.cosPhi[phi]) * this.sinThetaMultiply[theta], (2 + this.identityTheta[theta] * this.cosPhi[phi]) * this.cosThetaMultiply[theta] + 2 * this.identityTheta[theta], this.identityTheta[theta] * this.sinPhi[phi]);
    };

    return Horn;

  })(Surface);

  window.JetSurface = (function(_super) {
    __extends(JetSurface, _super);

    function JetSurface() {
      _ref4 = JetSurface.__super__.constructor.apply(this, arguments);
      return _ref4;
    }

    JetSurface.prototype.getRange = function() {
      return {
        minPhi: 0,
        maxPhi: 2 * Math.PI,
        minTheta: 0,
        maxTheta: Math.PI
      };
    };

    JetSurface.prototype.preCalculateLookUps = function(lookUpPhi, lookUpTheta) {
      this.sinTheta = lookUpTheta(Math.sin);
      this.coshTheta = lookUpTheta(this.cosH);
      this.sinPhi = lookUpPhi(Math.sin);
      return this.cosPhi = lookUpPhi(Math.cos);
    };

    JetSurface.prototype.calcVertex = function(phi, theta) {
      return new this.Vector3((1 - this.coshTheta[theta]) * this.sinTheta[theta] * this.cosPhi[phi] / 2, 50 * (1 - this.coshTheta[theta]) * this.sinTheta[theta] * this.sinPhi[phi] / 2, this.coshTheta[theta]);
    };

    return JetSurface;

  })(Surface);

  window.MoebiusStrip = (function(_super) {
    __extends(MoebiusStrip, _super);

    function MoebiusStrip() {
      _ref5 = MoebiusStrip.__super__.constructor.apply(this, arguments);
      return _ref5;
    }

    MoebiusStrip.prototype.getRange = function() {
      return {
        minPhi: -1,
        maxPhi: 1,
        minTheta: 0,
        maxTheta: Math.PI * 2
      };
    };

    MoebiusStrip.prototype.preCalculateLookUps = function(lookUpPhi, lookUpTheta) {
      this.sinTheta = lookUpTheta(Math.sin);
      this.cosTheta = lookUpTheta(Math.cos);
      this.sinThetaMultiply = lookUpTheta(this.multiplyFunc(Math.sin), .5);
      this.cosThetaMultiply = lookUpTheta(this.multiplyFunc(Math.cos), .5);
      return this.identityPhi = lookUpPhi();
    };

    MoebiusStrip.prototype.calcVertex = function(phi, theta) {
      return new this.Vector3(this.cosTheta[theta] + (this.identityPhi[phi] * this.cosThetaMultiply[theta]), this.sinTheta[theta] + (this.identityPhi[phi] * this.sinThetaMultiply[theta]), this.identityPhi[phi] * this.sinThetaMultiply[theta]);
    };

    return MoebiusStrip;

  })(Surface);

  window.Pillow = (function(_super) {
    __extends(Pillow, _super);

    function Pillow() {
      _ref6 = Pillow.__super__.constructor.apply(this, arguments);
      return _ref6;
    }

    Pillow.prototype.getRange = function() {
      return {
        minPhi: -Math.PI,
        maxPhi: Math.PI,
        minTheta: -Math.PI,
        maxTheta: Math.PI
      };
    };

    Pillow.prototype.preCalculateLookUps = function(lookUpPhi, lookUpTheta) {
      this.sinTheta = lookUpTheta(Math.sin);
      this.cosTheta = lookUpTheta(Math.cos);
      this.sinPhi = lookUpPhi(Math.sin);
      return this.cosPhi = lookUpPhi(Math.cos);
    };

    Pillow.prototype.calcVertex = function(phi, theta) {
      return new this.Vector3(this.cosTheta[theta], this.cosPhi[phi], this.sinTheta[theta] * this.sinPhi[phi]);
    };

    return Pillow;

  })(Surface);

  window.Shell = (function(_super) {
    __extends(Shell, _super);

    function Shell() {
      _ref7 = Shell.__super__.constructor.apply(this, arguments);
      return _ref7;
    }

    Shell.prototype.getRange = function() {
      return {
        minPhi: 0,
        maxPhi: 2 * Math.PI,
        minTheta: 0,
        maxTheta: 2 * Math.PI
      };
    };

    Shell.prototype.defaultSettings = {
      innerRadius: 1,
      outerRadius: 2,
      height: 5,
      spirals: 3
    };

    Shell.prototype.preCalculateLookUps = function(lookUpPhi, lookUpTheta) {
      this.identityTheta = lookUpTheta();
      this.sinPhi = lookUpPhi(Math.sin);
      this.cosPhi = lookUpPhi(Math.cos);
      this.sinThetaMultiply = lookUpTheta(this.multiplyFunc(Math.sin), this.settings.spirals);
      return this.cosThetaMultiply = lookUpTheta(this.multiplyFunc(Math.cos), this.settings.spirals);
    };

    Shell.prototype.calcVertex = function(phi, theta) {
      var f;

      f = this.settings.outerRadius * (1 - this.identityTheta[theta] / Math.PI * 2);
      return new this.Vector3(f * this.cosThetaMultiply[theta] * ((1 + this.cosPhi[phi]) + this.settings.innerRadius), f * this.sinThetaMultiply[theta] * ((1 + this.cosPhi[phi]) + this.settings.innerRadius), this.settings.height * (this.identityTheta[theta] / Math.PI * 2) + f * this.sinPhi[phi]);
    };

    return Shell;

  })(Surface);

  window.Sphere = (function(_super) {
    __extends(Sphere, _super);

    function Sphere() {
      _ref8 = Sphere.__super__.constructor.apply(this, arguments);
      return _ref8;
    }

    Sphere.prototype.getRange = function() {
      return {
        minPhi: 0,
        maxPhi: 2 * Math.PI,
        minTheta: 0,
        maxTheta: Math.PI
      };
    };

    Sphere.prototype.preCalculateLookUps = function(lookUpPhi, lookUpTheta) {
      this.sinTheta = lookUpTheta(Math.sin);
      this.cosTheta = lookUpTheta(Math.cos);
      this.sinPhi = lookUpPhi(Math.sin);
      return this.cosPhi = lookUpPhi(Math.cos);
    };

    Sphere.prototype.calcVertex = function(phi, theta) {
      return new this.Vector3(this.sinTheta[theta] * this.cosPhi[phi], this.sinTheta[theta] * this.sinPhi[phi], this.cosTheta[theta]);
    };

    return Sphere;

  })(Surface);

  window.SphereHarmonics = (function(_super) {
    __extends(SphereHarmonics, _super);

    function SphereHarmonics() {
      _ref9 = SphereHarmonics.__super__.constructor.apply(this, arguments);
      return _ref9;
    }

    SphereHarmonics.prototype.getRange = function() {
      return {
        minPhi: 0,
        maxPhi: Math.PI,
        minTheta: 0,
        maxTheta: 2 * Math.PI
      };
    };

    SphereHarmonics.prototype.defaultSettings = {
      m0: 10,
      m1: 10,
      m2: 0,
      m3: 5,
      m4: 5,
      m5: 40,
      m6: 0,
      m7: 0
    };

    SphereHarmonics.prototype.r = function(angle, settings) {
      return Math.pow(Math.sin(settings[0] * angle), settings[1]) + Math.pow(Math.cos(settings[2] * angle), settings[3]);
    };

    SphereHarmonics.prototype.preCalculateLookUps = function(lookUpPhi, lookUpTheta) {
      this.sinTheta = lookUpTheta(Math.sin);
      this.cosTheta = lookUpTheta(Math.cos);
      this.sinPhi = lookUpPhi(Math.sin);
      this.cosPhi = lookUpPhi(Math.cos);
      this.r1 = lookUpPhi(this.r, [this.settings.m0, this.settings.m1, this.settings.m2, this.settings.m3]);
      return this.r2 = lookUpTheta(this.r, [this.settings.m4, this.settings.m5, this.settings.m6, this.settings.m7]);
    };

    SphereHarmonics.prototype.calcVertex = function(phi, theta) {
      return new this.Vector3((this.r1[phi] + this.r2[theta]) * this.sinPhi[phi] * this.cosTheta[theta], (this.r1[phi] + this.r2[theta]) * this.cosPhi[phi], (this.r1[phi] + this.r2[theta]) * this.sinPhi[phi] * this.sinTheta[theta]);
    };

    return SphereHarmonics;

  })(Surface);

  window.SuperDuperShape = (function(_super) {
    __extends(SuperDuperShape, _super);

    function SuperDuperShape() {
      _ref10 = SuperDuperShape.__super__.constructor.apply(this, arguments);
      return _ref10;
    }

    SuperDuperShape.prototype.getRange = function() {
      return {
        minPhi: -Math.PI / 2 * this.settings.c2,
        maxPhi: Math.PI / 2 * this.settings.c2,
        minTheta: -Math.PI * this.settings.c1,
        maxTheta: Math.PI * this.settings.c1
      };
    };

    SuperDuperShape.prototype.defaultSettings = {
      t1: 0,
      d1: 0,
      m1: 6,
      n11: 8,
      n12: 15,
      n13: 30,
      t2: 0,
      d2: 0,
      m2: 4,
      n21: 12,
      n22: 10,
      n23: 10,
      c1: 2,
      c2: 4,
      c3: 1
    };

    SuperDuperShape.prototype.preCalculateLookUps = function(lookUpPhi, lookUpTheta) {
      var preset1, preset2;

      this.sinTheta = lookUpTheta(Math.sin);
      this.cosTheta = lookUpTheta(Math.cos);
      this.theta = lookUpTheta();
      this.phi = lookUpPhi();
      preset1 = {
        m: this.settings.m1,
        n1: this.settings.n11,
        n2: this.settings.n12,
        n3: this.settings.n13
      };
      preset2 = {
        m: this.settings.m2,
        n1: this.settings.n21,
        n2: this.settings.n22,
        n3: this.settings.n23
      };
      this.r1 = lookUpTheta(this.superFormular, preset1);
      this.r2 = lookUpPhi(this.superFormular, preset2);
      this.d1 = lookUpTheta(this.powerMultiply, {
        c: this.settings.c1,
        d: this.settings.d1
      });
      this.d2 = lookUpTheta(this.powerMultiply, {
        c: this.settings.c2,
        d: this.settings.d2
      });
      this.t2 = lookUpTheta(this.multiply, this.settings.t2 * this.settings.c2);
      return this.t2c = Math.pow(this.settings.c2, this.settings.d2) * this.settings.t2 * this.settings.c2 / 2;
    };

    SuperDuperShape.prototype.superFormular = function(angle, preset) {
      var s1, s2;

      s1 = Math.pow(Math.abs(Math.cos(preset.m * angle / 4)), preset.n2);
      s2 = Math.pow(Math.abs(Math.sin(preset.m * angle / 4)), preset.n3);
      return Math.pow(s1 + s2, -1 / preset.n1);
    };

    SuperDuperShape.prototype.calcVertex = function(phi, theta) {
      var a, v2;

      v2 = this.phi[phi] + this.settings.c3 * this.theta[theta];
      a = this.r1[theta] * (this.settings.t1 + this.d1[theta] * this.r2[phi] * Math.cos(v2));
      return new this.Vector3(a * this.sinTheta[theta], a * this.cosTheta[theta], this.d2[theta] * (this.r2[phi] * Math.sin(v2) - this.t2[theta]) + this.t2c);
    };

    return SuperDuperShape;

  })(Surface);

}).call(this);
