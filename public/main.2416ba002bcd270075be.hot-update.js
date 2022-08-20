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
    Canvas.prototype.createRenderTarget = function () {
        var _a;
        if (!this.mesh) {
            return;
        }
        var renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
        var renderTargetCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
        renderTargetCamera.position.z = 600;
        var renderTargetScene = new THREE.Scene();
        renderTargetScene.add(this.mesh);
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
        renderTargetMesh.rotation.set(2, 2.8, 0);
        this.scene.add(renderTargetMesh);
        (_a = this.renderTargets) === null || _a === void 0 ? void 0 : _a.push({
            scene: renderTargetScene,
            material: renderTargetMaterial,
            camera: renderTargetCamera,
            mesh: renderTargetMesh,
            renderTarget: renderTarget
        });
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
        if (this.renderTargets.length > 0) {
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
        if (this.renderTarget &&
            this.renderTargetScene &&
            this.renderTargetCamera &&
            this.renderTargetMesh) {
            this.renderer.setRenderTarget(this.renderTarget);
            this.renderer.render(this.renderTargetScene, this.renderTargetCamera);
            // this.renderer.clearTarget(this.renderTarget, true, false, false);
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
/******/ 	__webpack_require__.h = () => ("f92a91065321285aaecf")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi4yNDE2YmEwMDJiY2QyNzAwNzViZS5ob3QtdXBkYXRlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsbUdBQStCO0FBRS9CLG9IQUE2QjtBQUM3QixxSEFBbUM7QUFDbkMsNEZBQWdEO0FBQ2hELHFIQUFxRTtBQUNyRSxrR0FBb0Q7QUFDcEQsMEpBQTBFO0FBRTFFLElBQU0sS0FBSyxHQUFHLElBQUksa0JBQUssRUFBRSxDQUFDO0FBQzFCLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxtQ0FBbUM7QUFDdkQsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBVXJDLElBQU0sS0FBSyxHQUFHO0lBQ1osS0FBSyxFQUFFLE1BQU0sQ0FBQyxVQUFVO0lBQ3hCLE1BQU0sRUFBRSxNQUFNLENBQUMsV0FBVztDQUMzQixDQUFDO0FBRUY7SUFtQkUsZ0JBQVksTUFBZTtRQUN6QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQy9CLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxLQUFLLENBQUMsYUFBYSxDQUFDO1lBQ3RDLE1BQU07WUFDTixPQUFPLEVBQUUsS0FBSztZQUNkLEtBQUssRUFBRSxJQUFJO1NBQ1osQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDN0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsRSxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsR0FBRyxLQUFL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SSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ2pELElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUN0RSxvRUFBb0U7WUFFcEUsSUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLGdCQUFnQjtpQkFDdkMsUUFBbUMsQ0FBQztZQUV2QyxZQUFZLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsV0FBVyxDQUFDO1lBQ2pELFlBQVksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUM7WUFDdkMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDckM7UUFFRCxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM5QyxVQUFVO1FBQ1YsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBRVoscUJBQXFCLENBQUMsY0FBTSxZQUFJLENBQUMsT0FBTyxFQUFFLEVBQWQsQ0FBYyxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUNILGFBQUM7QUFBRCxDQUFDO0FBN09ZLHdCQUFNOzs7Ozs7Ozs7VUMxQm5CIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcHJvamVjdC1ib2lsZXJwbGF0ZS8uL2FwcC93ZWJnbC9jYW52YXMudHMiLCJ3ZWJwYWNrOi8vcHJvamVjdC1ib2lsZXJwbGF0ZS93ZWJwYWNrL3J1bnRpbWUvZ2V0RnVsbEhhc2giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSAndGhyZWUnO1xuaW1wb3J0IHsgRm9udCwgRm9udExvYWRlciB9IGZyb20gJ3RocmVlL2V4YW1wbGVzL2pzbS9sb2FkZXJzL0ZvbnRMb2FkZXInO1xuaW1wb3J0IFN0YXRzIGZyb20gJ3N0YXRzLmpzJztcbmltcG9ydCBsb2FkRm9udCBmcm9tICdsb2FkLWJtZm9udCc7XG5pbXBvcnQgeyB2ZXJ0ZXhTaGFkZXIgfSBmcm9tICcuL3NoYWRlcnMvdmVydGV4JztcbmltcG9ydCB7IE1TREZUZXh0R2VvbWV0cnksIE1TREZUZXh0TWF0ZXJpYWwgfSBmcm9tICd0aHJlZS1tc2RmLXRleHQnO1xuaW1wb3J0IHsgZnJhZ21lbnRTaGFkZXIgfSBmcm9tICcuL3NoYWRlcnMvZnJhZ21lbnQnO1xuaW1wb3J0IHsgT3JiaXRDb250cm9scyB9IGZyb20gJ3RocmVlL2V4YW1wbGVzL2pzbS9jb250cm9scy9PcmJpdENvbnRyb2xzJztcblxuY29uc3Qgc3RhdHMgPSBuZXcgU3RhdHMoKTtcbnN0YXRzLnNob3dQYW5lbCgxKTsgLy8gMDogZnBzLCAxOiBtcywgMjogbWIsIDMrOiBjdXN0b21cbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc3RhdHMuZG9tKTtcblxuaW50ZXJmYWNlIElSZW5kZXJUYXJnZXRQcm9wcyB7XG4gIHNjZW5lOiBUSFJFRS5TY2VuZTtcbiAgbWF0ZXJpYWw6IFRIUkVFLlJhd1NoYWRlck1hdGVyaWFsO1xuICBtZXNoOiBUSFJFRS5NZXNoO1xuICBjYW1lcmE6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhO1xuICByZW5kZXJUYXJnZXQ6IFRIUkVFLldlYkdMUmVuZGVyVGFyZ2V0O1xufVxuXG5jb25zdCBzaXplcyA9IHtcbiAgd2lkdGg6IHdpbmRvdy5pbm5lcldpZHRoLFxuICBoZWlnaHQ6IHdpbmRvdy5pbm5lckhlaWdodFxufTtcblxuZXhwb3J0IGNsYXNzIENhbnZhcyB7XG4gIHB1YmxpYyBjYW1lcmE6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhO1xuICBwdWJsaWMgcmVuZGVyVGFyZ2V0Q2FtZXJhPzogVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmE7XG4gIHB1YmxpYyByZW5kZXJlcjogVEhSRUUuV2ViR0xSZW5kZXJlcjtcbiAgcHVibGljIHNjZW5lOiBUSFJFRS5TY2VuZTtcbiAgcHVibGljIHJlbmRlclRhcmdldFNjZW5lPzogVEhSRUUuU2NlbmU7XG4gIHB1YmxpYyByZW5kZXJUYXJnZXRNYXRlcmlhbD86IFRIUkVFLlJhd1NoYWRlck1hdGVyaWFsO1xuICBwdWJsaWMgcmVuZGVyVGFyZ2V0TWVzaD86IFRIUkVFLk1lc2g7XG4gIHB1YmxpYyByZW5kZXJUYXJnZXRzPzogSVJlbmRlclRhcmdldFByb3BzW107XG4gIHB1YmxpYyBzcGhlcmU/OiBUSFJFRS5NZXNoO1xuICBwdWJsaWMgZmxvb3I/OiBUSFJFRS5NZXNoO1xuICBwdWJsaWMgbWVzaD86IFRIUkVFLk1lc2g7XG4gIHB1YmxpYyBjb3VudDogbnVtYmVyO1xuICBwdWJsaWMgY2xvY2s6IFRIUkVFLkNsb2NrO1xuICBwdWJsaWMgc3VyZmFjZT86IFRIUkVFLk1lc2g7XG4gIHB1YmxpYyByZW5kZXJUYXJnZXQ/OiBUSFJFRS5XZWJHTFJlbmRlclRhcmdldDtcbiAgcHVibGljIG9yYml0Q29udHJvbHM6IE9yYml0Q29udHJvbHM7XG4gIHB1YmxpYyBzcG90TGlnaHQ6IFRIUkVFLlNwb3RMaWdodDtcblxuICBjb25zdHJ1Y3RvcihjYW52YXM6IEVsZW1lbnQpIHtcbiAgICB0aGlzLnNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG4gICAgdGhpcy5jb3VudCA9IDgwMDA7XG4gICAgdGhpcy5yZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKHtcbiAgICAgIGNhbnZhcyxcbiAgICAgIHN0ZW5jaWw6IGZhbHNlLFxuICAgICAgYWxwaGE6IHRydWVcbiAgICB9KTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRQaXhlbFJhdGlvKE1hdGgubWluKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvLCAyKSk7XG4gICAgdGhpcy5yZW5kZXJlci5vdXRwdXRFbmNvZGluZyA9IFRIUkVFLnNSR0JFbmNvZGluZztcbiAgICB0aGlzLnJlbmRlcmVyLnNldENsZWFyQ29sb3IoMHgwMDAwMDApO1xuXG4gICAgdGhpcy5zcG90TGlnaHQgPSBuZXcgVEhSRUUuU3BvdExpZ2h0KFxuICAgICAgMHhmZmZmZmYsXG4gICAgICAwLjUsXG4gICAgICA4MCxcbiAgICAgIE1hdGguUEkgKiAwLjI1LFxuICAgICAgMC4yLFxuICAgICAgM1xuICAgICk7XG5cbiAgICB0aGlzLnNwb3RMaWdodC5wb3NpdGlvbi5zZXQoMCwgMTAsIDApO1xuICAgIHRoaXMuc3BvdExpZ2h0LmNhc3RTaGFkb3cgPSB0cnVlO1xuICAgIHRoaXMuc3BvdExpZ2h0LnNoYWRvdy5jYW1lcmEubmVhciA9IDAuNTtcbiAgICB0aGlzLnNwb3RMaWdodC5zaGFkb3cuY2FtZXJhLmZhciA9IDQwO1xuXG4gICAgdGhpcy5zY2VuZS5hZGQodGhpcy5zcG90TGlnaHQpO1xuXG4gICAgY29uc3QgbmVhciA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIHRoaXMuY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDc1LCBuZWFyLCAwLjEsIDEwMDAwKTtcbiAgICB0aGlzLmNhbWVyYS5wb3NpdGlvbi56ID0gNDA7XG5cbiAgICB0aGlzLm9yYml0Q29udHJvbHMgPSBuZXcgT3JiaXRDb250cm9scyhcbiAgICAgIHRoaXMuY2FtZXJhLFxuICAgICAgdGhpcy5yZW5kZXJlci5kb21FbGVtZW50XG4gICAgKTtcbiAgICB0aGlzLmNsb2NrID0gbmV3IFRIUkVFLkNsb2NrKCk7XG5cbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuXG4gIHB1YmxpYyBpbml0KCk6IHZvaWQge1xuICAgIFByb21pc2UuYWxsKFtcbiAgICAgIHRoaXMubG9hZEZvbnRBdGxhcygnaG9yaXpvbi5wbmcnKSxcbiAgICAgIHRoaXMubG9hZEZvbnQoJ2hvcml6b24uZm50JylcbiAgICBdKS50aGVuKChbYXRsYXMsIGZvbnRdKSA9PiB7XG4gICAgICBjb25zdCBnZW9tZXRyeSA9IG5ldyBNU0RGVGV4dEdlb21ldHJ5KHtcbiAgICAgICAgdGV4dDogJ0luZmluaXR5JyxcbiAgICAgICAgZm9udDogZm9udCxcbiAgICAgICAgd2lkdGg6IDEwMDAsXG4gICAgICAgIGFsaWduOiAnY2VudGVyJ1xuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IG1hdGVyaWFsID0gbmV3IE1TREZUZXh0TWF0ZXJpYWwoKTtcbiAgICAgIG1hdGVyaWFsLnVuaWZvcm1zLnVNYXAudmFsdWUgPSBhdGxhcztcbiAgICAgIG1hdGVyaWFsLnNpZGUgPSBUSFJFRS5Eb3VibGVTaWRlO1xuXG4gICAgICB0aGlzLm1lc2ggPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICAgICAgdGhpcy5tZXNoLnJvdGF0aW9uLnggPSBNYXRoLlBJO1xuICAgICAgY29uc3Qgc2NhbGUgPSAzO1xuICAgICAgdGhpcy5tZXNoLnBvc2l0aW9uLnggPSAoLWdlb21ldHJ5LmxheW91dC53aWR0aCAvIDIpICogc2NhbGU7XG4gICAgICB0aGlzLm1lc2guc2NhbGUuc2V0KHNjYWxlLCBzY2FsZSwgc2NhbGUpO1xuXG4gICAgICB0aGlzLmNyZWF0ZVJlbmRlclRhcmdldCgpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5jcmVhdGVGbG9vcigpO1xuICAgIHRoaXMuYW5pbWF0ZSgpO1xuICAgIHRoaXMuaGFuZGxlUmVzaXplKCk7XG4gIH1cbiAgcHVibGljIGxvYWRGb250QXRsYXMocGF0aDogc3RyaW5nKTogUHJvbWlzZTxUSFJFRS5UZXh0dXJlPiB7XG4gICAgY29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IGxvYWRlciA9IG5ldyBUSFJFRS5UZXh0dXJlTG9hZGVyKCk7XG4gICAgICBsb2FkZXIubG9hZChwYXRoLCAodGV4dHVyZSkgPT4ge1xuICAgICAgICByZXNvbHZlKHRleHR1cmUpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZSBhcyBQcm9taXNlPFRIUkVFLlRleHR1cmU+O1xuICB9XG5cbiAgcHVibGljIGxvYWRGb250KHBhdGg6IHN0cmluZyk6IFByb21pc2U8Rm9udD4ge1xuICAgIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBsb2FkRm9udChwYXRoLCAoZXJyb3I6IGFueSwgZm9udDogYW55KSA9PiB7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICByZXNvbHZlKGZvbnQpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZSBhcyBQcm9taXNlPEZvbnQ+O1xuICB9XG5cbiAgcHVibGljIGhhbmRsZVJlc2l6ZSgpOiB2b2lkIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xuICAgICAgc2l6ZXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgIHNpemVzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblxuICAgICAgdGhpcy5jYW1lcmEuYXNwZWN0ID0gc2l6ZXMud2lkdGggLyBzaXplcy5oZWlnaHQ7XG4gICAgICB0aGlzLmNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG5cbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0U2l6ZShzaXplcy53aWR0aCwgc2l6ZXMuaGVpZ2h0KTtcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyhNYXRoLm1pbih3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbywgMikpO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGNyZWF0ZVJlbmRlclRhcmdldCgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMubWVzaCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCByZW5kZXJUYXJnZXQgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJUYXJnZXQoXG4gICAgICB3aW5kb3cuaW5uZXJXaWR0aCxcbiAgICAgIHdpbmRvdy5pbm5lckhlaWdodFxuICAgICk7XG5cbiAgICBjb25zdCByZW5kZXJUYXJnZXRDYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoXG4gICAgICA3NSxcbiAgICAgIHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0LFxuICAgICAgMC4xLFxuICAgICAgMTAwMDBcbiAgICApO1xuICAgIHJlbmRlclRhcmdldENhbWVyYS5wb3NpdGlvbi56ID0gNjAwO1xuXG4gICAgY29uc3QgcmVuZGVyVGFyZ2V0U2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcblxuICAgIHJlbmRlclRhcmdldFNjZW5lLmFkZCh0aGlzLm1lc2gpO1xuXG4gICAgY29uc3QgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuVG9ydXNHZW9tZXRyeSgxMCwgMywgMTYsIDEwMCk7XG5cbiAgICBjb25zdCByZW5kZXJUYXJnZXRNYXRlcmlhbCA9IG5ldyBUSFJFRS5SYXdTaGFkZXJNYXRlcmlhbCh7XG4gICAgICB2ZXJ0ZXhTaGFkZXIsXG4gICAgICBmcmFnbWVudFNoYWRlcixcbiAgICAgIHNpZGU6IFRIUkVFLkZyb250U2lkZSxcbiAgICAgIHVuaWZvcm1zOiB7XG4gICAgICAgIHVfdGltZTogbmV3IFRIUkVFLlVuaWZvcm0oMCksXG4gICAgICAgIHVfdGV4dHVyZTogbmV3IFRIUkVFLlVuaWZvcm0ocmVuZGVyVGFyZ2V0LnRleHR1cmUpXG4gICAgICB9LFxuICAgICAgdHJhbnNwYXJlbnQ6IHRydWVcbiAgICB9KTtcblxuICAgIGNvbnN0IHJlbmRlclRhcmdldE1lc2ggPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgcmVuZGVyVGFyZ2V0TWF0ZXJpYWwpO1xuXG4gICAgcmVuZGVyVGFyZ2V0TWVzaC5yb3RhdGlvbi5zZXQoMiwgMi44LCAwKTtcbiAgICB0aGlzLnNjZW5lLmFkZChyZW5kZXJUYXJnZXRNZXNoKTtcblxuICAgIHRoaXMucmVuZGVyVGFyZ2V0cz8ucHVzaCh7XG4gICAgICBzY2VuZTogcmVuZGVyVGFyZ2V0U2NlbmUsXG4gICAgICBtYXRlcmlhbDogcmVuZGVyVGFyZ2V0TWF0ZXJpYWwsXG4gICAgICBjYW1lcmE6IHJlbmRlclRhcmdldENhbWVyYSxcbiAgICAgIG1lc2g6IHJlbmRlclRhcmdldE1lc2gsXG4gICAgICByZW5kZXJUYXJnZXQ6IHJlbmRlclRhcmdldFxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGNyZWF0ZUZsb29yKCk6IHZvaWQge1xuICAgIGNvbnN0IG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsKHtcbiAgICAgIGNvbG9yOiAweGZmZmZmZlxuICAgIH0pO1xuXG4gICAgY29uc3QgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQ2lyY2xlR2VvbWV0cnkoNTAsIDUwKTtcbiAgICBjb25zdCBwbGFuZSA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbCk7XG5cbiAgICB0aGlzLnNjZW5lLmFkZChwbGFuZSk7XG4gICAgcGxhbmUucm90YXRpb24ueCA9IC1NYXRoLlBJIC8gMjtcbiAgICBwbGFuZS5wb3NpdGlvbi55ID0gLTE1LjU7XG4gICAgcGxhbmUucmVjZWl2ZVNoYWRvdyA9IHRydWU7XG4gIH1cblxuICBwdWJsaWMgYW5pbWF0ZSgpOiB2b2lkIHtcbiAgICBzdGF0cy5iZWdpbigpO1xuICAgIGNvbnN0IGVsYXBzZWRUaW1lID0gdGhpcy5jbG9jay5nZXRFbGFwc2VkVGltZSgpO1xuXG4gICAgdGhpcy5vcmJpdENvbnRyb2xzLnVwZGF0ZSgpO1xuXG4gICAgaWYgKHRoaXMucmVuZGVyVGFyZ2V0cy5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLnJlbmRlclRhcmdldHM/LmZvckVhY2goKHJlbmRlclRhcmdldE9iamVjdCkgPT4ge1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFJlbmRlclRhcmdldChyZW5kZXJUYXJnZXRPYmplY3QucmVuZGVyVGFyZ2V0KTtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5yZW5kZXIoXG4gICAgICAgICAgcmVuZGVyVGFyZ2V0T2JqZWN0LnNjZW5lLFxuICAgICAgICAgIHJlbmRlclRhcmdldE9iamVjdC5jYW1lcmFcbiAgICAgICAgKTtcbiAgICAgICAgLy8gdGhpcy5yZW5kZXJlci5jbGVhclRhcmdldCh0aGlzLnJlbmRlclRhcmdldCwgdHJ1ZSwgZmFsc2UsIGZhbHNlKTtcblxuICAgICAgICBjb25zdCBtZXNoTWF0ZXJpYWwgPSByZW5kZXJUYXJnZXRPYmplY3QubWVzaFxuICAgICAgICAgIC5tYXRlcmlhbCBhcyBUSFJFRS5SYXdTaGFkZXJNYXRlcmlhbDtcblxuICAgICAgICBtZXNoTWF0ZXJpYWwudW5pZm9ybXMudV90aW1lLnZhbHVlID0gZWxhcHNlZFRpbWU7XG4gICAgICAgIG1lc2hNYXRlcmlhbC51bmlmb3Jtc05lZWRVcGRhdGUgPSB0cnVlO1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFJlbmRlclRhcmdldChudWxsKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChcbiAgICAgIHRoaXMucmVuZGVyVGFyZ2V0ICYmXG4gICAgICB0aGlzLnJlbmRlclRhcmdldFNjZW5lICYmXG4gICAgICB0aGlzLnJlbmRlclRhcmdldENhbWVyYSAmJlxuICAgICAgdGhpcy5yZW5kZXJUYXJnZXRNZXNoXG4gICAgKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFJlbmRlclRhcmdldCh0aGlzLnJlbmRlclRhcmdldCk7XG4gICAgICB0aGlzLnJlbmRlcmVyLnJlbmRlcih0aGlzLnJlbmRlclRhcmdldFNjZW5lLCB0aGlzLnJlbmRlclRhcmdldENhbWVyYSk7XG4gICAgICAvLyB0aGlzLnJlbmRlcmVyLmNsZWFyVGFyZ2V0KHRoaXMucmVuZGVyVGFyZ2V0LCB0cnVlLCBmYWxzZSwgZmFsc2UpO1xuXG4gICAgICBjb25zdCBtZXNoTWF0ZXJpYWwgPSB0aGlzLnJlbmRlclRhcmdldE1lc2hcbiAgICAgICAgLm1hdGVyaWFsIGFzIFRIUkVFLlJhd1NoYWRlck1hdGVyaWFsO1xuXG4gICAgICBtZXNoTWF0ZXJpYWwudW5pZm9ybXMudV90aW1lLnZhbHVlID0gZWxhcHNlZFRpbWU7XG4gICAgICBtZXNoTWF0ZXJpYWwudW5pZm9ybXNOZWVkVXBkYXRlID0gdHJ1ZTtcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0UmVuZGVyVGFyZ2V0KG51bGwpO1xuICAgIH1cblxuICAgIHRoaXMucmVuZGVyZXIucmVuZGVyKHRoaXMuc2NlbmUsIHRoaXMuY2FtZXJhKTtcbiAgICAvLyBBbmltYXRlXG4gICAgc3RhdHMuZW5kKCk7XG5cbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy5hbmltYXRlKCkpO1xuICB9XG59XG4iLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmggPSAoKSA9PiAoXCJmOTJhOTEwNjUzMjEyODVhYWVjZlwiKSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==