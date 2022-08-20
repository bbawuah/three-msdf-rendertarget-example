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
var sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};
var Canvas = /** @class */ (function () {
    function Canvas(canvas) {
        this.scene = new THREE.Scene();
        this.count = 8000;
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.setClearColor(0x0000ff);
        this.ambientLight = new THREE.AmbientLight(0xffffff, 1);
        this.scene.add(this.ambientLight);
        this.spotLight = new THREE.SpotLight(0xffffff, 17, 80, Math.PI * 0.25, 0.2, 3);
        this.spotLight.position.set(0, 10, 0);
        this.spotLight.castShadow = true;
        this.spotLight.shadow.camera.near = 0.5;
        this.spotLight.shadow.camera.far = 40;
        this.scene.add(this.spotLight);
        var near = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(75, near, 0.1, 10000);
        this.camera.position.z = 40;
        this.orbitControls = new OrbitControls_1.OrbitControls(this.camera, this.renderer.domElement);
        this.orbitControls.enableZoom = false;
        this.clock = new THREE.Clock();
        this.init();
    }
    Canvas.prototype.init = function () {
        var _this = this;
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
        this.createFloor();
        this.animate();
        this.handleResize();
    };
    Canvas.prototype.loadFontAtlas = function (path) {
        var promise = new Promise(function (resolve, reject) {
            var loader = new THREE.TextureLoader();
            loader.load(path, function (texture) {
                resolve(texture);
            }, onError, function (event) {
                console.log(event);
            });
        });
        return promise;
    };
    Canvas.prototype.loadFont = function (path) {
        var promise = new Promise(function (resolve, reject) {
            (0, load_bmfont_1.default)(path, function (error, font) {
                if (error) {
                    reject();
                }
                resolve(font);
            });
        });
        return promise;
    };
    Canvas.prototype.handleResize = function () {
        var _this = this;
        window.addEventListener('resize', function () {
            sizes.width = window.innerWidth;
            sizes.height = window.innerHeight;
            _this.camera.aspect = sizes.width / sizes.height;
            _this.camera.updateProjectionMatrix();
            _this.renderer.setSize(sizes.width, sizes.height);
            _this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        });
    };
    Canvas.prototype.createRenderTarget = function () {
        if (!this.mesh) {
            return;
        }
        this.renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
        this.renderTargetCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.renderTargetCamera.position.z = 375;
        this.renderTargetScene = new THREE.Scene();
        this.renderTargetScene.add(this.mesh);
        this.createMesh(this.renderTarget.texture);
    };
    Canvas.prototype.createMesh = function (texture) {
        var geometry = new THREE.TorusGeometry(10, 3, 30, 100);
        this.renderTargetMaterial = new THREE.RawShaderMaterial({
            vertexShader: vertex_1.vertexShader,
            fragmentShader: fragment_1.fragmentShader,
            side: THREE.FrontSide,
            uniforms: {
                u_time: new THREE.Uniform(0),
                u_texture: new THREE.Uniform(texture),
                u_lightPos: {
                    value: new THREE.Vector3(0).copy(this.spotLight.position)
                },
                u_spotLightColor: {
                    value: new THREE.Color(0xffffff)
                },
                u_lightIntensity: {
                    value: 0.875
                }
            },
            transparent: true
        });
        this.renderTargetMesh = new THREE.Mesh(geometry, this.renderTargetMaterial);
        this.renderTargetMesh.rotation.set(2, 2.8, 0);
        this.scene.add(this.renderTargetMesh);
    };
    Canvas.prototype.createFloor = function () {
        var material = new THREE.MeshStandardMaterial({
            color: 0x0000ff
        });
        var geometry = new THREE.CircleGeometry(50, 50);
        var plane = new THREE.Mesh(geometry, material);
        this.scene.add(plane);
        plane.rotation.x = -Math.PI / 2;
        plane.position.y = -15.5;
        plane.receiveShadow = true;
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
/******/ 	__webpack_require__.h = () => ("f8f2cd9636520c825f5e")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi44MmQ2MWY5OWIwMTljOGQ4MGM4Zi5ob3QtdXBkYXRlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsbUdBQStCO0FBRS9CLG9IQUE2QjtBQUM3QixxSEFBbUM7QUFDbkMsNEZBQWdEO0FBQ2hELHFIQUFxRTtBQUNyRSxrR0FBb0Q7QUFDcEQsMEpBQTBFO0FBRTFFLElBQU0sS0FBSyxHQUFHLElBQUksa0JBQUssRUFBRSxDQUFDO0FBQzFCLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxtQ0FBbUM7QUFDdkQsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBRXJDLElBQU0sS0FBSyxHQUFHO0lBQ1osS0FBSyxFQUFFLE1BQU0sQ0FBQyxVQUFVO0lBQ3hCLE1BQU0sRUFBRSxNQUFNLENBQUMsV0FBVztDQUMzQixDQUFDO0FBRUY7SUFtQkUsZ0JBQVksTUFBZTtRQUN6QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQy9CLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxLQUFLLENBQUMsYUFBYSxDQUFDO1lBQ3RDLE1BQU07U0FDUCxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUM3RCxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xFLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQyxZQUFZLENBQUM7UUFDbEQsSUFBSSxDQUFDLFFBQVEsQ0FB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QUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7WUFFdEUsSUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLGdCQUFnQjtpQkFDdkMsUUFBbUMsQ0FBQztZQUV2QyxZQUFZLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsV0FBVyxDQUFDO1lBQ2pELFlBQVksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUM7WUFDdkMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDckM7UUFFRCxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM5QyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7UUFFWixxQkFBcUIsQ0FBQyxjQUFNLFlBQUksQ0FBQyxPQUFPLEVBQUUsRUFBZCxDQUFjLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBQ0gsYUFBQztBQUFELENBQUM7QUFwT1ksd0JBQU07Ozs7Ozs7OztVQ2xCbkIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wcm9qZWN0LWJvaWxlcnBsYXRlLy4vYXBwL3dlYmdsL2NhbnZhcy50cyIsIndlYnBhY2s6Ly9wcm9qZWN0LWJvaWxlcnBsYXRlL3dlYnBhY2svcnVudGltZS9nZXRGdWxsSGFzaCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tICd0aHJlZSc7XG5pbXBvcnQgeyBGb250LCBGb250TG9hZGVyIH0gZnJvbSAndGhyZWUvZXhhbXBsZXMvanNtL2xvYWRlcnMvRm9udExvYWRlcic7XG5pbXBvcnQgU3RhdHMgZnJvbSAnc3RhdHMuanMnO1xuaW1wb3J0IGxvYWRGb250IGZyb20gJ2xvYWQtYm1mb250JztcbmltcG9ydCB7IHZlcnRleFNoYWRlciB9IGZyb20gJy4vc2hhZGVycy92ZXJ0ZXgnO1xuaW1wb3J0IHsgTVNERlRleHRHZW9tZXRyeSwgTVNERlRleHRNYXRlcmlhbCB9IGZyb20gJ3RocmVlLW1zZGYtdGV4dCc7XG5pbXBvcnQgeyBmcmFnbWVudFNoYWRlciB9IGZyb20gJy4vc2hhZGVycy9mcmFnbWVudCc7XG5pbXBvcnQgeyBPcmJpdENvbnRyb2xzIH0gZnJvbSAndGhyZWUvZXhhbXBsZXMvanNtL2NvbnRyb2xzL09yYml0Q29udHJvbHMnO1xuXG5jb25zdCBzdGF0cyA9IG5ldyBTdGF0cygpO1xuc3RhdHMuc2hvd1BhbmVsKDEpOyAvLyAwOiBmcHMsIDE6IG1zLCAyOiBtYiwgMys6IGN1c3RvbVxuZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzdGF0cy5kb20pO1xuXG5jb25zdCBzaXplcyA9IHtcbiAgd2lkdGg6IHdpbmRvdy5pbm5lcldpZHRoLFxuICBoZWlnaHQ6IHdpbmRvdy5pbm5lckhlaWdodFxufTtcblxuZXhwb3J0IGNsYXNzIENhbnZhcyB7XG4gIHB1YmxpYyBjYW1lcmE6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhO1xuICBwdWJsaWMgcmVuZGVyVGFyZ2V0Q2FtZXJhPzogVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmE7XG4gIHB1YmxpYyByZW5kZXJlcjogVEhSRUUuV2ViR0xSZW5kZXJlcjtcbiAgcHVibGljIHNjZW5lOiBUSFJFRS5TY2VuZTtcbiAgcHVibGljIHJlbmRlclRhcmdldFNjZW5lPzogVEhSRUUuU2NlbmU7XG4gIHB1YmxpYyByZW5kZXJUYXJnZXRNYXRlcmlhbD86IFRIUkVFLlJhd1NoYWRlck1hdGVyaWFsO1xuICBwdWJsaWMgcmVuZGVyVGFyZ2V0TWVzaD86IFRIUkVFLk1lc2g7XG4gIHB1YmxpYyBzcGhlcmU/OiBUSFJFRS5NZXNoO1xuICBwdWJsaWMgZmxvb3I/OiBUSFJFRS5NZXNoO1xuICBwdWJsaWMgbWVzaD86IFRIUkVFLk1lc2g7XG4gIHB1YmxpYyBjb3VudDogbnVtYmVyO1xuICBwdWJsaWMgY2xvY2s6IFRIUkVFLkNsb2NrO1xuICBwdWJsaWMgc3VyZmFjZT86IFRIUkVFLk1lc2g7XG4gIHB1YmxpYyByZW5kZXJUYXJnZXQ/OiBUSFJFRS5XZWJHTFJlbmRlclRhcmdldDtcbiAgcHVibGljIG9yYml0Q29udHJvbHM6IE9yYml0Q29udHJvbHM7XG4gIHB1YmxpYyBzcG90TGlnaHQ6IFRIUkVFLlNwb3RMaWdodDtcbiAgcHVibGljIGFtYmllbnRMaWdodDogVEhSRUUuQW1iaWVudExpZ2h0O1xuXG4gIGNvbnN0cnVjdG9yKGNhbnZhczogRWxlbWVudCkge1xuICAgIHRoaXMuc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcbiAgICB0aGlzLmNvdW50ID0gODAwMDtcbiAgICB0aGlzLnJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoe1xuICAgICAgY2FudmFzXG4gICAgfSk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyhNYXRoLm1pbih3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbywgMikpO1xuICAgIHRoaXMucmVuZGVyZXIub3V0cHV0RW5jb2RpbmcgPSBUSFJFRS5zUkdCRW5jb2Rpbmc7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRDbGVhckNvbG9yKDB4MDAwMGZmKTtcblxuICAgIHRoaXMuYW1iaWVudExpZ2h0ID0gbmV3IFRIUkVFLkFtYmllbnRMaWdodCgweGZmZmZmZiwgMSk7XG4gICAgdGhpcy5zY2VuZS5hZGQodGhpcy5hbWJpZW50TGlnaHQpO1xuXG4gICAgdGhpcy5zcG90TGlnaHQgPSBuZXcgVEhSRUUuU3BvdExpZ2h0KFxuICAgICAgMHhmZmZmZmYsXG4gICAgICAxNyxcbiAgICAgIDgwLFxuICAgICAgTWF0aC5QSSAqIDAuMjUsXG4gICAgICAwLjIsXG4gICAgICAzXG4gICAgKTtcblxuICAgIHRoaXMuc3BvdExpZ2h0LnBvc2l0aW9uLnNldCgwLCAxMCwgMCk7XG4gICAgdGhpcy5zcG90TGlnaHQuY2FzdFNoYWRvdyA9IHRydWU7XG4gICAgdGhpcy5zcG90TGlnaHQuc2hhZG93LmNhbWVyYS5uZWFyID0gMC41O1xuICAgIHRoaXMuc3BvdExpZ2h0LnNoYWRvdy5jYW1lcmEuZmFyID0gNDA7XG5cbiAgICB0aGlzLnNjZW5lLmFkZCh0aGlzLnNwb3RMaWdodCk7XG5cbiAgICBjb25zdCBuZWFyID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgdGhpcy5jYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoNzUsIG5lYXIsIDAuMSwgMTAwMDApO1xuICAgIHRoaXMuY2FtZXJhLnBvc2l0aW9uLnogPSA0MDtcblxuICAgIHRoaXMub3JiaXRDb250cm9scyA9IG5ldyBPcmJpdENvbnRyb2xzKFxuICAgICAgdGhpcy5jYW1lcmEsXG4gICAgICB0aGlzLnJlbmRlcmVyLmRvbUVsZW1lbnRcbiAgICApO1xuXG4gICAgdGhpcy5vcmJpdENvbnRyb2xzLmVuYWJsZVpvb20gPSBmYWxzZTtcbiAgICB0aGlzLmNsb2NrID0gbmV3IFRIUkVFLkNsb2NrKCk7XG5cbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuXG4gIHB1YmxpYyBpbml0KCk6IHZvaWQge1xuICAgIFByb21pc2UuYWxsKFtcbiAgICAgIHRoaXMubG9hZEZvbnRBdGxhcygnaG9yaXpvbi5wbmcnKSxcbiAgICAgIHRoaXMubG9hZEZvbnQoJ2hvcml6b24uZm50JylcbiAgICBdKS50aGVuKChbYXRsYXMsIGZvbnRdKSA9PiB7XG4gICAgICBjb25zdCBnZW9tZXRyeSA9IG5ldyBNU0RGVGV4dEdlb21ldHJ5KHtcbiAgICAgICAgdGV4dDogJ0luZmluaXR5JyxcbiAgICAgICAgZm9udDogZm9udCxcbiAgICAgICAgd2lkdGg6IDEwMDAsXG4gICAgICAgIGFsaWduOiAnY2VudGVyJ1xuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IG1hdGVyaWFsID0gbmV3IE1TREZUZXh0TWF0ZXJpYWwoKTtcbiAgICAgIG1hdGVyaWFsLnVuaWZvcm1zLnVNYXAudmFsdWUgPSBhdGxhcztcbiAgICAgIG1hdGVyaWFsLnNpZGUgPSBUSFJFRS5Eb3VibGVTaWRlO1xuXG4gICAgICB0aGlzLm1lc2ggPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICAgICAgdGhpcy5tZXNoLnJvdGF0aW9uLnggPSBNYXRoLlBJO1xuICAgICAgY29uc3Qgc2NhbGUgPSAzO1xuICAgICAgdGhpcy5tZXNoLnBvc2l0aW9uLnggPSAoLWdlb21ldHJ5LmxheW91dC53aWR0aCAvIDIpICogc2NhbGU7XG4gICAgICB0aGlzLm1lc2guc2NhbGUuc2V0KHNjYWxlLCBzY2FsZSwgc2NhbGUpO1xuXG4gICAgICB0aGlzLmNyZWF0ZVJlbmRlclRhcmdldCgpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5jcmVhdGVGbG9vcigpO1xuICAgIHRoaXMuYW5pbWF0ZSgpO1xuICAgIHRoaXMuaGFuZGxlUmVzaXplKCk7XG4gIH1cbiAgcHVibGljIGxvYWRGb250QXRsYXMocGF0aDogc3RyaW5nKTogUHJvbWlzZTxUSFJFRS5UZXh0dXJlPiB7XG4gICAgY29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IGxvYWRlciA9IG5ldyBUSFJFRS5UZXh0dXJlTG9hZGVyKCk7XG4gICAgICBsb2FkZXIubG9hZChwYXRoLCAodGV4dHVyZSkgPT4ge1xuICAgICAgICByZXNvbHZlKHRleHR1cmUpO1xuICAgICAgfSxcbiAgICAgIG9uRXJyb3I6KGV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGV2ZW50KVxuXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBwcm9taXNlIGFzIFByb21pc2U8VEhSRUUuVGV4dHVyZT47XG4gIH1cblxuICBwdWJsaWMgbG9hZEZvbnQocGF0aDogc3RyaW5nKTogUHJvbWlzZTxGb250PiB7XG4gICAgY29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGxvYWRGb250KHBhdGgsIChlcnJvcjogYW55LCBmb250OiBhbnkpID0+IHtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgcmVqZWN0KClcbiAgICAgICAgfVxuICAgICAgICByZXNvbHZlKGZvbnQpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZSBhcyBQcm9taXNlPEZvbnQ+O1xuICB9XG5cbiAgcHVibGljIGhhbmRsZVJlc2l6ZSgpOiB2b2lkIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xuICAgICAgc2l6ZXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgIHNpemVzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblxuICAgICAgdGhpcy5jYW1lcmEuYXNwZWN0ID0gc2l6ZXMud2lkdGggLyBzaXplcy5oZWlnaHQ7XG4gICAgICB0aGlzLmNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG5cbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0U2l6ZShzaXplcy53aWR0aCwgc2l6ZXMuaGVpZ2h0KTtcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyhNYXRoLm1pbih3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbywgMikpO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGNyZWF0ZVJlbmRlclRhcmdldCgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMubWVzaCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnJlbmRlclRhcmdldCA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlclRhcmdldChcbiAgICAgIHdpbmRvdy5pbm5lcldpZHRoLFxuICAgICAgd2luZG93LmlubmVySGVpZ2h0XG4gICAgKTtcblxuICAgIHRoaXMucmVuZGVyVGFyZ2V0Q2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKFxuICAgICAgNzUsXG4gICAgICB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCxcbiAgICAgIDAuMSxcbiAgICAgIDEwMDAwXG4gICAgKTtcbiAgICB0aGlzLnJlbmRlclRhcmdldENhbWVyYS5wb3NpdGlvbi56ID0gMzc1O1xuXG4gICAgdGhpcy5yZW5kZXJUYXJnZXRTY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xuXG4gICAgdGhpcy5yZW5kZXJUYXJnZXRTY2VuZS5hZGQodGhpcy5tZXNoKTtcbiAgICB0aGlzLmNyZWF0ZU1lc2godGhpcy5yZW5kZXJUYXJnZXQudGV4dHVyZSk7XG4gIH1cblxuICBwdWJsaWMgY3JlYXRlTWVzaCh0ZXh0dXJlOiBUSFJFRS5UZXh0dXJlKTogdm9pZCB7XG4gICAgY29uc3QgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuVG9ydXNHZW9tZXRyeSgxMCwgMywgMzAsIDEwMCk7XG5cbiAgICB0aGlzLnJlbmRlclRhcmdldE1hdGVyaWFsID0gbmV3IFRIUkVFLlJhd1NoYWRlck1hdGVyaWFsKHtcbiAgICAgIHZlcnRleFNoYWRlcixcbiAgICAgIGZyYWdtZW50U2hhZGVyLFxuICAgICAgc2lkZTogVEhSRUUuRnJvbnRTaWRlLFxuICAgICAgdW5pZm9ybXM6IHtcbiAgICAgICAgdV90aW1lOiBuZXcgVEhSRUUuVW5pZm9ybSgwKSxcbiAgICAgICAgdV90ZXh0dXJlOiBuZXcgVEhSRUUuVW5pZm9ybSh0ZXh0dXJlKSxcbiAgICAgICAgdV9saWdodFBvczoge1xuICAgICAgICAgIHZhbHVlOiBuZXcgVEhSRUUuVmVjdG9yMygwKS5jb3B5KHRoaXMuc3BvdExpZ2h0LnBvc2l0aW9uKVxuICAgICAgICB9LFxuICAgICAgICB1X3Nwb3RMaWdodENvbG9yOiB7XG4gICAgICAgICAgdmFsdWU6IG5ldyBUSFJFRS5Db2xvcigweGZmZmZmZilcbiAgICAgICAgfSxcbiAgICAgICAgdV9saWdodEludGVuc2l0eToge1xuICAgICAgICAgIHZhbHVlOiAwLjg3NVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgdHJhbnNwYXJlbnQ6IHRydWVcbiAgICB9KTtcblxuICAgIHRoaXMucmVuZGVyVGFyZ2V0TWVzaCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCB0aGlzLnJlbmRlclRhcmdldE1hdGVyaWFsKTtcblxuICAgIHRoaXMucmVuZGVyVGFyZ2V0TWVzaC5yb3RhdGlvbi5zZXQoMiwgMi44LCAwKTtcbiAgICB0aGlzLnNjZW5lLmFkZCh0aGlzLnJlbmRlclRhcmdldE1lc2gpO1xuICB9XG5cbiAgcHVibGljIGNyZWF0ZUZsb29yKCk6IHZvaWQge1xuICAgIGNvbnN0IG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsKHtcbiAgICAgIGNvbG9yOiAweDAwMDBmZlxuICAgIH0pO1xuXG4gICAgY29uc3QgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQ2lyY2xlR2VvbWV0cnkoNTAsIDUwKTtcbiAgICBjb25zdCBwbGFuZSA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbCk7XG5cbiAgICB0aGlzLnNjZW5lLmFkZChwbGFuZSk7XG4gICAgcGxhbmUucm90YXRpb24ueCA9IC1NYXRoLlBJIC8gMjtcbiAgICBwbGFuZS5wb3NpdGlvbi55ID0gLTE1LjU7XG4gICAgcGxhbmUucmVjZWl2ZVNoYWRvdyA9IHRydWU7XG4gIH1cblxuICBwdWJsaWMgYW5pbWF0ZSgpOiB2b2lkIHtcbiAgICBzdGF0cy5iZWdpbigpO1xuICAgIGNvbnN0IGVsYXBzZWRUaW1lID0gdGhpcy5jbG9jay5nZXRFbGFwc2VkVGltZSgpO1xuXG4gICAgdGhpcy5vcmJpdENvbnRyb2xzLnVwZGF0ZSgpO1xuXG4gICAgaWYgKFxuICAgICAgdGhpcy5yZW5kZXJUYXJnZXQgJiZcbiAgICAgIHRoaXMucmVuZGVyVGFyZ2V0U2NlbmUgJiZcbiAgICAgIHRoaXMucmVuZGVyVGFyZ2V0Q2FtZXJhICYmXG4gICAgICB0aGlzLnJlbmRlclRhcmdldE1lc2hcbiAgICApIHtcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0UmVuZGVyVGFyZ2V0KHRoaXMucmVuZGVyVGFyZ2V0KTtcbiAgICAgIHRoaXMucmVuZGVyZXIucmVuZGVyKHRoaXMucmVuZGVyVGFyZ2V0U2NlbmUsIHRoaXMucmVuZGVyVGFyZ2V0Q2FtZXJhKTtcblxuICAgICAgY29uc3QgbWVzaE1hdGVyaWFsID0gdGhpcy5yZW5kZXJUYXJnZXRNZXNoXG4gICAgICAgIC5tYXRlcmlhbCBhcyBUSFJFRS5SYXdTaGFkZXJNYXRlcmlhbDtcblxuICAgICAgbWVzaE1hdGVyaWFsLnVuaWZvcm1zLnVfdGltZS52YWx1ZSA9IGVsYXBzZWRUaW1lO1xuICAgICAgbWVzaE1hdGVyaWFsLnVuaWZvcm1zTmVlZFVwZGF0ZSA9IHRydWU7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFJlbmRlclRhcmdldChudWxsKTtcbiAgICB9XG5cbiAgICB0aGlzLnJlbmRlcmVyLnJlbmRlcih0aGlzLnNjZW5lLCB0aGlzLmNhbWVyYSk7XG4gICAgc3RhdHMuZW5kKCk7XG5cbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy5hbmltYXRlKCkpO1xuICB9XG59XG4iLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmggPSAoKSA9PiAoXCJmOGYyY2Q5NjM2NTIwYzgyNWY1ZVwiKSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==