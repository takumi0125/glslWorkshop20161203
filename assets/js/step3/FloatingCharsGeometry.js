(function() {

  var sample = window.sample || {};
  window.sample = sample;

  /**
   * THREE.BufferGeometryを拡張した独自Geoemtryクラス
   * @param {number} numChars - テクスチャの文字数
   * @param {number} charWidth - 文字の幅 [px]
   */
  sample.FloatingCharsGeometry = function(numChars, charWidth) {

    THREE.BufferGeometry.call(this);
    this.numChars = numChars;
    this.charWidth = charWidth;
    this.init();
  }

  sample.FloatingCharsGeometry.prototype = Object.create(THREE.BufferGeometry.prototype, { value: { constructor: THREE.BufferGeometry }});

  sample.FloatingCharsGeometry.prototype.init = function() {
    // attributes用の配列を生成
    this.vertices = [];
    this.charIndices = [];
    this.randomValues = [];
    this.uvs = [];
    this.indices = [];

    var charHeight = this.charWidth;
    var charHalfWidth = this.charWidth / 2;
    var charHalfHeight = charHeight / 2;

    // this.numCharsの数だけplaneを生成
    for(var i = 0; i < this.numChars; i++) {

      // GLSLで使用するランダムな値
      var randomValue = [
        Math.random(),
        Math.random(),
        Math.random()
      ];


      // 頂点データを生成

      // 左上
      this.vertices.push(-charHalfWidth);  // x
      this.vertices.push(charHalfHeight);  // y
      this.vertices.push(0);               // z

      this.uvs.push(0);
      this.uvs.push(0);

      this.charIndices.push(i);  // 何文字目かを表すインデックス番号

      this.randomValues.push(randomValue[0]);  // GLSLで使用するランダムな値 (vec3になるので3つ)
      this.randomValues.push(randomValue[1]);  // GLSLで使用するランダムな値 (vec3になるので3つ)
      this.randomValues.push(randomValue[2]);  // GLSLで使用するランダムな値 (vec3になるので3つ)


      // 右上
      this.vertices.push(charHalfWidth);
      this.vertices.push(charHalfHeight);
      this.vertices.push(0);

      this.uvs.push(1);
      this.uvs.push(0);

      this.charIndices.push(i);

      this.randomValues.push(randomValue[0]);
      this.randomValues.push(randomValue[1]);
      this.randomValues.push(randomValue[2]);


      // 左下
      this.vertices.push(-charHalfWidth);
      this.vertices.push(-charHalfHeight);
      this.vertices.push(0);

      this.uvs.push(0);
      this.uvs.push(1);

      this.charIndices.push(i);

      this.randomValues.push(randomValue[0]);
      this.randomValues.push(randomValue[1]);
      this.randomValues.push(randomValue[2]);


      // 右下
      this.vertices.push(charHalfWidth);
      this.vertices.push(-charHalfHeight);
      this.vertices.push(0);

      this.uvs.push(1);
      this.uvs.push(1);

      this.charIndices.push(i);

      this.randomValues.push(randomValue[0]);
      this.randomValues.push(randomValue[1]);
      this.randomValues.push(randomValue[2]);


      // ポリゴンを生成するインデックスをpush (三角形ポリゴンが2枚なので6個)
      var indexOffset = i * 4;
      this.indices.push(indexOffset + 0);
      this.indices.push(indexOffset + 2);
      this.indices.push(indexOffset + 1);
      this.indices.push(indexOffset + 2);
      this.indices.push(indexOffset + 3);
      this.indices.push(indexOffset + 1);
    }

    // attributes
    this.addAttribute('position',     new THREE.BufferAttribute(new Float32Array(this.vertices),     3));
    this.addAttribute('randomValues', new THREE.BufferAttribute(new Float32Array(this.randomValues), 3));
    this.addAttribute('charIndex',    new THREE.BufferAttribute(new Uint16Array(this.charIndices),   1));
    this.addAttribute('uv',           new THREE.BufferAttribute(new Float32Array(this.uvs),          2));

    // index
    this.setIndex(new THREE.BufferAttribute(new Uint16Array(this.indices), 1));

    // 配列としては使用しないので削除
    delete this.vertices;
    delete this.charIndices;
    delete this.randomValues;
    delete this.uvs;
    delete this.indices;

    this.computeVertexNormals();
  }

})();
