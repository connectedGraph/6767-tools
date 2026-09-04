Vue.createApp({
  components: {
    comment: comment
  },
  data() {
    return {
      formData: {
        value: [null, null, null, null, null]
      },
      decimalMap: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@#",
      fractionPrecision: 30
    };
  },
  methods: {
    parseBigInt(inputStr, radix) {
      if (!inputStr) {
        return null;
      }
      const digitMap = this.decimalMap;
      let result = BigInt(0);
      const radixBigInt = BigInt(radix);
      for (let charIndex = 0; charIndex < inputStr.length; charIndex++) {
        const currentChar = inputStr[charIndex];
        const digitValue = digitMap.indexOf(currentChar);
        if (digitValue === -1 || digitValue >= radix) {
          return null;
        }
        result = result * radixBigInt + BigInt(digitValue);
      }
      return result;
    },
    toBaseString(decimalNumber, targetBase) {
      if (decimalNumber === undefined || decimalNumber === null) {
        return "";
      }
      if (decimalNumber === BigInt(0)) {
        return "0";
      }
      const baseDigits = this.decimalMap;
      const targetBaseBigInt = BigInt(targetBase);
      let resultStr = "";
      let remainingValue = BigInt(decimalNumber);
      while (remainingValue > 0) {
        const digitNumber = Number(remainingValue % targetBaseBigInt);
        resultStr = baseDigits[digitNumber] + resultStr;
        remainingValue = remainingValue / targetBaseBigInt;
      }
      return resultStr;
    },
    parseFraction(fractionStr, fractionBase) {
      if (!fractionStr) {
        return {
          num: BigInt(0),
          den: BigInt(1)
        };
      }
      const maxFractionLength = 100;
      if (fractionStr.length > maxFractionLength) {
        fractionStr = fractionStr.slice(0, maxFractionLength);
      }
      const fractionValue = this.parseBigInt(fractionStr, fractionBase);
      if (fractionValue === null) {
        return null;
      }
      const denominator = BigInt(fractionBase) ** BigInt(fractionStr.length);
      return {
        num: fractionValue,
        den: denominator
      };
    },
    fractionToBase(numerator, divisor, outputBase, precision) {
      if (numerator === BigInt(0)) {
        return "";
      }
      const digitToCharMap = this.decimalMap;
      const outputBaseBigInt = BigInt(outputBase);
      let fractionResultStr = "";
      let currentNumerator = BigInt(numerator);
      const divisorBigInt = BigInt(divisor);
      for (let iterationIndex = 0; iterationIndex < precision; iterationIndex++) {
        currentNumerator = currentNumerator * outputBaseBigInt;
        if (currentNumerator === 0x0n) {
          break;
        }
        const currentDigit = currentNumerator / divisorBigInt;
        fractionResultStr += digitToCharMap[Number(currentDigit)];
        currentNumerator = currentNumerator % divisorBigInt;
        if (currentNumerator === 0x0n) {
          break;
        }
      }
      return fractionResultStr;
    },
    convert(fieldIndex) {
      let cleanedInput = String(this.formData.value[fieldIndex] || "").replace(/,/g, "").replace(/\s/g, "");
      if (cleanedInput === "") {
        this.formData.value = [null, null, null, null, null];
        return;
      }
      let isNegative = false;
      let workingValue = cleanedInput;
      if (workingValue.startsWith("-")) {
        isNegative = true;
        workingValue = workingValue.slice(1).trim();
        if (workingValue === "") {
          this.formData.value = [null, null, null, null, null];
          return;
        }
      }
      const parts = workingValue.split(".");
      const integerPart = parts[0] || "0";
      const fractionPart = parts.length > 1 ? parts[1] : "";
      const baseOptions = [2, 8, 10, 16, 32];
      const currentBase = baseOptions[fieldIndex];
      let integerValue = this.parseBigInt(integerPart, currentBase);
      if (integerValue === null) {
        this.formData.value = [null, null, null, null, null];
        return;
      }
      let fractionPartValue = this.parseFraction(fractionPart, currentBase);
      if (fractionPartValue === null) {
        this.formData.value = [null, null, null, null, null];
        return;
      }
      if (integerValue === 0x0n && fractionPartValue.num === 0x0n) {
        this.formData.value = ["0", "0", "0", "0", "0"];
        return;
      }
      const conversionResults = baseOptions.map(destBase => {
        let absoluteValue = integerValue < 0 ? -integerValue : integerValue;
        let convertedString = this.toBaseString(absoluteValue, destBase);
        if (convertedString === "") {
          convertedString = "0";
        }
        let finalResultStr = "";
        if (fractionPartValue.num !== 0x0n && this.fractionPrecision > 0) {
          finalResultStr = this.fractionToBase(fractionPartValue.num, fractionPartValue.den, destBase, this.fractionPrecision);
        }
        let convertedIntegerStr = convertedString;
        if (finalResultStr.length > 0) {
          convertedIntegerStr += "." + finalResultStr;
        }
        if (isNegative && (convertedString !== "0" || finalResultStr.length !== 0)) {
          convertedIntegerStr = "-" + convertedIntegerStr;
        }
        if (isNegative && convertedString === "0" && finalResultStr.length === 0) {
          convertedIntegerStr = "0";
        }
        return convertedIntegerStr;
      });
      this.formData.value[0] = conversionResults[0];
      this.formData.value[1] = conversionResults[1];
      this.formData.value[2] = conversionResults[2];
      this.formData.value[3] = conversionResults[3];
      this.formData.value[4] = conversionResults[4];
    },
    focus(focusField) {
      if (this.formData.value[focusField] == null) {
        return;
      }
      let focusInputValue = String(this.formData.value[focusField]).replace(/,/g, "").replace(/ /g, "");
      if (focusInputValue !== "") {
        this.formData.value[focusField] = focusInputValue;
      }
    },
    blur(blurField) {
      if (blurField !== 2) {
        return;
      }
      let rawValue = this.formData.value[blurField];
      if (rawValue == null || rawValue === "") {
        return;
      }
      let trimmedValue = String(rawValue).replace(/,/g, "").replace(/ /g, "");
      let negativeFlag = false;
      if (trimmedValue.startsWith("-")) {
        negativeFlag = true;
        trimmedValue = trimmedValue.slice(1);
      }
      let numParts = trimmedValue.split(".");
      let integerPartStr = numParts[0] || "0";
      let fractionSuffix = numParts.length > 1 ? "." + numParts[1] : "";
      if (/^\d+$/.test(integerPartStr)) {
        try {
          let integerBigInt = BigInt(integerPartStr);
          let formattedInteger = integerBigInt.toLocaleString("en-US");
          this.formData.value[blurField] = (negativeFlag ? "-" : "") + formattedInteger + fractionSuffix;
        } catch (error) {}
      }
    }
  }
}).use(ElementPlus).mount(".main-body");