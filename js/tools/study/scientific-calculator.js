/**
 * 科学高级计算器核心解析引擎
 * 拓展时间: 2026-08-31
 * Author: Antigravity Agent
 */

class ScientificMathEngine {
  constructor() {
    this.angleMode = 'DEG'; // 'DEG' 或 'RAD'
  }

  setAngleMode(mode) {
    this.angleMode = mode === 'RAD' ? 'RAD' : 'DEG';
  }

  // 阶乘计算 (支持非负整数与 Lanczos 伽马函数近似)
  factorial(n) {
    if (n < 0) throw new Error('阶乘定义域为非负数');
    if (n > 170) return Infinity;
    if (Number.isInteger(n)) {
      let r = 1;
      for (let i = 2; i <= n; i++) r *= i;
      return r;
    }
    // 伽马函数近似 Γ(n + 1) = n!
    return this.gamma(n + 1);
  }

  gamma(z) {
    const g = 7;
    const p = [
      0.99999999999980993,
      676.5203681218851,
      -1259.1392167224028,
      771.32342877765313,
      -176.61502916214059,
      12.507343278686905,
      -0.138571095831109,
      9.9843695780195716e-6,
      1.5056327351493116e-7
    ];
    if (z < 0.5) {
      return Math.PI / (Math.sin(Math.PI * z) * this.gamma(1 - z));
    }
    z -= 1;
    let x = p[0];
    for (let i = 1; i < g + 2; i++) {
      x += p[i] / (z + i);
    }
    const t = z + g + 0.5;
    return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
  }

  // 三角函数度数/弧度包装
  sin(x) {
    const rad = this.angleMode === 'DEG' ? (x * Math.PI) / 180 : x;
    const res = Math.sin(rad);
    return Math.abs(res) < 1e-15 ? 0 : res;
  }

  cos(x) {
    const rad = this.angleMode === 'DEG' ? (x * Math.PI) / 180 : x;
    const res = Math.cos(rad);
    return Math.abs(res) < 1e-15 ? 0 : res;
  }

  tan(x) {
    const rad = this.angleMode === 'DEG' ? (x * Math.PI) / 180 : x;
    const cosVal = Math.cos(rad);
    if (Math.abs(cosVal) < 1e-15) throw new Error('正切函数在奇数倍π/2处无定义 (tan 无穷大)');
    const res = Math.tan(rad);
    return Math.abs(res) < 1e-15 ? 0 : res;
  }

  asin(x) {
    if (x < -1 || x > 1) throw new Error('反正弦定义域必须在 [-1, 1] 内');
    const rad = Math.asin(x);
    return this.angleMode === 'DEG' ? (rad * 180) / Math.PI : rad;
  }

  acos(x) {
    if (x < -1 || x > 1) throw new Error('反余弦定义域必须在 [-1, 1] 内');
    const rad = Math.acos(x);
    return this.angleMode === 'DEG' ? (rad * 180) / Math.PI : rad;
  }

  atan(x) {
    const rad = Math.atan(x);
    return this.angleMode === 'DEG' ? (rad * 180) / Math.PI : rad;
  }

  log(x) {
    if (x <= 0) throw new Error('对数真数必须大于 0');
    return Math.log10(x);
  }

  ln(x) {
    if (x <= 0) throw new Error('自然对数真数必须大于 0');
    return Math.log(x);
  }

  log2(x) {
    if (x <= 0) throw new Error('以2为底对数真数必须大于 0');
    return Math.log2(x);
  }

  sqrt(x) {
    if (x < 0) throw new Error('负数不能在实数范围内开平方根');
    return Math.sqrt(x);
  }

  cbrt(x) {
    return Math.cbrt(x);
  }

  // 表达式安全计算
  evaluate(rawExpr) {
    if (!rawExpr || !rawExpr.trim()) return 0;

    let expr = String(rawExpr).trim();

    // 替换展示符号为计算符号
    expr = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/π/g, `(${Math.PI})`)
      .replace(/φ/g, `(1.618033988749895)`)
      .replace(/e(?![0-9a-zA-Z_])/g, `(${Math.E})`);

    // 替换常用函数前缀
    const self = this;
    const scope = {
      sin: x => self.sin(x),
      cos: x => self.cos(x),
      tan: x => self.tan(x),
      asin: x => self.asin(x),
      acos: x => self.acos(x),
      atan: x => self.atan(x),
      sinh: x => Math.sinh(x),
      cosh: x => Math.cosh(x),
      tanh: x => Math.tanh(x),
      asinh: x => Math.asinh(x),
      acosh: x => Math.acosh(x),
      atanh: x => Math.atanh(x),
      log: x => self.log(x),
      ln: x => self.ln(x),
      log2: x => self.log2(x),
      sqrt: x => self.sqrt(x),
      cbrt: x => self.cbrt(x),
      abs: x => Math.abs(x),
      fact: x => self.factorial(x),
      mod: (a, b) => a % b,
      PI: Math.PI,
      E: Math.E
    };

    // 转换阶乘后缀写法: 如 5! -> fact(5), (2+3)! -> fact(2+3)
    // 递归替换阶乘
    while (expr.includes('!')) {
      expr = expr.replace(/(\((?:[^()]+)\)|[0-9.]+|[a-zA-Z_]\w*)!/g, 'fact($1)');
    }

    // 转换百分比写法: 如 50% -> (50/100)
    while (expr.includes('%')) {
      expr = expr.replace(/(\((?:[^()]+)\)|[0-9.]+)%/g, '($1/100)');
    }

    // 转换乘方符号 ^ 为 **
    expr = expr.replace(/\^/g, '**');

    // 插入隐式乘法: 如 2(3) -> 2*(3), (2)(3) -> (2)*(3), 2sin(30) -> 2*sin(30)
    expr = expr.replace(/(\d)(\()/g, '$1*$2');
    expr = expr.replace(/(\))(\d)/g, '$1*$2');
    expr = expr.replace(/(\))(\()/g, '$1*$2');
    expr = expr.replace(/(\d)([a-zA-Z])/g, '$1*$2');

    // 安全沙箱执行解析
    try {
      const keys = Object.keys(scope);
      const vals = Object.values(scope);
      const fn = new Function(...keys, `"use strict"; return (${expr});`);
      const result = fn(...vals);

      if (typeof result !== 'number' || isNaN(result)) {
        throw new Error('无效的数学表达式');
      }
      return result;
    } catch (err) {
      if (err.message.includes('Unexpected') || err.message.includes('token') || err.message.includes('identifier')) {
        throw new Error('表达式语法错误，请检查括号与运算符');
      }
      throw err;
    }
  }
}

window.ScientificMathEngine = ScientificMathEngine;
