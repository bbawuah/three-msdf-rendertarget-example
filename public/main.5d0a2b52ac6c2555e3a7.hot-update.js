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
        this.camera.position.z = 1000;
        this.orbitControls = new OrbitControls_1.OrbitControls(this.camera, this.renderer.domElement);
        this.clock = new THREE.Clock();
        Promise.all([
            this.loadFontAtlas('horizon.png'),
            this.loadFont('horizon.fnt')
        ]).then(function (_a) {
            var atlas = _a[0], font = _a[1];
            var geometry = new three_msdf_text_1.MSDFTextGeometry({
                text: 'Hello World',
                font: font,
                width: 1000,
                align: 'center'
            });
            var material = new three_msdf_text_1.MSDFTextMaterial();
            material.uniforms.uMap.value = atlas;
            material.side = DoubleSide;
            _this.mesh = new THREE.Mesh(geometry, material);
            _this.scene.add(_this.mesh);
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
                console.log(font);
                resolve(font);
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
/******/ 	__webpack_require__.h = () => ("b3e00b0acf958848f9ff")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi41ZDBhMmI1MmFjNmMyNTU1ZTNhNy5ob3QtdXBkYXRlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsbUdBQStCO0FBRS9CLG9IQUE2QjtBQUM3QixxSEFBbUM7QUFDbkMsNEZBQWdEO0FBQ2hELHFIQUFxRTtBQUNyRSxrR0FBb0Q7QUFDcEQsMEpBQTBFO0FBRTFFLElBQU0sS0FBSyxHQUFHLElBQUksa0JBQUssRUFBRSxDQUFDO0FBQzFCLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxtQ0FBbUM7QUFDdkQsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBRXJDO0lBaUJFLGdCQUFZLE1BQWU7UUFBM0IsaUJBd0NDO1FBdkNDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDL0IsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLEtBQUssQ0FBQyxhQUFhLENBQUMsRUFBRSxNQUFNLFVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDcEUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDN0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsRSxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDO1FBQ2xELElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRXRDLElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxV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QUFNLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQztZQUNqRCxZQUFZLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3JDO1FBRUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDOUMsVUFBVTtRQUNWLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUVaLHFCQUFxQixDQUFDLGNBQU0sWUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFkLENBQWMsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFDSCxhQUFDO0FBQUQsQ0FBQztBQTdNWSx3QkFBTTs7Ozs7Ozs7O1VDYm5CIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcHJvamVjdC1ib2lsZXJwbGF0ZS8uL2FwcC93ZWJnbC9jYW52YXMudHMiLCJ3ZWJwYWNrOi8vcHJvamVjdC1ib2lsZXJwbGF0ZS93ZWJwYWNrL3J1bnRpbWUvZ2V0RnVsbEhhc2giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSAndGhyZWUnO1xuaW1wb3J0IHsgRm9udCwgRm9udExvYWRlciB9IGZyb20gJ3RocmVlL2V4YW1wbGVzL2pzbS9sb2FkZXJzL0ZvbnRMb2FkZXInO1xuaW1wb3J0IFN0YXRzIGZyb20gJ3N0YXRzLmpzJztcbmltcG9ydCBsb2FkRm9udCBmcm9tICdsb2FkLWJtZm9udCc7XG5pbXBvcnQgeyB2ZXJ0ZXhTaGFkZXIgfSBmcm9tICcuL3NoYWRlcnMvdmVydGV4JztcbmltcG9ydCB7IE1TREZUZXh0R2VvbWV0cnksIE1TREZUZXh0TWF0ZXJpYWwgfSBmcm9tICd0aHJlZS1tc2RmLXRleHQnO1xuaW1wb3J0IHsgZnJhZ21lbnRTaGFkZXIgfSBmcm9tICcuL3NoYWRlcnMvZnJhZ21lbnQnO1xuaW1wb3J0IHsgT3JiaXRDb250cm9scyB9IGZyb20gJ3RocmVlL2V4YW1wbGVzL2pzbS9jb250cm9scy9PcmJpdENvbnRyb2xzJztcblxuY29uc3Qgc3RhdHMgPSBuZXcgU3RhdHMoKTtcbnN0YXRzLnNob3dQYW5lbCgxKTsgLy8gMDogZnBzLCAxOiBtcywgMjogbWIsIDMrOiBjdXN0b21cbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc3RhdHMuZG9tKTtcblxuZXhwb3J0IGNsYXNzIENhbnZhcyB7XG4gIHB1YmxpYyBjYW1lcmE6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhO1xuICBwdWJsaWMgcmVuZGVyVGFyZ2V0Q2FtZXJhPzogVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmE7XG4gIHB1YmxpYyByZW5kZXJlcjogVEhSRUUuV2ViR0xSZW5kZXJlcjtcbiAgcHVibGljIHNjZW5lOiBUSFJFRS5TY2VuZTtcbiAgcHVibGljIHJlbmRlclRhcmdldFNjZW5lPzogVEhSRUUuU2NlbmU7XG4gIHB1YmxpYyByZW5kZXJUYXJnZXRNYXRlcmlhbD86IFRIUkVFLlJhd1NoYWRlck1hdGVyaWFsO1xuICBwdWJsaWMgcmVuZGVyVGFyZ2V0TWVzaD86IFRIUkVFLk1lc2g7XG4gIHB1YmxpYyBzcGhlcmU/OiBUSFJFRS5NZXNoO1xuICBwdWJsaWMgZmxvb3I/OiBUSFJFRS5NZXNoO1xuICBwdWJsaWMgbWVzaD86IFRIUkVFLk1lc2g7XG4gIHB1YmxpYyBjb3VudDogbnVtYmVyO1xuICBwdWJsaWMgY2xvY2s6IFRIUkVFLkNsb2NrO1xuICBwdWJsaWMgc3VyZmFjZT86IFRIUkVFLk1lc2g7XG4gIHB1YmxpYyByZW5kZXJUYXJnZXQ/OiBUSFJFRS5XZWJHTFJlbmRlclRhcmdldDtcbiAgcHVibGljIG9yYml0Q29udHJvbHM6IE9yYml0Q29udHJvbHM7XG5cbiAgY29uc3RydWN0b3IoY2FudmFzOiBFbGVtZW50KSB7XG4gICAgdGhpcy5zY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xuICAgIHRoaXMuY291bnQgPSA4MDAwO1xuICAgIHRoaXMucmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcih7IGNhbnZhcywgc3RlbmNpbDogZmFsc2UgfSk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyhNYXRoLm1pbih3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbywgMikpO1xuICAgIHRoaXMucmVuZGVyZXIub3V0cHV0RW5jb2RpbmcgPSBUSFJFRS5zUkdCRW5jb2Rpbmc7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRDbGVhckNvbG9yKDB4MDAwMDAwKTtcblxuICAgIGNvbnN0IG5lYXIgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICB0aGlzLmNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSg3NSwgbmVhciwgMC4xLCAxMDAwMCk7XG4gICAgdGhpcy5jYW1lcmEucG9zaXRpb24ueiA9IDEwMDA7XG5cbiAgICB0aGlzLm9yYml0Q29udHJvbHMgPSBuZXcgT3JiaXRDb250cm9scyhcbiAgICAgIHRoaXMuY2FtZXJhLFxuICAgICAgdGhpcy5yZW5kZXJlci5kb21FbGVtZW50XG4gICAgKTtcbiAgICB0aGlzLmNsb2NrID0gbmV3IFRIUkVFLkNsb2NrKCk7XG5cbiAgICBQcm9taXNlLmFsbChbXG4gICAgICB0aGlzLmxvYWRGb250QXRsYXMoJ2hvcml6b24ucG5nJyksXG4gICAgICB0aGlzLmxvYWRGb250KCdob3Jpem9uLmZudCcpXG4gICAgXSkudGhlbigoW2F0bGFzLCBmb250XSkgPT4ge1xuICAgICAgY29uc3QgZ2VvbWV0cnkgPSBuZXcgTVNERlRleHRHZW9tZXRyeSh7XG4gICAgICAgIHRleHQ6ICdIZWxsbyBXb3JsZCcsXG4gICAgICAgIGZvbnQ6IGZvbnQsXG4gICAgICAgIHdpZHRoOiAxMDAwLFxuICAgICAgICBhbGlnbjogJ2NlbnRlcidcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBtYXRlcmlhbCA9IG5ldyBNU0RGVGV4dE1hdGVyaWFsKCk7XG4gICAgICBtYXRlcmlhbC51bmlmb3Jtcy51TWFwLnZhbHVlID0gYXRsYXM7XG4gICAgICBtYXRlcmlhbC5zaWRlID0gRG91YmxlU2lkZTtcblxuICAgICAgdGhpcy5tZXNoID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcblxuICAgICAgdGhpcy5zY2VuZS5hZGQodGhpcy5tZXNoKTtcbiAgICB9KTtcblxuICAgIHRoaXMuYW5pbWF0ZSgpO1xuICB9XG5cbiAgcHVibGljIGxvYWRGb250QXRsYXMocGF0aDogc3RyaW5nKTogUHJvbWlzZTxUSFJFRS5UZXh0dXJlPiB7XG4gICAgY29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IGxvYWRlciA9IG5ldyBUSFJFRS5UZXh0dXJlTG9hZGVyKCk7XG4gICAgICBsb2FkZXIubG9hZChwYXRoLCAodGV4dHVyZSkgPT4ge1xuICAgICAgICByZXNvbHZlKHRleHR1cmUpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZSBhcyBQcm9taXNlPFRIUkVFLlRleHR1cmU+O1xuICB9XG5cbiAgcHVibGljIGxvYWRGb250KHBhdGg6IHN0cmluZyk6IFByb21pc2U8Rm9udD4ge1xuICAgIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBsb2FkRm9udChwYXRoLCAoZXJyb3I6IGFueSwgZm9udDogYW55KSA9PiB7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhmb250KTtcbiAgICAgICAgcmVzb2x2ZShmb250KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHByb21pc2UgYXMgUHJvbWlzZTxGb250PjtcbiAgfVxuXG4gIHB1YmxpYyBoYW5kbGVMb2FkRm9udCgpOiB2b2lkIHtcbiAgICBsb2FkRm9udCgnLi9ob3Jpem9uLmZudCcsIChlcnJvcjogYW55LCBmb250OiBhbnkpID0+IHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGdlb21ldHJ5ID0gbmV3IE1TREZUZXh0R2VvbWV0cnkoe1xuICAgICAgICBmb250OiBmb250LFxuICAgICAgICB0ZXh0OiAndGVzdCdcbiAgICAgIH0pIGFzIGFueTtcblxuICAgICAgY29uc3QgbG9hZGVyID0gbmV3IFRIUkVFLlRleHR1cmVMb2FkZXIoKTtcblxuICAgICAgbG9hZGVyLmxvYWQoJy4vaG9yaXpvbi5wbmcnLCAodGV4dHVyZSkgPT4ge1xuICAgICAgICB0aGlzLmluaXRpYWxpemUoZ2VvbWV0cnksIHRleHR1cmUpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgaW5pdGlhbGl6ZShcbiAgICBnZW9tZXRyeTogVEhSRUUuQnVmZmVyR2VvbWV0cnksXG4gICAgdGV4dHVyZTogVEhSRUUuVGV4dHVyZVxuICApOiB2b2lkIHtcbiAgICBjb25zdCBtYXRlcmlhbCA9IG5ldyBNU0RGVGV4dE1hdGVyaWFsKHtcbiAgICAgIHNpZGU6IFRIUkVFLkZyb250U2lkZSxcbiAgICAgIHRyYW5zcGFyZW50OiB0cnVlLFxuICAgICAgZGVmaW5lczoge1xuICAgICAgICBJU19TTUFMTDogZmFsc2VcbiAgICAgIH0sXG4gICAgICBleHRlbnNpb25zOiB7XG4gICAgICAgIGRlcml2YXRpdmVzOiB0cnVlXG4gICAgICB9LFxuICAgICAgdW5pZm9ybXM6IHtcbiAgICAgICAgLy8gQ29tbW9uXG4gICAgICAgIHVPcGFjaXR5OiB7IHZhbHVlOiAxIH0sXG4gICAgICAgIHVDb2xvcjogeyB2YWx1ZTogbmV3IFRIUkVFLkNvbG9yKCcjZmZmZmZmJykgfSxcbiAgICAgICAgdU1hcDogeyB2YWx1ZTogdGV4dHVyZSB9LFxuICAgICAgICAvLyBSZW5kZXJpbmdcbiAgICAgICAgdVRocmVzaG9sZDogeyB2YWx1ZTogMC4wNSB9LFxuICAgICAgICB1QWxwaGFUZXN0OiB7IHZhbHVlOiAwLjAxIH0sXG4gICAgICAgIC8vIFN0cm9rZXNcbiAgICAgICAgdVN0cm9rZUNvbG9yOiB7IHZhbHVlOiBuZXcgVEhSRUUuQ29sb3IoJyNmZjAwMDAnKSB9LFxuICAgICAgICB1U3Ryb2tlT3V0c2V0V2lkdGg6IHsgdmFsdWU6IDAuMCB9LFxuICAgICAgICB1U3Ryb2tlSW5zZXRXaWR0aDogeyB2YWx1ZTogMC4zIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuY3JlYXRlUmVuZGVyVGFyZ2V0KHsgZ2VvbWV0cnksIG1hdGVyaWFsIH0pO1xuICB9XG5cbiAgcHVibGljIGNyZWF0ZVJlbmRlclRhcmdldChvcHQ6IHtcbiAgICBnZW9tZXRyeTogYW55O1xuICAgIG1hdGVyaWFsOiBUSFJFRS5TaGFkZXJNYXRlcmlhbDtcbiAgfSk6IHZvaWQge1xuICAgIGNvbnN0IHsgZ2VvbWV0cnksIG1hdGVyaWFsIH0gPSBvcHQ7XG4gICAgdGhpcy5yZW5kZXJUYXJnZXQgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJUYXJnZXQoXG4gICAgICB3aW5kb3cuaW5uZXJXaWR0aCxcbiAgICAgIHdpbmRvdy5pbm5lckhlaWdodFxuICAgICk7XG5cbiAgICB0aGlzLnJlbmRlclRhcmdldENhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSg0NSwgMSwgMC4xLCAxMDAwKTtcbiAgICB0aGlzLnJlbmRlclRhcmdldENhbWVyYS5wb3NpdGlvbi56ID0gMi41O1xuXG4gICAgdGhpcy5yZW5kZXJUYXJnZXRTY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xuICAgIHRoaXMucmVuZGVyVGFyZ2V0U2NlbmUuYmFja2dyb3VuZCA9IG5ldyBUSFJFRS5Db2xvcignI2ZmMDBmZicpO1xuXG4gICAgY29uc3QgdGV4dCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbCk7XG5cbiAgICB0aGlzLnJlbmRlclRhcmdldFNjZW5lLmFkZCh0ZXh0KTtcbiAgICB0aGlzLmNyZWF0ZU1lc2godGhpcy5yZW5kZXJUYXJnZXQudGV4dHVyZSk7XG4gIH1cblxuICBwdWJsaWMgY3JlYXRlTWVzaCh0ZXh0dXJlOiBUSFJFRS5UZXh0dXJlKTogdm9pZCB7XG4gICAgY29uc3QgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkoMSwgMSwgMSk7XG5cbiAgICB0aGlzLnJlbmRlclRhcmdldE1hdGVyaWFsID0gbmV3IFRIUkVFLlJhd1NoYWRlck1hdGVyaWFsKHtcbiAgICAgIHZlcnRleFNoYWRlcixcbiAgICAgIGZyYWdtZW50U2hhZGVyLFxuICAgICAgc2lkZTogVEhSRUUuRnJvbnRTaWRlLFxuICAgICAgdW5pZm9ybXM6IHtcbiAgICAgICAgdV90aW1lOiBuZXcgVEhSRUUuVW5pZm9ybSgwKSxcbiAgICAgICAgdV90ZXh0dXJlOiBuZXcgVEhSRUUuVW5pZm9ybSh0ZXh0dXJlKVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5yZW5kZXJUYXJnZXRNZXNoID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIHRoaXMucmVuZGVyVGFyZ2V0TWF0ZXJpYWwpO1xuXG4gICAgdGhpcy5yZW5kZXJUYXJnZXRNZXNoLnJvdGF0aW9uLnNldCgxMCwgMi41LCAwKTtcbiAgICB0aGlzLnNjZW5lLmFkZCh0aGlzLnJlbmRlclRhcmdldE1lc2gpO1xuICB9XG5cbiAgcHVibGljIGFuaW1hdGUoKTogdm9pZCB7XG4gICAgc3RhdHMuYmVnaW4oKTtcbiAgICBjb25zdCBlbGFwc2VkVGltZSA9IHRoaXMuY2xvY2suZ2V0RWxhcHNlZFRpbWUoKTtcblxuICAgIHRoaXMub3JiaXRDb250cm9scy51cGRhdGUoKTtcblxuICAgIC8vIFJlbmRlclxuICAgIGlmIChcbiAgICAgIHRoaXMucmVuZGVyVGFyZ2V0ICYmXG4gICAgICB0aGlzLnJlbmRlclRhcmdldFNjZW5lICYmXG4gICAgICB0aGlzLnJlbmRlclRhcmdldENhbWVyYSAmJlxuICAgICAgdGhpcy5yZW5kZXJUYXJnZXRNZXNoXG4gICAgKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFJlbmRlclRhcmdldCh0aGlzLnJlbmRlclRhcmdldCk7XG4gICAgICB0aGlzLnJlbmRlcmVyLnJlbmRlcih0aGlzLnJlbmRlclRhcmdldFNjZW5lLCB0aGlzLnJlbmRlclRhcmdldENhbWVyYSk7XG5cbiAgICAgIGNvbnN0IG1lc2hNYXRlcmlhbCA9IHRoaXMucmVuZGVyVGFyZ2V0TWVzaFxuICAgICAgICAubWF0ZXJpYWwgYXMgVEhSRUUuUmF3U2hhZGVyTWF0ZXJpYWw7XG5cbiAgICAgIG1lc2hNYXRlcmlhbC51bmlmb3Jtcy51X3RpbWUudmFsdWUgPSBlbGFwc2VkVGltZTtcbiAgICAgIG1lc2hNYXRlcmlhbC51bmlmb3Jtc05lZWRVcGRhdGUgPSB0cnVlO1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRSZW5kZXJUYXJnZXQobnVsbCk7XG4gICAgfVxuXG4gICAgdGhpcy5yZW5kZXJlci5yZW5kZXIodGhpcy5zY2VuZSwgdGhpcy5jYW1lcmEpO1xuICAgIC8vIEFuaW1hdGVcbiAgICBzdGF0cy5lbmQoKTtcblxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLmFuaW1hdGUoKSk7XG4gIH1cbn1cbiIsIl9fd2VicGFja19yZXF1aXJlX18uaCA9ICgpID0+IChcImIzZTAwYjBhY2Y5NTg4NDhmOWZmXCIpIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9