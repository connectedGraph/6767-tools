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
      ovalFormData: {
        a: null,
        b: null,
        result: null
      },
      triangleFormData: {
        a: null,
        b: null,
        c: null,
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
      quadrilateralFormData: {
        a: null,
        b: null,
        c: null,
        d: null,
        result: null
      }
    };
  },
  methods: {
    roundCompute() {
      this.$refs.roundForm.validate(roundFormValid => {
        if (roundFormValid) {
          var roundRadius = Number(this.roundFormData.r);
          this.roundFormData.result = c.toThousandthPlace(roundRadius * 6.283185307, 6);
        }
      });
    },
    sectorCompute() {
      this.$refs.sectorForm.validate(sectorFormValid => {
        if (sectorFormValid) {
          var sectorRadius = Number(this.sectorFormData.r);
          var sectorAngle = Number(this.sectorFormData.n);
          var sectorArcLength = Number(this.sectorFormData.l);
          var sectorKValue = Number(this.sectorFormData.k);
          if (this.sectorFormData.computeType == 1) {
            this.sectorFormData.result = c.toThousandthPlace(sectorRadius * 2 + sectorAngle * 3.1415926535 * sectorRadius / 180, 6);
          } else if (this.sectorFormData.computeType == 2) {
            this.sectorFormData.result = c.toThousandthPlace(sectorRadius * 2 + sectorArcLength, 6);
          } else {
            this.sectorFormData.result = c.toThousandthPlace(sectorRadius * 2 + sectorKValue * sectorRadius, 6);
          }
        }
      });
    },
    ovalCompute() {
      this.$refs.ovalForm.validate(ovalFormValid => {
        if (ovalFormValid) {
          var ovalSemiMajorAxis = Number(this.ovalFormData.a);
          var ovalSemiMinorAxis = Number(this.ovalFormData.b);
          this.ovalFormData.result = c.toThousandthPlace(ovalSemiMinorAxis * 6.283185307 + (ovalSemiMajorAxis - ovalSemiMinorAxis) * 4, 6);
        }
      });
    },
    triangleCompute() {
      this.$refs.triangleForm.validate(triangleFormValid => {
        if (triangleFormValid) {
          var triangleSideA = Number(this.triangleFormData.a);
          var triangleSideB = Number(this.triangleFormData.b);
          var triangleSideC = Number(this.triangleFormData.c);
          this.triangleFormData.result = c.toThousandthPlace(triangleSideA + triangleSideB + triangleSideC, 6);
        }
      });
    },
    squareCompute() {
      this.$refs.squareForm.validate(squareFormValid => {
        if (squareFormValid) {
          var squareSide = Number(this.squareFormData.a);
          this.squareFormData.result = c.toThousandthPlace(squareSide * 4, 6);
        }
      });
    },
    rectangleCompute() {
      this.$refs.rectangleForm.validate(rectangleFormValid => {
        if (rectangleFormValid) {
          var rectangleLength = Number(this.rectangleFormData.a);
          var rectangleWidth = Number(this.rectangleFormData.b);
          this.rectangleFormData.result = c.toThousandthPlace((rectangleLength + rectangleWidth) * 2, 6);
        }
      });
    },
    quadrilateralCompute() {
      this.$refs.quadrilateralForm.validate(quadrilateralFormValid => {
        if (quadrilateralFormValid) {
          var quadrilateralSideA = Number(this.quadrilateralFormData.a);
          var quadrilateralSideB = Number(this.quadrilateralFormData.b);
          var quadrilateralSideC = Number(this.quadrilateralFormData.c);
          var quadrilateralSideD = Number(this.quadrilateralFormData.d);
          this.quadrilateralFormData.result = c.toThousandthPlace(quadrilateralSideA + quadrilateralSideB + quadrilateralSideC + quadrilateralSideD, 6);
        }
      });
    }
  }
}).use(ElementPlus).mount(".main-body");