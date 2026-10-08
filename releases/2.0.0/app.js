var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/qrcode/lib/can-promise.js
var require_can_promise = __commonJS({
  "node_modules/qrcode/lib/can-promise.js"(exports, module) {
    module.exports = function() {
      return typeof Promise === "function" && Promise.prototype && Promise.prototype.then;
    };
  }
});

// node_modules/qrcode/lib/core/utils.js
var require_utils = __commonJS({
  "node_modules/qrcode/lib/core/utils.js"(exports) {
    var toSJISFunction;
    var CODEWORDS_COUNT = [
      0,
      // Not used
      26,
      44,
      70,
      100,
      134,
      172,
      196,
      242,
      292,
      346,
      404,
      466,
      532,
      581,
      655,
      733,
      815,
      901,
      991,
      1085,
      1156,
      1258,
      1364,
      1474,
      1588,
      1706,
      1828,
      1921,
      2051,
      2185,
      2323,
      2465,
      2611,
      2761,
      2876,
      3034,
      3196,
      3362,
      3532,
      3706
    ];
    exports.getSymbolSize = function getSymbolSize(version2) {
      if (!version2) throw new Error('"version" cannot be null or undefined');
      if (version2 < 1 || version2 > 40) throw new Error('"version" should be in range from 1 to 40');
      return version2 * 4 + 17;
    };
    exports.getSymbolTotalCodewords = function getSymbolTotalCodewords(version2) {
      return CODEWORDS_COUNT[version2];
    };
    exports.getBCHDigit = function(data) {
      let digit = 0;
      while (data !== 0) {
        digit++;
        data >>>= 1;
      }
      return digit;
    };
    exports.setToSJISFunction = function setToSJISFunction(f) {
      if (typeof f !== "function") {
        throw new Error('"toSJISFunc" is not a valid function.');
      }
      toSJISFunction = f;
    };
    exports.isKanjiModeEnabled = function() {
      return typeof toSJISFunction !== "undefined";
    };
    exports.toSJIS = function toSJIS(kanji) {
      return toSJISFunction(kanji);
    };
  }
});

// node_modules/qrcode/lib/core/error-correction-level.js
var require_error_correction_level = __commonJS({
  "node_modules/qrcode/lib/core/error-correction-level.js"(exports) {
    exports.L = { bit: 1 };
    exports.M = { bit: 0 };
    exports.Q = { bit: 3 };
    exports.H = { bit: 2 };
    function fromString(string) {
      if (typeof string !== "string") {
        throw new Error("Param is not a string");
      }
      const lcStr = string.toLowerCase();
      switch (lcStr) {
        case "l":
        case "low":
          return exports.L;
        case "m":
        case "medium":
          return exports.M;
        case "q":
        case "quartile":
          return exports.Q;
        case "h":
        case "high":
          return exports.H;
        default:
          throw new Error("Unknown EC Level: " + string);
      }
    }
    exports.isValid = function isValid(level) {
      return level && typeof level.bit !== "undefined" && level.bit >= 0 && level.bit < 4;
    };
    exports.from = function from(value, defaultValue) {
      if (exports.isValid(value)) {
        return value;
      }
      try {
        return fromString(value);
      } catch (e) {
        return defaultValue;
      }
    };
  }
});

// node_modules/qrcode/lib/core/bit-buffer.js
var require_bit_buffer = __commonJS({
  "node_modules/qrcode/lib/core/bit-buffer.js"(exports, module) {
    function BitBuffer() {
      this.buffer = [];
      this.length = 0;
    }
    BitBuffer.prototype = {
      get: function(index) {
        const bufIndex = Math.floor(index / 8);
        return (this.buffer[bufIndex] >>> 7 - index % 8 & 1) === 1;
      },
      put: function(num, length) {
        for (let i = 0; i < length; i++) {
          this.putBit((num >>> length - i - 1 & 1) === 1);
        }
      },
      getLengthInBits: function() {
        return this.length;
      },
      putBit: function(bit) {
        const bufIndex = Math.floor(this.length / 8);
        if (this.buffer.length <= bufIndex) {
          this.buffer.push(0);
        }
        if (bit) {
          this.buffer[bufIndex] |= 128 >>> this.length % 8;
        }
        this.length++;
      }
    };
    module.exports = BitBuffer;
  }
});

// node_modules/qrcode/lib/core/bit-matrix.js
var require_bit_matrix = __commonJS({
  "node_modules/qrcode/lib/core/bit-matrix.js"(exports, module) {
    function BitMatrix(size) {
      if (!size || size < 1) {
        throw new Error("BitMatrix size must be defined and greater than 0");
      }
      this.size = size;
      this.data = new Uint8Array(size * size);
      this.reservedBit = new Uint8Array(size * size);
    }
    BitMatrix.prototype.set = function(row, col, value, reserved) {
      const index = row * this.size + col;
      this.data[index] = value;
      if (reserved) this.reservedBit[index] = true;
    };
    BitMatrix.prototype.get = function(row, col) {
      return this.data[row * this.size + col];
    };
    BitMatrix.prototype.xor = function(row, col, value) {
      this.data[row * this.size + col] ^= value;
    };
    BitMatrix.prototype.isReserved = function(row, col) {
      return this.reservedBit[row * this.size + col];
    };
    module.exports = BitMatrix;
  }
});

// node_modules/qrcode/lib/core/alignment-pattern.js
var require_alignment_pattern = __commonJS({
  "node_modules/qrcode/lib/core/alignment-pattern.js"(exports) {
    var getSymbolSize = require_utils().getSymbolSize;
    exports.getRowColCoords = function getRowColCoords(version2) {
      if (version2 === 1) return [];
      const posCount = Math.floor(version2 / 7) + 2;
      const size = getSymbolSize(version2);
      const intervals = size === 145 ? 26 : Math.ceil((size - 13) / (2 * posCount - 2)) * 2;
      const positions = [size - 7];
      for (let i = 1; i < posCount - 1; i++) {
        positions[i] = positions[i - 1] - intervals;
      }
      positions.push(6);
      return positions.reverse();
    };
    exports.getPositions = function getPositions(version2) {
      const coords = [];
      const pos = exports.getRowColCoords(version2);
      const posLength = pos.length;
      for (let i = 0; i < posLength; i++) {
        for (let j = 0; j < posLength; j++) {
          if (i === 0 && j === 0 || // top-left
          i === 0 && j === posLength - 1 || // bottom-left
          i === posLength - 1 && j === 0) {
            continue;
          }
          coords.push([pos[i], pos[j]]);
        }
      }
      return coords;
    };
  }
});

// node_modules/qrcode/lib/core/finder-pattern.js
var require_finder_pattern = __commonJS({
  "node_modules/qrcode/lib/core/finder-pattern.js"(exports) {
    var getSymbolSize = require_utils().getSymbolSize;
    var FINDER_PATTERN_SIZE = 7;
    exports.getPositions = function getPositions(version2) {
      const size = getSymbolSize(version2);
      return [
        // top-left
        [0, 0],
        // top-right
        [size - FINDER_PATTERN_SIZE, 0],
        // bottom-left
        [0, size - FINDER_PATTERN_SIZE]
      ];
    };
  }
});

// node_modules/qrcode/lib/core/mask-pattern.js
var require_mask_pattern = __commonJS({
  "node_modules/qrcode/lib/core/mask-pattern.js"(exports) {
    exports.Patterns = {
      PATTERN000: 0,
      PATTERN001: 1,
      PATTERN010: 2,
      PATTERN011: 3,
      PATTERN100: 4,
      PATTERN101: 5,
      PATTERN110: 6,
      PATTERN111: 7
    };
    var PenaltyScores = {
      N1: 3,
      N2: 3,
      N3: 40,
      N4: 10
    };
    exports.isValid = function isValid(mask) {
      return mask != null && mask !== "" && !isNaN(mask) && mask >= 0 && mask <= 7;
    };
    exports.from = function from(value) {
      return exports.isValid(value) ? parseInt(value, 10) : void 0;
    };
    exports.getPenaltyN1 = function getPenaltyN1(data) {
      const size = data.size;
      let points = 0;
      let sameCountCol = 0;
      let sameCountRow = 0;
      let lastCol = null;
      let lastRow = null;
      for (let row = 0; row < size; row++) {
        sameCountCol = sameCountRow = 0;
        lastCol = lastRow = null;
        for (let col = 0; col < size; col++) {
          let module2 = data.get(row, col);
          if (module2 === lastCol) {
            sameCountCol++;
          } else {
            if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
            lastCol = module2;
            sameCountCol = 1;
          }
          module2 = data.get(col, row);
          if (module2 === lastRow) {
            sameCountRow++;
          } else {
            if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
            lastRow = module2;
            sameCountRow = 1;
          }
        }
        if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
        if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
      }
      return points;
    };
    exports.getPenaltyN2 = function getPenaltyN2(data) {
      const size = data.size;
      let points = 0;
      for (let row = 0; row < size - 1; row++) {
        for (let col = 0; col < size - 1; col++) {
          const last = data.get(row, col) + data.get(row, col + 1) + data.get(row + 1, col) + data.get(row + 1, col + 1);
          if (last === 4 || last === 0) points++;
        }
      }
      return points * PenaltyScores.N2;
    };
    exports.getPenaltyN3 = function getPenaltyN3(data) {
      const size = data.size;
      let points = 0;
      let bitsCol = 0;
      let bitsRow = 0;
      for (let row = 0; row < size; row++) {
        bitsCol = bitsRow = 0;
        for (let col = 0; col < size; col++) {
          bitsCol = bitsCol << 1 & 2047 | data.get(row, col);
          if (col >= 10 && (bitsCol === 1488 || bitsCol === 93)) points++;
          bitsRow = bitsRow << 1 & 2047 | data.get(col, row);
          if (col >= 10 && (bitsRow === 1488 || bitsRow === 93)) points++;
        }
      }
      return points * PenaltyScores.N3;
    };
    exports.getPenaltyN4 = function getPenaltyN4(data) {
      let darkCount = 0;
      const modulesCount = data.data.length;
      for (let i = 0; i < modulesCount; i++) darkCount += data.data[i];
      const k = Math.abs(Math.ceil(darkCount * 100 / modulesCount / 5) - 10);
      return k * PenaltyScores.N4;
    };
    function getMaskAt(maskPattern, i, j) {
      switch (maskPattern) {
        case exports.Patterns.PATTERN000:
          return (i + j) % 2 === 0;
        case exports.Patterns.PATTERN001:
          return i % 2 === 0;
        case exports.Patterns.PATTERN010:
          return j % 3 === 0;
        case exports.Patterns.PATTERN011:
          return (i + j) % 3 === 0;
        case exports.Patterns.PATTERN100:
          return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0;
        case exports.Patterns.PATTERN101:
          return i * j % 2 + i * j % 3 === 0;
        case exports.Patterns.PATTERN110:
          return (i * j % 2 + i * j % 3) % 2 === 0;
        case exports.Patterns.PATTERN111:
          return (i * j % 3 + (i + j) % 2) % 2 === 0;
        default:
          throw new Error("bad maskPattern:" + maskPattern);
      }
    }
    exports.applyMask = function applyMask(pattern, data) {
      const size = data.size;
      for (let col = 0; col < size; col++) {
        for (let row = 0; row < size; row++) {
          if (data.isReserved(row, col)) continue;
          data.xor(row, col, getMaskAt(pattern, row, col));
        }
      }
    };
    exports.getBestMask = function getBestMask(data, setupFormatFunc) {
      const numPatterns = Object.keys(exports.Patterns).length;
      let bestPattern = 0;
      let lowerPenalty = Infinity;
      for (let p = 0; p < numPatterns; p++) {
        setupFormatFunc(p);
        exports.applyMask(p, data);
        const penalty = exports.getPenaltyN1(data) + exports.getPenaltyN2(data) + exports.getPenaltyN3(data) + exports.getPenaltyN4(data);
        exports.applyMask(p, data);
        if (penalty < lowerPenalty) {
          lowerPenalty = penalty;
          bestPattern = p;
        }
      }
      return bestPattern;
    };
  }
});

// node_modules/qrcode/lib/core/error-correction-code.js
var require_error_correction_code = __commonJS({
  "node_modules/qrcode/lib/core/error-correction-code.js"(exports) {
    var ECLevel = require_error_correction_level();
    var EC_BLOCKS_TABLE = [
      // L  M  Q  H
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      2,
      2,
      1,
      2,
      2,
      4,
      1,
      2,
      4,
      4,
      2,
      4,
      4,
      4,
      2,
      4,
      6,
      5,
      2,
      4,
      6,
      6,
      2,
      5,
      8,
      8,
      4,
      5,
      8,
      8,
      4,
      5,
      8,
      11,
      4,
      8,
      10,
      11,
      4,
      9,
      12,
      16,
      4,
      9,
      16,
      16,
      6,
      10,
      12,
      18,
      6,
      10,
      17,
      16,
      6,
      11,
      16,
      19,
      6,
      13,
      18,
      21,
      7,
      14,
      21,
      25,
      8,
      16,
      20,
      25,
      8,
      17,
      23,
      25,
      9,
      17,
      23,
      34,
      9,
      18,
      25,
      30,
      10,
      20,
      27,
      32,
      12,
      21,
      29,
      35,
      12,
      23,
      34,
      37,
      12,
      25,
      34,
      40,
      13,
      26,
      35,
      42,
      14,
      28,
      38,
      45,
      15,
      29,
      40,
      48,
      16,
      31,
      43,
      51,
      17,
      33,
      45,
      54,
      18,
      35,
      48,
      57,
      19,
      37,
      51,
      60,
      19,
      38,
      53,
      63,
      20,
      40,
      56,
      66,
      21,
      43,
      59,
      70,
      22,
      45,
      62,
      74,
      24,
      47,
      65,
      77,
      25,
      49,
      68,
      81
    ];
    var EC_CODEWORDS_TABLE = [
      // L  M  Q  H
      7,
      10,
      13,
      17,
      10,
      16,
      22,
      28,
      15,
      26,
      36,
      44,
      20,
      36,
      52,
      64,
      26,
      48,
      72,
      88,
      36,
      64,
      96,
      112,
      40,
      72,
      108,
      130,
      48,
      88,
      132,
      156,
      60,
      110,
      160,
      192,
      72,
      130,
      192,
      224,
      80,
      150,
      224,
      264,
      96,
      176,
      260,
      308,
      104,
      198,
      288,
      352,
      120,
      216,
      320,
      384,
      132,
      240,
      360,
      432,
      144,
      280,
      408,
      480,
      168,
      308,
      448,
      532,
      180,
      338,
      504,
      588,
      196,
      364,
      546,
      650,
      224,
      416,
      600,
      700,
      224,
      442,
      644,
      750,
      252,
      476,
      690,
      816,
      270,
      504,
      750,
      900,
      300,
      560,
      810,
      960,
      312,
      588,
      870,
      1050,
      336,
      644,
      952,
      1110,
      360,
      700,
      1020,
      1200,
      390,
      728,
      1050,
      1260,
      420,
      784,
      1140,
      1350,
      450,
      812,
      1200,
      1440,
      480,
      868,
      1290,
      1530,
      510,
      924,
      1350,
      1620,
      540,
      980,
      1440,
      1710,
      570,
      1036,
      1530,
      1800,
      570,
      1064,
      1590,
      1890,
      600,
      1120,
      1680,
      1980,
      630,
      1204,
      1770,
      2100,
      660,
      1260,
      1860,
      2220,
      720,
      1316,
      1950,
      2310,
      750,
      1372,
      2040,
      2430
    ];
    exports.getBlocksCount = function getBlocksCount(version2, errorCorrectionLevel) {
      switch (errorCorrectionLevel) {
        case ECLevel.L:
          return EC_BLOCKS_TABLE[(version2 - 1) * 4 + 0];
        case ECLevel.M:
          return EC_BLOCKS_TABLE[(version2 - 1) * 4 + 1];
        case ECLevel.Q:
          return EC_BLOCKS_TABLE[(version2 - 1) * 4 + 2];
        case ECLevel.H:
          return EC_BLOCKS_TABLE[(version2 - 1) * 4 + 3];
        default:
          return void 0;
      }
    };
    exports.getTotalCodewordsCount = function getTotalCodewordsCount(version2, errorCorrectionLevel) {
      switch (errorCorrectionLevel) {
        case ECLevel.L:
          return EC_CODEWORDS_TABLE[(version2 - 1) * 4 + 0];
        case ECLevel.M:
          return EC_CODEWORDS_TABLE[(version2 - 1) * 4 + 1];
        case ECLevel.Q:
          return EC_CODEWORDS_TABLE[(version2 - 1) * 4 + 2];
        case ECLevel.H:
          return EC_CODEWORDS_TABLE[(version2 - 1) * 4 + 3];
        default:
          return void 0;
      }
    };
  }
});

// node_modules/qrcode/lib/core/galois-field.js
var require_galois_field = __commonJS({
  "node_modules/qrcode/lib/core/galois-field.js"(exports) {
    var EXP_TABLE = new Uint8Array(512);
    var LOG_TABLE = new Uint8Array(256);
    (function initTables() {
      let x = 1;
      for (let i = 0; i < 255; i++) {
        EXP_TABLE[i] = x;
        LOG_TABLE[x] = i;
        x <<= 1;
        if (x & 256) {
          x ^= 285;
        }
      }
      for (let i = 255; i < 512; i++) {
        EXP_TABLE[i] = EXP_TABLE[i - 255];
      }
    })();
    exports.log = function log(n) {
      if (n < 1) throw new Error("log(" + n + ")");
      return LOG_TABLE[n];
    };
    exports.exp = function exp(n) {
      return EXP_TABLE[n];
    };
    exports.mul = function mul(x, y) {
      if (x === 0 || y === 0) return 0;
      return EXP_TABLE[LOG_TABLE[x] + LOG_TABLE[y]];
    };
  }
});

