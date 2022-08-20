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
            canvas: canvas,
            stencil: false,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.setClearColor(0x000000);
        this.renderTargets = [];
        this.spotLight = new THREE.SpotLight(0xffffff, 0.5, 80, Math.PI * 0.25, 0.2, 3);
        this.spotLight.position.set(0, 10, 0);
        this.spotLight.castShadow = true;
        this.spotLight.shadow.camera.near = 0.5;
        this.spotLight.shadow.camera.far = 40;
        this.scene.add(this.spotLight);
        var near = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(75, near, 0.1, 10000);
        this.camera.position.z = 40;
        this.orbitControls = new OrbitControls_1.OrbitControls(this.camera, this.renderer.domElement);
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
            var mesh = new THREE.Mesh(geometry, material);
            mesh.rotation.x = Math.PI;
            var scale = 3;
            mesh.position.x = (-geometry.layout.width / 2) * scale;
            mesh.scale.set(scale, scale, scale);
            _this.createRenderTarget(new THREE.Euler(2, 2.8, 0));
            // this.createRenderTarget(new THREE.Euler(0, 2.8, 0));
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
    Canvas.prototype.createRenderTarget = function (mesh, rotation) {
        var _a;
        var renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
        var renderTargetCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
        renderTargetCamera.position.z = 600;
        var renderTargetScene = new THREE.Scene();
        renderTargetScene.add(mesh);
        var geometry = new THREE.TorusGeometry(10, 3, 16, 100);
        var renderTargetMaterial = new THREE.RawShaderMaterial({
            vertexShader: vertex_1.vertexShader,
            fragmentShader: fragment_1.fragmentShader,
            side: THREE.FrontSide,
            uniforms: {
                u_time: new THREE.Uniform(0),
                u_texture: new THREE.Uniform(renderTarget.texture)
            },
            transparent: true
        });
        var renderTargetMesh = new THREE.Mesh(geometry, renderTargetMaterial);
        renderTargetMesh.rotation.copy(rotation);
        this.scene.add(renderTargetMesh);
        (_a = this.renderTargets) === null || _a === void 0 ? void 0 : _a.push({
            scene: renderTargetScene,
            material: renderTargetMaterial,
            camera: renderTargetCamera,
            mesh: renderTargetMesh,
            renderTarget: renderTarget
        });
        console.log(this.renderTargets);
    };
    Canvas.prototype.createFloor = function () {
        var material = new THREE.MeshStandardMaterial({
            color: 0xffffff
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
        var _a;
        stats.begin();
        var elapsedTime = this.clock.getElapsedTime();
        this.orbitControls.update();
        if (this.renderTargets && this.renderTargets.length > 0) {
            (_a = this.renderTargets) === null || _a === void 0 ? void 0 : _a.forEach(function (renderTargetObject) {
                _this.renderer.setRenderTarget(renderTargetObject.renderTarget);
                _this.renderer.render(renderTargetObject.scene, renderTargetObject.camera);
                // this.renderer.clearTarget(this.renderTarget, true, false, false);
                var meshMaterial = renderTargetObject.mesh
                    .material;
                meshMaterial.uniforms.u_time.value = elapsedTime;
                meshMaterial.uniformsNeedUpdate = true;
                _this.renderer.setRenderTarget(null);
            });
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
/******/ 	__webpack_require__.h = () => ("d8357b52fecbf304767e")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi4xYTViYzgyNjFlMGQwNTk2MzViNi5ob3QtdXBkYXRlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsbUdBQStCO0FBRS9CLG9IQUE2QjtBQUM3QixxSEFBbUM7QUFDbkMsNEZBQWdEO0FBQ2hELHFIQUFxRTtBQUNyRSxrR0FBb0Q7QUFDcEQsMEpBQTBFO0FBRTFFLElBQU0sS0FBSyxHQUFHLElBQUksa0JBQUssRUFBRSxDQUFDO0FBQzFCLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxtQ0FBbUM7QUFDdkQsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBVXJDLElBQU0sS0FBSyxHQUFHO0lBQ1osS0FBSyxFQUFFLE1BQU0sQ0FBQyxVQUFVO0lBQ3hCLE1BQU0sRUFBRSxNQUFNLENBQUMsV0FBVztDQUMzQixDQUFDO0FBRUY7SUFtQkUsZ0JBQVksTUFBZTtRQUN6QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQy9CLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxLQUFLLENBQUMsYUFBYSxDQUFDO1lBQ3RDLE1BQU07WUFDTixPQUFPLEVBQUUsS0FBSztZQUNkLEtBQUssRUFBRSxJQUFJO1NBQ1osQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDN0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsRSxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsR0FBRyxLQUFL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LEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzlDLFVBQVU7UUFDVixLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7UUFFWixxQkFBcUIsQ0FBQyxjQUFNLFlBQUksQ0FBQyxPQUFPLEVBQUUsRUFBZCxDQUFjLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBQ0gsYUFBQztBQUFELENBQUM7QUE1Tlksd0JBQU07Ozs7Ozs7OztVQzFCbkIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wcm9qZWN0LWJvaWxlcnBsYXRlLy4vYXBwL3dlYmdsL2NhbnZhcy50cyIsIndlYnBhY2s6Ly9wcm9qZWN0LWJvaWxlcnBsYXRlL3dlYnBhY2svcnVudGltZS9nZXRGdWxsSGFzaCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tICd0aHJlZSc7XG5pbXBvcnQgeyBGb250LCBGb250TG9hZGVyIH0gZnJvbSAndGhyZWUvZXhhbXBsZXMvanNtL2xvYWRlcnMvRm9udExvYWRlcic7XG5pbXBvcnQgU3RhdHMgZnJvbSAnc3RhdHMuanMnO1xuaW1wb3J0IGxvYWRGb250IGZyb20gJ2xvYWQtYm1mb250JztcbmltcG9ydCB7IHZlcnRleFNoYWRlciB9IGZyb20gJy4vc2hhZGVycy92ZXJ0ZXgnO1xuaW1wb3J0IHsgTVNERlRleHRHZW9tZXRyeSwgTVNERlRleHRNYXRlcmlhbCB9IGZyb20gJ3RocmVlLW1zZGYtdGV4dCc7XG5pbXBvcnQgeyBmcmFnbWVudFNoYWRlciB9IGZyb20gJy4vc2hhZGVycy9mcmFnbWVudCc7XG5pbXBvcnQgeyBPcmJpdENvbnRyb2xzIH0gZnJvbSAndGhyZWUvZXhhbXBsZXMvanNtL2NvbnRyb2xzL09yYml0Q29udHJvbHMnO1xuXG5jb25zdCBzdGF0cyA9IG5ldyBTdGF0cygpO1xuc3RhdHMuc2hvd1BhbmVsKDEpOyAvLyAwOiBmcHMsIDE6IG1zLCAyOiBtYiwgMys6IGN1c3RvbVxuZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzdGF0cy5kb20pO1xuXG5pbnRlcmZhY2UgSVJlbmRlclRhcmdldFByb3BzIHtcbiAgc2NlbmU6IFRIUkVFLlNjZW5lO1xuICBtYXRlcmlhbDogVEhSRUUuUmF3U2hhZGVyTWF0ZXJpYWw7XG4gIG1lc2g6IFRIUkVFLk1lc2g7XG4gIGNhbWVyYTogVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmE7XG4gIHJlbmRlclRhcmdldDogVEhSRUUuV2ViR0xSZW5kZXJUYXJnZXQ7XG59XG5cbmNvbnN0IHNpemVzID0ge1xuICB3aWR0aDogd2luZG93LmlubmVyV2lkdGgsXG4gIGhlaWdodDogd2luZG93LmlubmVySGVpZ2h0XG59O1xuXG5leHBvcnQgY2xhc3MgQ2FudmFzIHtcbiAgcHVibGljIGNhbWVyYTogVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmE7XG4gIHB1YmxpYyByZW5kZXJUYXJnZXRDYW1lcmE/OiBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYTtcbiAgcHVibGljIHJlbmRlcmVyOiBUSFJFRS5XZWJHTFJlbmRlcmVyO1xuICBwdWJsaWMgc2NlbmU6IFRIUkVFLlNjZW5lO1xuICBwdWJsaWMgcmVuZGVyVGFyZ2V0U2NlbmU/OiBUSFJFRS5TY2VuZTtcbiAgcHVibGljIHJlbmRlclRhcmdldE1hdGVyaWFsPzogVEhSRUUuUmF3U2hhZGVyTWF0ZXJpYWw7XG4gIHB1YmxpYyByZW5kZXJUYXJnZXRNZXNoPzogVEhSRUUuTWVzaDtcbiAgcHVibGljIHJlbmRlclRhcmdldHM/OiBJUmVuZGVyVGFyZ2V0UHJvcHNbXTtcbiAgcHVibGljIHNwaGVyZT86IFRIUkVFLk1lc2g7XG4gIHB1YmxpYyBmbG9vcj86IFRIUkVFLk1lc2g7XG4gIHB1YmxpYyBtZXNoPzogVEhSRUUuTWVzaDtcbiAgcHVibGljIGNvdW50OiBudW1iZXI7XG4gIHB1YmxpYyBjbG9jazogVEhSRUUuQ2xvY2s7XG4gIHB1YmxpYyBzdXJmYWNlPzogVEhSRUUuTWVzaDtcbiAgcHVibGljIHJlbmRlclRhcmdldD86IFRIUkVFLldlYkdMUmVuZGVyVGFyZ2V0O1xuICBwdWJsaWMgb3JiaXRDb250cm9sczogT3JiaXRDb250cm9scztcbiAgcHVibGljIHNwb3RMaWdodDogVEhSRUUuU3BvdExpZ2h0O1xuXG4gIGNvbnN0cnVjdG9yKGNhbnZhczogRWxlbWVudCkge1xuICAgIHRoaXMuc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcbiAgICB0aGlzLmNvdW50ID0gODAwMDtcbiAgICB0aGlzLnJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoe1xuICAgICAgY2FudmFzLFxuICAgICAgc3RlbmNpbDogZmFsc2UsXG4gICAgICBhbHBoYTogdHJ1ZVxuICAgIH0pO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFBpeGVsUmF0aW8oTWF0aC5taW4od2luZG93LmRldmljZVBpeGVsUmF0aW8sIDIpKTtcbiAgICB0aGlzLnJlbmRlcmVyLm91dHB1dEVuY29kaW5nID0gVEhSRUUuc1JHQkVuY29kaW5nO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0Q2xlYXJDb2xvcigweDAwMDAwMCk7XG4gICAgdGhpcy5yZW5kZXJUYXJnZXRzID0gW107XG5cbiAgICB0aGlzLnNwb3RMaWdodCA9IG5ldyBUSFJFRS5TcG90TGlnaHQoXG4gICAgICAweGZmZmZmZixcbiAgICAgIDAuNSxcbiAgICAgIDgwLFxuICAgICAgTWF0aC5QSSAqIDAuMjUsXG4gICAgICAwLjIsXG4gICAgICAzXG4gICAgKTtcblxuICAgIHRoaXMuc3BvdExpZ2h0LnBvc2l0aW9uLnNldCgwLCAxMCwgMCk7XG4gICAgdGhpcy5zcG90TGlnaHQuY2FzdFNoYWRvdyA9IHRydWU7XG4gICAgdGhpcy5zcG90TGlnaHQuc2hhZG93LmNhbWVyYS5uZWFyID0gMC41O1xuICAgIHRoaXMuc3BvdExpZ2h0LnNoYWRvdy5jYW1lcmEuZmFyID0gNDA7XG5cbiAgICB0aGlzLnNjZW5lLmFkZCh0aGlzLnNwb3RMaWdodCk7XG5cbiAgICBjb25zdCBuZWFyID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgdGhpcy5jYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoNzUsIG5lYXIsIDAuMSwgMTAwMDApO1xuICAgIHRoaXMuY2FtZXJhLnBvc2l0aW9uLnogPSA0MDtcblxuICAgIHRoaXMub3JiaXRDb250cm9scyA9IG5ldyBPcmJpdENvbnRyb2xzKFxuICAgICAgdGhpcy5jYW1lcmEsXG4gICAgICB0aGlzLnJlbmRlcmVyLmRvbUVsZW1lbnRcbiAgICApO1xuICAgIHRoaXMuY2xvY2sgPSBuZXcgVEhSRUUuQ2xvY2soKTtcblxuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgcHVibGljIGluaXQoKTogdm9pZCB7XG4gICAgUHJvbWlzZS5hbGwoW1xuICAgICAgdGhpcy5sb2FkRm9udEF0bGFzKCdob3Jpem9uLnBuZycpLFxuICAgICAgdGhpcy5sb2FkRm9udCgnaG9yaXpvbi5mbnQnKVxuICAgIF0pLnRoZW4oKFthdGxhcywgZm9udF0pID0+IHtcbiAgICAgIGNvbnN0IGdlb21ldHJ5ID0gbmV3IE1TREZUZXh0R2VvbWV0cnkoe1xuICAgICAgICB0ZXh0OiAnSW5maW5pdHknLFxuICAgICAgICBmb250OiBmb250LFxuICAgICAgICB3aWR0aDogMTAwMCxcbiAgICAgICAgYWxpZ246ICdjZW50ZXInXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgbWF0ZXJpYWwgPSBuZXcgTVNERlRleHRNYXRlcmlhbCgpO1xuICAgICAgbWF0ZXJpYWwudW5pZm9ybXMudU1hcC52YWx1ZSA9IGF0bGFzO1xuICAgICAgbWF0ZXJpYWwuc2lkZSA9IFRIUkVFLkRvdWJsZVNpZGU7XG5cbiAgICAgIGNvbnN0IG1lc2ggPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICAgICAgbWVzaC5yb3RhdGlvbi54ID0gTWF0aC5QSTtcbiAgICAgIGNvbnN0IHNjYWxlID0gMztcbiAgICAgIG1lc2gucG9zaXRpb24ueCA9ICgtZ2VvbWV0cnkubGF5b3V0LndpZHRoIC8gMikgKiBzY2FsZTtcbiAgICAgIG1lc2guc2NhbGUuc2V0KHNjYWxlLCBzY2FsZSwgc2NhbGUpO1xuXG4gICAgICB0aGlzLmNyZWF0ZVJlbmRlclRhcmdldChuZXcgVEhSRUUuRXVsZXIoMiwgMi44LCAwKSk7XG4gICAgICAvLyB0aGlzLmNyZWF0ZVJlbmRlclRhcmdldChuZXcgVEhSRUUuRXVsZXIoMCwgMi44LCAwKSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmNyZWF0ZUZsb29yKCk7XG4gICAgdGhpcy5hbmltYXRlKCk7XG4gICAgdGhpcy5oYW5kbGVSZXNpemUoKTtcbiAgfVxuICBwdWJsaWMgbG9hZEZvbnRBdGxhcyhwYXRoOiBzdHJpbmcpOiBQcm9taXNlPFRIUkVFLlRleHR1cmU+IHtcbiAgICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgbG9hZGVyID0gbmV3IFRIUkVFLlRleHR1cmVMb2FkZXIoKTtcbiAgICAgIGxvYWRlci5sb2FkKHBhdGgsICh0ZXh0dXJlKSA9PiB7XG4gICAgICAgIHJlc29sdmUodGV4dHVyZSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBwcm9taXNlIGFzIFByb21pc2U8VEhSRUUuVGV4dHVyZT47XG4gIH1cblxuICBwdWJsaWMgbG9hZEZvbnQocGF0aDogc3RyaW5nKTogUHJvbWlzZTxGb250PiB7XG4gICAgY29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGxvYWRGb250KHBhdGgsIChlcnJvcjogYW55LCBmb250OiBhbnkpID0+IHtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJlc29sdmUoZm9udCk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBwcm9taXNlIGFzIFByb21pc2U8Rm9udD47XG4gIH1cblxuICBwdWJsaWMgaGFuZGxlUmVzaXplKCk6IHZvaWQge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB7XG4gICAgICBzaXplcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgc2l6ZXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuXG4gICAgICB0aGlzLmNhbWVyYS5hc3BlY3QgPSBzaXplcy53aWR0aCAvIHNpemVzLmhlaWdodDtcbiAgICAgIHRoaXMuY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcblxuICAgICAgdGhpcy5yZW5kZXJlci5zZXRTaXplKHNpemVzLndpZHRoLCBzaXplcy5oZWlnaHQpO1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRQaXhlbFJhdGlvKE1hdGgubWluKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvLCAyKSk7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgY3JlYXRlUmVuZGVyVGFyZ2V0KG1lc2g6IFRIUkVFLk1lc2gsIHJvdGF0aW9uOiBUSFJFRS5FdWxlcik6IHZvaWQge1xuICAgIGNvbnN0IHJlbmRlclRhcmdldCA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlclRhcmdldChcbiAgICAgIHdpbmRvdy5pbm5lcldpZHRoLFxuICAgICAgd2luZG93LmlubmVySGVpZ2h0XG4gICAgKTtcblxuICAgIGNvbnN0IHJlbmRlclRhcmdldENhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYShcbiAgICAgIDc1LFxuICAgICAgd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQsXG4gICAgICAwLjEsXG4gICAgICAxMDAwMFxuICAgICk7XG4gICAgcmVuZGVyVGFyZ2V0Q2FtZXJhLnBvc2l0aW9uLnogPSA2MDA7XG5cbiAgICBjb25zdCByZW5kZXJUYXJnZXRTY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xuXG4gICAgcmVuZGVyVGFyZ2V0U2NlbmUuYWRkKG1lc2gpO1xuXG4gICAgY29uc3QgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuVG9ydXNHZW9tZXRyeSgxMCwgMywgMTYsIDEwMCk7XG5cbiAgICBjb25zdCByZW5kZXJUYXJnZXRNYXRlcmlhbCA9IG5ldyBUSFJFRS5SYXdTaGFkZXJNYXRlcmlhbCh7XG4gICAgICB2ZXJ0ZXhTaGFkZXIsXG4gICAgICBmcmFnbWVudFNoYWRlcixcbiAgICAgIHNpZGU6IFRIUkVFLkZyb250U2lkZSxcbiAgICAgIHVuaWZvcm1zOiB7XG4gICAgICAgIHVfdGltZTogbmV3IFRIUkVFLlVuaWZvcm0oMCksXG4gICAgICAgIHVfdGV4dHVyZTogbmV3IFRIUkVFLlVuaWZvcm0ocmVuZGVyVGFyZ2V0LnRleHR1cmUpXG4gICAgICB9LFxuICAgICAgdHJhbnNwYXJlbnQ6IHRydWVcbiAgICB9KTtcblxuICAgIGNvbnN0IHJlbmRlclRhcmdldE1lc2ggPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgcmVuZGVyVGFyZ2V0TWF0ZXJpYWwpO1xuXG4gICAgcmVuZGVyVGFyZ2V0TWVzaC5yb3RhdGlvbi5jb3B5KHJvdGF0aW9uKTtcblxuICAgIHRoaXMuc2NlbmUuYWRkKHJlbmRlclRhcmdldE1lc2gpO1xuICAgIHRoaXMucmVuZGVyVGFyZ2V0cz8ucHVzaCh7XG4gICAgICBzY2VuZTogcmVuZGVyVGFyZ2V0U2NlbmUsXG4gICAgICBtYXRlcmlhbDogcmVuZGVyVGFyZ2V0TWF0ZXJpYWwsXG4gICAgICBjYW1lcmE6IHJlbmRlclRhcmdldENhbWVyYSxcbiAgICAgIG1lc2g6IHJlbmRlclRhcmdldE1lc2gsXG4gICAgICByZW5kZXJUYXJnZXQ6IHJlbmRlclRhcmdldFxuICAgIH0pO1xuXG4gICAgY29uc29sZS5sb2codGhpcy5yZW5kZXJUYXJnZXRzKTtcbiAgfVxuXG4gIHB1YmxpYyBjcmVhdGVGbG9vcigpOiB2b2lkIHtcbiAgICBjb25zdCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCh7XG4gICAgICBjb2xvcjogMHhmZmZmZmZcbiAgICB9KTtcblxuICAgIGNvbnN0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLkNpcmNsZUdlb21ldHJ5KDUwLCA1MCk7XG4gICAgY29uc3QgcGxhbmUgPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuXG4gICAgdGhpcy5zY2VuZS5hZGQocGxhbmUpO1xuICAgIHBsYW5lLnJvdGF0aW9uLnggPSAtTWF0aC5QSSAvIDI7XG4gICAgcGxhbmUucG9zaXRpb24ueSA9IC0xNS41O1xuICAgIHBsYW5lLnJlY2VpdmVTaGFkb3cgPSB0cnVlO1xuICB9XG5cbiAgcHVibGljIGFuaW1hdGUoKTogdm9pZCB7XG4gICAgc3RhdHMuYmVnaW4oKTtcbiAgICBjb25zdCBlbGFwc2VkVGltZSA9IHRoaXMuY2xvY2suZ2V0RWxhcHNlZFRpbWUoKTtcblxuICAgIHRoaXMub3JiaXRDb250cm9scy51cGRhdGUoKTtcblxuICAgIGlmICh0aGlzLnJlbmRlclRhcmdldHMgJiYgdGhpcy5yZW5kZXJUYXJnZXRzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMucmVuZGVyVGFyZ2V0cz8uZm9yRWFjaCgocmVuZGVyVGFyZ2V0T2JqZWN0KSA9PiB7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0UmVuZGVyVGFyZ2V0KHJlbmRlclRhcmdldE9iamVjdC5yZW5kZXJUYXJnZXQpO1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnJlbmRlcihcbiAgICAgICAgICByZW5kZXJUYXJnZXRPYmplY3Quc2NlbmUsXG4gICAgICAgICAgcmVuZGVyVGFyZ2V0T2JqZWN0LmNhbWVyYVxuICAgICAgICApO1xuICAgICAgICAvLyB0aGlzLnJlbmRlcmVyLmNsZWFyVGFyZ2V0KHRoaXMucmVuZGVyVGFyZ2V0LCB0cnVlLCBmYWxzZSwgZmFsc2UpO1xuXG4gICAgICAgIGNvbnN0IG1lc2hNYXRlcmlhbCA9IHJlbmRlclRhcmdldE9iamVjdC5tZXNoXG4gICAgICAgICAgLm1hdGVyaWFsIGFzIFRIUkVFLlJhd1NoYWRlck1hdGVyaWFsO1xuXG4gICAgICAgIG1lc2hNYXRlcmlhbC51bmlmb3Jtcy51X3RpbWUudmFsdWUgPSBlbGFwc2VkVGltZTtcbiAgICAgICAgbWVzaE1hdGVyaWFsLnVuaWZvcm1zTmVlZFVwZGF0ZSA9IHRydWU7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0UmVuZGVyVGFyZ2V0KG51bGwpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5yZW5kZXJlci5yZW5kZXIodGhpcy5zY2VuZSwgdGhpcy5jYW1lcmEpO1xuICAgIC8vIEFuaW1hdGVcbiAgICBzdGF0cy5lbmQoKTtcblxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLmFuaW1hdGUoKSk7XG4gIH1cbn1cbiIsIl9fd2VicGFja19yZXF1aXJlX18uaCA9ICgpID0+IChcImQ4MzU3YjUyZmVjYmYzMDQ3NjdlXCIpIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9