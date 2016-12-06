(function() {

  var sample = window.sample || {};
  window.sample = sample;

  /**
   * THREE.Meshを拡張した独自3Dオブジェクトクラス
   * @param {number} numChars - 文字数 (正方形の数)
   * @param {number} charWidth - 文字の幅 [px]
   * @param {number} numTextureGridCols - テクスチャの1行文の文字列
   * @param {number} textureGridSize - テクスチャの1文字分の幅
   */
  sample.FloatingChars = function(numChars, charWidth, numTextureGridCols, textureGridSize) {
    this.numChars = numChars;
    this.charWidth = charWidth;
    this.numTextureGridCols = numTextureGridCols;
    this.textureGridSize = textureGridSize;

    // カスタムジオメトリオブジェクトをインスタンス化
    geometry = new sample.FloatingCharsGeometry(this.numChars, this.charWidth);

    // RawShaderMaterial生成
    material = new THREE.RawShaderMaterial({
      // 文字以外の部分は透過
      transparent: true,

      // 正方形の両面を描画
      side: THREE.DoubleSide,

      // シェーダに渡すuniform変数の定義
      uniforms: {
        // canvasに記述した文字から作ったtextureを渡す
        txtTexture: { type: 't' },

        // 時間経過 updateメソッド内でフレームごとに加算していく
        time: { type: '1f', value: 0 },

        // 文字数 = 正方形の数
        numChars: { type: '1f', value: this.numChars },

        // Textureの横方向の文字数
        numTextureGridCols: { type: '1f', value: this.numTextureGridCols },

        // Textureの縦方向の文字数
        numTextureGridRows: { type: '1f', value: 1 },

        // テクスチャとして使用する文字数 (文字を何種類使うか)
        textureTxtLength: { type: '1f', value: 1 },

        // アニメーション適用度
        animationValue1: { type: '1f', value: 1 },
        animationValue2: { type: '1f', value: 0 },
        animationValue3: { type: '1f', value: 0 }
      },

      // 頂点シェーダのプログラムをindex.htmlのscript#vertexShaderから取得
      vertexShader: $('#vertexShader').text(),

      // フラグメントシェーダのプログラムをindex.htmlのscript#fragmentShaderから取得
      fragmentShader: $('#fragmentShader').text()
    });

    // 継承元のTHREE.Meshのコンストラクタを実行
    THREE.Mesh.call(this, geometry, material);
  }

  sample.FloatingChars.prototype = Object.create(THREE.Mesh.prototype, { value: { constructor: THREE.Mesh }});


  /**
   * 更新
   */
  sample.FloatingChars.prototype.update = function() {
    // 経過時間を更新してシェーダに渡す
    this.material.uniforms.time.value += 0.001;
  }


  /**
   * テクスチャを生成
   * @param {string} txt - テクスチャとして使用したい文字列
   * @param {string} fontFamily - フォント名
   */
  sample.FloatingChars.prototype.createTxtTexture = function(txt, fontFamily) {
    var textureTxtLength = txt.length;
    var numTextureGridRows = Math.ceil(textureTxtLength / this.numTextureGridCols);

    this.txtCanvas = document.createElement('canvas');
    this.txtCanvasCtx = this.txtCanvas.getContext('2d');
    this.txtCanvas.width = this.textureGridSize * this.numTextureGridCols;
    this.txtCanvas.height = this.textureGridSize * numTextureGridRows;


    // canvasのスタイルを設定 (グリッドのサイズの80%をfontSizeとする)
    this.txtCanvasCtx.font = 'normal ' + (this.textureGridSize * 0.8) + 'px ' + fontFamily;

    // グリッドの中心に描画
    this.txtCanvasCtx.textAlign = 'center';

    // 文字色は白
    this.txtCanvasCtx.fillStyle = '#ffffff';

    var colIndex;
    var rowIndex;

    for(var i  = 0, l = textureTxtLength; i < l; i++) {
      // 横方向のインデックス
      colIndex = i % this.numTextureGridCols;

      // 縦方向のインデックス
      rowIndex = Math.floor(i / this.numTextureGridCols);

      // canvasに文字を描画
      this.txtCanvasCtx.fillText(
        txt.charAt(i),

        // textAlignをcenterに設定すると、
        // 基準位置が第一引数ので指定された文字列の中央になるので
        // 横方向は各グリッドの中心座標を指定する
        colIndex * this.textureGridSize + this.textureGridSize / 2,

        // 縦方向はベースラインの位置を指定する
        rowIndex * this.textureGridSize + this.textureGridSize * 0.8,

        this.textureGridSize
      );
    }

    // canvasからthree.jsのテクスチャを生成
    this.txtTexture = new THREE.Texture(this.txtCanvas);
    this.txtTexture.flipY = false;  // UVを反転しない (WebGLのデフォルトにする)
    this.txtTexture.needsUpdate = true;  // テクスチャを更新

    // シェーダに渡す値をセット

    // テクスチャ
    this.material.uniforms.txtTexture.value = this.txtTexture;

    // テクスチャの縦の文字数
    this.material.uniforms.numTextureGridRows.value = numTextureGridRows;

    // テクスチャとして使う文字の種類 (txtは1文字ずつユニークである前提)
    this.material.uniforms.textureTxtLength.value = textureTxtLength;

    // document.body.appendChild(this.txtCanvas);
    // $(this.txtCanvas).css('background-color', '#000');
    // $('#wrapper').remove();
  }


  /**
   * uniformの値をセット
   */
  sample.FloatingChars.prototype.setUniform = function(uniformKey, value) {
    this.material.uniforms[uniformKey].value = value;
  }




})();