// node_modules/qrcode/lib/core/polynomial.js
var require_polynomial = __commonJS({
  "node_modules/qrcode/lib/core/polynomial.js"(exports) {
    var GF = require_galois_field();
    exports.mul = function mul(p1, p2) {
      const coeff = new Uint8Array(p1.length + p2.length - 1);
      for (let i = 0; i < p1.length; i++) {
        for (let j = 0; j < p2.length; j++) {
          coeff[i + j] ^= GF.mul(p1[i], p2[j]);
        }
      }
      return coeff;
    };
    exports.mod = function mod(divident, divisor) {
      let result = new Uint8Array(divident);
      while (result.length - divisor.length >= 0) {
        const coeff = result[0];
        for (let i = 0; i < divisor.length; i++) {
          result[i] ^= GF.mul(divisor[i], coeff);
        }
        let offset = 0;
        while (offset < result.length && result[offset] === 0) offset++;
        result = result.slice(offset);
      }
      return result;
    };
    exports.generateECPolynomial = function generateECPolynomial(degree) {
      let poly = new Uint8Array([1]);
      for (let i = 0; i < degree; i++) {
        poly = exports.mul(poly, new Uint8Array([1, GF.exp(i)]));
      }
      return poly;
    };
  }
});

// node_modules/qrcode/lib/core/reed-solomon-encoder.js
var require_reed_solomon_encoder = __commonJS({
  "node_modules/qrcode/lib/core/reed-solomon-encoder.js"(exports, module) {
    var Polynomial = require_polynomial();
    function ReedSolomonEncoder(degree) {
      this.genPoly = void 0;
      this.degree = degree;
      if (this.degree) this.initialize(this.degree);
    }
    ReedSolomonEncoder.prototype.initialize = function initialize(degree) {
      this.degree = degree;
      this.genPoly = Polynomial.generateECPolynomial(this.degree);
    };
    ReedSolomonEncoder.prototype.encode = function encode(data) {
      if (!this.genPoly) {
        throw new Error("Encoder not initialized");
      }
      const paddedData = new Uint8Array(data.length + this.degree);
      paddedData.set(data);
      const remainder = Polynomial.mod(paddedData, this.genPoly);
      const start2 = this.degree - remainder.length;
      if (start2 > 0) {
        const buff = new Uint8Array(this.degree);
        buff.set(remainder, start2);
        return buff;
      }
      return remainder;
    };
    module.exports = ReedSolomonEncoder;
  }
});

// node_modules/qrcode/lib/core/version-check.js
var require_version_check = __commonJS({
  "node_modules/qrcode/lib/core/version-check.js"(exports) {
    exports.isValid = function isValid(version2) {
      return !isNaN(version2) && version2 >= 1 && version2 <= 40;
    };
  }
});

// node_modules/qrcode/lib/core/regex.js
var require_regex = __commonJS({
  "node_modules/qrcode/lib/core/regex.js"(exports) {
    var numeric = "[0-9]+";
    var alphanumeric = "[A-Z $%*+\\-./:]+";
    var kanji = "(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";
    kanji = kanji.replace(/u/g, "\\u");
    var byte = "(?:(?![A-Z0-9 $%*+\\-./:]|" + kanji + ")(?:.|[\r\n]))+";
    exports.KANJI = new RegExp(kanji, "g");
    exports.BYTE_KANJI = new RegExp("[^A-Z0-9 $%*+\\-./:]+", "g");
    exports.BYTE = new RegExp(byte, "g");
    exports.NUMERIC = new RegExp(numeric, "g");
    exports.ALPHANUMERIC = new RegExp(alphanumeric, "g");
    var TEST_KANJI = new RegExp("^" + kanji + "$");
    var TEST_NUMERIC = new RegExp("^" + numeric + "$");
    var TEST_ALPHANUMERIC = new RegExp("^[A-Z0-9 $%*+\\-./:]+$");
    exports.testKanji = function testKanji(str) {
      return TEST_KANJI.test(str);
    };
    exports.testNumeric = function testNumeric(str) {
      return TEST_NUMERIC.test(str);
    };
    exports.testAlphanumeric = function testAlphanumeric(str) {
      return TEST_ALPHANUMERIC.test(str);
    };
  }
});

// node_modules/qrcode/lib/core/mode.js
var require_mode = __commonJS({
  "node_modules/qrcode/lib/core/mode.js"(exports) {
    var VersionCheck = require_version_check();
    var Regex = require_regex();
    exports.NUMERIC = {
      id: "Numeric",
      bit: 1 << 0,
      ccBits: [10, 12, 14]
    };
    exports.ALPHANUMERIC = {
      id: "Alphanumeric",
      bit: 1 << 1,
      ccBits: [9, 11, 13]
    };
    exports.BYTE = {
      id: "Byte",
      bit: 1 << 2,
      ccBits: [8, 16, 16]
    };
    exports.KANJI = {
      id: "Kanji",
      bit: 1 << 3,
      ccBits: [8, 10, 12]
    };
    exports.MIXED = {
      bit: -1
    };
    exports.getCharCountIndicator = function getCharCountIndicator(mode, version2) {
      if (!mode.ccBits) throw new Error("Invalid mode: " + mode);
      if (!VersionCheck.isValid(version2)) {
        throw new Error("Invalid version: " + version2);
      }
      if (version2 >= 1 && version2 < 10) return mode.ccBits[0];
      else if (version2 < 27) return mode.ccBits[1];
      return mode.ccBits[2];
    };
    exports.getBestModeForData = function getBestModeForData(dataStr) {
      if (Regex.testNumeric(dataStr)) return exports.NUMERIC;
      else if (Regex.testAlphanumeric(dataStr)) return exports.ALPHANUMERIC;
      else if (Regex.testKanji(dataStr)) return exports.KANJI;
      else return exports.BYTE;
    };
    exports.toString = function toString(mode) {
      if (mode && mode.id) return mode.id;
      throw new Error("Invalid mode");
    };
    exports.isValid = function isValid(mode) {
      return mode && mode.bit && mode.ccBits;
    };
    function fromString(string) {
      if (typeof string !== "string") {
        throw new Error("Param is not a string");
      }
      const lcStr = string.toLowerCase();
      switch (lcStr) {
        case "numeric":
          return exports.NUMERIC;
        case "alphanumeric":
          return exports.ALPHANUMERIC;
        case "kanji":
          return exports.KANJI;
        case "byte":
          return exports.BYTE;
        default:
          throw new Error("Unknown mode: " + string);
      }
    }
    exports.from = function from(value, defaultValue) {
      if (exports.isValid(value)) {
        return value;
      }
      try {
        return fromString(value);
      } catch (e) {
        return defaultValue;
      }
    };
  }
});

// node_modules/qrcode/lib/core/version.js
var require_version = __commonJS({
  "node_modules/qrcode/lib/core/version.js"(exports) {
    var Utils = require_utils();
    var ECCode = require_error_correction_code();
    var ECLevel = require_error_correction_level();
    var Mode = require_mode();
    var VersionCheck = require_version_check();
    var G18 = 1 << 12 | 1 << 11 | 1 << 10 | 1 << 9 | 1 << 8 | 1 << 5 | 1 << 2 | 1 << 0;
    var G18_BCH = Utils.getBCHDigit(G18);
    function getBestVersionForDataLength(mode, length, errorCorrectionLevel) {
      for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
        if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, mode)) {
          return currentVersion;
        }
      }
      return void 0;
    }
    function getReservedBitsCount(mode, version2) {
      return Mode.getCharCountIndicator(mode, version2) + 4;
    }
    function getTotalBitsFromDataArray(segments, version2) {
      let totalBits = 0;
      segments.forEach(function(data) {
        const reservedBits = getReservedBitsCount(data.mode, version2);
        totalBits += reservedBits + data.getBitsLength();
      });
      return totalBits;
    }
    function getBestVersionForMixedData(segments, errorCorrectionLevel) {
      for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
        const length = getTotalBitsFromDataArray(segments, currentVersion);
        if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, Mode.MIXED)) {
          return currentVersion;
        }
      }
      return void 0;
    }
    exports.from = function from(value, defaultValue) {
      if (VersionCheck.isValid(value)) {
        return parseInt(value, 10);
      }
      return defaultValue;
    };
    exports.getCapacity = function getCapacity(version2, errorCorrectionLevel, mode) {
      if (!VersionCheck.isValid(version2)) {
        throw new Error("Invalid QR Code version");
      }
      if (typeof mode === "undefined") mode = Mode.BYTE;
      const totalCodewords = Utils.getSymbolTotalCodewords(version2);
      const ecTotalCodewords = ECCode.getTotalCodewordsCount(version2, errorCorrectionLevel);
      const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;
      if (mode === Mode.MIXED) return dataTotalCodewordsBits;
      const usableBits = dataTotalCodewordsBits - getReservedBitsCount(mode, version2);
      switch (mode) {
        case Mode.NUMERIC:
          return Math.floor(usableBits / 10 * 3);
        case Mode.ALPHANUMERIC:
          return Math.floor(usableBits / 11 * 2);
        case Mode.KANJI:
          return Math.floor(usableBits / 13);
        case Mode.BYTE:
        default:
          return Math.floor(usableBits / 8);
      }
    };
    exports.getBestVersionForData = function getBestVersionForData(data, errorCorrectionLevel) {
      let seg;
      const ecl = ECLevel.from(errorCorrectionLevel, ECLevel.M);
      if (Array.isArray(data)) {
        if (data.length > 1) {
          return getBestVersionForMixedData(data, ecl);
        }
        if (data.length === 0) {
          return 1;
        }
        seg = data[0];
      } else {
        seg = data;
      }
      return getBestVersionForDataLength(seg.mode, seg.getLength(), ecl);
    };
    exports.getEncodedBits = function getEncodedBits(version2) {
      if (!VersionCheck.isValid(version2) || version2 < 7) {
        throw new Error("Invalid QR Code version");
      }
      let d = version2 << 12;
      while (Utils.getBCHDigit(d) - G18_BCH >= 0) {
        d ^= G18 << Utils.getBCHDigit(d) - G18_BCH;
      }
      return version2 << 12 | d;
    };
  }
});

// node_modules/qrcode/lib/core/format-info.js
var require_format_info = __commonJS({
  "node_modules/qrcode/lib/core/format-info.js"(exports) {
    var Utils = require_utils();
    var G15 = 1 << 10 | 1 << 8 | 1 << 5 | 1 << 4 | 1 << 2 | 1 << 1 | 1 << 0;
    var G15_MASK = 1 << 14 | 1 << 12 | 1 << 10 | 1 << 4 | 1 << 1;
    var G15_BCH = Utils.getBCHDigit(G15);
    exports.getEncodedBits = function getEncodedBits(errorCorrectionLevel, mask) {
      const data = errorCorrectionLevel.bit << 3 | mask;
      let d = data << 10;
      while (Utils.getBCHDigit(d) - G15_BCH >= 0) {
        d ^= G15 << Utils.getBCHDigit(d) - G15_BCH;
      }
      return (data << 10 | d) ^ G15_MASK;
    };
  }
});

// node_modules/qrcode/lib/core/numeric-data.js
var require_numeric_data = __commonJS({
  "node_modules/qrcode/lib/core/numeric-data.js"(exports, module) {
    var Mode = require_mode();
    function NumericData(data) {
      this.mode = Mode.NUMERIC;
      this.data = data.toString();
    }
    NumericData.getBitsLength = function getBitsLength(length) {
      return 10 * Math.floor(length / 3) + (length % 3 ? length % 3 * 3 + 1 : 0);
    };
    NumericData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    NumericData.prototype.getBitsLength = function getBitsLength() {
      return NumericData.getBitsLength(this.data.length);
    };
    NumericData.prototype.write = function write(bitBuffer) {
      let i, group, value;
      for (i = 0; i + 3 <= this.data.length; i += 3) {
        group = this.data.substr(i, 3);
        value = parseInt(group, 10);
        bitBuffer.put(value, 10);
      }
      const remainingNum = this.data.length - i;
      if (remainingNum > 0) {
        group = this.data.substr(i);
        value = parseInt(group, 10);
        bitBuffer.put(value, remainingNum * 3 + 1);
      }
    };
    module.exports = NumericData;
  }
});

// node_modules/qrcode/lib/core/alphanumeric-data.js
var require_alphanumeric_data = __commonJS({
  "node_modules/qrcode/lib/core/alphanumeric-data.js"(exports, module) {
    var Mode = require_mode();
    var ALPHA_NUM_CHARS = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
      " ",
      "$",
      "%",
      "*",
      "+",
      "-",
      ".",
      "/",
      ":"
    ];
    function AlphanumericData(data) {
      this.mode = Mode.ALPHANUMERIC;
      this.data = data;
    }
    AlphanumericData.getBitsLength = function getBitsLength(length) {
      return 11 * Math.floor(length / 2) + 6 * (length % 2);
    };
    AlphanumericData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    AlphanumericData.prototype.getBitsLength = function getBitsLength() {
      return AlphanumericData.getBitsLength(this.data.length);
    };
    AlphanumericData.prototype.write = function write(bitBuffer) {
      let i;
      for (i = 0; i + 2 <= this.data.length; i += 2) {
        let value = ALPHA_NUM_CHARS.indexOf(this.data[i]) * 45;
        value += ALPHA_NUM_CHARS.indexOf(this.data[i + 1]);
        bitBuffer.put(value, 11);
      }
      if (this.data.length % 2) {
        bitBuffer.put(ALPHA_NUM_CHARS.indexOf(this.data[i]), 6);
      }
    };
    module.exports = AlphanumericData;
  }
});

// node_modules/qrcode/lib/core/byte-data.js
var require_byte_data = __commonJS({
  "node_modules/qrcode/lib/core/byte-data.js"(exports, module) {
    var Mode = require_mode();
    function ByteData(data) {
      this.mode = Mode.BYTE;
      if (typeof data === "string") {
        this.data = new TextEncoder().encode(data);
      } else {
        this.data = new Uint8Array(data);
      }
    }
    ByteData.getBitsLength = function getBitsLength(length) {
      return length * 8;
    };
    ByteData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    ByteData.prototype.getBitsLength = function getBitsLength() {
      return ByteData.getBitsLength(this.data.length);
    };
    ByteData.prototype.write = function(bitBuffer) {
      for (let i = 0, l = this.data.length; i < l; i++) {
        bitBuffer.put(this.data[i], 8);
      }
    };
    module.exports = ByteData;
  }
});

// node_modules/qrcode/lib/core/kanji-data.js
var require_kanji_data = __commonJS({
  "node_modules/qrcode/lib/core/kanji-data.js"(exports, module) {
    var Mode = require_mode();
    var Utils = require_utils();
    function KanjiData(data) {
      this.mode = Mode.KANJI;
      this.data = data;
    }
    KanjiData.getBitsLength = function getBitsLength(length) {
      return length * 13;
    };
    KanjiData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    KanjiData.prototype.getBitsLength = function getBitsLength() {
      return KanjiData.getBitsLength(this.data.length);
    };
    KanjiData.prototype.write = function(bitBuffer) {
      let i;
      for (i = 0; i < this.data.length; i++) {
        let value = Utils.toSJIS(this.data[i]);
        if (value >= 33088 && value <= 40956) {
          value -= 33088;
        } else if (value >= 57408 && value <= 60351) {
          value -= 49472;
        } else {
          throw new Error(
            "Invalid SJIS character: " + this.data[i] + "\nMake sure your charset is UTF-8"
          );
        }
        value = (value >>> 8 & 255) * 192 + (value & 255);
        bitBuffer.put(value, 13);
      }
    };
    module.exports = KanjiData;
  }
});

