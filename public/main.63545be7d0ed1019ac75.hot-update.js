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
/******/ 	__webpack_require__.h = () => ("f78781f46eb19ad6c604")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi42MzU0NWJlN2QwZWQxMDE5YWM3NS5ob3QtdXBkYXRlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsbUdBQStCO0FBQy9CLG9IQUE2QjtBQUM3QixxSEFBbUM7QUFDbkMsNEZBQWdEO0FBQ2hELHFIQUFxRTtBQUNyRSxrR0FBb0Q7QUFDcEQsMEpBQTBFO0FBRTFFLElBQU0sS0FBSyxHQUFHLElBQUksa0JBQUssRUFBRSxDQUFDO0FBQzFCLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxtQ0FBbUM7QUFDdkQsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBRXJDO0lBZ0JFLGdCQUFZLE1BQWU7UUFDekIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUMvQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUNsQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksS0FBSyxDQUFDLGFBQWEsQ0FBQyxFQUFFLE1BQU0sVUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUNwRSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUM3RCxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xFLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQyxZQUFZLENBQUM7UUFDbEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFdEMsSUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLFVBQVUsR0FBRyxNQUFN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R0FBRyxXQUFXLENBQUM7WUFDakQsWUFBWSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQztZQUN2QyxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNyQztRQUVELElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzlDLFVBQVU7UUFDVixLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7UUFFWixxQkFBcUIsQ0FBQyxjQUFNLFlBQUksQ0FBQyxPQUFPLEVBQUUsRUFBZCxDQUFjLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBQ0gsYUFBQztBQUFELENBQUM7QUExS1ksd0JBQU07Ozs7Ozs7OztVQ1puQiIsInNvdXJjZXMiOlsid2VicGFjazovL3Byb2plY3QtYm9pbGVycGxhdGUvLi9hcHAvd2ViZ2wvY2FudmFzLnRzIiwid2VicGFjazovL3Byb2plY3QtYm9pbGVycGxhdGUvd2VicGFjay9ydW50aW1lL2dldEZ1bGxIYXNoIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFRIUkVFIGZyb20gJ3RocmVlJztcbmltcG9ydCBTdGF0cyBmcm9tICdzdGF0cy5qcyc7XG5pbXBvcnQgbG9hZEZvbnQgZnJvbSAnbG9hZC1ibWZvbnQnO1xuaW1wb3J0IHsgdmVydGV4U2hhZGVyIH0gZnJvbSAnLi9zaGFkZXJzL3ZlcnRleCc7XG5pbXBvcnQgeyBNU0RGVGV4dEdlb21ldHJ5LCBNU0RGVGV4dE1hdGVyaWFsIH0gZnJvbSAndGhyZWUtbXNkZi10ZXh0JztcbmltcG9ydCB7IGZyYWdtZW50U2hhZGVyIH0gZnJvbSAnLi9zaGFkZXJzL2ZyYWdtZW50JztcbmltcG9ydCB7IE9yYml0Q29udHJvbHMgfSBmcm9tICd0aHJlZS9leGFtcGxlcy9qc20vY29udHJvbHMvT3JiaXRDb250cm9scyc7XG5cbmNvbnN0IHN0YXRzID0gbmV3IFN0YXRzKCk7XG5zdGF0cy5zaG93UGFuZWwoMSk7IC8vIDA6IGZwcywgMTogbXMsIDI6IG1iLCAzKzogY3VzdG9tXG5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHN0YXRzLmRvbSk7XG5cbmV4cG9ydCBjbGFzcyBDYW52YXMge1xuICBwdWJsaWMgY2FtZXJhOiBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYTtcbiAgcHVibGljIHJlbmRlclRhcmdldENhbWVyYT86IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhO1xuICBwdWJsaWMgcmVuZGVyZXI6IFRIUkVFLldlYkdMUmVuZGVyZXI7XG4gIHB1YmxpYyBzY2VuZTogVEhSRUUuU2NlbmU7XG4gIHB1YmxpYyByZW5kZXJUYXJnZXRTY2VuZT86IFRIUkVFLlNjZW5lO1xuICBwdWJsaWMgcmVuZGVyVGFyZ2V0TWF0ZXJpYWw/OiBUSFJFRS5SYXdTaGFkZXJNYXRlcmlhbDtcbiAgcHVibGljIHJlbmRlclRhcmdldE1lc2g/OiBUSFJFRS5NZXNoO1xuICBwdWJsaWMgc3BoZXJlPzogVEhSRUUuTWVzaDtcbiAgcHVibGljIGZsb29yPzogVEhSRUUuTWVzaDtcbiAgcHVibGljIGNvdW50OiBudW1iZXI7XG4gIHB1YmxpYyBjbG9jazogVEhSRUUuQ2xvY2s7XG4gIHB1YmxpYyBzdXJmYWNlPzogVEhSRUUuTWVzaDtcbiAgcHVibGljIHJlbmRlclRhcmdldD86IFRIUkVFLldlYkdMUmVuZGVyVGFyZ2V0O1xuICBwdWJsaWMgb3JiaXRDb250cm9sczogT3JiaXRDb250cm9scztcblxuICBjb25zdHJ1Y3RvcihjYW52YXM6IEVsZW1lbnQpIHtcbiAgICB0aGlzLnNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG4gICAgdGhpcy5jb3VudCA9IDgwMDA7XG4gICAgdGhpcy5yZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKHsgY2FudmFzLCBzdGVuY2lsOiBmYWxzZSB9KTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRQaXhlbFJhdGlvKE1hdGgubWluKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvLCAyKSk7XG4gICAgdGhpcy5yZW5kZXJlci5vdXRwdXRFbmNvZGluZyA9IFRIUkVFLnNSR0JFbmNvZGluZztcbiAgICB0aGlzLnJlbmRlcmVyLnNldENsZWFyQ29sb3IoMHhmZmZmZmYpO1xuXG4gICAgY29uc3QgbmVhciA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIHRoaXMuY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDc1LCBuZWFyLCAwLjEsIDEwMDAwKTtcbiAgICB0aGlzLmNhbWVyYS5wb3NpdGlvbi56ID0gMztcblxuICAgIHRoaXMub3JiaXRDb250cm9scyA9IG5ldyBPcmJpdENvbnRyb2xzKFxuICAgICAgdGhpcy5jYW1lcmEsXG4gICAgICB0aGlzLnJlbmRlcmVyLmRvbUVsZW1lbnRcbiAgICApO1xuICAgIHRoaXMuY2xvY2sgPSBuZXcgVEhSRUUuQ2xvY2soKTtcblxuICAgIHRoaXMuYW5pbWF0ZSgpO1xuICB9XG5cbiAgcHVibGljIGxvYWRGb250QXRsYXMocGF0aDogc3RyaW5nKTogUHJvbWlzZTxUSFJFRS5UZXh0dXJlPiB7XG4gICAgY29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IGxvYWRlciA9IG5ldyBUSFJFRS5UZXh0dXJlTG9hZGVyKCk7XG4gICAgICBsb2FkZXIubG9hZChwYXRoLCAodGV4dHVyZSkgPT4ge1xuICAgICAgICByZXNvbHZlKHRleHR1cmUpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIHB1YmxpYyBoYW5kbGVMb2FkRm9udCgpOiB2b2lkIHtcbiAgICBsb2FkRm9udCgnLi9ob3Jpem9uLmZudCcsIChlcnJvcjogYW55LCBmb250OiBhbnkpID0+IHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGdlb21ldHJ5ID0gbmV3IE1TREZUZXh0R2VvbWV0cnkoe1xuICAgICAgICBmb250OiBmb250LFxuICAgICAgICB0ZXh0OiAndGVzdCdcbiAgICAgIH0pIGFzIGFueTtcblxuICAgICAgY29uc3QgbG9hZGVyID0gbmV3IFRIUkVFLlRleHR1cmVMb2FkZXIoKTtcblxuICAgICAgbG9hZGVyLmxvYWQoJy4vaG9yaXpvbi5wbmcnLCAodGV4dHVyZSkgPT4ge1xuICAgICAgICB0aGlzLmluaXRpYWxpemUoZ2VvbWV0cnksIHRleHR1cmUpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgaW5pdGlhbGl6ZShcbiAgICBnZW9tZXRyeTogVEhSRUUuQnVmZmVyR2VvbWV0cnksXG4gICAgdGV4dHVyZTogVEhSRUUuVGV4dHVyZVxuICApOiB2b2lkIHtcbiAgICBjb25zdCBtYXRlcmlhbCA9IG5ldyBNU0RGVGV4dE1hdGVyaWFsKHtcbiAgICAgIHNpZGU6IFRIUkVFLkZyb250U2lkZSxcbiAgICAgIHRyYW5zcGFyZW50OiB0cnVlLFxuICAgICAgZGVmaW5lczoge1xuICAgICAgICBJU19TTUFMTDogZmFsc2VcbiAgICAgIH0sXG4gICAgICBleHRlbnNpb25zOiB7XG4gICAgICAgIGRlcml2YXRpdmVzOiB0cnVlXG4gICAgICB9LFxuICAgICAgdW5pZm9ybXM6IHtcbiAgICAgICAgLy8gQ29tbW9uXG4gICAgICAgIHVPcGFjaXR5OiB7IHZhbHVlOiAxIH0sXG4gICAgICAgIHVDb2xvcjogeyB2YWx1ZTogbmV3IFRIUkVFLkNvbG9yKCcjZmZmZmZmJykgfSxcbiAgICAgICAgdU1hcDogeyB2YWx1ZTogdGV4dHVyZSB9LFxuICAgICAgICAvLyBSZW5kZXJpbmdcbiAgICAgICAgdVRocmVzaG9sZDogeyB2YWx1ZTogMC4wNSB9LFxuICAgICAgICB1QWxwaGFUZXN0OiB7IHZhbHVlOiAwLjAxIH0sXG4gICAgICAgIC8vIFN0cm9rZXNcbiAgICAgICAgdVN0cm9rZUNvbG9yOiB7IHZhbHVlOiBuZXcgVEhSRUUuQ29sb3IoJyNmZjAwMDAnKSB9LFxuICAgICAgICB1U3Ryb2tlT3V0c2V0V2lkdGg6IHsgdmFsdWU6IDAuMCB9LFxuICAgICAgICB1U3Ryb2tlSW5zZXRXaWR0aDogeyB2YWx1ZTogMC4zIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuY3JlYXRlUmVuZGVyVGFyZ2V0KHsgZ2VvbWV0cnksIG1hdGVyaWFsIH0pO1xuICB9XG5cbiAgcHVibGljIGNyZWF0ZVJlbmRlclRhcmdldChvcHQ6IHtcbiAgICBnZW9tZXRyeTogYW55O1xuICAgIG1hdGVyaWFsOiBUSFJFRS5TaGFkZXJNYXRlcmlhbDtcbiAgfSk6IHZvaWQge1xuICAgIGNvbnN0IHsgZ2VvbWV0cnksIG1hdGVyaWFsIH0gPSBvcHQ7XG4gICAgdGhpcy5yZW5kZXJUYXJnZXQgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJUYXJnZXQoXG4gICAgICB3aW5kb3cuaW5uZXJXaWR0aCxcbiAgICAgIHdpbmRvdy5pbm5lckhlaWdodFxuICAgICk7XG5cbiAgICB0aGlzLnJlbmRlclRhcmdldENhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSg0NSwgMSwgMC4xLCAxMDAwKTtcbiAgICB0aGlzLnJlbmRlclRhcmdldENhbWVyYS5wb3NpdGlvbi56ID0gMi41O1xuXG4gICAgdGhpcy5yZW5kZXJUYXJnZXRTY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xuICAgIHRoaXMucmVuZGVyVGFyZ2V0U2NlbmUuYmFja2dyb3VuZCA9IG5ldyBUSFJFRS5Db2xvcignI2ZmMDBmZicpO1xuXG4gICAgY29uc3QgdGV4dCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbCk7XG5cbiAgICB0aGlzLnJlbmRlclRhcmdldFNjZW5lLmFkZCh0ZXh0KTtcbiAgICB0aGlzLmNyZWF0ZU1lc2godGhpcy5yZW5kZXJUYXJnZXQudGV4dHVyZSk7XG4gIH1cblxuICBwdWJsaWMgY3JlYXRlTWVzaCh0ZXh0dXJlOiBUSFJFRS5UZXh0dXJlKTogdm9pZCB7XG4gICAgY29uc3QgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkoMSwgMSwgMSk7XG5cbiAgICB0aGlzLnJlbmRlclRhcmdldE1hdGVyaWFsID0gbmV3IFRIUkVFLlJhd1NoYWRlck1hdGVyaWFsKHtcbiAgICAgIHZlcnRleFNoYWRlcixcbiAgICAgIGZyYWdtZW50U2hhZGVyLFxuICAgICAgc2lkZTogVEhSRUUuRnJvbnRTaWRlLFxuICAgICAgdW5pZm9ybXM6IHtcbiAgICAgICAgdV90aW1lOiBuZXcgVEhSRUUuVW5pZm9ybSgwKSxcbiAgICAgICAgdV90ZXh0dXJlOiBuZXcgVEhSRUUuVW5pZm9ybSh0ZXh0dXJlKVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5yZW5kZXJUYXJnZXRNZXNoID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIHRoaXMucmVuZGVyVGFyZ2V0TWF0ZXJpYWwpO1xuXG4gICAgdGhpcy5yZW5kZXJUYXJnZXRNZXNoLnJvdGF0aW9uLnNldCgxMCwgMi41LCAwKTtcbiAgICB0aGlzLnNjZW5lLmFkZCh0aGlzLnJlbmRlclRhcmdldE1lc2gpO1xuICB9XG5cbiAgcHVibGljIGFuaW1hdGUoKTogdm9pZCB7XG4gICAgc3RhdHMuYmVnaW4oKTtcbiAgICBjb25zdCBlbGFwc2VkVGltZSA9IHRoaXMuY2xvY2suZ2V0RWxhcHNlZFRpbWUoKTtcblxuICAgIHRoaXMub3JiaXRDb250cm9scy51cGRhdGUoKTtcblxuICAgIC8vIFJlbmRlclxuICAgIGlmIChcbiAgICAgIHRoaXMucmVuZGVyVGFyZ2V0ICYmXG4gICAgICB0aGlzLnJlbmRlclRhcmdldFNjZW5lICYmXG4gICAgICB0aGlzLnJlbmRlclRhcmdldENhbWVyYSAmJlxuICAgICAgdGhpcy5yZW5kZXJUYXJnZXRNZXNoXG4gICAgKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFJlbmRlclRhcmdldCh0aGlzLnJlbmRlclRhcmdldCk7XG4gICAgICB0aGlzLnJlbmRlcmVyLnJlbmRlcih0aGlzLnJlbmRlclRhcmdldFNjZW5lLCB0aGlzLnJlbmRlclRhcmdldENhbWVyYSk7XG5cbiAgICAgIGNvbnN0IG1lc2hNYXRlcmlhbCA9IHRoaXMucmVuZGVyVGFyZ2V0TWVzaFxuICAgICAgICAubWF0ZXJpYWwgYXMgVEhSRUUuUmF3U2hhZGVyTWF0ZXJpYWw7XG5cbiAgICAgIG1lc2hNYXRlcmlhbC51bmlmb3Jtcy51X3RpbWUudmFsdWUgPSBlbGFwc2VkVGltZTtcbiAgICAgIG1lc2hNYXRlcmlhbC51bmlmb3Jtc05lZWRVcGRhdGUgPSB0cnVlO1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRSZW5kZXJUYXJnZXQobnVsbCk7XG4gICAgfVxuXG4gICAgdGhpcy5yZW5kZXJlci5yZW5kZXIodGhpcy5zY2VuZSwgdGhpcy5jYW1lcmEpO1xuICAgIC8vIEFuaW1hdGVcbiAgICBzdGF0cy5lbmQoKTtcblxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLmFuaW1hdGUoKSk7XG4gIH1cbn1cbiIsIl9fd2VicGFja19yZXF1aXJlX18uaCA9ICgpID0+IChcImY3ODc4MWY0NmViMTlhZDZjNjA0XCIpIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9