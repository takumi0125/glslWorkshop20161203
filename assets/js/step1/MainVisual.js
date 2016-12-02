(function() {

  var sample = window.sample || {};
  window.sample = sample;

  /**
   * メインビジュアルクラス
   */
  sample.MainVisual = function() {
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

    // window resize
    this.$window.on('resize', function(e) {
      self.resize();
    });

    // geometry
    var geometry = new THREE.PlaneGeometry(50, 50);

    // material
    var material = new THREE.MeshBasicMaterial({
      color: 0x000000
    });

    // mesh
    var mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);

    // resizeイベントを発火してキャンバスサイズをリサイズ
    this.$window.trigger('resize');

    // アニメーション開始
    this.start();
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
    this.renderer.render(this.scene, this.camera);
  }


  /**
   * リサイズ処理
   * @param {jQuery.Event} e - jQueryのイベントオブジェクト
   */
  sample.MainVisual.prototype.resize = function() {
    this.width = this.$window.width();
    this.height = this.$window.height();

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
  }

})();