// node_modules/dijkstrajs/dijkstra.js
var require_dijkstra = __commonJS({
  "node_modules/dijkstrajs/dijkstra.js"(exports, module) {
    "use strict";
    var dijkstra = {
      single_source_shortest_paths: function(graph, s, d) {
        var predecessors = {};
        var costs = {};
        costs[s] = 0;
        var open = dijkstra.PriorityQueue.make();
        open.push(s, 0);
        var closest, u, v, cost_of_s_to_u, adjacent_nodes, cost_of_e, cost_of_s_to_u_plus_cost_of_e, cost_of_s_to_v, first_visit;
        while (!open.empty()) {
          closest = open.pop();
          u = closest.value;
          cost_of_s_to_u = closest.cost;
          adjacent_nodes = graph[u] || {};
          for (v in adjacent_nodes) {
            if (adjacent_nodes.hasOwnProperty(v)) {
              cost_of_e = adjacent_nodes[v];
              cost_of_s_to_u_plus_cost_of_e = cost_of_s_to_u + cost_of_e;
              cost_of_s_to_v = costs[v];
              first_visit = typeof costs[v] === "undefined";
              if (first_visit || cost_of_s_to_v > cost_of_s_to_u_plus_cost_of_e) {
                costs[v] = cost_of_s_to_u_plus_cost_of_e;
                open.push(v, cost_of_s_to_u_plus_cost_of_e);
                predecessors[v] = u;
              }
            }
          }
        }
        if (typeof d !== "undefined" && typeof costs[d] === "undefined") {
          var msg = ["Could not find a path from ", s, " to ", d, "."].join("");
          throw new Error(msg);
        }
        return predecessors;
      },
      extract_shortest_path_from_predecessor_list: function(predecessors, d) {
        var nodes = [];
        var u = d;
        var predecessor;
        while (u) {
          nodes.push(u);
          predecessor = predecessors[u];
          u = predecessors[u];
        }
        nodes.reverse();
        return nodes;
      },
      find_path: function(graph, s, d) {
        var predecessors = dijkstra.single_source_shortest_paths(graph, s, d);
        return dijkstra.extract_shortest_path_from_predecessor_list(
          predecessors,
          d
        );
      },
      /**
       * A very naive priority queue implementation.
       */
      PriorityQueue: {
        make: function(opts) {
          var T = dijkstra.PriorityQueue, t = {}, key;
          opts = opts || {};
          for (key in T) {
            if (T.hasOwnProperty(key)) {
              t[key] = T[key];
            }
          }
          t.queue = [];
          t.sorter = opts.sorter || T.default_sorter;
          return t;
        },
        default_sorter: function(a, b) {
          return a.cost - b.cost;
        },
        /**
         * Add a new item to the queue and ensure the highest priority element
         * is at the front of the queue.
         */
        push: function(value, cost) {
          var item = { value, cost };
          this.queue.push(item);
          this.queue.sort(this.sorter);
        },
        /**
         * Return the highest priority element in the queue.
         */
        pop: function() {
          return this.queue.shift();
        },
        empty: function() {
          return this.queue.length === 0;
        }
      }
    };
    if (typeof module !== "undefined") {
      module.exports = dijkstra;
    }
  }
});

// node_modules/qrcode/lib/core/segments.js
var require_segments = __commonJS({
  "node_modules/qrcode/lib/core/segments.js"(exports) {
    var Mode = require_mode();
    var NumericData = require_numeric_data();
    var AlphanumericData = require_alphanumeric_data();
    var ByteData = require_byte_data();
    var KanjiData = require_kanji_data();
    var Regex = require_regex();
    var Utils = require_utils();
    var dijkstra = require_dijkstra();
    function getStringByteLength(str) {
      return unescape(encodeURIComponent(str)).length;
    }
    function getSegments(regex, mode, str) {
      const segments = [];
      let result;
      while ((result = regex.exec(str)) !== null) {
        segments.push({
          data: result[0],
          index: result.index,
          mode,
          length: result[0].length
        });
      }
      return segments;
    }
    function getSegmentsFromString(dataStr) {
      const numSegs = getSegments(Regex.NUMERIC, Mode.NUMERIC, dataStr);
      const alphaNumSegs = getSegments(Regex.ALPHANUMERIC, Mode.ALPHANUMERIC, dataStr);
      let byteSegs;
      let kanjiSegs;
      if (Utils.isKanjiModeEnabled()) {
        byteSegs = getSegments(Regex.BYTE, Mode.BYTE, dataStr);
        kanjiSegs = getSegments(Regex.KANJI, Mode.KANJI, dataStr);
      } else {
        byteSegs = getSegments(Regex.BYTE_KANJI, Mode.BYTE, dataStr);
        kanjiSegs = [];
      }
      const segs = numSegs.concat(alphaNumSegs, byteSegs, kanjiSegs);
      return segs.sort(function(s1, s2) {
        return s1.index - s2.index;
      }).map(function(obj) {
        return {
          data: obj.data,
          mode: obj.mode,
          length: obj.length
        };
      });
    }
    function getSegmentBitsLength(length, mode) {
      switch (mode) {
        case Mode.NUMERIC:
          return NumericData.getBitsLength(length);
        case Mode.ALPHANUMERIC:
          return AlphanumericData.getBitsLength(length);
        case Mode.KANJI:
          return KanjiData.getBitsLength(length);
        case Mode.BYTE:
          return ByteData.getBitsLength(length);
      }
    }
    function mergeSegments(segs) {
      return segs.reduce(function(acc, curr) {
        const prevSeg = acc.length - 1 >= 0 ? acc[acc.length - 1] : null;
        if (prevSeg && prevSeg.mode === curr.mode) {
          acc[acc.length - 1].data += curr.data;
          return acc;
        }
        acc.push(curr);
        return acc;
      }, []);
    }
    function buildNodes(segs) {
      const nodes = [];
      for (let i = 0; i < segs.length; i++) {
        const seg = segs[i];
        switch (seg.mode) {
          case Mode.NUMERIC:
            nodes.push([
              seg,
              { data: seg.data, mode: Mode.ALPHANUMERIC, length: seg.length },
              { data: seg.data, mode: Mode.BYTE, length: seg.length }
            ]);
            break;
          case Mode.ALPHANUMERIC:
            nodes.push([
              seg,
              { data: seg.data, mode: Mode.BYTE, length: seg.length }
            ]);
            break;
          case Mode.KANJI:
            nodes.push([
              seg,
              { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
            ]);
            break;
          case Mode.BYTE:
            nodes.push([
              { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
            ]);
        }
      }
      return nodes;
    }
    function buildGraph(nodes, version2) {
      const table = {};
      const graph = { start: {} };
      let prevNodeIds = ["start"];
      for (let i = 0; i < nodes.length; i++) {
        const nodeGroup = nodes[i];
        const currentNodeIds = [];
        for (let j = 0; j < nodeGroup.length; j++) {
          const node = nodeGroup[j];
          const key = "" + i + j;
          currentNodeIds.push(key);
          table[key] = { node, lastCount: 0 };
          graph[key] = {};
          for (let n = 0; n < prevNodeIds.length; n++) {
            const prevNodeId = prevNodeIds[n];
            if (table[prevNodeId] && table[prevNodeId].node.mode === node.mode) {
              graph[prevNodeId][key] = getSegmentBitsLength(table[prevNodeId].lastCount + node.length, node.mode) - getSegmentBitsLength(table[prevNodeId].lastCount, node.mode);
              table[prevNodeId].lastCount += node.length;
            } else {
              if (table[prevNodeId]) table[prevNodeId].lastCount = node.length;
              graph[prevNodeId][key] = getSegmentBitsLength(node.length, node.mode) + 4 + Mode.getCharCountIndicator(node.mode, version2);
            }
          }
        }
        prevNodeIds = currentNodeIds;
      }
      for (let n = 0; n < prevNodeIds.length; n++) {
        graph[prevNodeIds[n]].end = 0;
      }
      return { map: graph, table };
    }
    function buildSingleSegment(data, modesHint) {
      let mode;
      const bestMode = Mode.getBestModeForData(data);
      mode = Mode.from(modesHint, bestMode);
      if (mode !== Mode.BYTE && mode.bit < bestMode.bit) {
        throw new Error('"' + data + '" cannot be encoded with mode ' + Mode.toString(mode) + ".\n Suggested mode is: " + Mode.toString(bestMode));
      }
      if (mode === Mode.KANJI && !Utils.isKanjiModeEnabled()) {
        mode = Mode.BYTE;
      }
      switch (mode) {
        case Mode.NUMERIC:
          return new NumericData(data);
        case Mode.ALPHANUMERIC:
          return new AlphanumericData(data);
        case Mode.KANJI:
          return new KanjiData(data);
        case Mode.BYTE:
          return new ByteData(data);
      }
    }
    exports.fromArray = function fromArray(array) {
      return array.reduce(function(acc, seg) {
        if (typeof seg === "string") {
          acc.push(buildSingleSegment(seg, null));
        } else if (seg.data) {
          acc.push(buildSingleSegment(seg.data, seg.mode));
        }
        return acc;
      }, []);
    };
    exports.fromString = function fromString(data, version2) {
      const segs = getSegmentsFromString(data, Utils.isKanjiModeEnabled());
      const nodes = buildNodes(segs);
      const graph = buildGraph(nodes, version2);
      const path = dijkstra.find_path(graph.map, "start", "end");
      const optimizedSegs = [];
      for (let i = 1; i < path.length - 1; i++) {
        optimizedSegs.push(graph.table[path[i]].node);
      }
      return exports.fromArray(mergeSegments(optimizedSegs));
    };
    exports.rawSplit = function rawSplit(data) {
      return exports.fromArray(
        getSegmentsFromString(data, Utils.isKanjiModeEnabled())
      );
    };
  }
});

// node_modules/qrcode/lib/core/qrcode.js
var require_qrcode = __commonJS({
  "node_modules/qrcode/lib/core/qrcode.js"(exports) {
    var Utils = require_utils();
    var ECLevel = require_error_correction_level();
    var BitBuffer = require_bit_buffer();
    var BitMatrix = require_bit_matrix();
    var AlignmentPattern = require_alignment_pattern();
    var FinderPattern = require_finder_pattern();
    var MaskPattern = require_mask_pattern();
    var ECCode = require_error_correction_code();
    var ReedSolomonEncoder = require_reed_solomon_encoder();
    var Version = require_version();
    var FormatInfo = require_format_info();
    var Mode = require_mode();
    var Segments = require_segments();
    function setupFinderPattern(matrix, version2) {
      const size = matrix.size;
      const pos = FinderPattern.getPositions(version2);
      for (let i = 0; i < pos.length; i++) {
        const row = pos[i][0];
        const col = pos[i][1];
        for (let r = -1; r <= 7; r++) {
          if (row + r <= -1 || size <= row + r) continue;
          for (let c = -1; c <= 7; c++) {
            if (col + c <= -1 || size <= col + c) continue;
            if (r >= 0 && r <= 6 && (c === 0 || c === 6) || c >= 0 && c <= 6 && (r === 0 || r === 6) || r >= 2 && r <= 4 && c >= 2 && c <= 4) {
              matrix.set(row + r, col + c, true, true);
            } else {
              matrix.set(row + r, col + c, false, true);
            }
          }
        }
      }
    }
    function setupTimingPattern(matrix) {
      const size = matrix.size;
      for (let r = 8; r < size - 8; r++) {
        const value = r % 2 === 0;
        matrix.set(r, 6, value, true);
        matrix.set(6, r, value, true);
      }
    }
    function setupAlignmentPattern(matrix, version2) {
      const pos = AlignmentPattern.getPositions(version2);
      for (let i = 0; i < pos.length; i++) {
        const row = pos[i][0];
        const col = pos[i][1];
        for (let r = -2; r <= 2; r++) {
          for (let c = -2; c <= 2; c++) {
            if (r === -2 || r === 2 || c === -2 || c === 2 || r === 0 && c === 0) {
              matrix.set(row + r, col + c, true, true);
            } else {
              matrix.set(row + r, col + c, false, true);
            }
          }
        }
      }
    }
    function setupVersionInfo(matrix, version2) {
      const size = matrix.size;
      const bits = Version.getEncodedBits(version2);
      let row, col, mod;
      for (let i = 0; i < 18; i++) {
        row = Math.floor(i / 3);
        col = i % 3 + size - 8 - 3;
        mod = (bits >> i & 1) === 1;
        matrix.set(row, col, mod, true);
        matrix.set(col, row, mod, true);
      }
    }
    function setupFormatInfo(matrix, errorCorrectionLevel, maskPattern) {
      const size = matrix.size;
      const bits = FormatInfo.getEncodedBits(errorCorrectionLevel, maskPattern);
      let i, mod;
      for (i = 0; i < 15; i++) {
        mod = (bits >> i & 1) === 1;
        if (i < 6) {
          matrix.set(i, 8, mod, true);
        } else if (i < 8) {
          matrix.set(i + 1, 8, mod, true);
        } else {
          matrix.set(size - 15 + i, 8, mod, true);
        }
        if (i < 8) {
          matrix.set(8, size - i - 1, mod, true);
        } else if (i < 9) {
          matrix.set(8, 15 - i - 1 + 1, mod, true);
        } else {
          matrix.set(8, 15 - i - 1, mod, true);
        }
      }
      matrix.set(size - 8, 8, 1, true);
    }
    function setupData(matrix, data) {
      const size = matrix.size;
      let inc = -1;
      let row = size - 1;
      let bitIndex = 7;
      let byteIndex = 0;
      for (let col = size - 1; col > 0; col -= 2) {
        if (col === 6) col--;
        while (true) {
          for (let c = 0; c < 2; c++) {
            if (!matrix.isReserved(row, col - c)) {
              let dark = false;
              if (byteIndex < data.length) {
                dark = (data[byteIndex] >>> bitIndex & 1) === 1;
              }
              matrix.set(row, col - c, dark);
              bitIndex--;
              if (bitIndex === -1) {
                byteIndex++;
                bitIndex = 7;
              }
            }
          }
          row += inc;
          if (row < 0 || size <= row) {
            row -= inc;
            inc = -inc;
            break;
          }
        }
      }
    }
    function createData(version2, errorCorrectionLevel, segments) {
      const buffer = new BitBuffer();
      segments.forEach(function(data) {
        buffer.put(data.mode.bit, 4);
        buffer.put(data.getLength(), Mode.getCharCountIndicator(data.mode, version2));
        data.write(buffer);
      });
      const totalCodewords = Utils.getSymbolTotalCodewords(version2);
      const ecTotalCodewords = ECCode.getTotalCodewordsCount(version2, errorCorrectionLevel);
      const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;
      if (buffer.getLengthInBits() + 4 <= dataTotalCodewordsBits) {
        buffer.put(0, 4);
      }
      while (buffer.getLengthInBits() % 8 !== 0) {
        buffer.putBit(0);
      }
      const remainingByte = (dataTotalCodewordsBits - buffer.getLengthInBits()) / 8;
      for (let i = 0; i < remainingByte; i++) {
        buffer.put(i % 2 ? 17 : 236, 8);
      }
      return createCodewords(buffer, version2, errorCorrectionLevel);
    }
    function createCodewords(bitBuffer, version2, errorCorrectionLevel) {
      const totalCodewords = Utils.getSymbolTotalCodewords(version2);
      const ecTotalCodewords = ECCode.getTotalCodewordsCount(version2, errorCorrectionLevel);
      const dataTotalCodewords = totalCodewords - ecTotalCodewords;
      const ecTotalBlocks = ECCode.getBlocksCount(version2, errorCorrectionLevel);
      const blocksInGroup2 = totalCodewords % ecTotalBlocks;
      const blocksInGroup1 = ecTotalBlocks - blocksInGroup2;
      const totalCodewordsInGroup1 = Math.floor(totalCodewords / ecTotalBlocks);
      const dataCodewordsInGroup1 = Math.floor(dataTotalCodewords / ecTotalBlocks);
      const dataCodewordsInGroup2 = dataCodewordsInGroup1 + 1;
      const ecCount = totalCodewordsInGroup1 - dataCodewordsInGroup1;
      const rs = new ReedSolomonEncoder(ecCount);
      let offset = 0;
      const dcData = new Array(ecTotalBlocks);
      const ecData = new Array(ecTotalBlocks);
      let maxDataSize = 0;
      const buffer = new Uint8Array(bitBuffer.buffer);
      for (let b = 0; b < ecTotalBlocks; b++) {
        const dataSize = b < blocksInGroup1 ? dataCodewordsInGroup1 : dataCodewordsInGroup2;
        dcData[b] = buffer.slice(offset, offset + dataSize);
        ecData[b] = rs.encode(dcData[b]);
        offset += dataSize;
        maxDataSize = Math.max(maxDataSize, dataSize);
      }
      const data = new Uint8Array(totalCodewords);
      let index = 0;
      let i, r;
      for (i = 0; i < maxDataSize; i++) {
        for (r = 0; r < ecTotalBlocks; r++) {
          if (i < dcData[r].length) {
            data[index++] = dcData[r][i];
          }
        }
      }
      for (i = 0; i < ecCount; i++) {
        for (r = 0; r < ecTotalBlocks; r++) {
          data[index++] = ecData[r][i];
        }
      }
      return data;
    }
    function createSymbol(data, version2, errorCorrectionLevel, maskPattern) {
      let segments;
      if (Array.isArray(data)) {
        segments = Segments.fromArray(data);
      } else if (typeof data === "string") {
        let estimatedVersion = version2;
        if (!estimatedVersion) {
          const rawSegments = Segments.rawSplit(data);
          estimatedVersion = Version.getBestVersionForData(rawSegments, errorCorrectionLevel);
        }
        segments = Segments.fromString(data, estimatedVersion || 40);
      } else {
        throw new Error("Invalid data");
      }
      const bestVersion = Version.getBestVersionForData(segments, errorCorrectionLevel);
      if (!bestVersion) {
        throw new Error("The amount of data is too big to be stored in a QR Code");
      }
      if (!version2) {
        version2 = bestVersion;
      } else if (version2 < bestVersion) {
        throw new Error(
          "\nThe chosen QR Code version cannot contain this amount of data.\nMinimum version required to store current data is: " + bestVersion + ".\n"
        );
      }
      const dataBits = createData(version2, errorCorrectionLevel, segments);
      const moduleCount = Utils.getSymbolSize(version2);
      const modules = new BitMatrix(moduleCount);
      setupFinderPattern(modules, version2);
      setupTimingPattern(modules);
      setupAlignmentPattern(modules, version2);
      setupFormatInfo(modules, errorCorrectionLevel, 0);
      if (version2 >= 7) {
        setupVersionInfo(modules, version2);
      }
      setupData(modules, dataBits);
      if (isNaN(maskPattern)) {
        maskPattern = MaskPattern.getBestMask(
          modules,
          setupFormatInfo.bind(null, modules, errorCorrectionLevel)
        );
      }
      MaskPattern.applyMask(maskPattern, modules);
      setupFormatInfo(modules, errorCorrectionLevel, maskPattern);
      return {
        modules,
        version: version2,
        errorCorrectionLevel,
        maskPattern,
        segments
      };
    }
    exports.create = function create(data, options) {
      if (typeof data === "undefined" || data === "") {
        throw new Error("No input text");
      }
      let errorCorrectionLevel = ECLevel.M;
      let version2;
      let mask;
      if (typeof options !== "undefined") {
        errorCorrectionLevel = ECLevel.from(options.errorCorrectionLevel, ECLevel.M);
        version2 = Version.from(options.version);
        mask = MaskPattern.from(options.maskPattern);
        if (options.toSJISFunc) {
          Utils.setToSJISFunction(options.toSJISFunc);
        }
      }
      return createSymbol(data, version2, errorCorrectionLevel, mask);
    };
  }
});

// node_modules/qrcode/lib/renderer/utils.js
var require_utils2 = __commonJS({
  "node_modules/qrcode/lib/renderer/utils.js"(exports) {
    function hex2rgba(hex) {
      if (typeof hex === "number") {
        hex = hex.toString();
      }
      if (typeof hex !== "string") {
        throw new Error("Color should be defined as hex string");
      }
      let hexCode = hex.slice().replace("#", "").split("");
      if (hexCode.length < 3 || hexCode.length === 5 || hexCode.length > 8) {
        throw new Error("Invalid hex color: " + hex);
      }
      if (hexCode.length === 3 || hexCode.length === 4) {
        hexCode = Array.prototype.concat.apply([], hexCode.map(function(c) {
          return [c, c];
        }));
      }
      if (hexCode.length === 6) hexCode.push("F", "F");
      const hexValue = parseInt(hexCode.join(""), 16);
      return {
        r: hexValue >> 24 & 255,
        g: hexValue >> 16 & 255,
        b: hexValue >> 8 & 255,
        a: hexValue & 255,
        hex: "#" + hexCode.slice(0, 6).join("")
      };
    }
    exports.getOptions = function getOptions(options) {
      if (!options) options = {};
      if (!options.color) options.color = {};
      const margin = typeof options.margin === "undefined" || options.margin === null || options.margin < 0 ? 4 : options.margin;
      const width = options.width && options.width >= 21 ? options.width : void 0;
      const scale = options.scale || 4;
      return {
        width,
        scale: width ? 4 : scale,
        margin,
        color: {
          dark: hex2rgba(options.color.dark || "#000000ff"),
          light: hex2rgba(options.color.light || "#ffffffff")
        },
        type: options.type,
        rendererOpts: options.rendererOpts || {}
      };
    };
    exports.getScale = function getScale(qrSize, opts) {
      return opts.width && opts.width >= qrSize + opts.margin * 2 ? opts.width / (qrSize + opts.margin * 2) : opts.scale;
    };
    exports.getImageWidth = function getImageWidth(qrSize, opts) {
      const scale = exports.getScale(qrSize, opts);
      return Math.floor((qrSize + opts.margin * 2) * scale);
    };
    exports.qrToImageData = function qrToImageData(imgData, qr, opts) {
      const size = qr.modules.size;
      const data = qr.modules.data;
      const scale = exports.getScale(size, opts);
      const symbolSize = Math.floor((size + opts.margin * 2) * scale);
      const scaledMargin = opts.margin * scale;
      const palette = [opts.color.light, opts.color.dark];
      for (let i = 0; i < symbolSize; i++) {
        for (let j = 0; j < symbolSize; j++) {
          let posDst = (i * symbolSize + j) * 4;
          let pxColor = opts.color.light;
          if (i >= scaledMargin && j >= scaledMargin && i < symbolSize - scaledMargin && j < symbolSize - scaledMargin) {
            const iSrc = Math.floor((i - scaledMargin) / scale);
            const jSrc = Math.floor((j - scaledMargin) / scale);
            pxColor = palette[data[iSrc * size + jSrc] ? 1 : 0];
          }
          imgData[posDst++] = pxColor.r;
          imgData[posDst++] = pxColor.g;
          imgData[posDst++] = pxColor.b;
          imgData[posDst] = pxColor.a;
        }
      }
    };
  }
});

// node_modules/qrcode/lib/renderer/canvas.js
var require_canvas = __commonJS({
  "node_modules/qrcode/lib/renderer/canvas.js"(exports) {
    var Utils = require_utils2();
    function clearCanvas(ctx, canvas, size) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!canvas.style) canvas.style = {};
      canvas.height = size;
      canvas.width = size;
      canvas.style.height = size + "px";
      canvas.style.width = size + "px";
    }
    function getCanvasElement() {
      try {
        return document.createElement("canvas");
      } catch (e) {
        throw new Error("You need to specify a canvas element");
      }
    }
    exports.render = function render(qrData, canvas, options) {
      let opts = options;
      let canvasEl = canvas;
      if (typeof opts === "undefined" && (!canvas || !canvas.getContext)) {
        opts = canvas;
        canvas = void 0;
      }
      if (!canvas) {
        canvasEl = getCanvasElement();
      }
      opts = Utils.getOptions(opts);
      const size = Utils.getImageWidth(qrData.modules.size, opts);
      const ctx = canvasEl.getContext("2d");
      const image = ctx.createImageData(size, size);
      Utils.qrToImageData(image.data, qrData, opts);
      clearCanvas(ctx, canvasEl, size);
      ctx.putImageData(image, 0, 0);
      return canvasEl;
    };
    exports.renderToDataURL = function renderToDataURL(qrData, canvas, options) {
      let opts = options;
      if (typeof opts === "undefined" && (!canvas || !canvas.getContext)) {
        opts = canvas;
        canvas = void 0;
      }
      if (!opts) opts = {};
      const canvasEl = exports.render(qrData, canvas, opts);
      const type = opts.type || "image/png";
      const rendererOpts = opts.rendererOpts || {};
      return canvasEl.toDataURL(type, rendererOpts.quality);
    };
  }
});

