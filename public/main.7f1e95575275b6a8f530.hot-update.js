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
    Canvas.prototype.createRenderTarget = function () {
        if (!this.mesh) {
            return;
        }
        this.renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, { format: THREE.RGBAFormat });
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
        this.renderer.clearTarget(this.renderTarget, true, false, false);
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
/******/ 	__webpack_require__.h = () => ("a71f280f05f1cdabf6c8")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi43ZjFlOTU1NzUyNzViNmE4ZjUzMC5ob3QtdXBkYXRlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsbUdBQStCO0FBRS9CLG9IQUE2QjtBQUM3QixxSEFBbUM7QUFDbkMsNEZBQWdEO0FBQ2hELHFIQUFxRTtBQUNyRSxrR0FBb0Q7QUFDcEQsMEpBQTBFO0FBRTFFLElBQU0sS0FBSyxHQUFHLElBQUksa0JBQUssRUFBRSxDQUFDO0FBQzFCLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxtQ0FBbUM7QUFDdkQsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBRXJDO0lBaUJFLGdCQUFZLE1BQWU7UUFBM0IsaUJBNENDO1FBM0NDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDL0IsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLEtBQUssQ0FBQyxhQUFhLENBQUMsRUFBRSxNQUFNLFVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDcEUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDN0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsRSxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDO1FBQ2xELElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRXRDLElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxV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QUFDLElBQUksQ0FBQyxDQUFDO1NBQ3JDO1FBRUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDOUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2pFLFVBQVU7UUFDVixLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7UUFFWixxQkFBcUIsQ0FBQyxjQUFNLFlBQUksQ0FBQyxPQUFPLEVBQUUsRUFBZCxDQUFjLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBQ0gsYUFBQztBQUFELENBQUM7QUFqS1ksd0JBQU07Ozs7Ozs7OztVQ2JuQiIsInNvdXJjZXMiOlsid2VicGFjazovL3Byb2plY3QtYm9pbGVycGxhdGUvLi9hcHAvd2ViZ2wvY2FudmFzLnRzIiwid2VicGFjazovL3Byb2plY3QtYm9pbGVycGxhdGUvd2VicGFjay9ydW50aW1lL2dldEZ1bGxIYXNoIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFRIUkVFIGZyb20gJ3RocmVlJztcbmltcG9ydCB7IEZvbnQsIEZvbnRMb2FkZXIgfSBmcm9tICd0aHJlZS9leGFtcGxlcy9qc20vbG9hZGVycy9Gb250TG9hZGVyJztcbmltcG9ydCBTdGF0cyBmcm9tICdzdGF0cy5qcyc7XG5pbXBvcnQgbG9hZEZvbnQgZnJvbSAnbG9hZC1ibWZvbnQnO1xuaW1wb3J0IHsgdmVydGV4U2hhZGVyIH0gZnJvbSAnLi9zaGFkZXJzL3ZlcnRleCc7XG5pbXBvcnQgeyBNU0RGVGV4dEdlb21ldHJ5LCBNU0RGVGV4dE1hdGVyaWFsIH0gZnJvbSAndGhyZWUtbXNkZi10ZXh0JztcbmltcG9ydCB7IGZyYWdtZW50U2hhZGVyIH0gZnJvbSAnLi9zaGFkZXJzL2ZyYWdtZW50JztcbmltcG9ydCB7IE9yYml0Q29udHJvbHMgfSBmcm9tICd0aHJlZS9leGFtcGxlcy9qc20vY29udHJvbHMvT3JiaXRDb250cm9scyc7XG5cbmNvbnN0IHN0YXRzID0gbmV3IFN0YXRzKCk7XG5zdGF0cy5zaG93UGFuZWwoMSk7IC8vIDA6IGZwcywgMTogbXMsIDI6IG1iLCAzKzogY3VzdG9tXG5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHN0YXRzLmRvbSk7XG5cbmV4cG9ydCBjbGFzcyBDYW52YXMge1xuICBwdWJsaWMgY2FtZXJhOiBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYTtcbiAgcHVibGljIHJlbmRlclRhcmdldENhbWVyYT86IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhO1xuICBwdWJsaWMgcmVuZGVyZXI6IFRIUkVFLldlYkdMUmVuZGVyZXI7XG4gIHB1YmxpYyBzY2VuZTogVEhSRUUuU2NlbmU7XG4gIHB1YmxpYyByZW5kZXJUYXJnZXRTY2VuZT86IFRIUkVFLlNjZW5lO1xuICBwdWJsaWMgcmVuZGVyVGFyZ2V0TWF0ZXJpYWw/OiBUSFJFRS5SYXdTaGFkZXJNYXRlcmlhbDtcbiAgcHVibGljIHJlbmRlclRhcmdldE1lc2g/OiBUSFJFRS5NZXNoO1xuICBwdWJsaWMgc3BoZXJlPzogVEhSRUUuTWVzaDtcbiAgcHVibGljIGZsb29yPzogVEhSRUUuTWVzaDtcbiAgcHVibGljIG1lc2g/OiBUSFJFRS5NZXNoO1xuICBwdWJsaWMgY291bnQ6IG51bWJlcjtcbiAgcHVibGljIGNsb2NrOiBUSFJFRS5DbG9jaztcbiAgcHVibGljIHN1cmZhY2U/OiBUSFJFRS5NZXNoO1xuICBwdWJsaWMgcmVuZGVyVGFyZ2V0PzogVEhSRUUuV2ViR0xSZW5kZXJUYXJnZXQ7XG4gIHB1YmxpYyBvcmJpdENvbnRyb2xzOiBPcmJpdENvbnRyb2xzO1xuXG4gIGNvbnN0cnVjdG9yKGNhbnZhczogRWxlbWVudCkge1xuICAgIHRoaXMuc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcbiAgICB0aGlzLmNvdW50ID0gODAwMDtcbiAgICB0aGlzLnJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoeyBjYW52YXMsIHN0ZW5jaWw6IGZhbHNlIH0pO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFBpeGVsUmF0aW8oTWF0aC5taW4od2luZG93LmRldmljZVBpeGVsUmF0aW8sIDIpKTtcbiAgICB0aGlzLnJlbmRlcmVyLm91dHB1dEVuY29kaW5nID0gVEhSRUUuc1JHQkVuY29kaW5nO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0Q2xlYXJDb2xvcigweDAwMDAwMCk7XG5cbiAgICBjb25zdCBuZWFyID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgdGhpcy5jYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoNzUsIG5lYXIsIDAuMSwgMTAwMDApO1xuICAgIHRoaXMuY2FtZXJhLnBvc2l0aW9uLnogPSA1MDtcblxuICAgIHRoaXMub3JiaXRDb250cm9scyA9IG5ldyBPcmJpdENvbnRyb2xzKFxuICAgICAgdGhpcy5jYW1lcmEsXG4gICAgICB0aGlzLnJlbmRlcmVyLmRvbUVsZW1lbnRcbiAgICApO1xuICAgIHRoaXMuY2xvY2sgPSBuZXcgVEhSRUUuQ2xvY2soKTtcblxuICAgIFByb21pc2UuYWxsKFtcbiAgICAgIHRoaXMubG9hZEZvbnRBdGxhcygnaG9yaXpvbi5wbmcnKSxcbiAgICAgIHRoaXMubG9hZEZvbnQoJ2hvcml6b24uZm50JylcbiAgICBdKS50aGVuKChbYXRsYXMsIGZvbnRdKSA9PiB7XG4gICAgICBjb25zdCBnZW9tZXRyeSA9IG5ldyBNU0RGVGV4dEdlb21ldHJ5KHtcbiAgICAgICAgdGV4dDogJ0luZmluaXR5JyxcbiAgICAgICAgZm9udDogZm9udCxcbiAgICAgICAgd2lkdGg6IDEwMDAsXG4gICAgICAgIGFsaWduOiAnY2VudGVyJ1xuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IG1hdGVyaWFsID0gbmV3IE1TREZUZXh0TWF0ZXJpYWwoKTtcbiAgICAgIG1hdGVyaWFsLnVuaWZvcm1zLnVNYXAudmFsdWUgPSBhdGxhcztcbiAgICAgIG1hdGVyaWFsLnNpZGUgPSBUSFJFRS5Eb3VibGVTaWRlO1xuXG4gICAgICB0aGlzLm1lc2ggPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICAgICAgdGhpcy5tZXNoLnJvdGF0aW9uLnggPSBNYXRoLlBJO1xuICAgICAgY29uc3Qgc2NhbGUgPSAzO1xuICAgICAgdGhpcy5tZXNoLnBvc2l0aW9uLnggPSAoLWdlb21ldHJ5LmxheW91dC53aWR0aCAvIDIpICogc2NhbGU7XG4gICAgICB0aGlzLm1lc2guc2NhbGUuc2V0KHNjYWxlLCBzY2FsZSwgc2NhbGUpO1xuXG4gICAgICB0aGlzLmNyZWF0ZVJlbmRlclRhcmdldCgpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5hbmltYXRlKCk7XG4gIH1cblxuICBwdWJsaWMgbG9hZEZvbnRBdGxhcyhwYXRoOiBzdHJpbmcpOiBQcm9taXNlPFRIUkVFLlRleHR1cmU+IHtcbiAgICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgbG9hZGVyID0gbmV3IFRIUkVFLlRleHR1cmVMb2FkZXIoKTtcbiAgICAgIGxvYWRlci5sb2FkKHBhdGgsICh0ZXh0dXJlKSA9PiB7XG4gICAgICAgIHJlc29sdmUodGV4dHVyZSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBwcm9taXNlIGFzIFByb21pc2U8VEhSRUUuVGV4dHVyZT47XG4gIH1cblxuICBwdWJsaWMgbG9hZEZvbnQocGF0aDogc3RyaW5nKTogUHJvbWlzZTxGb250PiB7XG4gICAgY29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGxvYWRGb250KHBhdGgsIChlcnJvcjogYW55LCBmb250OiBhbnkpID0+IHtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJlc29sdmUoZm9udCk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBwcm9taXNlIGFzIFByb21pc2U8Rm9udD47XG4gIH1cblxuICBwdWJsaWMgY3JlYXRlUmVuZGVyVGFyZ2V0KCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5tZXNoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMucmVuZGVyVGFyZ2V0ID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyVGFyZ2V0KFxuICAgICAgd2luZG93LmlubmVyV2lkdGgsXG4gICAgICB3aW5kb3cuaW5uZXJIZWlnaHQsXG4gICAgICB7IGZvcm1hdDogVEhSRUUuUkdCQUZvcm1hdCB9XG4gICAgKTtcblxuICAgIHRoaXMucmVuZGVyVGFyZ2V0Q2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKFxuICAgICAgNzUsXG4gICAgICB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCxcbiAgICAgIDAuMSxcbiAgICAgIDEwMDAwXG4gICAgKTtcbiAgICB0aGlzLnJlbmRlclRhcmdldENhbWVyYS5wb3NpdGlvbi56ID0gNjAwO1xuXG4gICAgdGhpcy5yZW5kZXJUYXJnZXRTY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xuXG4gICAgdGhpcy5yZW5kZXJUYXJnZXRTY2VuZS5hZGQodGhpcy5tZXNoKTtcbiAgICB0aGlzLmNyZWF0ZU1lc2godGhpcy5yZW5kZXJUYXJnZXQudGV4dHVyZSk7XG4gIH1cblxuICBwdWJsaWMgY3JlYXRlTWVzaCh0ZXh0dXJlOiBUSFJFRS5UZXh0dXJlKTogdm9pZCB7XG4gICAgY29uc3QgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuVG9ydXNHZW9tZXRyeSgxMCwgMywgMTYsIDEwMCk7XG5cbiAgICB0aGlzLnJlbmRlclRhcmdldE1hdGVyaWFsID0gbmV3IFRIUkVFLlJhd1NoYWRlck1hdGVyaWFsKHtcbiAgICAgIHZlcnRleFNoYWRlcixcbiAgICAgIGZyYWdtZW50U2hhZGVyLFxuICAgICAgc2lkZTogVEhSRUUuRnJvbnRTaWRlLFxuICAgICAgdW5pZm9ybXM6IHtcbiAgICAgICAgdV90aW1lOiBuZXcgVEhSRUUuVW5pZm9ybSgwKSxcbiAgICAgICAgdV90ZXh0dXJlOiBuZXcgVEhSRUUuVW5pZm9ybSh0ZXh0dXJlKVxuICAgICAgfSxcbiAgICAgIHRyYW5zcGFyZW50OiB0cnVlXG4gICAgfSk7XG5cbiAgICB0aGlzLnJlbmRlclRhcmdldE1lc2ggPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgdGhpcy5yZW5kZXJUYXJnZXRNYXRlcmlhbCk7XG5cbiAgICB0aGlzLnJlbmRlclRhcmdldE1lc2gucm90YXRpb24uc2V0KDIsIDIuOCwgMCk7XG4gICAgdGhpcy5zY2VuZS5hZGQodGhpcy5yZW5kZXJUYXJnZXRNZXNoKTtcbiAgfVxuXG4gIHB1YmxpYyBhbmltYXRlKCk6IHZvaWQge1xuICAgIHN0YXRzLmJlZ2luKCk7XG4gICAgY29uc3QgZWxhcHNlZFRpbWUgPSB0aGlzLmNsb2NrLmdldEVsYXBzZWRUaW1lKCk7XG5cbiAgICB0aGlzLm9yYml0Q29udHJvbHMudXBkYXRlKCk7XG5cbiAgICBpZiAoXG4gICAgICB0aGlzLnJlbmRlclRhcmdldCAmJlxuICAgICAgdGhpcy5yZW5kZXJUYXJnZXRTY2VuZSAmJlxuICAgICAgdGhpcy5yZW5kZXJUYXJnZXRDYW1lcmEgJiZcbiAgICAgIHRoaXMucmVuZGVyVGFyZ2V0TWVzaFxuICAgICkge1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRSZW5kZXJUYXJnZXQodGhpcy5yZW5kZXJUYXJnZXQpO1xuICAgICAgdGhpcy5yZW5kZXJlci5yZW5kZXIodGhpcy5yZW5kZXJUYXJnZXRTY2VuZSwgdGhpcy5yZW5kZXJUYXJnZXRDYW1lcmEpO1xuXG4gICAgICBjb25zdCBtZXNoTWF0ZXJpYWwgPSB0aGlzLnJlbmRlclRhcmdldE1lc2hcbiAgICAgICAgLm1hdGVyaWFsIGFzIFRIUkVFLlJhd1NoYWRlck1hdGVyaWFsO1xuXG4gICAgICBtZXNoTWF0ZXJpYWwudW5pZm9ybXMudV90aW1lLnZhbHVlID0gZWxhcHNlZFRpbWU7XG4gICAgICBtZXNoTWF0ZXJpYWwudW5pZm9ybXNOZWVkVXBkYXRlID0gdHJ1ZTtcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0UmVuZGVyVGFyZ2V0KG51bGwpO1xuICAgIH1cblxuICAgIHRoaXMucmVuZGVyZXIucmVuZGVyKHRoaXMuc2NlbmUsIHRoaXMuY2FtZXJhKTtcbiAgICB0aGlzLnJlbmRlcmVyLmNsZWFyVGFyZ2V0KHRoaXMucmVuZGVyVGFyZ2V0LCB0cnVlLCBmYWxzZSwgZmFsc2UpO1xuICAgIC8vIEFuaW1hdGVcbiAgICBzdGF0cy5lbmQoKTtcblxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLmFuaW1hdGUoKSk7XG4gIH1cbn1cbiIsIl9fd2VicGFja19yZXF1aXJlX18uaCA9ICgpID0+IChcImE3MWYyODBmMDVmMWNkYWJmNmM4XCIpIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9