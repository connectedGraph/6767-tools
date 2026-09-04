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
          var cubeEdgeLength = Number(this.cubeFormData.a);
          this.cubeFormData.result = c.toThousandthPlace(cubeEdgeLength * 6 * cubeEdgeLength, 6);
        }
      });
    },
    cuboidCompute() {
      this.$refs.cuboidForm.validate(cuboidFormValid => {
        if (cuboidFormValid) {
          var cuboidLength = Number(this.cuboidFormData.a);
          var cuboidWidth = Number(this.cuboidFormData.b);
          var cuboidHeight = Number(this.cuboidFormData.h);
          this.cuboidFormData.result = c.toThousandthPlace((cuboidLength * cuboidWidth + cuboidWidth * cuboidHeight + cuboidLength * cuboidHeight) * 2, 6);
        }
      });
    },
    cylinderCompute() {
      this.$refs.cylinderForm.validate(cylinderFormValid => {
        if (cylinderFormValid) {
          var cylinderRadius = Number(this.cylinderFormData.r);
          var cylinderHeight = Number(this.cylinderFormData.h);
          this.cylinderFormData.result = c.toThousandthPlace(cylinderRadius * 6.283185307 * cylinderHeight + cylinderRadius * 6.283185307 * cylinderRadius, 6);
        }
      });
    },
    hollowCylinderCompute() {
      this.$refs.hollowCylinderForm.validate(hollowCylinderFormValid => {
        if (hollowCylinderFormValid) {
          var hollowCylinderOuterRadius = Number(this.hollowCylinderFormData.R);
          var hollowCylinderInnerRadius = Number(this.hollowCylinderFormData.r);
          var hollowCylinderHeight = Number(this.hollowCylinderFormData.h);
          this.hollowCylinderFormData.result = c.toThousandthPlace((hollowCylinderOuterRadius + hollowCylinderInnerRadius) * 6.283185307 * hollowCylinderHeight + (hollowCylinderOuterRadius * hollowCylinderOuterRadius - hollowCylinderInnerRadius * hollowCylinderInnerRadius) * 6.283185307, 6);
        }
      });
    },
    triangularPrismCompute() {
      this.$refs.triangularPrismForm.validate(triangularPrismFormValid => {
        if (triangularPrismFormValid) {
          var triangularPrismSideA = Number(this.triangularPrismFormData.a);
          var triangularPrismSideB = Number(this.triangularPrismFormData.b);
          var triangularPrismSideC = Number(this.triangularPrismFormData.c);
          var triangularPrismHeight = Number(this.triangularPrismFormData.h);
          var triangleSemiPerimeter = (triangularPrismSideA + triangularPrismSideB + triangularPrismSideC) / 2;
          this.triangularPrismFormData.result = c.toThousandthPlace((triangularPrismSideA + triangularPrismSideB + triangularPrismSideC) * triangularPrismHeight + Math.pow(triangleSemiPerimeter * (triangleSemiPerimeter - triangularPrismSideA) * (triangleSemiPerimeter - triangularPrismSideB) * (triangleSemiPerimeter - triangularPrismSideC), 1 / 2) * 2, 6);
        }
      });
    },
    coneCompute() {
      this.$refs.coneForm.validate(coneFormValid => {
        if (coneFormValid) {
          var coneRadius = Number(this.coneFormData.r);
          var coneHeight = Number(this.coneFormData.h);
          this.coneFormData.result = c.toThousandthPlace(coneRadius * 3.1415926535 * Math.pow(coneRadius * coneRadius + coneHeight * coneHeight, 1 / 2) + coneRadius * 3.1415926535 * coneRadius, 6);
        }
      });
    },
    coneFrustumCompute() {
      this.$refs.coneFrustumForm.validate(coneFrustumFormValid => {
        if (coneFrustumFormValid) {
          var coneFrustumBottomRadius = Number(this.coneFrustumFormData.R);
          var coneFrustumTopRadius = Number(this.coneFrustumFormData.r);
          var coneFrustumHeight = Number(this.coneFrustumFormData.h);
          this.coneFrustumFormData.result = c.toThousandthPlace(Math.pow((coneFrustumBottomRadius - coneFrustumTopRadius) * (coneFrustumBottomRadius - coneFrustumTopRadius) + coneFrustumHeight * coneFrustumHeight, 1 / 2) * 3.1415926535 * (coneFrustumBottomRadius + coneFrustumTopRadius) + (coneFrustumBottomRadius * coneFrustumBottomRadius + coneFrustumTopRadius * coneFrustumTopRadius) * 3.1415926535, 6);
        }
      });
    },
    sphereCompute() {
      this.$refs.sphereForm.validate(sphereFormValid => {
        if (sphereFormValid) {
          var sphereRadius = Number(this.sphereFormData.r);
          this.sphereFormData.result = c.toThousandthPlace(sphereRadius * 3.1415926535 * sphereRadius * 4, 6);
        }
      });
    },
    ellipsoidCompute() {
      this.$refs.ellipsoidForm.validate(ellipsoidFormValid => {
        if (ellipsoidFormValid) {
          var ellipsoidAxisA = Number(this.ellipsoidFormData.a);
          var ellipsoidAxisB = Number(this.ellipsoidFormData.b);
          var ellipsoidAxisC = Number(this.ellipsoidFormData.c);
          this.ellipsoidFormData.result = c.toThousandthPlace((ellipsoidAxisA * ellipsoidAxisB + ellipsoidAxisB * ellipsoidAxisC + ellipsoidAxisC * ellipsoidAxisA) * 3.1415926535 * 4 / 3, 6);
        }
      });
    }
  }
}).use(ElementPlus).mount(".main-body");