// node_modules/qrcode/lib/renderer/svg-tag.js
var require_svg_tag = __commonJS({
  "node_modules/qrcode/lib/renderer/svg-tag.js"(exports) {
    var Utils = require_utils2();
    function getColorAttrib(color, attrib) {
      const alpha = color.a / 255;
      const str = attrib + '="' + color.hex + '"';
      return alpha < 1 ? str + " " + attrib + '-opacity="' + alpha.toFixed(2).slice(1) + '"' : str;
    }
    function svgCmd(cmd, x, y) {
      let str = cmd + x;
      if (typeof y !== "undefined") str += " " + y;
      return str;
    }
    function qrToPath(data, size, margin) {
      let path = "";
      let moveBy = 0;
      let newRow = false;
      let lineLength = 0;
      for (let i = 0; i < data.length; i++) {
        const col = Math.floor(i % size);
        const row = Math.floor(i / size);
        if (!col && !newRow) newRow = true;
        if (data[i]) {
          lineLength++;
          if (!(i > 0 && col > 0 && data[i - 1])) {
            path += newRow ? svgCmd("M", col + margin, 0.5 + row + margin) : svgCmd("m", moveBy, 0);
            moveBy = 0;
            newRow = false;
          }
          if (!(col + 1 < size && data[i + 1])) {
            path += svgCmd("h", lineLength);
            lineLength = 0;
          }
        } else {
          moveBy++;
        }
      }
      return path;
    }
    exports.render = function render(qrData, options, cb) {
      const opts = Utils.getOptions(options);
      const size = qrData.modules.size;
      const data = qrData.modules.data;
      const qrcodesize = size + opts.margin * 2;
      const bg = !opts.color.light.a ? "" : "<path " + getColorAttrib(opts.color.light, "fill") + ' d="M0 0h' + qrcodesize + "v" + qrcodesize + 'H0z"/>';
      const path = "<path " + getColorAttrib(opts.color.dark, "stroke") + ' d="' + qrToPath(data, size, opts.margin) + '"/>';
      const viewBox = 'viewBox="0 0 ' + qrcodesize + " " + qrcodesize + '"';
      const width = !opts.width ? "" : 'width="' + opts.width + '" height="' + opts.width + '" ';
      const svgTag = '<svg xmlns="http://www.w3.org/2000/svg" ' + width + viewBox + ' shape-rendering="crispEdges">' + bg + path + "</svg>\n";
      if (typeof cb === "function") {
        cb(null, svgTag);
      }
      return svgTag;
    };
  }
});

// node_modules/qrcode/lib/browser.js
var require_browser = __commonJS({
  "node_modules/qrcode/lib/browser.js"(exports) {
    var canPromise = require_can_promise();
    var QRCode2 = require_qrcode();
    var CanvasRenderer = require_canvas();
    var SvgRenderer = require_svg_tag();
    function renderCanvas(renderFunc, canvas, text, opts, cb) {
      const args = [].slice.call(arguments, 1);
      const argsNum = args.length;
      const isLastArgCb = typeof args[argsNum - 1] === "function";
      if (!isLastArgCb && !canPromise()) {
        throw new Error("Callback required as last argument");
      }
      if (isLastArgCb) {
        if (argsNum < 2) {
          throw new Error("Too few arguments provided");
        }
        if (argsNum === 2) {
          cb = text;
          text = canvas;
          canvas = opts = void 0;
        } else if (argsNum === 3) {
          if (canvas.getContext && typeof cb === "undefined") {
            cb = opts;
            opts = void 0;
          } else {
            cb = opts;
            opts = text;
            text = canvas;
            canvas = void 0;
          }
        }
      } else {
        if (argsNum < 1) {
          throw new Error("Too few arguments provided");
        }
        if (argsNum === 1) {
          text = canvas;
          canvas = opts = void 0;
        } else if (argsNum === 2 && !canvas.getContext) {
          opts = text;
          text = canvas;
          canvas = void 0;
        }
        return new Promise(function(resolve, reject) {
          try {
            const data = QRCode2.create(text, opts);
            resolve(renderFunc(data, canvas, opts));
          } catch (e) {
            reject(e);
          }
        });
      }
      try {
        const data = QRCode2.create(text, opts);
        cb(null, renderFunc(data, canvas, opts));
      } catch (e) {
        cb(e);
      }
    }
    exports.create = QRCode2.create;
    exports.toCanvas = renderCanvas.bind(null, CanvasRenderer.render);
    exports.toDataURL = renderCanvas.bind(null, CanvasRenderer.renderToDataURL);
    exports.toString = renderCanvas.bind(null, function(data, _, opts) {
      return SvgRenderer.render(data, opts);
    });
  }
});

// web/app.js
var import_qrcode = __toESM(require_browser(), 1);

