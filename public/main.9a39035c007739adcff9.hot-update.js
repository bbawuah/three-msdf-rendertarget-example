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
    Canvas.prototype.createRenderTarget = function (rotation) {
        var _a;
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
/******/ 	__webpack_require__.h = () => ("1a5bc8261e0d059635b6")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi45YTM5MDM1YzAwNzczOWFkY2ZmOS5ob3QtdXBkYXRlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsbUdBQStCO0FBRS9CLG9IQUE2QjtBQUM3QixxSEFBbUM7QUFDbkMsNEZBQWdEO0FBQ2hELHFIQUFxRTtBQUNyRSxrR0FBb0Q7QUFDcEQsMEpBQTBFO0FBRTFFLElBQU0sS0FBSyxHQUFHLElBQUksa0JBQUssRUFBRSxDQUFDO0FBQzFCLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxtQ0FBbUM7QUFDdkQsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBVXJDLElBQU0sS0FBSyxHQUFHO0lBQ1osS0FBSyxFQUFFLE1BQU0sQ0FBQyxVQUFVO0lBQ3hCLE1BQU0sRUFBRSxNQUFNLENBQUMsV0FBVztDQUMzQixDQUFDO0FBRUY7SUFtQkUsZ0JBQVksTUFBZTtRQUN6QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQy9CLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxLQUFLLENBQUMsYUFBYSxDQUFDO1lBQ3RDLE1BQU07WUFDTixPQUFPLEVBQUUsS0FBSztZQUNkLEtBQUssRUFBRSxJQUFJO1NBQ1osQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDN0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsRSxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsR0FBRyxLQUFL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RUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDOUMsVUFBVTtRQUNWLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUVaLHFCQUFxQixDQUFDLGNBQU0sWUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFkLENBQWMsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFDSCxhQUFDO0FBQUQsQ0FBQztBQTVOWSx3QkFBTTs7Ozs7Ozs7O1VDMUJuQiIsInNvdXJjZXMiOlsid2VicGFjazovL3Byb2plY3QtYm9pbGVycGxhdGUvLi9hcHAvd2ViZ2wvY2FudmFzLnRzIiwid2VicGFjazovL3Byb2plY3QtYm9pbGVycGxhdGUvd2VicGFjay9ydW50aW1lL2dldEZ1bGxIYXNoIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFRIUkVFIGZyb20gJ3RocmVlJztcbmltcG9ydCB7IEZvbnQsIEZvbnRMb2FkZXIgfSBmcm9tICd0aHJlZS9leGFtcGxlcy9qc20vbG9hZGVycy9Gb250TG9hZGVyJztcbmltcG9ydCBTdGF0cyBmcm9tICdzdGF0cy5qcyc7XG5pbXBvcnQgbG9hZEZvbnQgZnJvbSAnbG9hZC1ibWZvbnQnO1xuaW1wb3J0IHsgdmVydGV4U2hhZGVyIH0gZnJvbSAnLi9zaGFkZXJzL3ZlcnRleCc7XG5pbXBvcnQgeyBNU0RGVGV4dEdlb21ldHJ5LCBNU0RGVGV4dE1hdGVyaWFsIH0gZnJvbSAndGhyZWUtbXNkZi10ZXh0JztcbmltcG9ydCB7IGZyYWdtZW50U2hhZGVyIH0gZnJvbSAnLi9zaGFkZXJzL2ZyYWdtZW50JztcbmltcG9ydCB7IE9yYml0Q29udHJvbHMgfSBmcm9tICd0aHJlZS9leGFtcGxlcy9qc20vY29udHJvbHMvT3JiaXRDb250cm9scyc7XG5cbmNvbnN0IHN0YXRzID0gbmV3IFN0YXRzKCk7XG5zdGF0cy5zaG93UGFuZWwoMSk7IC8vIDA6IGZwcywgMTogbXMsIDI6IG1iLCAzKzogY3VzdG9tXG5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHN0YXRzLmRvbSk7XG5cbmludGVyZmFjZSBJUmVuZGVyVGFyZ2V0UHJvcHMge1xuICBzY2VuZTogVEhSRUUuU2NlbmU7XG4gIG1hdGVyaWFsOiBUSFJFRS5SYXdTaGFkZXJNYXRlcmlhbDtcbiAgbWVzaDogVEhSRUUuTWVzaDtcbiAgY2FtZXJhOiBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYTtcbiAgcmVuZGVyVGFyZ2V0OiBUSFJFRS5XZWJHTFJlbmRlclRhcmdldDtcbn1cblxuY29uc3Qgc2l6ZXMgPSB7XG4gIHdpZHRoOiB3aW5kb3cuaW5uZXJXaWR0aCxcbiAgaGVpZ2h0OiB3aW5kb3cuaW5uZXJIZWlnaHRcbn07XG5cbmV4cG9ydCBjbGFzcyBDYW52YXMge1xuICBwdWJsaWMgY2FtZXJhOiBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYTtcbiAgcHVibGljIHJlbmRlclRhcmdldENhbWVyYT86IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhO1xuICBwdWJsaWMgcmVuZGVyZXI6IFRIUkVFLldlYkdMUmVuZGVyZXI7XG4gIHB1YmxpYyBzY2VuZTogVEhSRUUuU2NlbmU7XG4gIHB1YmxpYyByZW5kZXJUYXJnZXRTY2VuZT86IFRIUkVFLlNjZW5lO1xuICBwdWJsaWMgcmVuZGVyVGFyZ2V0TWF0ZXJpYWw/OiBUSFJFRS5SYXdTaGFkZXJNYXRlcmlhbDtcbiAgcHVibGljIHJlbmRlclRhcmdldE1lc2g/OiBUSFJFRS5NZXNoO1xuICBwdWJsaWMgcmVuZGVyVGFyZ2V0cz86IElSZW5kZXJUYXJnZXRQcm9wc1tdO1xuICBwdWJsaWMgc3BoZXJlPzogVEhSRUUuTWVzaDtcbiAgcHVibGljIGZsb29yPzogVEhSRUUuTWVzaDtcbiAgcHVibGljIG1lc2g/OiBUSFJFRS5NZXNoO1xuICBwdWJsaWMgY291bnQ6IG51bWJlcjtcbiAgcHVibGljIGNsb2NrOiBUSFJFRS5DbG9jaztcbiAgcHVibGljIHN1cmZhY2U/OiBUSFJFRS5NZXNoO1xuICBwdWJsaWMgcmVuZGVyVGFyZ2V0PzogVEhSRUUuV2ViR0xSZW5kZXJUYXJnZXQ7XG4gIHB1YmxpYyBvcmJpdENvbnRyb2xzOiBPcmJpdENvbnRyb2xzO1xuICBwdWJsaWMgc3BvdExpZ2h0OiBUSFJFRS5TcG90TGlnaHQ7XG5cbiAgY29uc3RydWN0b3IoY2FudmFzOiBFbGVtZW50KSB7XG4gICAgdGhpcy5zY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xuICAgIHRoaXMuY291bnQgPSA4MDAwO1xuICAgIHRoaXMucmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcih7XG4gICAgICBjYW52YXMsXG4gICAgICBzdGVuY2lsOiBmYWxzZSxcbiAgICAgIGFscGhhOiB0cnVlXG4gICAgfSk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyhNYXRoLm1pbih3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbywgMikpO1xuICAgIHRoaXMucmVuZGVyZXIub3V0cHV0RW5jb2RpbmcgPSBUSFJFRS5zUkdCRW5jb2Rpbmc7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRDbGVhckNvbG9yKDB4MDAwMDAwKTtcbiAgICB0aGlzLnJlbmRlclRhcmdldHMgPSBbXTtcblxuICAgIHRoaXMuc3BvdExpZ2h0ID0gbmV3IFRIUkVFLlNwb3RMaWdodChcbiAgICAgIDB4ZmZmZmZmLFxuICAgICAgMC41LFxuICAgICAgODAsXG4gICAgICBNYXRoLlBJICogMC4yNSxcbiAgICAgIDAuMixcbiAgICAgIDNcbiAgICApO1xuXG4gICAgdGhpcy5zcG90TGlnaHQucG9zaXRpb24uc2V0KDAsIDEwLCAwKTtcbiAgICB0aGlzLnNwb3RMaWdodC5jYXN0U2hhZG93ID0gdHJ1ZTtcbiAgICB0aGlzLnNwb3RMaWdodC5zaGFkb3cuY2FtZXJhLm5lYXIgPSAwLjU7XG4gICAgdGhpcy5zcG90TGlnaHQuc2hhZG93LmNhbWVyYS5mYXIgPSA0MDtcblxuICAgIHRoaXMuc2NlbmUuYWRkKHRoaXMuc3BvdExpZ2h0KTtcblxuICAgIGNvbnN0IG5lYXIgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICB0aGlzLmNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSg3NSwgbmVhciwgMC4xLCAxMDAwMCk7XG4gICAgdGhpcy5jYW1lcmEucG9zaXRpb24ueiA9IDQwO1xuXG4gICAgdGhpcy5vcmJpdENvbnRyb2xzID0gbmV3IE9yYml0Q29udHJvbHMoXG4gICAgICB0aGlzLmNhbWVyYSxcbiAgICAgIHRoaXMucmVuZGVyZXIuZG9tRWxlbWVudFxuICAgICk7XG4gICAgdGhpcy5jbG9jayA9IG5ldyBUSFJFRS5DbG9jaygpO1xuXG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICBwdWJsaWMgaW5pdCgpOiB2b2lkIHtcbiAgICBQcm9taXNlLmFsbChbXG4gICAgICB0aGlzLmxvYWRGb250QXRsYXMoJ2hvcml6b24ucG5nJyksXG4gICAgICB0aGlzLmxvYWRGb250KCdob3Jpem9uLmZudCcpXG4gICAgXSkudGhlbigoW2F0bGFzLCBmb250XSkgPT4ge1xuICAgICAgY29uc3QgZ2VvbWV0cnkgPSBuZXcgTVNERlRleHRHZW9tZXRyeSh7XG4gICAgICAgIHRleHQ6ICdJbmZpbml0eScsXG4gICAgICAgIGZvbnQ6IGZvbnQsXG4gICAgICAgIHdpZHRoOiAxMDAwLFxuICAgICAgICBhbGlnbjogJ2NlbnRlcidcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBtYXRlcmlhbCA9IG5ldyBNU0RGVGV4dE1hdGVyaWFsKCk7XG4gICAgICBtYXRlcmlhbC51bmlmb3Jtcy51TWFwLnZhbHVlID0gYXRsYXM7XG4gICAgICBtYXRlcmlhbC5zaWRlID0gVEhSRUUuRG91YmxlU2lkZTtcblxuICAgICAgY29uc3QgbWVzaCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbCk7XG4gICAgICBtZXNoLnJvdGF0aW9uLnggPSBNYXRoLlBJO1xuICAgICAgY29uc3Qgc2NhbGUgPSAzO1xuICAgICAgbWVzaC5wb3NpdGlvbi54ID0gKC1nZW9tZXRyeS5sYXlvdXQud2lkdGggLyAyKSAqIHNjYWxlO1xuICAgICAgbWVzaC5zY2FsZS5zZXQoc2NhbGUsIHNjYWxlLCBzY2FsZSk7XG5cbiAgICAgIHRoaXMuY3JlYXRlUmVuZGVyVGFyZ2V0KG5ldyBUSFJFRS5FdWxlcigyLCAyLjgsIDApKTtcbiAgICAgIC8vIHRoaXMuY3JlYXRlUmVuZGVyVGFyZ2V0KG5ldyBUSFJFRS5FdWxlcigwLCAyLjgsIDApKTtcbiAgICB9KTtcblxuICAgIHRoaXMuY3JlYXRlRmxvb3IoKTtcbiAgICB0aGlzLmFuaW1hdGUoKTtcbiAgICB0aGlzLmhhbmRsZVJlc2l6ZSgpO1xuICB9XG4gIHB1YmxpYyBsb2FkRm9udEF0bGFzKHBhdGg6IHN0cmluZyk6IFByb21pc2U8VEhSRUUuVGV4dHVyZT4ge1xuICAgIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBsb2FkZXIgPSBuZXcgVEhSRUUuVGV4dHVyZUxvYWRlcigpO1xuICAgICAgbG9hZGVyLmxvYWQocGF0aCwgKHRleHR1cmUpID0+IHtcbiAgICAgICAgcmVzb2x2ZSh0ZXh0dXJlKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHByb21pc2UgYXMgUHJvbWlzZTxUSFJFRS5UZXh0dXJlPjtcbiAgfVxuXG4gIHB1YmxpYyBsb2FkRm9udChwYXRoOiBzdHJpbmcpOiBQcm9taXNlPEZvbnQ+IHtcbiAgICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgbG9hZEZvbnQocGF0aCwgKGVycm9yOiBhbnksIGZvbnQ6IGFueSkgPT4ge1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmVzb2x2ZShmb250KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHByb21pc2UgYXMgUHJvbWlzZTxGb250PjtcbiAgfVxuXG4gIHB1YmxpYyBoYW5kbGVSZXNpemUoKTogdm9pZCB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcbiAgICAgIHNpemVzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICBzaXplcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cbiAgICAgIHRoaXMuY2FtZXJhLmFzcGVjdCA9IHNpemVzLndpZHRoIC8gc2l6ZXMuaGVpZ2h0O1xuICAgICAgdGhpcy5jYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuXG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFNpemUoc2l6ZXMud2lkdGgsIHNpemVzLmhlaWdodCk7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFBpeGVsUmF0aW8oTWF0aC5taW4od2luZG93LmRldmljZVBpeGVsUmF0aW8sIDIpKTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBjcmVhdGVSZW5kZXJUYXJnZXQocm90YXRpb246IFRIUkVFLkV1bGVyKTogdm9pZCB7XG4gICAgY29uc3QgcmVuZGVyVGFyZ2V0ID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyVGFyZ2V0KFxuICAgICAgd2luZG93LmlubmVyV2lkdGgsXG4gICAgICB3aW5kb3cuaW5uZXJIZWlnaHRcbiAgICApO1xuXG4gICAgY29uc3QgcmVuZGVyVGFyZ2V0Q2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKFxuICAgICAgNzUsXG4gICAgICB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCxcbiAgICAgIDAuMSxcbiAgICAgIDEwMDAwXG4gICAgKTtcbiAgICByZW5kZXJUYXJnZXRDYW1lcmEucG9zaXRpb24ueiA9IDYwMDtcblxuICAgIGNvbnN0IHJlbmRlclRhcmdldFNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG5cbiAgICByZW5kZXJUYXJnZXRTY2VuZS5hZGQodGhpcy5tZXNoKTtcblxuICAgIGNvbnN0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLlRvcnVzR2VvbWV0cnkoMTAsIDMsIDE2LCAxMDApO1xuXG4gICAgY29uc3QgcmVuZGVyVGFyZ2V0TWF0ZXJpYWwgPSBuZXcgVEhSRUUuUmF3U2hhZGVyTWF0ZXJpYWwoe1xuICAgICAgdmVydGV4U2hhZGVyLFxuICAgICAgZnJhZ21lbnRTaGFkZXIsXG4gICAgICBzaWRlOiBUSFJFRS5Gcm9udFNpZGUsXG4gICAgICB1bmlmb3Jtczoge1xuICAgICAgICB1X3RpbWU6IG5ldyBUSFJFRS5Vbmlmb3JtKDApLFxuICAgICAgICB1X3RleHR1cmU6IG5ldyBUSFJFRS5Vbmlmb3JtKHJlbmRlclRhcmdldC50ZXh0dXJlKVxuICAgICAgfSxcbiAgICAgIHRyYW5zcGFyZW50OiB0cnVlXG4gICAgfSk7XG5cbiAgICBjb25zdCByZW5kZXJUYXJnZXRNZXNoID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIHJlbmRlclRhcmdldE1hdGVyaWFsKTtcblxuICAgIHJlbmRlclRhcmdldE1lc2gucm90YXRpb24uY29weShyb3RhdGlvbik7XG5cbiAgICB0aGlzLnNjZW5lLmFkZChyZW5kZXJUYXJnZXRNZXNoKTtcbiAgICB0aGlzLnJlbmRlclRhcmdldHM/LnB1c2goe1xuICAgICAgc2NlbmU6IHJlbmRlclRhcmdldFNjZW5lLFxuICAgICAgbWF0ZXJpYWw6IHJlbmRlclRhcmdldE1hdGVyaWFsLFxuICAgICAgY2FtZXJhOiByZW5kZXJUYXJnZXRDYW1lcmEsXG4gICAgICBtZXNoOiByZW5kZXJUYXJnZXRNZXNoLFxuICAgICAgcmVuZGVyVGFyZ2V0OiByZW5kZXJUYXJnZXRcbiAgICB9KTtcblxuICAgIGNvbnNvbGUubG9nKHRoaXMucmVuZGVyVGFyZ2V0cyk7XG4gIH1cblxuICBwdWJsaWMgY3JlYXRlRmxvb3IoKTogdm9pZCB7XG4gICAgY29uc3QgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwoe1xuICAgICAgY29sb3I6IDB4ZmZmZmZmXG4gICAgfSk7XG5cbiAgICBjb25zdCBnZW9tZXRyeSA9IG5ldyBUSFJFRS5DaXJjbGVHZW9tZXRyeSg1MCwgNTApO1xuICAgIGNvbnN0IHBsYW5lID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcblxuICAgIHRoaXMuc2NlbmUuYWRkKHBsYW5lKTtcbiAgICBwbGFuZS5yb3RhdGlvbi54ID0gLU1hdGguUEkgLyAyO1xuICAgIHBsYW5lLnBvc2l0aW9uLnkgPSAtMTUuNTtcbiAgICBwbGFuZS5yZWNlaXZlU2hhZG93ID0gdHJ1ZTtcbiAgfVxuXG4gIHB1YmxpYyBhbmltYXRlKCk6IHZvaWQge1xuICAgIHN0YXRzLmJlZ2luKCk7XG4gICAgY29uc3QgZWxhcHNlZFRpbWUgPSB0aGlzLmNsb2NrLmdldEVsYXBzZWRUaW1lKCk7XG5cbiAgICB0aGlzLm9yYml0Q29udHJvbHMudXBkYXRlKCk7XG5cbiAgICBpZiAodGhpcy5yZW5kZXJUYXJnZXRzICYmIHRoaXMucmVuZGVyVGFyZ2V0cy5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLnJlbmRlclRhcmdldHM/LmZvckVhY2goKHJlbmRlclRhcmdldE9iamVjdCkgPT4ge1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFJlbmRlclRhcmdldChyZW5kZXJUYXJnZXRPYmplY3QucmVuZGVyVGFyZ2V0KTtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5yZW5kZXIoXG4gICAgICAgICAgcmVuZGVyVGFyZ2V0T2JqZWN0LnNjZW5lLFxuICAgICAgICAgIHJlbmRlclRhcmdldE9iamVjdC5jYW1lcmFcbiAgICAgICAgKTtcbiAgICAgICAgLy8gdGhpcy5yZW5kZXJlci5jbGVhclRhcmdldCh0aGlzLnJlbmRlclRhcmdldCwgdHJ1ZSwgZmFsc2UsIGZhbHNlKTtcblxuICAgICAgICBjb25zdCBtZXNoTWF0ZXJpYWwgPSByZW5kZXJUYXJnZXRPYmplY3QubWVzaFxuICAgICAgICAgIC5tYXRlcmlhbCBhcyBUSFJFRS5SYXdTaGFkZXJNYXRlcmlhbDtcblxuICAgICAgICBtZXNoTWF0ZXJpYWwudW5pZm9ybXMudV90aW1lLnZhbHVlID0gZWxhcHNlZFRpbWU7XG4gICAgICAgIG1lc2hNYXRlcmlhbC51bmlmb3Jtc05lZWRVcGRhdGUgPSB0cnVlO1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFJlbmRlclRhcmdldChudWxsKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMucmVuZGVyZXIucmVuZGVyKHRoaXMuc2NlbmUsIHRoaXMuY2FtZXJhKTtcbiAgICAvLyBBbmltYXRlXG4gICAgc3RhdHMuZW5kKCk7XG5cbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy5hbmltYXRlKCkpO1xuICB9XG59XG4iLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmggPSAoKSA9PiAoXCIxYTViYzgyNjFlMGQwNTk2MzViNlwiKSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==