c.preventCheat();
Vue.createApp({
  components: {
    comment: comment,
    "el-input-extend": elInputExtend
  },
  data() {
    return {
      cubeFormData: {
        a: null,
        result: null
      },
      cuboidFormData: {
        a: null,
        b: null,
        h: null,
        result: null
      },
      cylinderFormData: {
        r: null,
        h: null,
        result: null
      },
      hollowCylinderFormData: {
        R: null,
        r: null,
        h: null,
        result: null
      },
      triangularPrismFormData: {
        computeType: 1,
        a: null,
        b: null,
        c: null,
        h: null,
        H: null,
        result: null
      },
      coneFormData: {
        r: null,
        h: null,
        result: null
      },
      coneFrustumFormData: {
        R: null,
        r: null,
        h: null,
        result: null
      },
      pyramidFormData: {
        S: null,
        h: null,
        result: null
      },
      pyramidFrustumFormData: {
        S1: null,
        S2: null,
        h: null,
        result: null
      },
      sphereFormData: {
        r: null,
        result: null
      },
      ellipsoidFormData: {
        a: null,
        b: null,
        c: null,
        result: null
      }
    };
  },
  mounted() {},
  methods: {
    cubeCompute() {
      this.$refs.cubeForm.validate(cubeFormValid => {
        if (cubeFormValid) {
          var cubeSideLength = Number(this.cubeFormData.a);
          this.cubeFormData.result = c.toThousandthPlace(cubeSideLength * cubeSideLength * cubeSideLength, 6);
        }
      });
    },
    cuboidCompute() {
      this.$refs.cuboidForm.validate(cuboidFormValid => {
        if (cuboidFormValid) {
          var cuboidLength = Number(this.cuboidFormData.a);
          var cuboidWidth = Number(this.cuboidFormData.b);
          var cuboidHeight = Number(this.cuboidFormData.h);
          this.cuboidFormData.result = c.toThousandthPlace(cuboidLength * cuboidWidth * cuboidHeight, 6);
        }
      });
    },
    cylinderCompute() {
      this.$refs.cylinderForm.validate(cylinderFormValid => {
        if (cylinderFormValid) {
          var cylinderRadius = Number(this.cylinderFormData.r);
          var cylinderHeight = Number(this.cylinderFormData.h);
          this.cylinderFormData.result = c.toThousandthPlace(cylinderRadius * 3.1415926535 * cylinderRadius * cylinderHeight, 6);
        }
      });
    },
    hollowCylinderCompute() {
      this.$refs.hollowCylinderForm.validate(hollowCylinderFormValid => {
        if (hollowCylinderFormValid) {
          var hollowCylinderOuterRadius = Number(this.hollowCylinderFormData.R);
          var hollowCylinderInnerRadius = Number(this.hollowCylinderFormData.r);
          var hollowCylinderHeight = Number(this.hollowCylinderFormData.h);
          this.hollowCylinderFormData.result = c.toThousandthPlace((hollowCylinderOuterRadius * hollowCylinderOuterRadius - hollowCylinderInnerRadius * hollowCylinderInnerRadius) * 3.1415926535 * hollowCylinderHeight, 6);
        }
      });
    },
    triangularPrismCompute() {
      this.$refs.triangularPrismForm.validate(triangularPrismFormValid => {
        if (triangularPrismFormValid) {
          var triangularPrismSideA = Number(this.triangularPrismFormData.a);
          var triangularPrismHeight = Number(this.triangularPrismFormData.H);
          if (this.triangularPrismFormData.computeType == 1) {
            var triangularPrismBaseHeight = Number(this.triangularPrismFormData.h);
            this.triangularPrismFormData.result = c.toThousandthPlace(triangularPrismSideA * triangularPrismBaseHeight / 2 * triangularPrismHeight, 6);
          } else {
            var triangularPrismSideB = Number(this.triangularPrismFormData.b);
            var triangularPrismSideC = Number(this.triangularPrismFormData.c);
            var triangularPrismSemiperimeter = (triangularPrismSideA + triangularPrismSideB + triangularPrismSideC) / 2;
            this.triangularPrismFormData.result = c.toThousandthPlace(Math.pow(triangularPrismSemiperimeter * (triangularPrismSemiperimeter - triangularPrismSideA) * (triangularPrismSemiperimeter - triangularPrismSideB) * (triangularPrismSemiperimeter - triangularPrismSideC), 1 / 2) * triangularPrismHeight, 6);
          }
        }
      });
    },
    coneCompute() {
      this.$refs.coneForm.validate(coneFormValid => {
        if (coneFormValid) {
          var coneRadius = Number(this.coneFormData.r);
          var coneHeight = Number(this.coneFormData.h);
          this.coneFormData.result = c.toThousandthPlace(coneRadius * 3.1415926535 * coneRadius * coneHeight / 3, 6);
        }
      });
    },
    coneFrustumCompute() {
      this.$refs.coneFrustumForm.validate(coneFrustumFormValid => {
        if (coneFrustumFormValid) {
          var coneFrustumBottomRadius = Number(this.coneFrustumFormData.R);
          var coneFrustumTopRadius = Number(this.coneFrustumFormData.r);
          var coneFrustumHeight = Number(this.coneFrustumFormData.h);
          this.coneFrustumFormData.result = c.toThousandthPlace((coneFrustumBottomRadius * coneFrustumBottomRadius + coneFrustumTopRadius * coneFrustumTopRadius + coneFrustumBottomRadius * coneFrustumTopRadius) * 3.1415926535 * coneFrustumHeight / 3, 6);
        }
      });
    },
    pyramidCompute() {
      this.$refs.pyramidForm.validate(pyramidFormValid => {
        if (pyramidFormValid) {
          var pyramidBaseArea = Number(this.pyramidFormData.S);
          var pyramidHeight = Number(this.pyramidFormData.h);
          this.pyramidFormData.result = c.toThousandthPlace(pyramidBaseArea * pyramidHeight / 3, 6);
        }
      });
    },
    pyramidFrustumCompute() {
      this.$refs.pyramidFrustumForm.validate(pyramidFrustumFormValid => {
        if (pyramidFrustumFormValid) {
          var pyramidFrustumBottomArea = Number(this.pyramidFrustumFormData.S1);
          var pyramidFrustumTopArea = Number(this.pyramidFrustumFormData.S2);
          var pyramidFrustumHeight = Number(this.pyramidFrustumFormData.h);
          this.pyramidFrustumFormData.result = c.toThousandthPlace((pyramidFrustumBottomArea + pyramidFrustumTopArea + Math.pow(pyramidFrustumBottomArea * pyramidFrustumTopArea, 1 / 2)) * pyramidFrustumHeight / 3, 6);
        }
      });
    },
    sphereCompute() {
      this.$refs.sphereForm.validate(sphereFormValid => {
        if (sphereFormValid) {
          var sphereRadius = Number(this.sphereFormData.r);
          this.sphereFormData.result = c.toThousandthPlace(sphereRadius * 3.1415926535 * sphereRadius * sphereRadius * 4 / 3, 6);
        }
      });
    },
    ellipsoidCompute() {
      this.$refs.ellipsoidForm.validate(ellipsoidFormValid => {
        if (ellipsoidFormValid) {
          var ellipsoidSemiAxisA = Number(this.ellipsoidFormData.a);
          var ellipsoidSemiAxisB = Number(this.ellipsoidFormData.b);
          var ellipsoidSemiAxisC = Number(this.ellipsoidFormData.c);
          this.ellipsoidFormData.result = c.toThousandthPlace(ellipsoidSemiAxisA * 3.1415926535 * ellipsoidSemiAxisB * ellipsoidSemiAxisC * 4 / 3, 6);
        }
      });
    }
  }
}).use(ElementPlus).mount(".main-body");