// web/ui.js
function renderUI({ desktop: desktop2, native: native2, version: version2, icon: icon2, home }) {
  const tabs = [["monitor", desktop2 ? "\u76D1\u770B" : "\u76F8\u673A", "camera"], ["devices", "\u8FDE\u63A5", "link"], ["settings", "\u8BBE\u7F6E", "settings"]];
  const nav2 = (where) => `<nav class="${where}" aria-label="${where === "mobile-nav" ? "\u624B\u673A\u5BFC\u822A" : "\u4E3B\u5BFC\u822A"}">${tabs.map(([id, label, i]) => `<button data-page="${id}" class="${id === "monitor" ? "selected" : ""}">${icon2(i)}<span>${label}</span></button>`).join("")}</nav>`;
  return `
 <header class="app-header"><a class="brand" href="${home}" aria-label="Ninja Relay \u9996\u9875">${icon2("camera")}<span>Ninja Relay</span></a><div class="sidebar">${nav2("desktop-nav")}</div><span id="network" class="network">\u7F51\u7EDC\u53EF\u7528</span><button class="version-link" data-page="updates">v${version2}</button></header>
 <main><div id="notice" class="notice" role="status" hidden></div>
 <section id="page-monitor" class="page"><div class="page-heading"><div><h1>${desktop2 ? "\u5B9E\u65F6\u76D1\u770B" : "\u76F8\u673A"}</h1><p>${desktop2 ? "\u624B\u673A\u753B\u9762\u4E0E\u58F0\u97F3\uFF0C\u5728\u8FD9\u91CC\u63A5\u5165\u7535\u8111\u3002" : "\u5C06 iPhone \u53D8\u6210\u7535\u8111\u7684\u76F8\u673A\u548C\u9EA6\u514B\u98CE\u3002"}</p></div><span id="status-badge" class="status-badge">\u5F85\u8FDE\u63A5</span></div>
 <div id="setup-banner" class="setup-banner" hidden><div><strong>\u5148\u51C6\u5907\u597D\u7CFB\u7EDF\u8BBE\u5907</strong><p id="setup-summary">\u68C0\u67E5\u6444\u50CF\u5934\u548C\u9EA6\u514B\u98CE\u9A71\u52A8</p></div><button class="secondary" data-page="devices">\u5B8C\u6210\u8BBE\u7F6E</button></div>
 <div class="monitor-layout"><div class="monitor-main">
 <div class="preview" id="preview"><video id="video" playsinline autoplay muted></video><div class="preview-top"><span class="preview-label"><span id="live-dot"></span><span id="preview-state">${desktop2 ? "iPhone \u753B\u9762" : "\u672C\u673A\u9884\u89C8"}</span></span><span id="elapsed">00:00</span></div><div id="preview-empty" class="preview-empty">${icon2("camera")}<h2 id="empty-title">${desktop2 ? "\u7B49\u5F85 iPhone" : "\u51C6\u5907\u597D\u4F60\u7684\u955C\u5934"}</h2><p id="empty-copy">${desktop2 ? "\u624B\u673A\u626B\u7801\u8FDE\u63A5\u540E\uFF0C\u753B\u9762\u4F1A\u51FA\u73B0\u5728\u8FD9\u91CC\u3002" : "\u9996\u6B21\u4F7F\u7528\uFF0C\u5148\u8FDE\u63A5\u4F60\u7684\u7535\u8111\u3002"}</p><button class="preview-action" data-page="devices">${desktop2 ? "\u663E\u793A\u914D\u5BF9\u7801" : "\u8FDE\u63A5\u7535\u8111"}</button></div><div class="preview-bottom"><span id="camera-label">${desktop2 ? "iPhone" : "\u540E\u7F6E\u6444\u50CF\u5934"}</span><span id="preview-format">720p / 30 fps</span></div></div>
 <div class="audio-strip">${icon2("mic")}<div class="audio-title"><strong>\u624B\u673A\u58F0\u97F3</strong><span id="audio-state">\u7B49\u5F85\u97F3\u9891</span></div><div class="meter" id="meter" aria-label="\u97F3\u9891\u7535\u5E73">${Array.from({ length: 24 }, () => "<i></i>").join("")}</div><span id="audio-db">\u2212\u221E dB</span></div>
 <div class="transport"><div class="transport-note"><strong id="connection-title">\u5C1A\u672A\u8FDE\u63A5</strong><small id="connection-subtitle">${desktop2 ? "\u6253\u5F00\u624B\u673A\u76F8\u673A\u5E94\u7528\u5373\u53EF\u8FDE\u63A5" : "\u914D\u5BF9\u540E\uFF0C\u4E0B\u6B21\u6253\u5F00\u81EA\u52A8\u8FDE\u63A5"}</small></div><button id="flip" class="icon-button" aria-label="\u5207\u6362\u524D\u540E\u6444\u50CF\u5934" ${desktop2 ? "hidden" : ""}>${icon2("flip")}</button><button id="start" class="primary start-button">${icon2("play")}<span>${desktop2 ? "\u5F00\u59CB\u63A5\u6536" : "\u5F00\u542F\u76F8\u673A"}</span></button><button id="mute" class="icon-button" aria-label="\u9759\u97F3\u9EA6\u514B\u98CE" aria-pressed="false">${icon2("mic")}</button></div>
 <div class="stats"><div><span>\u89C6\u9891\u7801\u7387</span><strong id="stat-bitrate">\u2014 <small>Mbps</small></strong></div><div><span>\u7F51\u7EDC\u5F80\u8FD4</span><strong id="stat-rtt">\u2014 <small>ms</small></strong></div><div><span>\u63A5\u6536\u5E27\u7387</span><strong id="stat-fps">\u2014 <small>fps</small></strong></div><div><span>\u8FDE\u63A5\u8DEF\u5F84</span><strong id="stat-route">\u5F85\u8FDE\u63A5</strong></div></div><p id="performance-hint" class="performance-hint" role="status"></p>
 </div><aside class="inspector"><section class="output-panel"><h2>\u8F93\u51FA\u5230\u5176\u4ED6\u8F6F\u4EF6</h2><p class="hint">\u5F00\u542F\u540E\uFF0C\u5728 Chrome \u6216 Codex \u4E2D\u9009\u62E9\u4E0B\u65B9\u8BBE\u5907\u3002</p>
 ${desktop2 ? `<div class="output-row"><div class="output-heading">${icon2("camera")}<strong>\u6444\u50CF\u5934</strong><input id="camera-output" type="checkbox" role="switch" aria-label="\u542F\u7528\u865A\u62DF\u6444\u50CF\u5934"></div><span class="device-endpoint">Unity Video Capture</span><p id="camera-output-state">\u6B63\u5728\u68C0\u67E5\u8BBE\u5907</p></div><div class="output-row"><div class="output-heading">${icon2("mic")}<strong>\u9EA6\u514B\u98CE</strong><input id="audio-output" type="checkbox" role="switch" aria-label="\u542F\u7528\u865A\u62DF\u9EA6\u514B\u98CE"></div><span class="device-endpoint">CABLE Output</span><p id="mic-output-state">\u6B63\u5728\u68C0\u67E5\u7CFB\u7EDF\u5F55\u97F3\u8F93\u5165</p></div><button class="secondary full" data-page="devices">\u68C0\u67E5 / \u914D\u7F6E\u8BBE\u5907</button>` : ""}</section>
 <section class="device-summary"><div class="device-avatar">${icon2("phone")}</div><div><strong id="device-name">${desktop2 ? "iPhone" : "Windows \u63A5\u6536\u7AEF"}</strong><p id="device-status">\u5C1A\u672A\u8FDE\u63A5</p></div><span id="device-dot" class="device-dot"></span></section><div class="quality-summary"><span>\u5F53\u524D\u753B\u8D28</span><strong id="quality-name">\u5747\u8861 \xB7 720p</strong><button class="text-button" data-page="settings">\u8C03\u6574</button></div></aside></div></section>
 <section id="page-devices" class="page" hidden><div class="page-heading"><div><h1>${desktop2 ? "\u8FDE\u63A5\u4E0E\u8BBE\u5907" : "\u8FDE\u63A5\u7535\u8111"}</h1><p>${desktop2 ? "\u5B8C\u6210\u4E00\u6B21\u8BBE\u7F6E\uFF0C\u4E4B\u540E\u6253\u5F00\u5373\u53EF\u4F7F\u7528\u3002" : "\u626B\u63CF\u7535\u8111\u914D\u5BF9\u7801\uFF0C\u6216\u7C98\u8D34\u5B8C\u6574\u7684\u914D\u5BF9\u94FE\u63A5\u3002"}</p></div>${native2 ? '<button id="refresh-devices" class="secondary">\u91CD\u65B0\u68C0\u6D4B</button>' : ""}</div>
 <div class="connection-grid"><section class="panel pairing-panel"><div class="section-title"><span class="step">1</span><h2>${desktop2 ? "\u624B\u673A\u626B\u7801\u8FDE\u63A5" : "\u4FDD\u5B58\u914D\u5BF9"}</h2></div>${desktop2 ? `<canvas id="qr" aria-label="iPhone \u914D\u5BF9\u4E8C\u7EF4\u7801"></canvas><p>\u7528 iPhone \u76F8\u673A\u626B\u7801\uFF0C\u5728 Safari \u6253\u5F00</p><div class="pair-link"><input id="pair-url" readonly aria-label="\u914D\u5BF9\u5730\u5740"><button id="copy-pair" class="secondary">\u590D\u5236</button></div><button id="new-pair" class="text-button">\u66F4\u6362\u914D\u5BF9\u7801</button><p class="hint">\u7B49\u5F85\u624B\u673A\u663E\u793A\u201C\u5DF2\u5B8C\u6574\u7F13\u5B58\u201D\uFF0C\u518D\u4ECE Safari \u5206\u4EAB\u83DC\u5355\u6DFB\u52A0\u5230\u4E3B\u5C4F\u5E55\u3002</p>` : `<label for="pair-input">\u7535\u8111\u7684\u914D\u5BF9\u94FE\u63A5</label><textarea id="pair-input" rows="4" placeholder="\u7C98\u8D34\u7535\u8111\u201C\u8FDE\u63A5\u201D\u9875\u590D\u5236\u7684\u94FE\u63A5" autocomplete="off" spellcheck="false"></textarea><button id="save-pair" class="primary full">\u4FDD\u5B58\u5E76\u8FDE\u63A5</button><p id="saved-pair" class="hint">\u5C1A\u672A\u914D\u5BF9</p><button id="forget-pair" class="text-button">\u79FB\u9664\u6B64\u7535\u8111</button><dl class="details"><dt>\u63A5\u6536\u7AEF</dt><dd id="pair-name">\u672A\u8BBE\u7F6E</dd><dt>\u79BB\u7EBF\u8D44\u6E90</dt><dd id="cache-status">\u6B63\u5728\u68C0\u67E5</dd></dl>`}</section>
 ${desktop2 ? `<section class="panel setup-panel"><div class="section-title"><span class="step">2</span><h2>\u51C6\u5907 Windows \u8BBE\u5907</h2></div><div class="setup-device"><span class="setup-icon">${icon2("camera")}</span><div><h3>\u865A\u62DF\u6444\u50CF\u5934</h3><p id="driver-camera">\u9700\u8981\u5728 Windows \u63A5\u6536\u8F6F\u4EF6\u4E2D\u68C0\u6D4B</p></div><button id="install-camera" class="secondary" ${!native2 ? "disabled" : ""}>\u5B89\u88C5</button></div><div class="setup-device"><span class="setup-icon">${icon2("mic")}</span><div><h3>\u865A\u62DF\u9EA6\u514B\u98CE</h3><p id="driver-audio">\u9700\u8981\u5728 Windows \u63A5\u6536\u8F6F\u4EF6\u4E2D\u68C0\u6D4B</p></div><button id="install-audio" class="secondary">\u5B98\u7F51\u4E0B\u8F7D</button></div><p class="hint">\u97F3\u9891\u9A71\u52A8\u5B89\u88C5\uFF1A\u4E0B\u8F7D VB-CABLE\uFF0C\u89E3\u538B\u540E\u4EE5\u7BA1\u7406\u5458\u8FD0\u884C VBCABLE_Setup_x64.exe\uFF0C\u70B9\u51FB Install Driver\u3002\u6309\u5B89\u88C5\u5668\u63D0\u793A\u91CD\u542F\u7535\u8111\u3002</p><div class="setup-actions"><button id="configure-outputs" class="primary full" ${!native2 ? "disabled" : ""}>\u81EA\u52A8\u914D\u7F6E\u5E76\u542F\u7528\u8F93\u51FA</button><p id="output-result" role="status" class="hint"></p></div><details class="advanced"><summary>\u97F3\u9891\u8DEF\u7531</summary><label for="audio-device">\u865A\u62DF\u7EBF\u7F06\u7684\u64AD\u653E\u7AEF</label><select id="audio-device" ${!native2 ? "disabled" : ""}><option value="">\u7B49\u5F85\u68C0\u6D4B</option></select><p class="hint">\u624B\u673A\u58F0\u97F3\u9001\u5165 CABLE Input\uFF1BCodex \u7B49\u8F6F\u4EF6\u4ECE CABLE Output \u5F55\u97F3\u3002</p></details></section><section class="panel test-panel"><div class="section-title"><span class="step">3</span><h2>\u9A8C\u8BC1\u9EA6\u514B\u98CE</h2></div><p id="capture-status">\u6B63\u5728\u68C0\u67E5 Windows \u5F55\u97F3\u8F93\u5165</p><div class="button-row"><button id="test-microphone" class="secondary" ${!native2 ? "disabled" : ""}>\u6D4B\u8BD5\u7CFB\u7EDF\u9EA6\u514B\u98CE</button><button id="sound-settings" class="text-button" ${!native2 ? "disabled" : ""}>Windows \u58F0\u97F3\u8BBE\u7F6E</button></div><p class="hint">\u6D4B\u8BD5\u4F1A\u5411\u865A\u62DF\u7EBF\u7F06\u53D1\u9001 1 \u79D2\u6D4B\u8BD5\u97F3\uFF0C\u68C0\u67E5\u5F55\u97F3\u7AEF\u80FD\u5426\u8BFB\u5230\u58F0\u97F3\u3002\u6D4B\u8BD5\u671F\u95F4\u5176\u4ED6\u4F7F\u7528\u6B64\u9EA6\u514B\u98CE\u7684\u8F6F\u4EF6\u4E5F\u53EF\u80FD\u6536\u5230\u6D4B\u8BD5\u97F3\u3002</p><p id="microphone-result" role="status"></p><p class="hint">Codex \u6CA1\u6709\u8BBE\u5907\u9009\u62E9\u5668\u65F6\uFF0C\u5728 Windows \u4E2D\u5C06 CABLE Output \u8BBE\u4E3A\u9ED8\u8BA4\u8F93\u5165\uFF0C\u7136\u540E\u91CD\u65B0\u6253\u5F00 Codex \u7684\u9EA6\u514B\u98CE\u3002</p></section>` : `<section class="panel"><h2>\u4E0B\u6B21\uFF0C\u76F4\u63A5\u6253\u5F00</h2><p>Safari \u5206\u4EAB\u83DC\u5355 \u2192 \u6DFB\u52A0\u5230\u4E3B\u5C4F\u5E55\u3002\u5141\u8BB8\u76F8\u673A\u548C\u9EA6\u514B\u98CE\u540E\uFF0C\u4FDD\u6301\u6B64\u5E94\u7528\u5728\u524D\u53F0\u3002</p><p class="hint">\u65E0\u9700\u5B89\u88C5\u8BC1\u4E66\u3002\u65E7\u7248\u7535\u8111\u7684\u5C40\u57DF\u7F51\u914D\u5BF9\u94FE\u63A5\u4E5F\u53EF\u4EE5\u76F4\u63A5\u7C98\u8D34\u5230\u4E0A\u65B9\u3002</p></section>`}</div></section>
 <section id="page-settings" class="page" hidden><div class="page-heading"><div><h1>\u753B\u8D28\u4E0E\u58F0\u97F3</h1><p>${desktop2 ? "\u53C2\u6570\u4F1A\u5E94\u7528\u5230\u8FDE\u63A5\u7684 iPhone\u3002" : "\u4F18\u5148\u4FDD\u6301\u6D41\u7545\uFF0C\u518D\u8C03\u6574\u6E05\u6670\u5EA6\u3002"}</p></div></div><div class="settings-layout"><section class="panel"><h2>\u753B\u8D28\u9884\u8BBE</h2><div class="presets"><button data-preset="smooth"><strong>\u6D41\u7545</strong><span>540p \xB7 24 fps</span><small>\u5F31\u7F51 / \u964D\u4F4E\u53D1\u70ED</small></button><button data-preset="balanced" class="selected"><strong>\u5747\u8861</strong><span>720p \xB7 30 fps</span><small>\u65E5\u5E38\u4F7F\u7528</small></button><button data-preset="detail"><strong>\u6E05\u6670</strong><span>1080p \xB7 30 fps</span><small>\u7A33\u5B9A Wi-Fi</small></button></div><p id="preset-result" role="status" class="hint"></p></section>
 <form id="settings-form" class="settings-grid"><section class="panel"><h2>\u65E5\u5E38\u8BBE\u7F6E</h2><label class="setting-inline">\u91C7\u96C6\u624B\u673A\u9EA6\u514B\u98CE<input id="microphone" name="microphone" type="checkbox" role="switch"></label><label class="setting-inline">\u56DE\u58F0\u6D88\u9664\u4E0E\u964D\u566A<input id="echoCancellation" name="echoCancellation" type="checkbox" role="switch"></label><label class="setting-inline">\u6253\u5F00\u540E\u81EA\u52A8\u8FDE\u63A5<input id="autoStart" name="autoStart" type="checkbox" role="switch"></label><label class="setting-inline">\u9884\u89C8\u955C\u50CF<input id="mirror" name="mirror" type="checkbox" role="switch"></label><p class="hint">\u9996\u6B21\u6388\u6743\u9700\u8981\u70B9\u51FB\u5F00\u59CB\u3002\u955C\u50CF\u4EC5\u5F71\u54CD\u9884\u89C8\u3002</p><button type="submit" class="primary full">\u5E94\u7528\u8BBE\u7F6E</button><p id="settings-result" role="status" class="hint"></p></section><section class="panel"><details class="advanced"><summary>\u9AD8\u7EA7\u753B\u8D28\u53C2\u6570</summary><label for="resolution">\u5206\u8FA8\u7387</label><select id="resolution"><option value="540">540p</option><option value="720">720p</option><option value="1080">1080p</option></select><label for="fps">\u5E27\u7387</label><select id="fps"><option value="15">15 fps</option><option value="24">24 fps</option><option value="30">30 fps</option></select><label for="bitrate">\u7801\u7387\u4E0A\u9650 <output id="bitrate-label">1800 kbps</output></label><input id="bitrate" type="range" min="500" max="8000" step="100"><label for="facing">\u6444\u50CF\u5934</label><select id="facing"><option value="environment">\u540E\u7F6E\u6444\u50CF\u5934</option><option value="user">\u524D\u7F6E\u6444\u50CF\u5934</option></select><p class="hint">\u5B9E\u9645\u5E27\u7387\u53D6\u51B3\u4E8E\u624B\u673A\u6027\u80FD\u4E0E\u7F51\u7EDC\u3002\u753B\u9762\u5361\u987F\u65F6\u5148\u9009\u62E9\u201C\u6D41\u7545\u201D\u3002</p></details><div class="settings-links"><button data-page="updates" type="button">\u5E94\u7528\u7248\u672C <span>v${version2} ${icon2("chevron")}</span></button><button data-page="help" type="button">\u4F7F\u7528\u8BF4\u660E ${icon2("chevron")}</button></div></section></form></div></section>
 <section id="page-updates" class="page" hidden><div class="page-heading"><div><h1>\u5E94\u7528\u7248\u672C</h1><p>\u79BB\u7EBF\u53EF\u7528\uFF0C\u66F4\u65B0\u7531\u4F60\u51B3\u5B9A\u3002</p></div></div><section class="panel update-panel"><h2>Ninja Relay <span>v${version2}</span></h2><p id="version-status">\u6B63\u5728\u68C0\u67E5\u672C\u5730\u8D44\u6E90</p><dl class="details"><dt>\u672C\u5730\u8D44\u6E90</dt><dd id="version-cache">\u68C0\u67E5\u4E2D</dd><dt>\u53EF\u56DE\u9000\u7248\u672C</dt><dd id="version-previous">\u6682\u65E0</dd></dl><div class="button-row"><button id="check-update" class="primary">\u68C0\u67E5\u65B0\u7248\u672C</button><button id="download-update" class="secondary" hidden>\u4E0B\u8F7D\u5E76\u6821\u9A8C</button><button id="apply-update" class="primary" hidden>\u542F\u7528\u5E76\u91CD\u542F</button><button id="rollback" class="secondary" disabled>\u56DE\u9000\u7248\u672C</button></div><p class="hint">\u4E0D\u4F1A\u81EA\u52A8\u4E0B\u8F7D\u6216\u542F\u7528\u5E94\u7528\u66F4\u65B0\u3002\u4E0B\u8F7D\u5931\u8D25\u4FDD\u7559\u5F53\u524D\u7248\u672C\uFF1B\u65B0\u7248\u672C\u672A\u5B8C\u6210\u542F\u52A8\uFF0C\u4E0B\u6B21\u6253\u5F00\u81EA\u52A8\u56DE\u9000\u3002</p></section></section>
 <section id="page-help" class="page" hidden><div class="page-heading"><div><h1>\u4F7F\u7528\u8BF4\u660E</h1></div></div><div class="settings-grid"><section class="panel"><h2>iPhone</h2><ol><li>\u7535\u8111\u6253\u5F00\u63A5\u6536\u7AEF\uFF0C\u624B\u673A\u626B\u63CF\u914D\u5BF9\u7801\u3002</li><li>Safari \u6253\u5F00\u540E\uFF0C\u7B49\u201C\u5DF2\u5B8C\u6574\u7F13\u5B58\u201D\uFF0C\u518D\u6DFB\u52A0\u5230\u4E3B\u5C4F\u5E55\u3002</li><li>\u5141\u8BB8\u76F8\u673A\u548C\u9EA6\u514B\u98CE\u3002\u4FDD\u6301\u624B\u673A\u5E94\u7528\u5728\u524D\u53F0\u3002</li><li>\u753B\u9762\u5361\u987F\u65F6\uFF0C\u4E24\u7AEF\u5C3D\u91CF\u8FDE\u63A5\u540C\u4E00\u4E2A\u7A33\u5B9A Wi-Fi\uFF0C\u5E76\u9009\u62E9\u6D41\u7545\u753B\u8D28\u3002</li></ol></section><section class="panel"><h2>Windows / Codex</h2><ol><li>\u8FDE\u63A5\u9875\u5B89\u88C5\u6444\u50CF\u5934\u4E0E\u97F3\u9891\u9A71\u52A8\uFF0C\u70B9\u201C\u91CD\u65B0\u68C0\u6D4B\u201D\u3002</li><li>\u70B9\u201C\u81EA\u52A8\u914D\u7F6E\u5E76\u542F\u7528\u8F93\u51FA\u201D\uFF0C\u518D\u6D4B\u8BD5\u7CFB\u7EDF\u9EA6\u514B\u98CE\u3002</li><li>Chrome \u6444\u50CF\u5934\u9009 Unity Video Capture\uFF1B\u9EA6\u514B\u98CE\u9009 CABLE Output\u3002</li><li>Codex \u82E5\u4ECD\u62A5\u65E0\u9EA6\u514B\u98CE\uFF0C\u5728 Windows \u58F0\u97F3\u8BBE\u7F6E\u9009 CABLE Output \u4E3A\u9ED8\u8BA4\u8F93\u5165\uFF0C\u518D\u91CD\u5F00\u9EA6\u514B\u98CE\u3002</li></ol><div id="certificate-info" class="hint"></div></section></div></section>
 </main><footer><span id="footer-cache">\u6B63\u5728\u68C0\u67E5\u79BB\u7EBF\u8D44\u6E90</span><span id="breadcrumb" hidden></span><span id="nav-count" hidden>0</span><span>iPhone \u2192 Windows</span></footer>${nav2("mobile-nav")}`;
}

