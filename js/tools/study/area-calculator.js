c.preventCheat();
Vue.createApp({
  components: {
    comment: comment,
    "el-input-extend": elInputExtend
  },
  data() {
    return {
      roundFormData: {
        r: null,
        result: null
      },
      sectorFormData: {
        computeType: 1,
        r: null,
        n: null,
        l: null,
        result: null
      },
      ringFormData: {
        computeType: 1,
        R: null,
        r: null,
        d: null,
        result: null
      },
      ovalFormData: {
        a: null,
        b: null,
        result: null
      },
      triangleFormData: {
        a: null,
        h: null,
        result: null
      },
      squareFormData: {
        a: null,
        result: null
      },
      rectangleFormData: {
        a: null,
        b: null,
        result: null
      },
      parallelogramFormData: {
        a: null,
        h: null,
        result: null
      },
      trapezoidFormData: {
        a: null,
        b: null,
        h: null,
        result: null
      }
    };
  },
  methods: {
    roundCompute() {
      this.$refs.roundForm.validate(roundFormValid => {
        if (roundFormValid) {
          var roundRadius = Number(this.roundFormData.r);
          this.roundFormData.result = c.toThousandthPlace(roundRadius * 3.1415926535 * roundRadius, 6);
        }
      });
    },
    sectorCompute() {
      this.$refs.sectorForm.validate(sectorFormValid => {
        if (sectorFormValid) {
          var sectorRadius = Number(this.sectorFormData.r);
          var sectorAngle = Number(this.sectorFormData.n);
          var sectorArcLength = Number(this.sectorFormData.l);
          var sectorChordLength = Number(this.sectorFormData.k);
          if (this.sectorFormData.computeType == 1) {
            this.sectorFormData.result = c.toThousandthPlace(sectorRadius * 3.1415926535 * sectorRadius * sectorAngle / 360, 6);
          } else if (this.sectorFormData.computeType == 2) {
            this.sectorFormData.result = c.toThousandthPlace(sectorRadius * sectorArcLength / 2, 6);
          } else {
            this.sectorFormData.result = c.toThousandthPlace(sectorRadius * sectorChordLength / 2, 6);
          }
        }
      });
    },
    ringCompute() {
      this.$refs.ringForm.validate(ringFormValid => {
        if (ringFormValid) {
          var ringOuterRadius = Number(this.ringFormData.R);
          var ringInnerRadius = Number(this.ringFormData.r);
          var ringDiameter = Number(this.ringFormData.d);
          if (this.ringFormData.computeType == 1) {
            this.ringFormData.result = c.toThousandthPlace((ringOuterRadius * ringOuterRadius - ringInnerRadius * ringInnerRadius) * 3.1415926535, 6);
          } else {
            this.ringFormData.result = c.toThousandthPlace(ringDiameter * 3.1415926535 * (ringOuterRadius * 2 - ringDiameter), 6);
          }
        }
      });
    },
    ovalCompute() {
      this.$refs.ovalForm.validate(ovalFormValid => {
        if (ovalFormValid) {
          var ovalSemiMajorAxis = Number(this.ovalFormData.a);
          var ovalSemiMinorAxis = Number(this.ovalFormData.b);
          this.ovalFormData.result = c.toThousandthPlace(ovalSemiMajorAxis * 3.1415926535 * ovalSemiMinorAxis, 6);
        }
      });
    },
    triangleCompute() {
      this.$refs.triangleForm.validate(triangleFormValid => {
        if (triangleFormValid) {
          var triangleBase = Number(this.triangleFormData.a);
          var triangleHeight = Number(this.triangleFormData.h);
          this.triangleFormData.result = c.toThousandthPlace(triangleBase * triangleHeight / 2, 6);
        }
      });
    },
    squareCompute() {
      this.$refs.squareForm.validate(squareFormValid => {
        if (squareFormValid) {
          var squareSide = Number(this.squareFormData.a);
          this.squareFormData.result = c.toThousandthPlace(squareSide * squareSide, 6);
        }
      });
    },
    rectangleCompute() {
      this.$refs.rectangleForm.validate(rectangleFormValid => {
        if (rectangleFormValid) {
          var rectangleLength = Number(this.rectangleFormData.a);
          var rectangleWidth = Number(this.rectangleFormData.b);
          this.rectangleFormData.result = c.toThousandthPlace(rectangleLength * rectangleWidth, 6);
        }
      });
    },
    parallelogramCompute() {
      this.$refs.parallelogramForm.validate(parallelogramFormValid => {
        if (parallelogramFormValid) {
          var parallelogramBase = Number(this.parallelogramFormData.a);
          var parallelogramHeight = Number(this.parallelogramFormData.h);
          this.parallelogramFormData.result = c.toThousandthPlace(parallelogramBase * parallelogramHeight, 6);
        }
      });
    },
    trapezoidCompute() {
      this.$refs.trapezoidForm.validate(trapezoidFormValid => {
        if (trapezoidFormValid) {
          var trapezoidUpperBase = Number(this.trapezoidFormData.a);
          var trapezoidLowerBase = Number(this.trapezoidFormData.b);
          var trapezoidHeight = Number(this.trapezoidFormData.h);
          this.trapezoidFormData.result = c.toThousandthPlace((trapezoidUpperBase + trapezoidLowerBase) * trapezoidHeight / 2, 6);
        }
      });
    }
  }
}).use(ElementPlus).mount(".main-body");