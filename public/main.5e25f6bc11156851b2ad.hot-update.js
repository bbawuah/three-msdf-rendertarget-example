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
        this.renderer.setClearColor(0x000000);
        var near = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(75, near, 0.1, 10000);
        this.camera.position.z = 50;
        this.orbitControls = new OrbitControls_1.OrbitControls(this.camera, this.renderer.domElement);
        this.clock = new THREE.Clock();
        Promise.all([
            this.loadFontAtlas('horizon.png'),
            this.loadFont('horizon.fnt')
        ]).then(function (_a) {
            var atlas = _a[0], font = _a[1];
            var geometry = new three_msdf_text_1.MSDFTextGeometry({
                text: 'Infinity',
                font: font,
                width: 1000,
                align: 'center'
            });
            var material = new three_msdf_text_1.MSDFTextMaterial();
            material.uniforms.uMap.value = atlas;
            material.side = THREE.DoubleSide;
            _this.mesh = new THREE.Mesh(geometry, material);
            _this.mesh.rotation.x = Math.PI;
            var scale = 3;
            _this.mesh.position.x = (-geometry.layout.width / 2) * scale;
            _this.mesh.scale.set(scale, scale, scale);
            _this.createRenderTarget();
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
            (0, load_bmfont_1.default)(path, function (error, font) {
                if (error) {
                    return;
                }
                resolve(font);
            });
        });
        return promise;
    };
    Canvas.prototype.createRenderTarget = function (_a) {
        var rotation = _a.rotation;
        if (!this.mesh) {
            return;
        }
        this.renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
        this.renderTargetCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.renderTargetCamera.position.z = 600;
        this.renderTargetScene = new THREE.Scene();
        this.renderTargetScene.add(this.mesh);
        this.createMesh(this.renderTarget.texture);
    };
    Canvas.prototype.createMesh = function (texture) {
        var geometry = new THREE.TorusGeometry(10, 3, 16, 100);
        this.renderTargetMaterial = new THREE.RawShaderMaterial({
            vertexShader: vertex_1.vertexShader,
            fragmentShader: fragment_1.fragmentShader,
            side: THREE.FrontSide,
            uniforms: {
                u_time: new THREE.Uniform(0),
                u_texture: new THREE.Uniform(texture)
            },
            transparent: true
        });
        this.renderTargetMesh = new THREE.Mesh(geometry, this.renderTargetMaterial);
        this.renderTargetMesh.rotation.set(2, 2.8, 0);
        this.scene.add(this.renderTargetMesh);
    };
    Canvas.prototype.animate = function () {
        var _this = this;
        stats.begin();
        var elapsedTime = this.clock.getElapsedTime();
        this.orbitControls.update();
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
/******/ 	__webpack_require__.h = () => ("4fb7a70c1f1f90f7d398")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi41ZTI1ZjZiYzExMTU2ODUxYjJhZC5ob3QtdXBkYXRlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsbUdBQStCO0FBRS9CLG9IQUE2QjtBQUM3QixxSEFBbUM7QUFDbkMsNEZBQWdEO0FBQ2hELHFIQUFxRTtBQUNyRSxrR0FBb0Q7QUFDcEQsMEpBQTBFO0FBRTFFLElBQU0sS0FBSyxHQUFHLElBQUksa0JBQUssRUFBRSxDQUFDO0FBQzFCLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxtQ0FBbUM7QUFDdkQsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBTXJDO0lBaUJFLGdCQUFZLE1BQWU7UUFBM0IsaUJBNENDO1FBM0NDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDL0IsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLEtBQUssQ0FBQyxhQUFhLENBQUMsRUFBRSxNQUFNLFVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDcEUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDN0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsRSxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDO1FBQ2xELElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRXRDLElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxV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QztTQUNyQztRQUVELElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzlDLFVBQVU7UUFDVixLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7UUFFWixxQkFBcUIsQ0FBQyxjQUFNLFlBQUksQ0FBQyxPQUFPLEVBQUUsRUFBZCxDQUFjLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBQ0gsYUFBQztBQUFELENBQUM7QUEvSlksd0JBQU07Ozs7Ozs7OztVQ2pCbkIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wcm9qZWN0LWJvaWxlcnBsYXRlLy4vYXBwL3dlYmdsL2NhbnZhcy50cyIsIndlYnBhY2s6Ly9wcm9qZWN0LWJvaWxlcnBsYXRlL3dlYnBhY2svcnVudGltZS9nZXRGdWxsSGFzaCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tICd0aHJlZSc7XG5pbXBvcnQgeyBGb250LCBGb250TG9hZGVyIH0gZnJvbSAndGhyZWUvZXhhbXBsZXMvanNtL2xvYWRlcnMvRm9udExvYWRlcic7XG5pbXBvcnQgU3RhdHMgZnJvbSAnc3RhdHMuanMnO1xuaW1wb3J0IGxvYWRGb250IGZyb20gJ2xvYWQtYm1mb250JztcbmltcG9ydCB7IHZlcnRleFNoYWRlciB9IGZyb20gJy4vc2hhZGVycy92ZXJ0ZXgnO1xuaW1wb3J0IHsgTVNERlRleHRHZW9tZXRyeSwgTVNERlRleHRNYXRlcmlhbCB9IGZyb20gJ3RocmVlLW1zZGYtdGV4dCc7XG5pbXBvcnQgeyBmcmFnbWVudFNoYWRlciB9IGZyb20gJy4vc2hhZGVycy9mcmFnbWVudCc7XG5pbXBvcnQgeyBPcmJpdENvbnRyb2xzIH0gZnJvbSAndGhyZWUvZXhhbXBsZXMvanNtL2NvbnRyb2xzL09yYml0Q29udHJvbHMnO1xuXG5jb25zdCBzdGF0cyA9IG5ldyBTdGF0cygpO1xuc3RhdHMuc2hvd1BhbmVsKDEpOyAvLyAwOiBmcHMsIDE6IG1zLCAyOiBtYiwgMys6IGN1c3RvbVxuZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzdGF0cy5kb20pO1xuXG5pbnRlcmZhY2UgSUNvb3JkaW5hdGVzIHtcbiAgcm90YXRpb246IFRIUkVFLkV1bGVyO1xufVxuXG5leHBvcnQgY2xhc3MgQ2FudmFzIHtcbiAgcHVibGljIGNhbWVyYTogVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmE7XG4gIHB1YmxpYyByZW5kZXJUYXJnZXRDYW1lcmE/OiBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYTtcbiAgcHVibGljIHJlbmRlcmVyOiBUSFJFRS5XZWJHTFJlbmRlcmVyO1xuICBwdWJsaWMgc2NlbmU6IFRIUkVFLlNjZW5lO1xuICBwdWJsaWMgcmVuZGVyVGFyZ2V0U2NlbmU/OiBUSFJFRS5TY2VuZTtcbiAgcHVibGljIHJlbmRlclRhcmdldE1hdGVyaWFsPzogVEhSRUUuUmF3U2hhZGVyTWF0ZXJpYWw7XG4gIHB1YmxpYyByZW5kZXJUYXJnZXRNZXNoPzogVEhSRUUuTWVzaDtcbiAgcHVibGljIHNwaGVyZT86IFRIUkVFLk1lc2g7XG4gIHB1YmxpYyBmbG9vcj86IFRIUkVFLk1lc2g7XG4gIHB1YmxpYyBtZXNoPzogVEhSRUUuTWVzaDtcbiAgcHVibGljIGNvdW50OiBudW1iZXI7XG4gIHB1YmxpYyBjbG9jazogVEhSRUUuQ2xvY2s7XG4gIHB1YmxpYyBzdXJmYWNlPzogVEhSRUUuTWVzaDtcbiAgcHVibGljIHJlbmRlclRhcmdldD86IFRIUkVFLldlYkdMUmVuZGVyVGFyZ2V0O1xuICBwdWJsaWMgb3JiaXRDb250cm9sczogT3JiaXRDb250cm9scztcblxuICBjb25zdHJ1Y3RvcihjYW52YXM6IEVsZW1lbnQpIHtcbiAgICB0aGlzLnNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG4gICAgdGhpcy5jb3VudCA9IDgwMDA7XG4gICAgdGhpcy5yZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKHsgY2FudmFzLCBzdGVuY2lsOiBmYWxzZSB9KTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRQaXhlbFJhdGlvKE1hdGgubWluKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvLCAyKSk7XG4gICAgdGhpcy5yZW5kZXJlci5vdXRwdXRFbmNvZGluZyA9IFRIUkVFLnNSR0JFbmNvZGluZztcbiAgICB0aGlzLnJlbmRlcmVyLnNldENsZWFyQ29sb3IoMHgwMDAwMDApO1xuXG4gICAgY29uc3QgbmVhciA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIHRoaXMuY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDc1LCBuZWFyLCAwLjEsIDEwMDAwKTtcbiAgICB0aGlzLmNhbWVyYS5wb3NpdGlvbi56ID0gNTA7XG5cbiAgICB0aGlzLm9yYml0Q29udHJvbHMgPSBuZXcgT3JiaXRDb250cm9scyhcbiAgICAgIHRoaXMuY2FtZXJhLFxuICAgICAgdGhpcy5yZW5kZXJlci5kb21FbGVtZW50XG4gICAgKTtcbiAgICB0aGlzLmNsb2NrID0gbmV3IFRIUkVFLkNsb2NrKCk7XG5cbiAgICBQcm9taXNlLmFsbChbXG4gICAgICB0aGlzLmxvYWRGb250QXRsYXMoJ2hvcml6b24ucG5nJyksXG4gICAgICB0aGlzLmxvYWRGb250KCdob3Jpem9uLmZudCcpXG4gICAgXSkudGhlbigoW2F0bGFzLCBmb250XSkgPT4ge1xuICAgICAgY29uc3QgZ2VvbWV0cnkgPSBuZXcgTVNERlRleHRHZW9tZXRyeSh7XG4gICAgICAgIHRleHQ6ICdJbmZpbml0eScsXG4gICAgICAgIGZvbnQ6IGZvbnQsXG4gICAgICAgIHdpZHRoOiAxMDAwLFxuICAgICAgICBhbGlnbjogJ2NlbnRlcidcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBtYXRlcmlhbCA9IG5ldyBNU0RGVGV4dE1hdGVyaWFsKCk7XG4gICAgICBtYXRlcmlhbC51bmlmb3Jtcy51TWFwLnZhbHVlID0gYXRsYXM7XG4gICAgICBtYXRlcmlhbC5zaWRlID0gVEhSRUUuRG91YmxlU2lkZTtcblxuICAgICAgdGhpcy5tZXNoID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgICAgIHRoaXMubWVzaC5yb3RhdGlvbi54ID0gTWF0aC5QSTtcbiAgICAgIGNvbnN0IHNjYWxlID0gMztcbiAgICAgIHRoaXMubWVzaC5wb3NpdGlvbi54ID0gKC1nZW9tZXRyeS5sYXlvdXQud2lkdGggLyAyKSAqIHNjYWxlO1xuICAgICAgdGhpcy5tZXNoLnNjYWxlLnNldChzY2FsZSwgc2NhbGUsIHNjYWxlKTtcblxuICAgICAgdGhpcy5jcmVhdGVSZW5kZXJUYXJnZXQoKTtcbiAgICB9KTtcblxuICAgIHRoaXMuYW5pbWF0ZSgpO1xuICB9XG5cbiAgcHVibGljIGxvYWRGb250QXRsYXMocGF0aDogc3RyaW5nKTogUHJvbWlzZTxUSFJFRS5UZXh0dXJlPiB7XG4gICAgY29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IGxvYWRlciA9IG5ldyBUSFJFRS5UZXh0dXJlTG9hZGVyKCk7XG4gICAgICBsb2FkZXIubG9hZChwYXRoLCAodGV4dHVyZSkgPT4ge1xuICAgICAgICByZXNvbHZlKHRleHR1cmUpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZSBhcyBQcm9taXNlPFRIUkVFLlRleHR1cmU+O1xuICB9XG5cbiAgcHVibGljIGxvYWRGb250KHBhdGg6IHN0cmluZyk6IFByb21pc2U8Rm9udD4ge1xuICAgIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBsb2FkRm9udChwYXRoLCAoZXJyb3I6IGFueSwgZm9udDogYW55KSA9PiB7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICByZXNvbHZlKGZvbnQpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZSBhcyBQcm9taXNlPEZvbnQ+O1xuICB9XG5cbiAgcHVibGljIGNyZWF0ZVJlbmRlclRhcmdldCh7IHJvdGF0aW9uIH06IElDb29yZGluYXRlcyk6IHZvaWQge1xuICAgIGlmICghdGhpcy5tZXNoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMucmVuZGVyVGFyZ2V0ID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyVGFyZ2V0KFxuICAgICAgd2luZG93LmlubmVyV2lkdGgsXG4gICAgICB3aW5kb3cuaW5uZXJIZWlnaHRcbiAgICApO1xuXG4gICAgdGhpcy5yZW5kZXJUYXJnZXRDYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoXG4gICAgICA3NSxcbiAgICAgIHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0LFxuICAgICAgMC4xLFxuICAgICAgMTAwMDBcbiAgICApO1xuICAgIHRoaXMucmVuZGVyVGFyZ2V0Q2FtZXJhLnBvc2l0aW9uLnogPSA2MDA7XG5cbiAgICB0aGlzLnJlbmRlclRhcmdldFNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG5cbiAgICB0aGlzLnJlbmRlclRhcmdldFNjZW5lLmFkZCh0aGlzLm1lc2gpO1xuICAgIHRoaXMuY3JlYXRlTWVzaCh0aGlzLnJlbmRlclRhcmdldC50ZXh0dXJlKTtcbiAgfVxuXG4gIHB1YmxpYyBjcmVhdGVNZXNoKHRleHR1cmU6IFRIUkVFLlRleHR1cmUpOiB2b2lkIHtcbiAgICBjb25zdCBnZW9tZXRyeSA9IG5ldyBUSFJFRS5Ub3J1c0dlb21ldHJ5KDEwLCAzLCAxNiwgMTAwKTtcblxuICAgIHRoaXMucmVuZGVyVGFyZ2V0TWF0ZXJpYWwgPSBuZXcgVEhSRUUuUmF3U2hhZGVyTWF0ZXJpYWwoe1xuICAgICAgdmVydGV4U2hhZGVyLFxuICAgICAgZnJhZ21lbnRTaGFkZXIsXG4gICAgICBzaWRlOiBUSFJFRS5Gcm9udFNpZGUsXG4gICAgICB1bmlmb3Jtczoge1xuICAgICAgICB1X3RpbWU6IG5ldyBUSFJFRS5Vbmlmb3JtKDApLFxuICAgICAgICB1X3RleHR1cmU6IG5ldyBUSFJFRS5Vbmlmb3JtKHRleHR1cmUpXG4gICAgICB9LFxuICAgICAgdHJhbnNwYXJlbnQ6IHRydWVcbiAgICB9KTtcblxuICAgIHRoaXMucmVuZGVyVGFyZ2V0TWVzaCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCB0aGlzLnJlbmRlclRhcmdldE1hdGVyaWFsKTtcblxuICAgIHRoaXMucmVuZGVyVGFyZ2V0TWVzaC5yb3RhdGlvbi5zZXQoMiwgMi44LCAwKTtcbiAgICB0aGlzLnNjZW5lLmFkZCh0aGlzLnJlbmRlclRhcmdldE1lc2gpO1xuICB9XG5cbiAgcHVibGljIGFuaW1hdGUoKTogdm9pZCB7XG4gICAgc3RhdHMuYmVnaW4oKTtcbiAgICBjb25zdCBlbGFwc2VkVGltZSA9IHRoaXMuY2xvY2suZ2V0RWxhcHNlZFRpbWUoKTtcblxuICAgIHRoaXMub3JiaXRDb250cm9scy51cGRhdGUoKTtcblxuICAgIGlmIChcbiAgICAgIHRoaXMucmVuZGVyVGFyZ2V0ICYmXG4gICAgICB0aGlzLnJlbmRlclRhcmdldFNjZW5lICYmXG4gICAgICB0aGlzLnJlbmRlclRhcmdldENhbWVyYSAmJlxuICAgICAgdGhpcy5yZW5kZXJUYXJnZXRNZXNoXG4gICAgKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFJlbmRlclRhcmdldCh0aGlzLnJlbmRlclRhcmdldCk7XG4gICAgICB0aGlzLnJlbmRlcmVyLnJlbmRlcih0aGlzLnJlbmRlclRhcmdldFNjZW5lLCB0aGlzLnJlbmRlclRhcmdldENhbWVyYSk7XG5cbiAgICAgIGNvbnN0IG1lc2hNYXRlcmlhbCA9IHRoaXMucmVuZGVyVGFyZ2V0TWVzaFxuICAgICAgICAubWF0ZXJpYWwgYXMgVEhSRUUuUmF3U2hhZGVyTWF0ZXJpYWw7XG5cbiAgICAgIG1lc2hNYXRlcmlhbC51bmlmb3Jtcy51X3RpbWUudmFsdWUgPSBlbGFwc2VkVGltZTtcbiAgICAgIG1lc2hNYXRlcmlhbC51bmlmb3Jtc05lZWRVcGRhdGUgPSB0cnVlO1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRSZW5kZXJUYXJnZXQobnVsbCk7XG4gICAgfVxuXG4gICAgdGhpcy5yZW5kZXJlci5yZW5kZXIodGhpcy5zY2VuZSwgdGhpcy5jYW1lcmEpO1xuICAgIC8vIEFuaW1hdGVcbiAgICBzdGF0cy5lbmQoKTtcblxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLmFuaW1hdGUoKSk7XG4gIH1cbn1cbiIsIl9fd2VicGFja19yZXF1aXJlX18uaCA9ICgpID0+IChcIjRmYjdhNzBjMWYxZjkwZjdkMzk4XCIpIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9