(function() {

  var sample = window.sample || {};
  window.sample = sample;

  /**
   * THREE.BufferGeometryを拡張した独自Geoemtryクラス
   * @param {number} numChars - 文字数 (正方形の数)
   * @param {number} charWidth - 文字の幅 [px]
   */
  sample.FloatingCharsGeometry = function(numChars, charWidth) {
    THREE.BufferGeometry.call(this);
    this.numChars = numChars;
    this.charWidth = charWidth;
    this.init();
  }

  sample.FloatingCharsGeometry.prototype = Object.create(THREE.BufferGeometry.prototype, { value: { constructor: THREE.BufferGeometry }});

  /**
   * イニシャライズ
   */
  sample.FloatingCharsGeometry.prototype.init = function() {
    // attributes用の配列を生成
    var vertices = [];      // 頂点
    var charIndices = [];   // 文字(正方形)のインデックス
    var randomValues = [];  // 頂点計算等に使用するランダム値
    var uvs = [];           // UV座標
    var indices = [];       // インデックス

    var charHeight = this.charWidth;
    var charHalfWidth = this.charWidth / 2;
    var charHalfHeight = charHeight / 2;

    // this.numCharsの数だけ正方形を生成
    for(var i = 0; i < this.numChars; i++) {

      // GLSLで使用するランダムな値
      var randomValue = [
        Math.random(),
        Math.random(),
        Math.random()
      ];


      // 頂点データを生成

      // 左上
      vertices.push(-charHalfWidth);  // x
      vertices.push(charHalfHeight);  // y
      vertices.push(0);               // z

      uvs.push(0);  // u
      uvs.push(0);  // v

      charIndices.push(i);  // 何文字目かを表す番号

      randomValues.push(randomValue[0]);  // GLSLで使用するランダムな値 (vec3になるので3つ)
      randomValues.push(randomValue[1]);  // GLSLで使用するランダムな値 (vec3になるので3つ)
      randomValues.push(randomValue[2]);  // GLSLで使用するランダムな値 (vec3になるので3つ)


      // 右上
      vertices.push(charHalfWidth);
      vertices.push(charHalfHeight);

      vertices.push(0);

      uvs.push(1);
      uvs.push(0);

      charIndices.push(i);

      randomValues.push(randomValue[0]);
      randomValues.push(randomValue[1]);
      randomValues.push(randomValue[2]);


      // 左下
      vertices.push(-charHalfWidth);
      vertices.push(-charHalfHeight);

      vertices.push(0);

      uvs.push(0);
      uvs.push(1);

      charIndices.push(i);

      randomValues.push(randomValue[0]);
      randomValues.push(randomValue[1]);
      randomValues.push(randomValue[2]);


      // 右下
      vertices.push(charHalfWidth);
      vertices.push(-charHalfHeight);

      vertices.push(0);

      uvs.push(1);
      uvs.push(1);

      charIndices.push(i);

      randomValues.push(randomValue[0]);
      randomValues.push(randomValue[1]);
      randomValues.push(randomValue[2]);


      // ポリゴンを生成するインデックスをpush (三角形ポリゴンが2枚なので6個)
      var indexOffset = i * 4;

      indices.push(indexOffset + 0);　// 左上
      indices.push(indexOffset + 2);　// 左下
      indices.push(indexOffset + 1);　// 右上

      indices.push(indexOffset + 2);　// 左下
      indices.push(indexOffset + 3);　// 右下
      indices.push(indexOffset + 1);　// 右上
    }

    // attributes
    this.addAttribute('position',     new THREE.BufferAttribute(new Float32Array(vertices),     3));  // vec3
    this.addAttribute('randomValues', new THREE.BufferAttribute(new Float32Array(randomValues), 3));  // vec3
    this.addAttribute('charIndex',    new THREE.BufferAttribute(new Float32Array(charIndices),  1));  // float
    this.addAttribute('uv',           new THREE.BufferAttribute(new Float32Array(uvs),          2));  // vec2

    // index
    this.setIndex(new THREE.BufferAttribute(new Uint16Array(indices), 1));

    this.computeVertexNormals();
  }

})();
