The goal of the library is to create parametric surfaces as Threejs geometries.


##Api

Create a new surface and get the threejs geometry.

    var sphere = new Sphere({phiSteps: 20, thetaSteps: 20});
    var geometry = sphere.getGeometry();

###Aviable Surfaces

####DoubleCone

Options:

- phiSteps: vertical resoultion
- thetaSteps: horizontal resoultion

####EnnepersSurface

Options:

- phiSteps: vertical resoultion
- thetaSteps: horizontal resoultion

####FishSurface

Options:

- phiSteps: vertical resoultion
- thetaSteps: horizontal resoultion

####Horn

Options:

- phiSteps: vertical resoultion
- thetaSteps: horizontal resoultion

####JetSurface

Options:

- phiSteps: vertical resoultion
- thetaSteps: horizontal resoultion

####MoebiusStrip

Options:

- phiSteps: vertical resoultion
- thetaSteps: horizontal resoultion

####Pillow

Options:

- phiSteps: vertical resoultion
- thetaSteps: horizontal resoultion

####Shell

Options:

- phiSteps: vertical resoultion
- thetaSteps: horizontal resoultion
- innerRadius: inner radius of the shell (default: 1)
- outerRadius: outer radius of the shell (default: 2)
- height: height of the shell (default: 5)
- spirals: spirals count (default: 3)

####Sphere

Options:

- phiSteps: vertical resoultion
- thetaSteps: horizontal resoultion

####SphereHarmonics

Options:

- phiSteps: vertical resoultion
- thetaSteps: horizontal resoultion
- m0: (default: 10)
- m1: (default: 10)
- m2: (default: 0)
- m3: (default: 5)
- m4: (default: 5)
- m5: (default: 40)
- m6: (default: 100)
- m7: (default: 100)

####SuperDuperShape

Try [SuperDuperShapeExplorer](http://eskimoblood.github.com/superdupershape/) to understand the options parameter.
Options:

- phiSteps: vertical resoultion
- thetaSteps: horizontal resoultion
- t1: (default: 0)
- d1: (default: 0)
- m1: (default: 6)
- n11: (default: 8)
- n12: (default: 15)
- n13: (default: 30)
- t2: (default: 0)
- d2: (default: 0)
- m2: (default: 4)
- n21: (default: 12)
- n22: (default: 10)
- n23: (default: 10)
- c1: (default: 2)
- c2: (default: 4)
- c3: (default: 1)

##Build
The project use grunt to compile and minify the CoffeScript source. So first install the dev dependencies

    npm install

Then compile the CoffeeScript

    grunt build

##License
MIT: http://koeberle.mit-license.org