// web/native-video.js
var NativeVideo = class {
  constructor(video, host2, enabled, onStatus, onError) {
    this.video = video;
    this.host = host2;
    this.enabled = enabled;
    this.onStatus = onStatus;
    this.onError = onError;
    this.bytes = null;
    this.active = false;
    this.pending = false;
    this.handle = null;
    this.generation = 0;
    this.last = 0;
    this.probeAfter = 0;
    this.metrics = { frames: 0, totalMs: 0, maxMs: 0, skipped: 0 };
    this.canvas = document.createElement("canvas");
    this.canvas.width = 1280;
    this.canvas.height = 720;
    this.context = this.canvas.getContext("2d", { alpha: false, willReadFrequently: true });
    window.chrome.webview.addEventListener("sharedbufferreceived", (e) => {
      if (e.additionalData?.type !== "video") return;
      if (this.bytes) window.chrome.webview.releaseBuffer(this.bytes.buffer);
      this.bytes = new Uint8Array(e.getBuffer());
    });
  }
  async attach() {
    if (!this.bytes) await this.host("videoBuffer");
  }
  start() {
    if (this.active) return;
    this.active = true;
    const generation = ++this.generation;
    const schedule = () => {
      if (!this.active || generation !== this.generation) return;
      this.handle = this.video.requestVideoFrameCallback ? this.video.requestVideoFrameCallback(tick) : setTimeout(() => tick(performance.now()), 34);
    };
    const tick = async (now) => {
      schedule();
      if (!this.bytes || !this.enabled() || this.video.readyState < 2 || now < this.probeAfter) return;
      if (this.pending) {
        this.metrics.skipped++;
        return;
      }
      this.pending = true;
      this.last = now;
      const started2 = performance.now();
      try {
        const v = this.video, ctx = this.context, scale = Math.min(1280 / v.videoWidth, 720 / v.videoHeight), w = v.videoWidth * scale, h = v.videoHeight * scale;
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, 1280, 720);
        ctx.drawImage(v, (1280 - w) / 2, (720 - h) / 2, w, h);
        this.bytes.set(ctx.getImageData(0, 0, 1280, 720).data);
        const result = await this.host("videoFrame");
        const elapsed = performance.now() - started2;
        this.metrics.frames++;
        this.metrics.totalMs += elapsed;
        this.metrics.maxMs = Math.max(this.metrics.maxMs, elapsed);
        if (!result.active) this.probeAfter = performance.now() + 250;
        this.onStatus(result.active, elapsed);
      } catch (error) {
        this.onError(error);
        this.stop();
      } finally {
        this.pending = false;
      }
    };
    schedule();
  }
  stop() {
    this.active = false;
    this.generation++;
    if (this.handle !== null) {
      if (this.video.cancelVideoFrameCallback) this.video.cancelVideoFrameCallback(this.handle);
      else clearTimeout(this.handle);
    }
    this.handle = null;
  }
};

// web/core.js
var DEFAULTS = Object.freeze({ resolution: "720", fps: 30, bitrate: 1800, facing: "environment", microphone: true, echoCancellation: false, autoStart: true, mirror: false });
var PRESETS = Object.freeze({ smooth: { resolution: "540", fps: 24, bitrate: 1e3 }, balanced: { resolution: "720", fps: 30, bitrate: 1800 }, detail: { resolution: "1080", fps: 30, bitrate: 4e3 } });
function validatePairing(value) {
  if (!value || value.v !== 1 || !/^[A-Za-z0-9_]{12,64}$/.test(value.streamID || "") || !/^[A-Za-z0-9_]{12,64}$/.test(value.room || "") || !/^[A-Za-z0-9_-]{24,128}$/.test(value.password || "")) throw new Error("\u914D\u5BF9\u4FE1\u606F\u65E0\u6548\uFF0C\u8BF7\u91CD\u65B0\u626B\u63CF Windows \u914D\u5BF9\u7801\u3002");
  const host2 = new URL(value.host || "wss://apibackup.vdo.ninja");
  if (host2.protocol !== "wss:" || host2.username || host2.password) throw new Error("\u4FE1\u4EE4\u5730\u5740\u5FC5\u987B\u4E3A\u5B89\u5168\u7684 wss \u5730\u5740\u3002");
  return { v: 1, streamID: value.streamID, room: value.room, password: value.password, host: host2.href, name: String(value.name || "Windows \u63A5\u6536\u7AEF").slice(0, 60) };
}
function encodePairing(value) {
  return btoa(String.fromCharCode(...new TextEncoder().encode(JSON.stringify(validatePairing(value))))).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}
function decodePairing(text) {
  const raw = text.includes("#pair=") ? text.split("#pair=")[1] : text;
  try {
    return validatePairing(JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(raw.replaceAll("-", "+").replaceAll("_", "/")), (c) => c.charCodeAt(0)))));
  } catch {
    throw new Error("\u65E0\u6CD5\u8BFB\u53D6\u914D\u5BF9\u7801\uFF0C\u8BF7\u590D\u5236\u5B8C\u6574\u7684\u914D\u5BF9\u94FE\u63A5\u3002");
  }
}
function sanitizeSettings(value = {}) {
  return { resolution: ["540", "720", "1080"].includes(String(value.resolution)) ? String(value.resolution) : "720", fps: [15, 24, 30].includes(+value.fps) ? +value.fps : 30, bitrate: Math.min(8e3, Math.max(500, +value.bitrate || 1800)), facing: value.facing === "user" ? "user" : "environment", microphone: value.microphone !== false, echoCancellation: value.echoCancellation === true, autoStart: value.autoStart !== false, mirror: value.mirror === true };
}
function captureConstraints(settings2) {
  const s = sanitizeSettings(settings2), height = +s.resolution;
  return { video: { width: { ideal: Math.round(height * 16 / 9) }, height: { ideal: height }, frameRate: { ideal: s.fps, max: s.fps }, facingMode: { ideal: s.facing } }, audio: { echoCancellation: s.echoCancellation, noiseSuppression: s.echoCancellation, autoGainControl: s.echoCancellation, sampleRate: { ideal: 48e3 }, channelCount: { ideal: 1 } } };
}
function friendlyError(error) {
  const errors = { NotAllowedError: "\u76F8\u673A\u6216\u9EA6\u514B\u98CE\u672A\u83B7\u6388\u6743\u3002\u8BF7\u5728 Safari \u7F51\u7AD9\u8BBE\u7F6E\u4E2D\u5141\u8BB8\u8BBF\u95EE\uFF0C\u7136\u540E\u70B9\u201C\u5F00\u59CB\u63A8\u6D41\u201D\u3002", NotFoundError: "\u6CA1\u6709\u627E\u5230\u53EF\u7528\u7684\u76F8\u673A\u6216\u9EA6\u514B\u98CE\u3002", NotReadableError: "\u76F8\u673A\u6B63\u88AB\u5176\u4ED6\u5E94\u7528\u5360\u7528\uFF0C\u8BF7\u5173\u95ED\u5360\u7528\u76F8\u673A\u7684\u5E94\u7528\u540E\u91CD\u8BD5\u3002", OverconstrainedError: "\u76F8\u673A\u4E0D\u652F\u6301\u5F53\u524D\u53C2\u6570\uFF0C\u8BF7\u9009\u62E9 720p / 30 fps \u540E\u91CD\u8BD5\u3002", SecurityError: "\u9700\u8981\u53D7\u4FE1\u4EFB\u7684 HTTPS \u8FDE\u63A5\uFF0C\u624D\u80FD\u8BBF\u95EE\u76F8\u673A\u3002" };
  return errors[error?.name] || error?.message || "\u8FDE\u63A5\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5\u3002";
}
function formatDuration(seconds) {
  return `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${Math.floor(seconds % 60).toString().padStart(2, "0")}`;
}
function mergeRemoteTrack(stream2, track) {
  for (const previous of stream2.getTracks()) if (previous.kind === track.kind && previous !== track) stream2.removeTrack(previous);
  if (!stream2.getTracks().includes(track)) stream2.addTrack(track);
}

