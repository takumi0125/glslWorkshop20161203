(function() {

  var sample = window.sample || {};
  window.sample = sample;

  /**
   * メインビジュアルクラス
   * @param {number} numChars - テクスチャの文字数
   * @param {number} charWidth - 文字の幅 [px]
   * @param {number} numTextureGridCols - テクスチャの1行文の文字列 [px]
   * @param {number} textureGridSize - テクスチャの1文字分の幅 [px]
   */
  sample.MainVisual = function(numChars, charWidth, numTextureGridCols, textureGridSize) {

    // 文字数
    this.numChars = numChars || 10;

    // 文字の幅[px] (geometryの1文字の幅)
    this.charWidth = charWidth || 32;

    // テクスチャの1行文の文字列
    this.numTextureGridCols = numTextureGridCols || 1;

    // テクスチャの1文字分の幅
    this.textureGridSize = textureGridSize || 128;

    // イニシャライズ
    this.init();
  }

  /**
   * イニシャライズ
   */
  sample.MainVisual.prototype.init = function() {
    var self = this;

    this.$window = $(window);
    this.$mainVisual = $('#main');

    // webGL renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.$mainVisual.find('canvas').get(0),
      alpha: true,
      antialias: true
    });

    // 高解像度対応
    var pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    this.renderer.setPixelRatio(pixelRatio);

    // scene
    this.scene = new THREE.Scene();

    // camera
    this.camera = new THREE.PerspectiveCamera(35, this.width / this.height, 10, 1000);
    this.camera.position.set(0, 0, 300);

    // controls
    this.controls = new THREE.TrackballControls(this.camera, this.renderer.domElement);

    // window resize
    this.$window.on('resize', function(e) {
      self.resize();
    });

    this.iniFloatingChars()
    .then(function() {
      // resizeイベントを発火してキャンバスサイズをリサイズ
      self.$window.trigger('resize');

      // アニメーション開始
      self.start();
    });
  }


  /**
   * floatingCharsをイニシャライズ
   */
  sample.MainVisual.prototype.iniFloatingChars = function() {
    var self = this;

    return new Promise(function(resolve) {

      // webfont load event
      WebFont.load({
        google: {
          families: [ 'Cabin Sketch' ]
        },
        active: function(fontFamily, fontDescription) {
          console.log('webfonts loaded');

          // 3Dオブジェクト生成

          // FloatingCharsインスタンス化
          self.floatingChars = new sample.FloatingChars(
            self.numChars,
            self.charWidth,
            self.numTextureGridCols,
            self.textureGridSize
          );

          // テクスチャをイニシャライズ
          self.floatingChars.createTxtTexture('0', 'Cabin Sketch');

          // シーンに追加
          self.scene.add(self.floatingChars);

          resolve();

        }
      });

    });
  }


  /**
   * アニメーション開始
   */
  sample.MainVisual.prototype.start = function() {
    var self = this;

    var enterFrameHandler = function() {
      requestAnimationFrame(enterFrameHandler);
      self.update();
    };

    enterFrameHandler();
  }


  /**
   * アニメーションループ内で実行される
   */
  sample.MainVisual.prototype.update = function() {
    this.controls.update();
    this.floatingChars.update(this.camera);
    this.renderer.render(this.scene, this.camera);
  }


  /**
   * リサイズ処理
   * @param {jQuery.Event} e - jQueryのイベントオブジェクト
   */
  sample.MainVisual.prototype.resize = function() {
    this.width = this.$window.width();
    this.height = this.$window.height();

    this.controls.handleResize();

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
  }

})();
