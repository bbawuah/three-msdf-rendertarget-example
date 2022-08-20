"use strict";
self["webpackHotUpdateproject_boilerplate"]("main",{

/***/ "./app/webgl/canvas.ts":
/*!*****************************!*\
  !*** ./app/webgl/canvas.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Canvas = void 0;
var THREE = __importStar(__webpack_require__(/*! three */ "./node_modules/three/build/three.cjs"));
var FontLoader_1 = __webpack_require__(/*! three/examples/jsm/loaders/FontLoader */ "./node_modules/three/examples/jsm/loaders/FontLoader.js");
var stats_js_1 = __importDefault(__webpack_require__(/*! stats.js */ "./node_modules/stats.js/build/stats.min.js"));
var load_bmfont_1 = __importDefault(__webpack_require__(/*! load-bmfont */ "./node_modules/load-bmfont/browser.js"));
var vertex_1 = __webpack_require__(/*! ./shaders/vertex */ "./app/webgl/shaders/vertex.ts");
var three_msdf_text_1 = __webpack_require__(/*! three-msdf-text */ "./node_modules/three-msdf-text/build/bundle.js");
var fragment_1 = __webpack_require__(/*! ./shaders/fragment */ "./app/webgl/shaders/fragment.ts");
var OrbitControls_1 = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls */ "./node_modules/three/examples/jsm/controls/OrbitControls.js");
var stats = new stats_js_1.default();
stats.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);
var Canvas = /** @class */ (function () {
    function Canvas(canvas) {
        var _this = this;
        this.scene = new THREE.Scene();
        this.count = 8000;
        this.renderer = new THREE.WebGLRenderer({ canvas: canvas, stencil: false });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.setClearColor(0xffffff);
        var near = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(75, near, 0.1, 10000);
        this.camera.position.z = 3;
        this.orbitControls = new OrbitControls_1.OrbitControls(this.camera, this.renderer.domElement);
        this.clock = new THREE.Clock();
        Promise.all([
            this.loadFontAtlas('./horizon.png'),
            this.loadFont('./horizon.fnt')
        ]).then(function (_a) {
            var atlas = _a[0], font = _a[1];
            var geometry = new three_msdf_text_1.MSDFTextGeometry({
                text: 'Hello World',
                font: font.data
            });
            var material = new three_msdf_text_1.MSDFTextMaterial();
            material.uniforms.uMap.value = atlas;
            _this.mesh = new THREE.Mesh(geometry, material);
        });
        this.animate();
    }
    Canvas.prototype.loadFontAtlas = function (path) {
        var promise = new Promise(function (resolve, reject) {
            var loader = new THREE.TextureLoader();
            loader.load(path, function (texture) {
                resolve(texture);
            });
        });
        return promise;
    };
    Canvas.prototype.loadFont = function (path) {
        var promise = new Promise(function (resolve, reject) {
            var loader = new FontLoader_1.FontLoader();
            loader.load(path, function (responseFont) {
                resolve(responseFont);
            });
        });
        return promise;
    };
    Canvas.prototype.handleLoadFont = function () {
        var _this = this;
        (0, load_bmfont_1.default)('./horizon.fnt', function (error, font) {
            if (error) {
                return;
            }
            var geometry = new three_msdf_text_1.MSDFTextGeometry({
                font: font,
                text: 'test'
            });
            var loader = new THREE.TextureLoader();
            loader.load('./horizon.png', function (texture) {
                _this.initialize(geometry, texture);
            });
        });
    };
    Canvas.prototype.initialize = function (geometry, texture) {
        var material = new three_msdf_text_1.MSDFTextMaterial({
            side: THREE.FrontSide,
            transparent: true,
            defines: {
                IS_SMALL: false
            },
            extensions: {
                derivatives: true
            },
            uniforms: {
                // Common
                uOpacity: { value: 1 },
                uColor: { value: new THREE.Color('#ffffff') },
                uMap: { value: texture },
                // Rendering
                uThreshold: { value: 0.05 },
                uAlphaTest: { value: 0.01 },
                // Strokes
                uStrokeColor: { value: new THREE.Color('#ff0000') },
                uStrokeOutsetWidth: { value: 0.0 },
                uStrokeInsetWidth: { value: 0.3 }
            }
        });
        this.createRenderTarget({ geometry: geometry, material: material });
    };
    Canvas.prototype.createRenderTarget = function (opt) {
        var geometry = opt.geometry, material = opt.material;
        this.renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
        this.renderTargetCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
        this.renderTargetCamera.position.z = 2.5;
        this.renderTargetScene = new THREE.Scene();
        this.renderTargetScene.background = new THREE.Color('#ff00ff');
        var text = new THREE.Mesh(geometry, material);
        this.renderTargetScene.add(text);
        this.createMesh(this.renderTarget.texture);
    };
    Canvas.prototype.createMesh = function (texture) {
        var geometry = new THREE.BoxGeometry(1, 1, 1);
        this.renderTargetMaterial = new THREE.RawShaderMaterial({
            vertexShader: vertex_1.vertexShader,
            fragmentShader: fragment_1.fragmentShader,
            side: THREE.FrontSide,
            uniforms: {
                u_time: new THREE.Uniform(0),
                u_texture: new THREE.Uniform(texture)
            }
        });
        this.renderTargetMesh = new THREE.Mesh(geometry, this.renderTargetMaterial);
        this.renderTargetMesh.rotation.set(10, 2.5, 0);
        this.scene.add(this.renderTargetMesh);
    };
    Canvas.prototype.animate = function () {
        var _this = this;
        stats.begin();
        var elapsedTime = this.clock.getElapsedTime();
        this.orbitControls.update();
        // Render
        if (this.renderTarget &&
            this.renderTargetScene &&
            this.renderTargetCamera &&
            this.renderTargetMesh) {
            this.renderer.setRenderTarget(this.renderTarget);
            this.renderer.render(this.renderTargetScene, this.renderTargetCamera);
            var meshMaterial = this.renderTargetMesh
                .material;
            meshMaterial.uniforms.u_time.value = elapsedTime;
            meshMaterial.uniformsNeedUpdate = true;
            this.renderer.setRenderTarget(null);
        }
        this.renderer.render(this.scene, this.camera);
        // Animate
        stats.end();
        requestAnimationFrame(function () { return _this.animate(); });
    };
    return Canvas;
}());
exports.Canvas = Canvas;


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("9b61ef845c4083f6147d")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5hNGU1OTYwY2NkOWY4MzFiOWE2Yi5ob3QtdXBkYXRlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsbUdBQStCO0FBQy9CLCtJQUF5RTtBQUN6RSxvSEFBNkI7QUFDN0IscUhBQW1DO0FBQ25DLDRGQUFnRDtBQUNoRCxxSEFBcUU7QUFDckUsa0dBQW9EO0FBQ3BELDBKQUEwRTtBQUUxRSxJQUFNLEtBQUssR0FBRyxJQUFJLGtCQUFLLEVBQUUsQ0FBQztBQUMxQixLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsbUNBQW1DO0FBQ3ZELFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUVyQztJQWdCRSxnQkFBWSxNQUFlO1FBQTNCLGlCQW1DQztRQWxDQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQy9CLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxLQUFLLENBQUMsYUFBYSxDQUFDLEVBQUUsTUFBTSxVQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ3BFLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzdELElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLGdCQUFnQixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQztRQUNsRCxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUV0QyxJQUFNLElBQUksR0FB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QUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzlDLFVBQVU7UUFDVixLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7UUFFWixxQkFBcUIsQ0FBQyxjQUFNLFlBQUksQ0FBQyxPQUFPLEVBQUUsRUFBZCxDQUFjLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBQ0gsYUFBQztBQUFELENBQUM7QUFwTVksd0JBQU07Ozs7Ozs7OztVQ2JuQiIsInNvdXJjZXMiOlsid2VicGFjazovL3Byb2plY3QtYm9pbGVycGxhdGUvLi9hcHAvd2ViZ2wvY2FudmFzLnRzIiwid2VicGFjazovL3Byb2plY3QtYm9pbGVycGxhdGUvd2VicGFjay9ydW50aW1lL2dldEZ1bGxIYXNoIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFRIUkVFIGZyb20gJ3RocmVlJztcbmltcG9ydCB7IEZvbnQsIEZvbnRMb2FkZXIgfSBmcm9tICd0aHJlZS9leGFtcGxlcy9qc20vbG9hZGVycy9Gb250TG9hZGVyJztcbmltcG9ydCBTdGF0cyBmcm9tICdzdGF0cy5qcyc7XG5pbXBvcnQgbG9hZEZvbnQgZnJvbSAnbG9hZC1ibWZvbnQnO1xuaW1wb3J0IHsgdmVydGV4U2hhZGVyIH0gZnJvbSAnLi9zaGFkZXJzL3ZlcnRleCc7XG5pbXBvcnQgeyBNU0RGVGV4dEdlb21ldHJ5LCBNU0RGVGV4dE1hdGVyaWFsIH0gZnJvbSAndGhyZWUtbXNkZi10ZXh0JztcbmltcG9ydCB7IGZyYWdtZW50U2hhZGVyIH0gZnJvbSAnLi9zaGFkZXJzL2ZyYWdtZW50JztcbmltcG9ydCB7IE9yYml0Q29udHJvbHMgfSBmcm9tICd0aHJlZS9leGFtcGxlcy9qc20vY29udHJvbHMvT3JiaXRDb250cm9scyc7XG5cbmNvbnN0IHN0YXRzID0gbmV3IFN0YXRzKCk7XG5zdGF0cy5zaG93UGFuZWwoMSk7IC8vIDA6IGZwcywgMTogbXMsIDI6IG1iLCAzKzogY3VzdG9tXG5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHN0YXRzLmRvbSk7XG5cbmV4cG9ydCBjbGFzcyBDYW52YXMge1xuICBwdWJsaWMgY2FtZXJhOiBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYTtcbiAgcHVibGljIHJlbmRlclRhcmdldENhbWVyYT86IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhO1xuICBwdWJsaWMgcmVuZGVyZXI6IFRIUkVFLldlYkdMUmVuZGVyZXI7XG4gIHB1YmxpYyBzY2VuZTogVEhSRUUuU2NlbmU7XG4gIHB1YmxpYyByZW5kZXJUYXJnZXRTY2VuZT86IFRIUkVFLlNjZW5lO1xuICBwdWJsaWMgcmVuZGVyVGFyZ2V0TWF0ZXJpYWw/OiBUSFJFRS5SYXdTaGFkZXJNYXRlcmlhbDtcbiAgcHVibGljIHJlbmRlclRhcmdldE1lc2g/OiBUSFJFRS5NZXNoO1xuICBwdWJsaWMgc3BoZXJlPzogVEhSRUUuTWVzaDtcbiAgcHVibGljIGZsb29yPzogVEhSRUUuTWVzaDtcbiAgcHVibGljIGNvdW50OiBudW1iZXI7XG4gIHB1YmxpYyBjbG9jazogVEhSRUUuQ2xvY2s7XG4gIHB1YmxpYyBzdXJmYWNlPzogVEhSRUUuTWVzaDtcbiAgcHVibGljIHJlbmRlclRhcmdldD86IFRIUkVFLldlYkdMUmVuZGVyVGFyZ2V0O1xuICBwdWJsaWMgb3JiaXRDb250cm9sczogT3JiaXRDb250cm9scztcblxuICBjb25zdHJ1Y3RvcihjYW52YXM6IEVsZW1lbnQpIHtcbiAgICB0aGlzLnNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG4gICAgdGhpcy5jb3VudCA9IDgwMDA7XG4gICAgdGhpcy5yZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKHsgY2FudmFzLCBzdGVuY2lsOiBmYWxzZSB9KTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRQaXhlbFJhdGlvKE1hdGgubWluKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvLCAyKSk7XG4gICAgdGhpcy5yZW5kZXJlci5vdXRwdXRFbmNvZGluZyA9IFRIUkVFLnNSR0JFbmNvZGluZztcbiAgICB0aGlzLnJlbmRlcmVyLnNldENsZWFyQ29sb3IoMHhmZmZmZmYpO1xuXG4gICAgY29uc3QgbmVhciA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIHRoaXMuY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDc1LCBuZWFyLCAwLjEsIDEwMDAwKTtcbiAgICB0aGlzLmNhbWVyYS5wb3NpdGlvbi56ID0gMztcblxuICAgIHRoaXMub3JiaXRDb250cm9scyA9IG5ldyBPcmJpdENvbnRyb2xzKFxuICAgICAgdGhpcy5jYW1lcmEsXG4gICAgICB0aGlzLnJlbmRlcmVyLmRvbUVsZW1lbnRcbiAgICApO1xuICAgIHRoaXMuY2xvY2sgPSBuZXcgVEhSRUUuQ2xvY2soKTtcblxuICAgIFByb21pc2UuYWxsKFtcbiAgICAgIHRoaXMubG9hZEZvbnRBdGxhcygnLi9ob3Jpem9uLnBuZycpLFxuICAgICAgdGhpcy5sb2FkRm9udCgnLi9ob3Jpem9uLmZudCcpXG4gICAgXSkudGhlbigoW2F0bGFzLCBmb250XSkgPT4ge1xuICAgICAgY29uc3QgZ2VvbWV0cnkgPSBuZXcgTVNERlRleHRHZW9tZXRyeSh7XG4gICAgICAgIHRleHQ6ICdIZWxsbyBXb3JsZCcsXG4gICAgICAgIGZvbnQ6IGZvbnQuZGF0YVxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IG1hdGVyaWFsID0gbmV3IE1TREZUZXh0TWF0ZXJpYWwoKTtcbiAgICAgIG1hdGVyaWFsLnVuaWZvcm1zLnVNYXAudmFsdWUgPSBhdGxhcztcblxuICAgICAgdGhpcy5tZXNoID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgICB9KTtcblxuICAgIHRoaXMuYW5pbWF0ZSgpO1xuICB9XG5cbiAgcHVibGljIGxvYWRGb250QXRsYXMocGF0aDogc3RyaW5nKTogUHJvbWlzZTxUSFJFRS5UZXh0dXJlPiB7XG4gICAgY29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IGxvYWRlciA9IG5ldyBUSFJFRS5UZXh0dXJlTG9hZGVyKCk7XG4gICAgICBsb2FkZXIubG9hZChwYXRoLCAodGV4dHVyZSkgPT4ge1xuICAgICAgICByZXNvbHZlKHRleHR1cmUpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZSBhcyBQcm9taXNlPFRIUkVFLlRleHR1cmU+O1xuICB9XG5cbiAgcHVibGljIGxvYWRGb250KHBhdGg6IHN0cmluZyk6IFByb21pc2U8Rm9udD4ge1xuICAgIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBsb2FkZXIgPSBuZXcgRm9udExvYWRlcigpO1xuICAgICAgbG9hZGVyLmxvYWQocGF0aCwgKHJlc3BvbnNlRm9udCkgPT4ge1xuICAgICAgICByZXNvbHZlKHJlc3BvbnNlRm9udCk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBwcm9taXNlIGFzIFByb21pc2U8Rm9udD47XG4gIH1cblxuICBwdWJsaWMgaGFuZGxlTG9hZEZvbnQoKTogdm9pZCB7XG4gICAgbG9hZEZvbnQoJy4vaG9yaXpvbi5mbnQnLCAoZXJyb3I6IGFueSwgZm9udDogYW55KSA9PiB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBnZW9tZXRyeSA9IG5ldyBNU0RGVGV4dEdlb21ldHJ5KHtcbiAgICAgICAgZm9udDogZm9udCxcbiAgICAgICAgdGV4dDogJ3Rlc3QnXG4gICAgICB9KSBhcyBhbnk7XG5cbiAgICAgIGNvbnN0IGxvYWRlciA9IG5ldyBUSFJFRS5UZXh0dXJlTG9hZGVyKCk7XG5cbiAgICAgIGxvYWRlci5sb2FkKCcuL2hvcml6b24ucG5nJywgKHRleHR1cmUpID0+IHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKGdlb21ldHJ5LCB0ZXh0dXJlKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGluaXRpYWxpemUoXG4gICAgZ2VvbWV0cnk6IFRIUkVFLkJ1ZmZlckdlb21ldHJ5LFxuICAgIHRleHR1cmU6IFRIUkVFLlRleHR1cmVcbiAgKTogdm9pZCB7XG4gICAgY29uc3QgbWF0ZXJpYWwgPSBuZXcgTVNERlRleHRNYXRlcmlhbCh7XG4gICAgICBzaWRlOiBUSFJFRS5Gcm9udFNpZGUsXG4gICAgICB0cmFuc3BhcmVudDogdHJ1ZSxcbiAgICAgIGRlZmluZXM6IHtcbiAgICAgICAgSVNfU01BTEw6IGZhbHNlXG4gICAgICB9LFxuICAgICAgZXh0ZW5zaW9uczoge1xuICAgICAgICBkZXJpdmF0aXZlczogdHJ1ZVxuICAgICAgfSxcbiAgICAgIHVuaWZvcm1zOiB7XG4gICAgICAgIC8vIENvbW1vblxuICAgICAgICB1T3BhY2l0eTogeyB2YWx1ZTogMSB9LFxuICAgICAgICB1Q29sb3I6IHsgdmFsdWU6IG5ldyBUSFJFRS5Db2xvcignI2ZmZmZmZicpIH0sXG4gICAgICAgIHVNYXA6IHsgdmFsdWU6IHRleHR1cmUgfSxcbiAgICAgICAgLy8gUmVuZGVyaW5nXG4gICAgICAgIHVUaHJlc2hvbGQ6IHsgdmFsdWU6IDAuMDUgfSxcbiAgICAgICAgdUFscGhhVGVzdDogeyB2YWx1ZTogMC4wMSB9LFxuICAgICAgICAvLyBTdHJva2VzXG4gICAgICAgIHVTdHJva2VDb2xvcjogeyB2YWx1ZTogbmV3IFRIUkVFLkNvbG9yKCcjZmYwMDAwJykgfSxcbiAgICAgICAgdVN0cm9rZU91dHNldFdpZHRoOiB7IHZhbHVlOiAwLjAgfSxcbiAgICAgICAgdVN0cm9rZUluc2V0V2lkdGg6IHsgdmFsdWU6IDAuMyB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLmNyZWF0ZVJlbmRlclRhcmdldCh7IGdlb21ldHJ5LCBtYXRlcmlhbCB9KTtcbiAgfVxuXG4gIHB1YmxpYyBjcmVhdGVSZW5kZXJUYXJnZXQob3B0OiB7XG4gICAgZ2VvbWV0cnk6IGFueTtcbiAgICBtYXRlcmlhbDogVEhSRUUuU2hhZGVyTWF0ZXJpYWw7XG4gIH0pOiB2b2lkIHtcbiAgICBjb25zdCB7IGdlb21ldHJ5LCBtYXRlcmlhbCB9ID0gb3B0O1xuICAgIHRoaXMucmVuZGVyVGFyZ2V0ID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyVGFyZ2V0KFxuICAgICAgd2luZG93LmlubmVyV2lkdGgsXG4gICAgICB3aW5kb3cuaW5uZXJIZWlnaHRcbiAgICApO1xuXG4gICAgdGhpcy5yZW5kZXJUYXJnZXRDYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoNDUsIDEsIDAuMSwgMTAwMCk7XG4gICAgdGhpcy5yZW5kZXJUYXJnZXRDYW1lcmEucG9zaXRpb24ueiA9IDIuNTtcblxuICAgIHRoaXMucmVuZGVyVGFyZ2V0U2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcbiAgICB0aGlzLnJlbmRlclRhcmdldFNjZW5lLmJhY2tncm91bmQgPSBuZXcgVEhSRUUuQ29sb3IoJyNmZjAwZmYnKTtcblxuICAgIGNvbnN0IHRleHQgPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuXG4gICAgdGhpcy5yZW5kZXJUYXJnZXRTY2VuZS5hZGQodGV4dCk7XG4gICAgdGhpcy5jcmVhdGVNZXNoKHRoaXMucmVuZGVyVGFyZ2V0LnRleHR1cmUpO1xuICB9XG5cbiAgcHVibGljIGNyZWF0ZU1lc2godGV4dHVyZTogVEhSRUUuVGV4dHVyZSk6IHZvaWQge1xuICAgIGNvbnN0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KDEsIDEsIDEpO1xuXG4gICAgdGhpcy5yZW5kZXJUYXJnZXRNYXRlcmlhbCA9IG5ldyBUSFJFRS5SYXdTaGFkZXJNYXRlcmlhbCh7XG4gICAgICB2ZXJ0ZXhTaGFkZXIsXG4gICAgICBmcmFnbWVudFNoYWRlcixcbiAgICAgIHNpZGU6IFRIUkVFLkZyb250U2lkZSxcbiAgICAgIHVuaWZvcm1zOiB7XG4gICAgICAgIHVfdGltZTogbmV3IFRIUkVFLlVuaWZvcm0oMCksXG4gICAgICAgIHVfdGV4dHVyZTogbmV3IFRIUkVFLlVuaWZvcm0odGV4dHVyZSlcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMucmVuZGVyVGFyZ2V0TWVzaCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCB0aGlzLnJlbmRlclRhcmdldE1hdGVyaWFsKTtcblxuICAgIHRoaXMucmVuZGVyVGFyZ2V0TWVzaC5yb3RhdGlvbi5zZXQoMTAsIDIuNSwgMCk7XG4gICAgdGhpcy5zY2VuZS5hZGQodGhpcy5yZW5kZXJUYXJnZXRNZXNoKTtcbiAgfVxuXG4gIHB1YmxpYyBhbmltYXRlKCk6IHZvaWQge1xuICAgIHN0YXRzLmJlZ2luKCk7XG4gICAgY29uc3QgZWxhcHNlZFRpbWUgPSB0aGlzLmNsb2NrLmdldEVsYXBzZWRUaW1lKCk7XG5cbiAgICB0aGlzLm9yYml0Q29udHJvbHMudXBkYXRlKCk7XG5cbiAgICAvLyBSZW5kZXJcbiAgICBpZiAoXG4gICAgICB0aGlzLnJlbmRlclRhcmdldCAmJlxuICAgICAgdGhpcy5yZW5kZXJUYXJnZXRTY2VuZSAmJlxuICAgICAgdGhpcy5yZW5kZXJUYXJnZXRDYW1lcmEgJiZcbiAgICAgIHRoaXMucmVuZGVyVGFyZ2V0TWVzaFxuICAgICkge1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRSZW5kZXJUYXJnZXQodGhpcy5yZW5kZXJUYXJnZXQpO1xuICAgICAgdGhpcy5yZW5kZXJlci5yZW5kZXIodGhpcy5yZW5kZXJUYXJnZXRTY2VuZSwgdGhpcy5yZW5kZXJUYXJnZXRDYW1lcmEpO1xuXG4gICAgICBjb25zdCBtZXNoTWF0ZXJpYWwgPSB0aGlzLnJlbmRlclRhcmdldE1lc2hcbiAgICAgICAgLm1hdGVyaWFsIGFzIFRIUkVFLlJhd1NoYWRlck1hdGVyaWFsO1xuXG4gICAgICBtZXNoTWF0ZXJpYWwudW5pZm9ybXMudV90aW1lLnZhbHVlID0gZWxhcHNlZFRpbWU7XG4gICAgICBtZXNoTWF0ZXJpYWwudW5pZm9ybXNOZWVkVXBkYXRlID0gdHJ1ZTtcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0UmVuZGVyVGFyZ2V0KG51bGwpO1xuICAgIH1cblxuICAgIHRoaXMucmVuZGVyZXIucmVuZGVyKHRoaXMuc2NlbmUsIHRoaXMuY2FtZXJhKTtcbiAgICAvLyBBbmltYXRlXG4gICAgc3RhdHMuZW5kKCk7XG5cbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy5hbmltYXRlKCkpO1xuICB9XG59XG4iLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmggPSAoKSA9PiAoXCI5YjYxZWY4NDVjNDA4M2Y2MTQ3ZFwiKSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==