// web/app.js
var $ = (id) => document.getElementById(id);
var native = !!window.chrome?.webview;
var appBase = document.querySelector('meta[name="relay-base"]').content;
var publicPhoneUrl = document.querySelector('meta[name="relay-phone-url"]').content;
var desktop = native || [appBase + "desktop", appBase + "desktop/", appBase + "desktop/index.html"].includes(location.pathname);
var storageKey = (key) => appBase === "/" ? key : key + ":" + appBase;
var version = document.querySelector('meta[name="relay-version"]').content;
var pending = /* @__PURE__ */ new Map();
var requestId = 0;
function host(type, payload = {}) {
  if (!native) return Promise.reject(Error("\u8BF7\u5728 Windows \u63A5\u6536\u8F6F\u4EF6\u4E2D\u4F7F\u7528\u6B64\u529F\u80FD\u3002"));
  return new Promise((resolve, reject) => {
    const id = ++requestId, timer = setTimeout(() => {
      pending.delete(id);
      reject(Error("Windows \u64CD\u4F5C\u8D85\u65F6\u3002"));
    }, type === "installCamera" ? 12e4 : 15e3);
    pending.set(id, { resolve, reject, timer });
    window.chrome.webview.postMessage({ id, type, ...payload });
  });
}
if (native) window.chrome.webview.addEventListener("message", (event) => {
  const m = event.data, task = pending.get(m.id);
  if (task) {
    clearTimeout(task.timer);
    pending.delete(m.id);
    m.error ? task.reject(Error(m.error)) : task.resolve(m.result);
  }
});
function saved(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(storageKey(key))) || fallback;
  } catch {
    return fallback;
  }
}
function persist(key, value) {
  localStorage.setItem(storageKey(key), JSON.stringify(value));
}
var settings = sanitizeSettings(saved("relay-settings", DEFAULTS));
var pair;
try {
  pair = validatePairing(saved("relay-pair", null));
} catch {
  pair = null;
}
var sdk = null;
var stream = null;
var running = false;
var busy = false;
var connected = false;
var started = 0;
var peers = /* @__PURE__ */ new Set();
var epoch = 0;
var audioContext = null;
var analyser = null;
var audioSource = null;
var audioWorklet = null;
var wakeLock = null;
var nativeInfo = null;
var outputEnabled = false;
var audioEnabled = false;
var lastBytes = 0;
var lastStatsTime = 0;
var audioPeak = 0;
var lastAudioSent = 0;
var page = "monitor";
var queuedSettings = saved("relay-pending-settings", false);
var nativeVideo = null;
var statsBusy = false;
var icons = { camera: '<rect x="3" y="6" width="12" height="12" rx="3"/><path d="m15 10 6-4v12l-6-4"/>', monitor: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>', link: '<path d="m10 13 4-4m-6 6-1 1a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0m2 2 1-1a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0"/>', settings: '<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3"/><circle cx="15" cy="17" r="3"/>', update: '<path d="M20 8a8 8 0 1 0 0 8M20 3v5h-5M12 7v10m-4-4 4 4 4-4"/>', mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3m-4 0h8"/>', flip: '<path d="M3 8h15l-4-4M21 16H6l4 4M3 8v7m18 1V9"/>', play: '<path d="m8 4 13 8-13 8Z"/>', stop: '<rect x="6" y="6" width="12" height="12" rx="2"/>', help: '<circle cx="12" cy="12" r="9"/><path d="M9 8a3 3 0 0 1 6 0c0 3-3 2-3 5m0 3v1"/>', check: '<path d="m5 12 4 4L20 5"/>', phone: '<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10 18h4"/>', chevron: '<path d="m9 5 7 7-7 7"/>', volume: '<path d="m11 4-6 5H2v6h3l6 5Zm4 4a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>' };
var icon = (name) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.camera}</svg>`;
var nav = [["monitor", "monitor", "\u76D1\u770B"], ["devices", "link", "\u8FDE\u63A5"], ["settings", "settings", "\u8BBE\u7F6E"], ["updates", "update", "\u7248\u672C"], ["help", "help", "\u4F7F\u7528\u6307\u5357"]];
$("app").innerHTML = renderUI({ desktop, native, version, icon, home: native ? "/desktop" : desktop ? appBase + "desktop/" : appBase });
document.body.classList.add(desktop ? "desktop" : "phone");
if (native) nativeVideo = new NativeVideo($("video"), host, () => outputEnabled && connected, (active) => {
  $("camera-output-state").textContent = active ? "\u6B63\u5728\u8F93\u51FA\u753B\u9762" : "\u5DF2\u542F\u7528\uFF0C\u7B49\u5F85\u5176\u4ED6\u8F6F\u4EF6\u4F7F\u7528";
}, (error) => {
  outputEnabled = false;
  $("camera-output").checked = false;
  notify(error.message, true);
});
function notify(message, error = false) {
  $("notice").hidden = false;
  $("notice").textContent = message;
  $("notice").classList.toggle("error", error);
}
function setPage(id) {
  page = id;
  document.querySelectorAll(".page").forEach((e) => e.hidden = e.id !== `page-${id}`);
  document.querySelectorAll("[data-page]").forEach((e) => e.classList.toggle("selected", e.dataset.page === id));
  $("breadcrumb").textContent = nav.find((n) => n[0] === id)?.[2] || "\u76D1\u770B";
  window.scrollTo(0, 0);
}
document.querySelectorAll("[data-page]").forEach((button) => button.addEventListener("click", () => setPage(button.dataset.page)));
function bind(id, fn) {
  $(id)?.addEventListener("click", async () => {
    try {
      await fn();
    } catch (e) {
      notify(friendlyError(e), true);
    }
  });
}
function updateNetwork() {
  const online = navigator.onLine;
  $("network").textContent = online ? "\u7F51\u7EDC\u53EF\u7528" : "\u79BB\u7EBF\u6A21\u5F0F";
  $("network").classList.toggle("offline", !online);
}
window.addEventListener("online", updateNetwork);
window.addEventListener("offline", updateNetwork);
updateNetwork();
function syncSettings() {
  document.querySelectorAll("[data-preset]").forEach((el) => {
    const p = PRESETS[el.dataset.preset];
    el.classList.toggle("selected", p.resolution === settings.resolution && p.fps === settings.fps && p.bitrate === settings.bitrate);
  });
  for (const [key, value] of Object.entries(settings)) {
    const el = $(key);
    if (el) el.type === "checkbox" ? el.checked = value : el.value = value;
  }
  if ($("quick-auto")) $("quick-auto").checked = settings.autoStart;
  if ($("quick-mirror")) $("quick-mirror").checked = settings.mirror;
  $("bitrate-label").textContent = `${settings.bitrate} kbps`;
  $("preview-format").textContent = `${settings.resolution}p / ${settings.fps} fps`;
  $("quality-name").textContent = `${settings.resolution === "720" ? "\u5747\u8861" : "\u81EA\u5B9A"} \xB7 ${settings.resolution}p`;
  $("video").classList.toggle("mirrored", settings.mirror);
  $("mute").setAttribute("aria-pressed", String(!settings.microphone));
  $("mute").classList.toggle("muted-mic", !settings.microphone);
  $("camera-label").textContent = desktop ? "iPhone SE" : settings.facing === "environment" ? "\u540E\u7F6E\u6444\u50CF\u5934" : "\u524D\u7F6E\u6444\u50CF\u5934";
}
function syncPair() {
  const text = pair ? pair.name : "\u5C1A\u672A\u914D\u5BF9";
  $("device-name").textContent = desktop ? "iPhone SE" : text;
  $("device-status").textContent = pair ? "\u5DF2\u914D\u5BF9 \xB7 \u7B49\u5F85\u8FDE\u63A5" : "\u5C1A\u672A\u914D\u5BF9";
  $("nav-count").textContent = pair ? "1" : "0";
  if ($("pair-name")) $("pair-name").textContent = text;
  if ($("saved-pair")) $("saved-pair").textContent = pair ? `\u5DF2\u4FDD\u5B58\uFF1A${pair.name}` : "\u5C1A\u672A\u914D\u5BF9";
}
function setStatus(text, isLive = false) {
  connected = isLive;
  $("status-badge").textContent = text;
  $("status-badge").classList.toggle("live", isLive);
  $("live-dot").classList.toggle("live", isLive);
  $("device-dot").classList.toggle("live", isLive);
  $("connection-title").textContent = text;
  $("device-status").textContent = isLive ? "\u5DF2\u8FDE\u63A5" : pair ? "\u5DF2\u914D\u5BF9 \xB7 " + text : "\u5C1A\u672A\u914D\u5BF9";
}
function pauseReceiver() {
  if (!desktop) return;
  $("preview-empty").hidden = false;
  $("empty-title").textContent = "\u7B49\u5F85 iPhone \u6062\u590D\u8FDE\u63A5";
  $("empty-copy").textContent = "\u8FDE\u63A5\u6062\u590D\u540E\u5C06\u81EA\u52A8\u7EE7\u7EED\u63A5\u6536\u3002";
  if (native) host("flush").catch(() => {
  });
}
function updateButton() {
  $("start").disabled = busy;
  $("start").classList.toggle("stop", running);
  $("start").innerHTML = `${icon(running ? "stop" : "play")}<span>${busy ? "\u6B63\u5728\u8FDE\u63A5\u2026" : running ? "\u505C\u6B62" + (desktop ? "\u63A5\u6536" : "\u76F8\u673A") : desktop ? "\u5F00\u59CB\u63A5\u6536" : "\u5F00\u542F\u76F8\u673A"}</span>`;
}
async function sw(type, extra = {}) {
  if (!navigator.serviceWorker?.controller) throw Error("\u79BB\u7EBF\u5E94\u7528\u5C1A\u672A\u5B89\u88C5\u5B8C\u6210\uFF0C\u8BF7\u91CD\u65B0\u6253\u5F00\u3002");
  return new Promise((resolve, reject) => {
    const c = new MessageChannel(), timer = setTimeout(() => reject(Error("\u64CD\u4F5C\u8D85\u65F6\uFF0C\u8BF7\u786E\u8BA4\u63A5\u6536\u7AEF\u5728\u7EBF\u540E\u91CD\u8BD5\u3002")), 12e4);
    c.port1.onmessage = (e) => {
      clearTimeout(timer);
      c.port1.close();
      e.data.ok ? resolve(e.data.result) : reject(Error(e.data.error));
    };
    navigator.serviceWorker.controller.postMessage({ type, ...extra }, [c.port2]);
  });
}
async function cacheStatus() {
  const s = await sw("STATUS");
  const text = `\u5DF2\u5B8C\u6574\u7F13\u5B58 \xB7 ${s.active.assets.length} \u4E2A\u8D44\u6E90`;
  $("footer-cache").textContent = text;
  $("version-cache").textContent = text;
  if ($("cache-status")) $("cache-status").textContent = text;
  $("version-status").textContent = s.rollbackReason || "\u5F53\u524D\u7248\u672C\u53EF\u79BB\u7EBF\u6253\u5F00";
  $("version-previous").textContent = s.previous?.version || "\u6682\u65E0";
  $("rollback").disabled = !s.previous;
  $("apply-update").hidden = !s.staged;
  return s;
}
function sdkEvents(instance, token) {
  const current = () => sdk === instance && token === epoch;
  instance.addEventListener("peerConnected", (e) => {
    if (!current()) return;
    peers.add(e.detail.uuid);
    setStatus(desktop ? "\u6B63\u5728\u63A5\u6536" : "\u6B63\u5728\u63A8\u6D41", true);
    if (desktop && stream && $("video").videoWidth) $("preview-empty").hidden = true;
    $("connection-subtitle").textContent = "WebRTC \u52A0\u5BC6\u8FDE\u63A5\u5DF2\u5EFA\u7ACB";
  });
  instance.addEventListener("dataChannelOpen", (e) => {
    if (current() && !desktop) instance.sendData({ app: "ninja-relay", type: "settings-ack", settings }, e.detail.uuid);
  });
  instance.addEventListener("peerDisconnected", (e) => {
    if (!current()) return;
    peers.delete(e.detail.uuid);
    if (!peers.size) {
      setStatus("\u7B49\u5F85\u91CD\u65B0\u8FDE\u63A5");
      $("connection-subtitle").textContent = "\u8BF7\u4FDD\u6301\u4E24\u7AEF\u5728\u7EBF";
      pauseReceiver();
    }
  });
  for (const name of ["reconnecting", "connectionRecovering"]) instance.addEventListener(name, () => {
    if (current()) {
      setStatus("\u6B63\u5728\u91CD\u65B0\u8FDE\u63A5");
      pauseReceiver();
    }
  });
  instance.addEventListener("connectionRecovered", () => {
    if (current()) {
      setStatus(desktop ? "\u6B63\u5728\u63A5\u6536" : "\u6B63\u5728\u63A8\u6D41", true);
      if (desktop && stream) $("preview-empty").hidden = true;
    }
  });
  instance.addEventListener("connectionFailed", () => {
    if (current()) {
      setStatus("\u8FDE\u63A5\u4E2D\u65AD");
      pauseReceiver();
      notify("\u8FDE\u63A5\u6062\u590D\u5931\u8D25\uFF0C\u8BF7\u505C\u6B62\u540E\u91CD\u65B0\u5F00\u59CB\u3002", true);
    }
  });
  instance.addEventListener("reconnectFailed", () => {
    if (current()) notify("\u4FE1\u4EE4\u91CD\u8FDE\u5931\u8D25\uFF0C\u8BF7\u505C\u6B62\u540E\u91CD\u8BD5\u3002", true);
  });
  instance.addEventListener("error", (e) => {
    if (current()) notify(friendlyError(e.detail.error instanceof Error ? e.detail.error : Error(String(e.detail.error || "\u8FDE\u63A5\u9519\u8BEF"))), true);
  });
  instance.addEventListener("track", async (e) => {
    if (!desktop || !current()) return;
    const track = e.detail.track;
    if (!stream) stream = new MediaStream();
    mergeRemoteTrack(stream, track);
    if ($("video").srcObject !== stream) $("video").srcObject = stream;
    $("preview-empty").hidden = true;
    $("video").play().catch(() => {
    });
    if (track.kind === "audio") await setupAudio();
    if (track.kind === "video" && native) startFrames();
  });
  instance.addEventListener("dataReceived", async (e) => {
    if (!current()) return;
    const data = e.detail.data;
    if (data?.app !== "ninja-relay") return;
    if (!desktop && data.type === "settings") {
      try {
        await changeSettings(sanitizeSettings(data.settings));
        instance.sendData({ app: "ninja-relay", type: "settings-ack", settings }, e.detail.uuid);
      } catch (error) {
        instance.sendData({ app: "ninja-relay", type: "settings-error", message: friendlyError(error) }, e.detail.uuid);
      }
    }
    if (desktop && data.type === "settings-ack") {
      if (queuedSettings && JSON.stringify(sanitizeSettings(data.settings)) !== JSON.stringify(settings)) {
        instance.sendData({ app: "ninja-relay", type: "settings", settings }, e.detail.uuid);
        return;
      }
      settings = sanitizeSettings(data.settings);
      persist("relay-settings", settings);
      syncSettings();
      queuedSettings = false;
      persist("relay-pending-settings", false);
      $("settings-result").textContent = "iPhone \u5DF2\u5E94\u7528\u53C2\u6570\u3002";
    }
    if (desktop && data.type === "settings-error") $("settings-result").textContent = data.message;
  });
}
async function start() {
  if (busy || running) return;
  if (!pair) {
    setPage("devices");
    notify("\u5148\u4FDD\u5B58 Windows \u914D\u5BF9\u4FE1\u606F\u3002");
    return;
  }
  busy = true;
  updateButton();
  $("notice").hidden = true;
  const token = ++epoch;
  lastBytes = 0;
  lastStatsTime = 0;
  try {
    if (!desktop) {
      stream = await navigator.mediaDevices.getUserMedia(captureConstraints(settings));
      if (token !== epoch) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      stream.getAudioTracks().forEach((t) => t.enabled = settings.microphone);
      $("video").srcObject = stream;
      $("preview-empty").hidden = true;
      await $("video").play();
      await setupAudio();
      await acquireWakeLock();
    }
    sdk = new window.VDONinjaSDK({ host: pair.host, password: pair.password, salt: "vdo.ninja", label: desktop ? "Ninja Relay Windows" : "iPhone SE", debug: false, autoRecover: true });
    const instance = sdk;
    sdkEvents(instance, token);
    setStatus("\u6B63\u5728\u8FDE\u63A5\u4FE1\u4EE4");
    await instance.connect();
    if (token !== epoch) return;
    await instance.joinRoom({ room: pair.room, password: pair.password });
    if (token !== epoch) return;
    if (desktop) {
      await instance.view(pair.streamID, { audio: true, video: true, downloads: false });
    } else {
      await instance.publish(stream, { streamID: pair.streamID, password: pair.password, media: { video: { codec: "h264", maxBitrate: settings.bitrate * 1e3, frameRate: settings.fps }, audio: { codec: "opus", maxBitrate: 64e3 } } });
    }
    if (token !== epoch) return;
    running = true;
    started = Date.now();
    if (!connected) setStatus(desktop ? "\u7B49\u5F85 iPhone \u63A8\u6D41" : "\u7B49\u5F85 Windows \u63A5\u6536");
    $("connection-subtitle").textContent = "\u914D\u5BF9\u5DF2\u4FDD\u5B58 \xB7 \u81EA\u52A8\u91CD\u8FDE\u5DF2\u542F\u7528";
  } catch (error) {
    await stop();
    notify(friendlyError(error), true);
  } finally {
    busy = false;
    updateButton();
  }
}
async function stop() {
  ++epoch;
  running = false;
  busy = false;
  connected = false;
  peers.clear();
  const old = sdk;
  sdk = null;
  stream?.getTracks().forEach((t) => t.stop());
  stream = null;
  $("video").srcObject = null;
  stopFrames();
  await closeAudio();
  await wakeLock?.release().catch(() => {
  });
  wakeLock = null;
  await old?.disconnect().catch(() => {
  });
  $("preview-empty").hidden = false;
  setStatus("\u5DF2\u505C\u6B62");
  $("elapsed").textContent = "00:00";
  $("connection-subtitle").textContent = "\u518D\u6B21\u5F00\u59CB\u5373\u53EF\u4F7F\u7528\u5DF2\u4FDD\u5B58\u7684\u914D\u5BF9";
  updateButton();
  if (native) await host("flush").catch(() => {
  });
}
async function acquireWakeLock() {
  if ("wakeLock" in navigator && document.visibilityState === "visible") wakeLock = await navigator.wakeLock.request("screen").catch(() => null);
}
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && running) {
    acquireWakeLock();
    audioContext?.resume();
  } else if (running && !desktop) notify("\u79BB\u5F00\u524D\u53F0\u53EF\u80FD\u6682\u505C\u91C7\u96C6\uFF0C\u8FD4\u56DE\u540E\u8BF7\u68C0\u67E5\u753B\u9762\u3002");
});
document.addEventListener("pointerdown", () => {
  if (audioContext?.state === "suspended") audioContext.resume().catch(() => {
  });
});
async function closeAudio() {
  audioWorklet?.disconnect();
  audioSource?.disconnect();
  audioWorklet = null;
  audioSource = null;
  analyser = null;
  if (audioContext) {
    await audioContext.close().catch(() => {
    });
    audioContext = null;
  }
}
async function setupAudio() {
  await closeAudio();
  if (!stream?.getAudioTracks().length) return;
  audioContext = new AudioContext({ sampleRate: 48e3 });
  audioContext.resume().catch(() => {
  });
  audioSource = audioContext.createMediaStreamSource(stream);
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 256;
  audioSource.connect(analyser);
  if (native && desktop) {
    await audioContext.audioWorklet.addModule(new URL("./audio-worklet.js", import.meta.url));
    audioWorklet = new AudioWorkletNode(audioContext, "relay-audio");
    audioSource.connect(audioWorklet);
    const silence = audioContext.createGain();
    silence.gain.value = 0;
    audioWorklet.connect(silence).connect(audioContext.destination);
    let outstanding = 0;
    audioWorklet.port.onmessage = (e) => {
      if (!audioEnabled || !running || !connected || outstanding > 2) return;
      const bytes = new Uint8Array(e.data.buffer);
      const base64 = btoa(String.fromCharCode(...bytes));
      outstanding++;
      host("audio", { data: base64, sampleRate: audioContext.sampleRate }).then(() => {
        lastAudioSent = performance.now();
      }).catch((error) => {
        audioEnabled = false;
        $("audio-output").checked = false;
        notify(error.message, true);
      }).finally(() => outstanding--);
    };
  }
}
function startFrames() {
  nativeVideo?.start();
}
function stopFrames() {
  nativeVideo?.stop();
}
async function changeSettings(value) {
  const next = sanitizeSettings(value), previous = settings;
  if (!desktop && stream) {
    const c = captureConstraints(next), oldVideo = stream.getVideoTracks()[0];
    try {
      if (previous.facing !== next.facing) {
        oldVideo.stop();
        const replacement = await navigator.mediaDevices.getUserMedia({ video: c.video, audio: false });
        await sdk?.replaceTrack(oldVideo, replacement.getVideoTracks()[0]);
        stream.removeTrack(oldVideo);
        if (!stream.getTracks().includes(replacement.getVideoTracks()[0])) stream.addTrack(replacement.getVideoTracks()[0]);
        $("video").srcObject = stream;
        await $("video").play();
      } else await oldVideo?.applyConstraints(c.video);
      await stream.getAudioTracks()[0]?.applyConstraints(c.audio);
      stream.getAudioTracks().forEach((t) => t.enabled = next.microphone);
      await sdk?.updatePublisherMedia({ media: { video: { codec: "h264", maxBitrate: next.bitrate * 1e3, frameRate: next.fps } } });
    } catch (error) {
      settings = previous;
      syncSettings();
      if (oldVideo?.readyState === "ended") {
        await stop();
        notify("\u6444\u50CF\u5934\u5207\u6362\u5931\u8D25\uFF0C\u5DF2\u505C\u6B62\u63A8\u6D41\u3002\u8BF7\u91CD\u65B0\u5F00\u59CB\u3002", true);
      }
      throw error;
    }
  }
  settings = next;
  persist("relay-settings", settings);
  syncSettings();
}
bind("start", () => running ? stop() : start());
bind("flip", () => changeSettings({ ...settings, facing: settings.facing === "user" ? "environment" : "user" }));
bind("mute", async () => {
  if (desktop) {
    if (!sdk?.sendData({ app: "ninja-relay", type: "settings", settings: { ...settings, microphone: !settings.microphone } })) throw Error("\u8BF7\u5148\u8FDE\u63A5 iPhone\u3002");
  } else await changeSettings({ ...settings, microphone: !settings.microphone });
});
for (const [id, key] of [["quick-auto", "autoStart"], ["quick-mirror", "mirror"]]) $(id)?.addEventListener("change", () => changeSettings({ ...settings, [key]: $(id).checked }).catch((e) => notify(e.message, true)));
$("bitrate").addEventListener("input", () => $("bitrate-label").textContent = `${$("bitrate").value} kbps`);
async function applySettings(value) {
  const next = sanitizeSettings(value);
  if (desktop) {
    settings = next;
    persist("relay-settings", settings);
    syncSettings();
    queuedSettings = true;
    persist("relay-pending-settings", true);
    const sent = sdk?.sendData({ app: "ninja-relay", type: "settings", settings });
    $("settings-result").textContent = sent ? "\u6B63\u5728\u5E94\u7528\u5230 iPhone\u2026" : "\u5DF2\u4FDD\u5B58\uFF0C\u8FDE\u63A5\u540E\u81EA\u52A8\u5E94\u7528\u3002";
  } else {
    await changeSettings(next);
    $("settings-result").textContent = "\u53C2\u6570\u5DF2\u4FDD\u5B58\u3002";
  }
}
$("settings-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const next = {};
    for (const key of Object.keys(DEFAULTS)) {
      const el = $(key);
      next[key] = el.type === "checkbox" ? el.checked : el.value;
    }
    await applySettings(next);
  } catch (error) {
    $("settings-result").textContent = friendlyError(error);
  }
});
document.querySelectorAll("[data-preset]").forEach((button) => button.addEventListener("click", async () => {
  button.disabled = true;
  try {
    await applySettings({ ...settings, ...PRESETS[button.dataset.preset] });
    $("preset-result").textContent = desktop ? $("settings-result").textContent : "\u753B\u8D28\u5DF2\u5E94\u7528\u3002";
  } catch (error) {
    $("preset-result").textContent = friendlyError(error);
  } finally {
    button.disabled = false;
  }
}));
async function renderPair() {
  if (!desktop || !pair) return;
  const phoneUrl = publicPhoneUrl || (nativeInfo?.phoneOrigin ? nativeInfo.phoneOrigin + "/phone" : new URL(appBase, location.origin).href);
  const url = `${phoneUrl}#pair=${encodePairing(pair)}`;
  $("pair-url").value = url;
  await import_qrcode.default.toCanvas($("qr"), url, { width: 240, margin: 3, color: { dark: "#10151e", light: "#ffffff" }, errorCorrectionLevel: "M" });
}
function randomId() {
  return Array.from(crypto.getRandomValues(new Uint8Array(18)), (x) => x.toString(16).padStart(2, "0")).join("");
}
bind("new-pair", async () => {
  await stop();
  pair = native ? (await host("rotatePair")).pair : validatePairing({ v: 1, room: randomId(), streamID: randomId(), password: randomId(), host: "wss://apibackup.vdo.ninja", name: "Windows \u63A5\u6536\u7AEF" });
  persist("relay-pair", pair);
  syncPair();
  await renderPair();
  notify("\u65B0\u914D\u5BF9\u5DF2\u751F\u6210\uFF0C\u8BF7\u7528 iPhone \u91CD\u65B0\u626B\u63CF\u3002");
});
bind("copy-pair", async () => {
  await navigator.clipboard.writeText($("pair-url").value);
  notify("\u914D\u5BF9\u94FE\u63A5\u5DF2\u590D\u5236\u3002");
});
bind("save-pair", async () => {
  const next = decodePairing($("pair-input").value.trim());
  await stop();
  pair = next;
  persist("relay-pair", pair);
  syncPair();
  setPage("monitor");
  await start();
});
bind("forget-pair", async () => {
  await stop();
  pair = null;
  localStorage.removeItem(storageKey("relay-pair"));
  syncPair();
  notify("\u914D\u5BF9\u5DF2\u79FB\u9664\u3002");
});
async function refreshDevices() {
  nativeInfo = await host("info");
  pair = validatePairing(nativeInfo.pair);
  persist("relay-pair", pair);
  syncPair();
  const modern = nativeInfo.bridgeVersion >= 2, cables = nativeInfo.audioDevices.filter((d) => d.isCable ?? d.name.includes("CABLE")), captures = nativeInfo.captureDevices || [], mic = captures.find((d) => d.name.includes("CABLE"));
  $("driver-camera").textContent = nativeInfo.cameraInstalled ? "\u5DF2\u5B89\u88C5\uFF0C\u53EF\u4EE5\u8F93\u51FA" : "\u5C1A\u672A\u5B89\u88C5";
  $("install-camera").hidden = !!nativeInfo.cameraInstalled;
  $("driver-audio").textContent = mic && cables.length ? "\u5DF2\u5B89\u88C5\uFF0C\u5F55\u97F3\u7AEF\u53EF\u7528" : cables.length ? "\u64AD\u653E\u7AEF\u5DF2\u53D1\u73B0\uFF0C\u5F55\u97F3\u7AEF\u4E0D\u53EF\u7528\uFF0C\u8BF7\u91CD\u542F\u68C0\u67E5" : "\u5C1A\u672A\u5B89\u88C5";
  $("install-audio").hidden = !!mic && !!cables.length;
  $("camera-output").disabled = !modern || !nativeInfo.cameraInstalled;
  $("audio-output").disabled = !modern || !mic || !cables.length;
  const select = $("audio-device");
  select.replaceChildren(new Option(cables.length ? "\u8BF7\u9009\u62E9\u865A\u62DF\u7EBF\u7F06" : "\u672A\u68C0\u6D4B\u5230\u97F3\u9891\u9A71\u52A8", ""));
  cables.forEach((d) => select.add(new Option(d.name, d.id)));
  select.value = nativeInfo.audioDeviceId || "";
  outputEnabled = modern && nativeInfo.cameraEnabled;
  audioEnabled = modern && nativeInfo.audioEnabled;
  $("camera-output").checked = outputEnabled;
  $("audio-output").checked = audioEnabled;
  $("camera-output-state").textContent = !nativeInfo.cameraInstalled ? "\u672A\u5B89\u88C5\uFF0C\u524D\u5F80\u8FDE\u63A5\u9875\u5B89\u88C5" : outputEnabled ? "\u5DF2\u542F\u7528\uFF0C\u7B49\u5F85\u753B\u9762" : "\u5DF2\u5B89\u88C5\uFF0C\u5C1A\u672A\u542F\u7528";
  $("mic-output-state").textContent = !mic ? "\u7CFB\u7EDF\u4E2D\u6CA1\u6709\u865A\u62DF\u5F55\u97F3\u8F93\u5165" : audioEnabled ? "\u5DF2\u542F\u7528\uFF0C\u7B49\u5F85\u624B\u673A\u58F0\u97F3" : "\u8BBE\u5907\u53EF\u7528\uFF0C\u5C1A\u672A\u542F\u7528";
  $("capture-status").textContent = mic ? "\u7CFB\u7EDF\u5F55\u97F3\u8BBE\u5907\uFF1A" + mic.name + (mic.isDefault ? "\uFF08\u9ED8\u8BA4\u8F93\u5165\uFF09" : "\uFF08\u5C1A\u672A\u8BBE\u4E3A\u9ED8\u8BA4\u8F93\u5165\uFF09") : captures.length ? "\u672A\u68C0\u6D4B\u5230 CABLE Output \u5F55\u97F3\u8F93\u5165" : "Windows \u5F53\u524D\u6CA1\u6709\u53EF\u7528\u5F55\u97F3\u8F93\u5165\uFF0CCodex \u65E0\u6CD5\u627E\u5230\u9EA6\u514B\u98CE\u3002";
  $("test-microphone").disabled = !modern || !mic || !cables.length;
  $("configure-outputs").disabled = !modern || !nativeInfo.cameraInstalled && !mic;
  $("setup-banner").hidden = modern && nativeInfo.cameraInstalled && !!mic && outputEnabled && audioEnabled;
  $("setup-summary").textContent = !modern ? "\u8BF7\u8FD0\u884C Windows 2.0 \u65B0\u7248 EXE\uFF0C\u5355\u72EC\u66F4\u65B0\u7F51\u9875\u4E0D\u4F1A\u5347\u7EA7\u89C6\u9891\u4F20\u8F93\u3002" : !nativeInfo.cameraInstalled && !mic ? "\u6444\u50CF\u5934\u4E0E\u9EA6\u514B\u98CE\u9A71\u52A8\u5C1A\u672A\u5B89\u88C5" : !mic ? "\u7F3A\u5C11\u865A\u62DF\u9EA6\u514B\u98CE\uFF0CCodex \u65E0\u6CD5\u4F7F\u7528\u624B\u673A\u58F0\u97F3" : !nativeInfo.cameraInstalled ? "\u7F3A\u5C11\u865A\u62DF\u6444\u50CF\u5934\u9A71\u52A8" : "\u8BBE\u5907\u5DF2\u5B89\u88C5\uFF0C\u70B9\u51FB\u81EA\u52A8\u914D\u7F6E\u542F\u7528";
  $("certificate-info").textContent = "\u624B\u673A\u5165\u53E3\uFF1A" + publicPhoneUrl;
  if (modern) await nativeVideo.attach();
  await renderPair();
}
bind("refresh-devices", refreshDevices);
bind("configure-outputs", async () => {
  await host("configureOutputs");
  await refreshDevices();
  if (stream) {
    startFrames();
    await setupAudio();
  }
  $("output-result").textContent = audioEnabled && outputEnabled ? "\u6444\u50CF\u5934\u4E0E\u9EA6\u514B\u98CE\u8F93\u51FA\u5DF2\u542F\u7528\u3002" : "\u5DF2\u542F\u7528\u53EF\u7528\u8BBE\u5907\uFF0C\u8BF7\u5B8C\u6210\u5269\u4F59\u9A71\u52A8\u5B89\u88C5\u3002";
});
bind("install-camera", async () => {
  $("install-camera").disabled = true;
  try {
    await host("installCamera");
    await refreshDevices();
  } finally {
    $("install-camera").disabled = false;
  }
});
bind("install-audio", async () => {
  if (native) await host("openMicrophoneDownload");
  else window.open("https://vb-audio.com/Cable/", "_blank", "noopener");
});
bind("sound-settings", () => host("openSoundSettings"));
bind("test-microphone", async () => {
  $("test-microphone").disabled = true;
  $("microphone-result").textContent = "\u6B63\u5728\u68C0\u6D4B\u7CFB\u7EDF\u5F55\u97F3\u7AEF\u2026";
  try {
    const r = await host("testMicrophone");
    $("microphone-result").textContent = r.signalDetected ? "\u901A\u8FC7\uFF1A\u7CFB\u7EDF\u9EA6\u514B\u98CE\u5DF2\u6536\u5230\u58F0\u97F3\u3002" + (r.isDefault ? "\u53EF\u4EE5\u91CD\u65B0\u6253\u5F00 Codex \u9EA6\u514B\u98CE\u3002" : "\u8BF7\u5C06 CABLE Output \u8BBE\u4E3A\u9ED8\u8BA4\u8F93\u5165\u3002") : "\u5DF2\u53D1\u73B0\u5F55\u97F3\u8BBE\u5907\uFF0C\u4F46\u672A\u6536\u5230\u6D4B\u8BD5\u97F3\u3002\u8BF7\u91CD\u542F\u540E\u518D\u6D4B\u3002";
  } finally {
    $("test-microphone").disabled = false;
  }
});
$("audio-device")?.addEventListener("change", async () => {
  try {
    await host("setAudioDevice", { deviceId: $("audio-device").value });
    audioEnabled = false;
    $("audio-output").checked = false;
    $("mic-output-state").textContent = "\u8BBE\u5907\u5DF2\u9009\u5B9A \xB7 \u8BF7\u542F\u7528";
  } catch (e) {
    notify(e.message, true);
  }
});
$("camera-output")?.addEventListener("change", async () => {
  try {
    outputEnabled = $("camera-output").checked;
    await host("setCamera", { enabled: outputEnabled });
    $("camera-output-state").textContent = outputEnabled ? "\u5DF2\u542F\u7528 \xB7 \u7B49\u5F85\u4F1A\u8BAE\u8F6F\u4EF6" : "\u5DF2\u5173\u95ED";
    if (outputEnabled && stream) startFrames();
  } catch (e) {
    outputEnabled = false;
    $("camera-output").checked = false;
    notify(e.message, true);
  }
});
$("audio-output")?.addEventListener("change", async () => {
  try {
    audioEnabled = $("audio-output").checked;
    await host("setAudio", { enabled: audioEnabled });
    $("mic-output-state").textContent = audioEnabled ? "\u5DF2\u542F\u7528 \xB7 \u7B49\u5F85\u97F3\u9891" : "\u5DF2\u5173\u95ED";
    if (audioEnabled && stream) await setupAudio();
  } catch (e) {
    audioEnabled = false;
    $("audio-output").checked = false;
    notify(e.message, true);
  }
});
bind("check-update", async () => {
  const m = await sw("CHECK");
  $("version-status").textContent = m.version === version ? "\u5DF2\u7ECF\u662F\u5F53\u524D\u670D\u52A1\u5668\u4E0A\u7684\u6700\u65B0\u7248\u672C\u3002" : `\u53D1\u73B0\u65B0\u7248\u672C ${m.version}\uFF0C\u53EF\u624B\u52A8\u4E0B\u8F7D\u3002`;
  $("download-update").hidden = m.version === version;
});
bind("download-update", async () => {
  $("download-update").disabled = true;
  $("version-status").textContent = "\u6B63\u5728\u4E0B\u8F7D\u5E76\u6821\u9A8C\uFF0C\u5F53\u524D\u7248\u672C\u4FDD\u6301\u53EF\u7528\u2026";
  try {
    const s = await sw("DOWNLOAD");
    $("version-status").textContent = s.staged ? `${s.staged.version} \u6821\u9A8C\u5B8C\u6210\uFF0C\u53EF\u4EE5\u542F\u7528\u3002` : "\u5F53\u524D\u7248\u672C\u65E0\u9700\u66F4\u65B0\u3002";
    $("apply-update").hidden = !s.staged;
  } finally {
    $("download-update").disabled = false;
  }
});
bind("apply-update", async () => {
  await stop();
  await sw("APPLY");
  location.reload();
});
bind("rollback", async () => {
  await stop();
  await sw("ROLLBACK");
  location.reload();
});
setInterval(async () => {
  if (running) $("elapsed").textContent = formatDuration((Date.now() - started) / 1e3);
  if (analyser) {
    const samples = new Float32Array(analyser.fftSize);
    analyser.getFloatTimeDomainData(samples);
    audioPeak = Math.sqrt(samples.reduce((a, x) => a + x * x, 0) / samples.length);
  } else audioPeak = 0;
  const db = audioPeak > 1e-5 ? 20 * Math.log10(audioPeak) : -Infinity;
  $("audio-db").textContent = Number.isFinite(db) ? `${Math.round(db)} dB` : "\u2212\u221E dB";
  $("meter").querySelectorAll("i").forEach((e, i) => e.classList.toggle("on", i < Math.max(0, (db + 60) / 60 * 24)));
  $("audio-state").textContent = !settings.microphone ? "\u5DF2\u9759\u97F3" : analyser ? "48 kHz \xB7 \u5355\u58F0\u9053" : "\u7B49\u5F85\u97F3\u9891";
  if (native && audioEnabled) $("mic-output-state").textContent = !settings.microphone ? "\u624B\u673A\u9EA6\u514B\u98CE\u5DF2\u9759\u97F3" : connected && performance.now() - lastAudioSent < 700 ? "\u6B63\u5728\u8F93\u51FA\u624B\u673A\u58F0\u97F3" : "\u5DF2\u542F\u7528\uFF0C\u7B49\u5F85\u624B\u673A\u58F0\u97F3";
}, 150);
var lastPackets = 0;
var lastLost = 0;
var lastJitterDelay = 0;
var lastJitterCount = 0;
setInterval(async () => {
  if (!sdk || !peers.size || statsBusy) return;
  statsBusy = true;
  try {
    const quality = await sdk.getPeerQuality([...peers][0]);
    if (!quality) return;
    const bytes = desktop ? quality.bytesReceived : quality.bytesSent, now = performance.now();
    if (lastStatsTime && bytes >= lastBytes) $("stat-bitrate").innerHTML = ((bytes - lastBytes) * 8 / (now - lastStatsTime) / 1e3).toFixed(2) + " <small>Mbps</small>";
    lastBytes = bytes;
    lastStatsTime = now;
    $("stat-rtt").innerHTML = (quality.rttMs === null ? "\u2014" : Math.round(quality.rttMs)) + " <small>ms</small>";
    $("stat-route").textContent = quality.relayed === null ? "\u68C0\u6D4B\u4E2D" : quality.relayed ? "\u7ECF\u4E2D\u7EE7" : "\u76F4\u63A5\u8FDE\u63A5";
    const all = await sdk.getStats(), video = Object.values(all).flat().find((r) => r.type === (desktop ? "inbound-rtp" : "outbound-rtp") && (r.kind === "video" || r.mediaType === "video"));
    $("stat-fps").innerHTML = (video?.framesPerSecond ?? "\u2014") + " <small>fps</small>";
    const packetDelta = (video?.packetsReceived || 0) - lastPackets, lostDelta = (video?.packetsLost || 0) - lastLost;
    const loss = packetDelta > 0 ? Math.max(0, lostDelta) / (packetDelta + Math.max(0, lostDelta)) : 0;
    const delayDelta = (video?.jitterBufferDelay || 0) - lastJitterDelay, countDelta = (video?.jitterBufferEmittedCount || 0) - lastJitterCount;
    const jitterMs = countDelta > 0 ? delayDelta / countDelta * 1e3 : 0;
    lastPackets = video?.packetsReceived || 0;
    lastLost = video?.packetsLost || 0;
    lastJitterDelay = video?.jitterBufferDelay || 0;
    lastJitterCount = video?.jitterBufferEmittedCount || 0;
    const slow = quality.rttMs > 250 || loss > 0.05 || jitterMs > 180 || video?.qualityLimitationReason === "cpu";
    $("performance-hint").textContent = slow ? "\u5F53\u524D\u7F51\u7EDC\u6216\u8BBE\u5907\u8D1F\u8F7D\u8F83\u9AD8\uFF0C\u8BF7\u5728\u8BBE\u7F6E\u4E2D\u9009\u62E9\u201C\u6D41\u7545\u201D\u3002" : quality.relayed ? "\u5F53\u524D\u7ECF\u8FC7\u7F51\u7EDC\u4E2D\u7EE7\uFF0C\u4E24\u7AEF\u8FDE\u63A5\u540C\u4E00 Wi-Fi \u901A\u5E38\u66F4\u6D41\u7545\u3002" : "";
    window.__relayMetrics = { framesPerSecond: video?.framesPerSecond, roundTripMs: quality.rttMs, jitterBufferMs: jitterMs, loss, relayed: quality.relayed, qualityLimitationReason: video?.qualityLimitationReason, nativeVideo: nativeVideo?.metrics };
  } catch {
  } finally {
    statsBusy = false;
  }
}, 2e3);
async function init() {
  syncSettings();
  syncPair();
  if (location.hash.startsWith("#pair=")) {
    try {
      pair = decodePairing(location.href);
      persist("relay-pair", pair);
      history.replaceState(null, "", location.pathname);
      syncPair();
      notify("\u5DF2\u4FDD\u5B58\u914D\u5BF9\u4FE1\u606F\uFF0C\u53EF\u4EE5\u5F00\u59CB\u63A8\u6D41\u3002");
    } catch (e) {
      notify(e.message, true);
    }
  }
  if (native) {
    try {
      await refreshDevices();
    } catch (e) {
      notify(e.message, true);
    }
  } else if (desktop) {
    $("capture-status").textContent = "\u8BF7\u5728 Windows \u63A5\u6536\u8F6F\u4EF6\u4E2D\u5B89\u88C5\u5E76\u68C0\u67E5\u7CFB\u7EDF\u8BBE\u5907\u3002";
    $("camera-output-state").textContent = "\u6D4F\u89C8\u5668\u9884\u89C8\u4E0D\u63D0\u4F9B\u7CFB\u7EDF\u6444\u50CF\u5934";
    $("mic-output-state").textContent = "\u6D4F\u89C8\u5668\u9884\u89C8\u4E0D\u63D0\u4F9B\u7CFB\u7EDF\u9EA6\u514B\u98CE";
    if (!pair) {
      pair = validatePairing({ v: 1, streamID: randomId(), room: randomId(), password: randomId(), host: "wss://apibackup.vdo.ninja", name: "Windows \u63A5\u6536\u7AEF" });
      persist("relay-pair", pair);
      syncPair();
    }
    await renderPair();
    $("camera-output").disabled = true;
    $("audio-output").disabled = true;
  }
  await cacheStatus();
  await sw("HEALTHY", { version });
  window.__relayHealthy = true;
  clearTimeout(window.__bootTimer);
  if (settings.autoStart && pair && (!desktop || native)) await start();
}
init().catch((e) => notify(friendlyError(e), true));
