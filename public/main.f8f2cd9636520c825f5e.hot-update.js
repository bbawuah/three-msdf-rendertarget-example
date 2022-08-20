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
            }, function () {
                console.log('progress');
            }, function (event) {
                reject(event);
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
/******/ 	__webpack_require__.h = () => ("0bb032132df1c16b8558")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5mOGYyY2Q5NjM2NTIwYzgyNWY1ZS5ob3QtdXBkYXRlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsbUdBQStCO0FBRS9CLG9IQUE2QjtBQUM3QixxSEFBbUM7QUFDbkMsNEZBQWdEO0FBQ2hELHFIQUFxRTtBQUNyRSxrR0FBb0Q7QUFDcEQsMEpBQTBFO0FBRTFFLElBQU0sS0FBSyxHQUFHLElBQUksa0JBQUssRUFBRSxDQUFDO0FBQzFCLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxtQ0FBbUM7QUFDdkQsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBRXJDLElBQU0sS0FBSyxHQUFHO0lBQ1osS0FBSyxFQUFFLE1BQU0sQ0FBQyxVQUFVO0lBQ3hCLE1BQU0sRUFBRSxNQUFNLENBQUMsV0FBVztDQUMzQixDQUFDO0FBRUY7SUFtQkUsZ0JBQVksTUFBZTtRQUN6QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQy9CLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxLQUFLLENBQUMsYUFBYSxDQUFDO1lBQ3RDLE1BQU07U0FDUCxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUM3RCxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xFLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQyxZQUFZLENBQUM7UUFDbEQsSUFBSSxDQUFDLFFBQVEsQ0FB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QWUsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDakQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBRXRFLElBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxnQkFBZ0I7aUJBQ3ZDLFFBQW1DLENBQUM7WUFFdkMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQztZQUNqRCxZQUFZLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3JDO1FBRUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDOUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBRVoscUJBQXFCLENBQUMsY0FBTSxZQUFJLENBQUMsT0FBTyxFQUFFLEVBQWQsQ0FBYyxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUNILGFBQUM7QUFBRCxDQUFDO0FBek9ZLHdCQUFNOzs7Ozs7Ozs7VUNsQm5CIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcHJvamVjdC1ib2lsZXJwbGF0ZS8uL2FwcC93ZWJnbC9jYW52YXMudHMiLCJ3ZWJwYWNrOi8vcHJvamVjdC1ib2lsZXJwbGF0ZS93ZWJwYWNrL3J1bnRpbWUvZ2V0RnVsbEhhc2giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSAndGhyZWUnO1xuaW1wb3J0IHsgRm9udCwgRm9udExvYWRlciB9IGZyb20gJ3RocmVlL2V4YW1wbGVzL2pzbS9sb2FkZXJzL0ZvbnRMb2FkZXInO1xuaW1wb3J0IFN0YXRzIGZyb20gJ3N0YXRzLmpzJztcbmltcG9ydCBsb2FkRm9udCBmcm9tICdsb2FkLWJtZm9udCc7XG5pbXBvcnQgeyB2ZXJ0ZXhTaGFkZXIgfSBmcm9tICcuL3NoYWRlcnMvdmVydGV4JztcbmltcG9ydCB7IE1TREZUZXh0R2VvbWV0cnksIE1TREZUZXh0TWF0ZXJpYWwgfSBmcm9tICd0aHJlZS1tc2RmLXRleHQnO1xuaW1wb3J0IHsgZnJhZ21lbnRTaGFkZXIgfSBmcm9tICcuL3NoYWRlcnMvZnJhZ21lbnQnO1xuaW1wb3J0IHsgT3JiaXRDb250cm9scyB9IGZyb20gJ3RocmVlL2V4YW1wbGVzL2pzbS9jb250cm9scy9PcmJpdENvbnRyb2xzJztcblxuY29uc3Qgc3RhdHMgPSBuZXcgU3RhdHMoKTtcbnN0YXRzLnNob3dQYW5lbCgxKTsgLy8gMDogZnBzLCAxOiBtcywgMjogbWIsIDMrOiBjdXN0b21cbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc3RhdHMuZG9tKTtcblxuY29uc3Qgc2l6ZXMgPSB7XG4gIHdpZHRoOiB3aW5kb3cuaW5uZXJXaWR0aCxcbiAgaGVpZ2h0OiB3aW5kb3cuaW5uZXJIZWlnaHRcbn07XG5cbmV4cG9ydCBjbGFzcyBDYW52YXMge1xuICBwdWJsaWMgY2FtZXJhOiBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYTtcbiAgcHVibGljIHJlbmRlclRhcmdldENhbWVyYT86IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhO1xuICBwdWJsaWMgcmVuZGVyZXI6IFRIUkVFLldlYkdMUmVuZGVyZXI7XG4gIHB1YmxpYyBzY2VuZTogVEhSRUUuU2NlbmU7XG4gIHB1YmxpYyByZW5kZXJUYXJnZXRTY2VuZT86IFRIUkVFLlNjZW5lO1xuICBwdWJsaWMgcmVuZGVyVGFyZ2V0TWF0ZXJpYWw/OiBUSFJFRS5SYXdTaGFkZXJNYXRlcmlhbDtcbiAgcHVibGljIHJlbmRlclRhcmdldE1lc2g/OiBUSFJFRS5NZXNoO1xuICBwdWJsaWMgc3BoZXJlPzogVEhSRUUuTWVzaDtcbiAgcHVibGljIGZsb29yPzogVEhSRUUuTWVzaDtcbiAgcHVibGljIG1lc2g/OiBUSFJFRS5NZXNoO1xuICBwdWJsaWMgY291bnQ6IG51bWJlcjtcbiAgcHVibGljIGNsb2NrOiBUSFJFRS5DbG9jaztcbiAgcHVibGljIHN1cmZhY2U/OiBUSFJFRS5NZXNoO1xuICBwdWJsaWMgcmVuZGVyVGFyZ2V0PzogVEhSRUUuV2ViR0xSZW5kZXJUYXJnZXQ7XG4gIHB1YmxpYyBvcmJpdENvbnRyb2xzOiBPcmJpdENvbnRyb2xzO1xuICBwdWJsaWMgc3BvdExpZ2h0OiBUSFJFRS5TcG90TGlnaHQ7XG4gIHB1YmxpYyBhbWJpZW50TGlnaHQ6IFRIUkVFLkFtYmllbnRMaWdodDtcblxuICBjb25zdHJ1Y3RvcihjYW52YXM6IEVsZW1lbnQpIHtcbiAgICB0aGlzLnNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG4gICAgdGhpcy5jb3VudCA9IDgwMDA7XG4gICAgdGhpcy5yZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKHtcbiAgICAgIGNhbnZhc1xuICAgIH0pO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFBpeGVsUmF0aW8oTWF0aC5taW4od2luZG93LmRldmljZVBpeGVsUmF0aW8sIDIpKTtcbiAgICB0aGlzLnJlbmRlcmVyLm91dHB1dEVuY29kaW5nID0gVEhSRUUuc1JHQkVuY29kaW5nO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0Q2xlYXJDb2xvcigweDAwMDBmZik7XG5cbiAgICB0aGlzLmFtYmllbnRMaWdodCA9IG5ldyBUSFJFRS5BbWJpZW50TGlnaHQoMHhmZmZmZmYsIDEpO1xuICAgIHRoaXMuc2NlbmUuYWRkKHRoaXMuYW1iaWVudExpZ2h0KTtcblxuICAgIHRoaXMuc3BvdExpZ2h0ID0gbmV3IFRIUkVFLlNwb3RMaWdodChcbiAgICAgIDB4ZmZmZmZmLFxuICAgICAgMTcsXG4gICAgICA4MCxcbiAgICAgIE1hdGguUEkgKiAwLjI1LFxuICAgICAgMC4yLFxuICAgICAgM1xuICAgICk7XG5cbiAgICB0aGlzLnNwb3RMaWdodC5wb3NpdGlvbi5zZXQoMCwgMTAsIDApO1xuICAgIHRoaXMuc3BvdExpZ2h0LmNhc3RTaGFkb3cgPSB0cnVlO1xuICAgIHRoaXMuc3BvdExpZ2h0LnNoYWRvdy5jYW1lcmEubmVhciA9IDAuNTtcbiAgICB0aGlzLnNwb3RMaWdodC5zaGFkb3cuY2FtZXJhLmZhciA9IDQwO1xuXG4gICAgdGhpcy5zY2VuZS5hZGQodGhpcy5zcG90TGlnaHQpO1xuXG4gICAgY29uc3QgbmVhciA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIHRoaXMuY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDc1LCBuZWFyLCAwLjEsIDEwMDAwKTtcbiAgICB0aGlzLmNhbWVyYS5wb3NpdGlvbi56ID0gNDA7XG5cbiAgICB0aGlzLm9yYml0Q29udHJvbHMgPSBuZXcgT3JiaXRDb250cm9scyhcbiAgICAgIHRoaXMuY2FtZXJhLFxuICAgICAgdGhpcy5yZW5kZXJlci5kb21FbGVtZW50XG4gICAgKTtcblxuICAgIHRoaXMub3JiaXRDb250cm9scy5lbmFibGVab29tID0gZmFsc2U7XG4gICAgdGhpcy5jbG9jayA9IG5ldyBUSFJFRS5DbG9jaygpO1xuXG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICBwdWJsaWMgaW5pdCgpOiB2b2lkIHtcbiAgICBQcm9taXNlLmFsbChbXG4gICAgICB0aGlzLmxvYWRGb250QXRsYXMoJ2hvcml6b24ucG5nJyksXG4gICAgICB0aGlzLmxvYWRGb250KCdob3Jpem9uLmZudCcpXG4gICAgXSkudGhlbigoW2F0bGFzLCBmb250XSkgPT4ge1xuICAgICAgY29uc3QgZ2VvbWV0cnkgPSBuZXcgTVNERlRleHRHZW9tZXRyeSh7XG4gICAgICAgIHRleHQ6ICdJbmZpbml0eScsXG4gICAgICAgIGZvbnQ6IGZvbnQsXG4gICAgICAgIHdpZHRoOiAxMDAwLFxuICAgICAgICBhbGlnbjogJ2NlbnRlcidcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBtYXRlcmlhbCA9IG5ldyBNU0RGVGV4dE1hdGVyaWFsKCk7XG4gICAgICBtYXRlcmlhbC51bmlmb3Jtcy51TWFwLnZhbHVlID0gYXRsYXM7XG4gICAgICBtYXRlcmlhbC5zaWRlID0gVEhSRUUuRG91YmxlU2lkZTtcblxuICAgICAgdGhpcy5tZXNoID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgICAgIHRoaXMubWVzaC5yb3RhdGlvbi54ID0gTWF0aC5QSTtcbiAgICAgIGNvbnN0IHNjYWxlID0gMztcbiAgICAgIHRoaXMubWVzaC5wb3NpdGlvbi54ID0gKC1nZW9tZXRyeS5sYXlvdXQud2lkdGggLyAyKSAqIHNjYWxlO1xuICAgICAgdGhpcy5tZXNoLnNjYWxlLnNldChzY2FsZSwgc2NhbGUsIHNjYWxlKTtcblxuICAgICAgdGhpcy5jcmVhdGVSZW5kZXJUYXJnZXQoKTtcbiAgICB9KTtcblxuICAgIHRoaXMuY3JlYXRlRmxvb3IoKTtcbiAgICB0aGlzLmFuaW1hdGUoKTtcbiAgICB0aGlzLmhhbmRsZVJlc2l6ZSgpO1xuICB9XG4gIHB1YmxpYyBsb2FkRm9udEF0bGFzKHBhdGg6IHN0cmluZyk6IFByb21pc2U8VEhSRUUuVGV4dHVyZT4ge1xuICAgIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBsb2FkZXIgPSBuZXcgVEhSRUUuVGV4dHVyZUxvYWRlcigpO1xuICAgICAgbG9hZGVyLmxvYWQoXG4gICAgICAgIHBhdGgsXG4gICAgICAgICh0ZXh0dXJlKSA9PiB7XG4gICAgICAgICAgcmVzb2x2ZSh0ZXh0dXJlKTtcbiAgICAgICAgfSxcbiAgICAgICAgKCkgPT4ge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdwcm9ncmVzcycpO1xuICAgICAgICB9LFxuICAgICAgICAoZXZlbnQpID0+IHtcbiAgICAgICAgICByZWplY3QoZXZlbnQpO1xuICAgICAgICB9XG4gICAgICApO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHByb21pc2UgYXMgUHJvbWlzZTxUSFJFRS5UZXh0dXJlPjtcbiAgfVxuXG4gIHB1YmxpYyBsb2FkRm9udChwYXRoOiBzdHJpbmcpOiBQcm9taXNlPEZvbnQ+IHtcbiAgICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgbG9hZEZvbnQocGF0aCwgKGVycm9yOiBhbnksIGZvbnQ6IGFueSkgPT4ge1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICByZWplY3QoKTtcbiAgICAgICAgfVxuICAgICAgICByZXNvbHZlKGZvbnQpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZSBhcyBQcm9taXNlPEZvbnQ+O1xuICB9XG5cbiAgcHVibGljIGhhbmRsZVJlc2l6ZSgpOiB2b2lkIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xuICAgICAgc2l6ZXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgIHNpemVzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblxuICAgICAgdGhpcy5jYW1lcmEuYXNwZWN0ID0gc2l6ZXMud2lkdGggLyBzaXplcy5oZWlnaHQ7XG4gICAgICB0aGlzLmNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG5cbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0U2l6ZShzaXplcy53aWR0aCwgc2l6ZXMuaGVpZ2h0KTtcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyhNYXRoLm1pbih3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbywgMikpO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGNyZWF0ZVJlbmRlclRhcmdldCgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMubWVzaCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnJlbmRlclRhcmdldCA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlclRhcmdldChcbiAgICAgIHdpbmRvdy5pbm5lcldpZHRoLFxuICAgICAgd2luZG93LmlubmVySGVpZ2h0XG4gICAgKTtcblxuICAgIHRoaXMucmVuZGVyVGFyZ2V0Q2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKFxuICAgICAgNzUsXG4gICAgICB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCxcbiAgICAgIDAuMSxcbiAgICAgIDEwMDAwXG4gICAgKTtcbiAgICB0aGlzLnJlbmRlclRhcmdldENhbWVyYS5wb3NpdGlvbi56ID0gMzc1O1xuXG4gICAgdGhpcy5yZW5kZXJUYXJnZXRTY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xuXG4gICAgdGhpcy5yZW5kZXJUYXJnZXRTY2VuZS5hZGQodGhpcy5tZXNoKTtcbiAgICB0aGlzLmNyZWF0ZU1lc2godGhpcy5yZW5kZXJUYXJnZXQudGV4dHVyZSk7XG4gIH1cblxuICBwdWJsaWMgY3JlYXRlTWVzaCh0ZXh0dXJlOiBUSFJFRS5UZXh0dXJlKTogdm9pZCB7XG4gICAgY29uc3QgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuVG9ydXNHZW9tZXRyeSgxMCwgMywgMzAsIDEwMCk7XG5cbiAgICB0aGlzLnJlbmRlclRhcmdldE1hdGVyaWFsID0gbmV3IFRIUkVFLlJhd1NoYWRlck1hdGVyaWFsKHtcbiAgICAgIHZlcnRleFNoYWRlcixcbiAgICAgIGZyYWdtZW50U2hhZGVyLFxuICAgICAgc2lkZTogVEhSRUUuRnJvbnRTaWRlLFxuICAgICAgdW5pZm9ybXM6IHtcbiAgICAgICAgdV90aW1lOiBuZXcgVEhSRUUuVW5pZm9ybSgwKSxcbiAgICAgICAgdV90ZXh0dXJlOiBuZXcgVEhSRUUuVW5pZm9ybSh0ZXh0dXJlKSxcbiAgICAgICAgdV9saWdodFBvczoge1xuICAgICAgICAgIHZhbHVlOiBuZXcgVEhSRUUuVmVjdG9yMygwKS5jb3B5KHRoaXMuc3BvdExpZ2h0LnBvc2l0aW9uKVxuICAgICAgICB9LFxuICAgICAgICB1X3Nwb3RMaWdodENvbG9yOiB7XG4gICAgICAgICAgdmFsdWU6IG5ldyBUSFJFRS5Db2xvcigweGZmZmZmZilcbiAgICAgICAgfSxcbiAgICAgICAgdV9saWdodEludGVuc2l0eToge1xuICAgICAgICAgIHZhbHVlOiAwLjg3NVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgdHJhbnNwYXJlbnQ6IHRydWVcbiAgICB9KTtcblxuICAgIHRoaXMucmVuZGVyVGFyZ2V0TWVzaCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCB0aGlzLnJlbmRlclRhcmdldE1hdGVyaWFsKTtcblxuICAgIHRoaXMucmVuZGVyVGFyZ2V0TWVzaC5yb3RhdGlvbi5zZXQoMiwgMi44LCAwKTtcbiAgICB0aGlzLnNjZW5lLmFkZCh0aGlzLnJlbmRlclRhcmdldE1lc2gpO1xuICB9XG5cbiAgcHVibGljIGNyZWF0ZUZsb29yKCk6IHZvaWQge1xuICAgIGNvbnN0IG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsKHtcbiAgICAgIGNvbG9yOiAweDAwMDBmZlxuICAgIH0pO1xuXG4gICAgY29uc3QgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQ2lyY2xlR2VvbWV0cnkoNTAsIDUwKTtcbiAgICBjb25zdCBwbGFuZSA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbCk7XG5cbiAgICB0aGlzLnNjZW5lLmFkZChwbGFuZSk7XG4gICAgcGxhbmUucm90YXRpb24ueCA9IC1NYXRoLlBJIC8gMjtcbiAgICBwbGFuZS5wb3NpdGlvbi55ID0gLTE1LjU7XG4gICAgcGxhbmUucmVjZWl2ZVNoYWRvdyA9IHRydWU7XG4gIH1cblxuICBwdWJsaWMgYW5pbWF0ZSgpOiB2b2lkIHtcbiAgICBzdGF0cy5iZWdpbigpO1xuICAgIGNvbnN0IGVsYXBzZWRUaW1lID0gdGhpcy5jbG9jay5nZXRFbGFwc2VkVGltZSgpO1xuXG4gICAgdGhpcy5vcmJpdENvbnRyb2xzLnVwZGF0ZSgpO1xuXG4gICAgaWYgKFxuICAgICAgdGhpcy5yZW5kZXJUYXJnZXQgJiZcbiAgICAgIHRoaXMucmVuZGVyVGFyZ2V0U2NlbmUgJiZcbiAgICAgIHRoaXMucmVuZGVyVGFyZ2V0Q2FtZXJhICYmXG4gICAgICB0aGlzLnJlbmRlclRhcmdldE1lc2hcbiAgICApIHtcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0UmVuZGVyVGFyZ2V0KHRoaXMucmVuZGVyVGFyZ2V0KTtcbiAgICAgIHRoaXMucmVuZGVyZXIucmVuZGVyKHRoaXMucmVuZGVyVGFyZ2V0U2NlbmUsIHRoaXMucmVuZGVyVGFyZ2V0Q2FtZXJhKTtcblxuICAgICAgY29uc3QgbWVzaE1hdGVyaWFsID0gdGhpcy5yZW5kZXJUYXJnZXRNZXNoXG4gICAgICAgIC5tYXRlcmlhbCBhcyBUSFJFRS5SYXdTaGFkZXJNYXRlcmlhbDtcblxuICAgICAgbWVzaE1hdGVyaWFsLnVuaWZvcm1zLnVfdGltZS52YWx1ZSA9IGVsYXBzZWRUaW1lO1xuICAgICAgbWVzaE1hdGVyaWFsLnVuaWZvcm1zTmVlZFVwZGF0ZSA9IHRydWU7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFJlbmRlclRhcmdldChudWxsKTtcbiAgICB9XG5cbiAgICB0aGlzLnJlbmRlcmVyLnJlbmRlcih0aGlzLnNjZW5lLCB0aGlzLmNhbWVyYSk7XG4gICAgc3RhdHMuZW5kKCk7XG5cbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy5hbmltYXRlKCkpO1xuICB9XG59XG4iLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmggPSAoKSA9PiAoXCIwYmIwMzIxMzJkZjFjMTZiODU1OFwiKSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==