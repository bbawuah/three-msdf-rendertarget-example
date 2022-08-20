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
        this.createLight();
        this.animate();
        this.handleResize();
    };
    Canvas.prototype.createLight = function () {
        this.spotLight = new THREE.SpotLight(0xffffff, 0.5, 80, Math.PI * 0.25, 0.2, 3);
        this.spotLight.position.set(0, 10, 0);
        this.spotLight.castShadow = true;
        this.spotLight.shadow.camera.near = 0.5;
        this.spotLight.shadow.camera.far = 40;
        this.scene.add(this.spotLight);
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
        stats.begin();
        var elapsedTime = this.clock.getElapsedTime();
        this.orbitControls.update();
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
/******/ 	__webpack_require__.h = () => ("79b0028d269649386f3a")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5kNDc2MWY3OTczZGUzNTUwMjk2Mi5ob3QtdXBkYXRlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsbUdBQStCO0FBRS9CLG9IQUE2QjtBQUM3QixxSEFBbUM7QUFDbkMsNEZBQWdEO0FBQ2hELHFIQUFxRTtBQUNyRSxrR0FBb0Q7QUFDcEQsMEpBQTBFO0FBRTFFLElBQU0sS0FBSyxHQUFHLElBQUksa0JBQUssRUFBRSxDQUFDO0FBQzFCLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxtQ0FBbUM7QUFDdkQsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBRXJDLElBQU0sS0FBSyxHQUFHO0lBQ1osS0FBSyxFQUFFLE1BQU0sQ0FBQyxVQUFVO0lBQ3hCLE1BQU0sRUFBRSxNQUFNLENBQUMsV0FBVztDQUMzQixDQUFDO0FBRUY7SUFrQkUsZ0JBQVksTUFBZTtRQUN6QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQy9CLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxLQUFLLENBQUMsYUFBYSxDQUFDO1lBQ3RDLE1BQU07WUFDTixPQUFPLEVBQUUsS0FBSztZQUNkLEtBQUssRUFBRSxJQUFJO1NBQ1osQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDN0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsRSxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDO1FBQ2xELElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRXRDLElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQztRQUNwRCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2hFLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7UUFFNUIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLDZCQUFhLENBQ3BDLElBQUksQ0FBQyxNQUFNLEVBQ1gsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQ3pCLENBQUM7UUFDRixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRS9CLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFFTSxxQkFBSSxHQUFYO1FBQUEsaUJBNkJDO1FBNUJDLE9BQU8sQ0FBQyxHQUFHLENBQUM7WUFDVixJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQztZQUNqQyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQztTQUM3QixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsRUFBYTtnQkFBWixLQUFLLFVBQUUsSUFBSTtZQUNuQixJQUFNLFFBQVEsR0FBRyxJQUFJLGtDQUFnQixDQUFDO2dCQUNwQyxJQUFJLEVBQUUsVUFBVTtnQkFDaEIsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsS0FBSyxFQUFFLElBQUk7Z0JBQ1gsS0FBSyxFQUFFLFFBQVE7YUFDaEIsQ0FBQyxDQUFDO1lBRUgsSUFBTSxRQUFRLEdBQUcsSUFBSSxrQ0FBZ0IsRUFBRSxDQUFDO1lBQ3hDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7WUFDckMsUUFBUSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDO1lBRWpDLEtBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUMvQyxLQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUMvQixJQUFNLEtBQUssR0FBRyxDQUFDLENBQUM7WUFDaEIsS0FBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7WUFDNUQsS0FBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFFekMsS0FBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFDNUIsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDbkIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ25CLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNmLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBRU0sNEJBQVcsR0FBbEI7UUFDRSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksS0FBSyxDQUFDLFNBQVMsQ0FDbEMsUUFBUSxFQUNSLEdBQUcsRUFDSCxFQUFFLEVBQ0YsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLEVBQ2QsR0FBRyxFQUNILENBQUMsQ0FDRixDQUFDO1FBRUYsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO1FBQ3hDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBRXRDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRU0sOEJBQWEsR0FBcEIsVUFBcUIsSUFBWTtRQUMvQixJQUFNLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNO1lBQzFDLElBQU0sTUFBTSxHQUFHLElBQUksS0FBSyxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ3pDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFVBQUMsT0FBTztnQkFDeEIsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ25CLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLE9BQWlDLENBQUM7SUFDM0MsQ0FBQztJQUVNLHlCQUFRLEdBQWYsVUFBZ0IsSUFBWTtRQUMxQixJQUFNLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNO1lBQzFDLHlCQUFRLEVBQUMsSUFBSSxFQUFFLFVBQUMsS0FBVSxFQUFFLElBQVM7Z0JBQ25DLElBQUksS0FBSyxFQUFFO29CQUNULE9BQU87aUJBQ1I7Z0JBQ0QsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2hCLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLE9BQXdCLENBQUM7SUFDbEMsQ0FBQztJQUVNLDZCQUFZLEdBQW5CO1FBQUEsaUJBV0M7UUFWQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFO1lBQ2hDLEtBQUssQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQztZQUNoQyxLQUFLLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUM7WUFFbEMsS0FBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO1lBQ2hELEtBQUksQ0FBQyxNQUFNLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztZQUVyQyxLQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNqRCxLQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BFLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVNLG1DQUFrQixHQUF6QjtRQUNFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ2QsT0FBTztTQUNSO1FBQ0QsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FDN0MsTUFBTSxDQUFDLFVBQVUsRUFDakIsTUFBTSxDQUFDLFdBQVcsQ0FDbkIsQ0FBQztRQUVGLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FDbkQsRUFBRSxFQUNGLE1BQU0sQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLFdBQVcsRUFDdEMsR0FBRyxFQUNILEtBQUssQ0FDTixDQUFDO1FBQ0YsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBRXpDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUUzQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN0QyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVNLDJCQUFVLEdBQWpCLFVBQWtCLE9BQXNCO1FBQ3RDLElBQU0sUUFBUSxHQUFHLElBQUksS0FBSyxDQUFDLGFBQWEsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUV6RCxJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUM7WUFDdEQsWUFBWTtZQUNaLGNBQWM7WUFDZCxJQUFJLEVBQUUsS0FBSyxDQUFDLFNBQVM7WUFDckIsUUFBUSxFQUFFO2dCQUNSLE1BQU0sRUFBRSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUM1QixTQUFTLEVBQUUsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQzthQUN0QztZQUNELFdBQVcsRUFBRSxJQUFJO1NBQ2xCLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBRTVFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDOUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVNLDRCQUFXLEdBQWxCO1FBQ0UsSUFBTSxRQUFRLEdBQUcsSUFBSSxLQUFLLENBQUMsb0JBQW9CLENBQUM7WUFDOUMsS0FBSyxFQUFFLFFBQVE7U0FDaEIsQ0FBQyxDQUFDO1FBRUgsSUFBTSxRQUFRLEdBQUcsSUFBSSxLQUFLLENBQUMsY0FBYyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNsRCxJQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRWpELElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3RCLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDaEMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUM7UUFDekIsS0FBSyxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7SUFDN0IsQ0FBQztJQUVNLHdCQUFPLEdBQWQ7UUFBQSxpQkE2QkM7UUE1QkMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2QsSUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUVoRCxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRTVCLElBQ0UsSUFBSSxDQUFDLFlBQVk7WUFDakIsSUFBSSxDQUFDLGlCQUFpQjtZQUN0QixJQUFJLENBQUMsa0JBQWtCO1lBQ3ZCLElBQUksQ0FBQyxnQkFBZ0IsRUFDckI7WUFDQSxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDakQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBQ3RFLG9FQUFvRTtZQUVwRSxJQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsZ0JBQWdCO2lCQUN2QyxRQUFtQyxDQUFDO1lBRXZDLFlBQVksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxXQUFXLENBQUM7WUFDakQsWUFBWSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQztZQUN2QyxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNyQztRQUVELElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzlDLFVBQVU7UUFDVixLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7UUFFWixxQkFBcUIsQ0FBQyxjQUFNLFlBQUksQ0FBQyxPQUFPLEVBQUUsRUFBZCxDQUFjLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBQ0gsYUFBQztBQUFELENBQUM7QUF6Tlksd0JBQU07Ozs7Ozs7OztVQ2xCbkIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wcm9qZWN0LWJvaWxlcnBsYXRlLy4vYXBwL3dlYmdsL2NhbnZhcy50cyIsIndlYnBhY2s6Ly9wcm9qZWN0LWJvaWxlcnBsYXRlL3dlYnBhY2svcnVudGltZS9nZXRGdWxsSGFzaCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tICd0aHJlZSc7XG5pbXBvcnQgeyBGb250LCBGb250TG9hZGVyIH0gZnJvbSAndGhyZWUvZXhhbXBsZXMvanNtL2xvYWRlcnMvRm9udExvYWRlcic7XG5pbXBvcnQgU3RhdHMgZnJvbSAnc3RhdHMuanMnO1xuaW1wb3J0IGxvYWRGb250IGZyb20gJ2xvYWQtYm1mb250JztcbmltcG9ydCB7IHZlcnRleFNoYWRlciB9IGZyb20gJy4vc2hhZGVycy92ZXJ0ZXgnO1xuaW1wb3J0IHsgTVNERlRleHRHZW9tZXRyeSwgTVNERlRleHRNYXRlcmlhbCB9IGZyb20gJ3RocmVlLW1zZGYtdGV4dCc7XG5pbXBvcnQgeyBmcmFnbWVudFNoYWRlciB9IGZyb20gJy4vc2hhZGVycy9mcmFnbWVudCc7XG5pbXBvcnQgeyBPcmJpdENvbnRyb2xzIH0gZnJvbSAndGhyZWUvZXhhbXBsZXMvanNtL2NvbnRyb2xzL09yYml0Q29udHJvbHMnO1xuXG5jb25zdCBzdGF0cyA9IG5ldyBTdGF0cygpO1xuc3RhdHMuc2hvd1BhbmVsKDEpOyAvLyAwOiBmcHMsIDE6IG1zLCAyOiBtYiwgMys6IGN1c3RvbVxuZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzdGF0cy5kb20pO1xuXG5jb25zdCBzaXplcyA9IHtcbiAgd2lkdGg6IHdpbmRvdy5pbm5lcldpZHRoLFxuICBoZWlnaHQ6IHdpbmRvdy5pbm5lckhlaWdodFxufTtcblxuZXhwb3J0IGNsYXNzIENhbnZhcyB7XG4gIHB1YmxpYyBjYW1lcmE6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhO1xuICBwdWJsaWMgcmVuZGVyVGFyZ2V0Q2FtZXJhPzogVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmE7XG4gIHB1YmxpYyByZW5kZXJlcjogVEhSRUUuV2ViR0xSZW5kZXJlcjtcbiAgcHVibGljIHNjZW5lOiBUSFJFRS5TY2VuZTtcbiAgcHVibGljIHJlbmRlclRhcmdldFNjZW5lPzogVEhSRUUuU2NlbmU7XG4gIHB1YmxpYyByZW5kZXJUYXJnZXRNYXRlcmlhbD86IFRIUkVFLlJhd1NoYWRlck1hdGVyaWFsO1xuICBwdWJsaWMgcmVuZGVyVGFyZ2V0TWVzaD86IFRIUkVFLk1lc2g7XG4gIHB1YmxpYyBzcGhlcmU/OiBUSFJFRS5NZXNoO1xuICBwdWJsaWMgZmxvb3I/OiBUSFJFRS5NZXNoO1xuICBwdWJsaWMgbWVzaD86IFRIUkVFLk1lc2g7XG4gIHB1YmxpYyBjb3VudDogbnVtYmVyO1xuICBwdWJsaWMgY2xvY2s6IFRIUkVFLkNsb2NrO1xuICBwdWJsaWMgc3VyZmFjZT86IFRIUkVFLk1lc2g7XG4gIHB1YmxpYyByZW5kZXJUYXJnZXQ/OiBUSFJFRS5XZWJHTFJlbmRlclRhcmdldDtcbiAgcHVibGljIG9yYml0Q29udHJvbHM6IE9yYml0Q29udHJvbHM7XG4gIHB1YmxpYyBzcG90TGlnaHQ6IFRIUkVFLlNwb3RMaWdodDtcblxuICBjb25zdHJ1Y3RvcihjYW52YXM6IEVsZW1lbnQpIHtcbiAgICB0aGlzLnNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG4gICAgdGhpcy5jb3VudCA9IDgwMDA7XG4gICAgdGhpcy5yZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKHtcbiAgICAgIGNhbnZhcyxcbiAgICAgIHN0ZW5jaWw6IGZhbHNlLFxuICAgICAgYWxwaGE6IHRydWVcbiAgICB9KTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRQaXhlbFJhdGlvKE1hdGgubWluKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvLCAyKSk7XG4gICAgdGhpcy5yZW5kZXJlci5vdXRwdXRFbmNvZGluZyA9IFRIUkVFLnNSR0JFbmNvZGluZztcbiAgICB0aGlzLnJlbmRlcmVyLnNldENsZWFyQ29sb3IoMHgwMDAwMDApO1xuXG4gICAgY29uc3QgbmVhciA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIHRoaXMuY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDc1LCBuZWFyLCAwLjEsIDEwMDAwKTtcbiAgICB0aGlzLmNhbWVyYS5wb3NpdGlvbi56ID0gNDA7XG5cbiAgICB0aGlzLm9yYml0Q29udHJvbHMgPSBuZXcgT3JiaXRDb250cm9scyhcbiAgICAgIHRoaXMuY2FtZXJhLFxuICAgICAgdGhpcy5yZW5kZXJlci5kb21FbGVtZW50XG4gICAgKTtcbiAgICB0aGlzLmNsb2NrID0gbmV3IFRIUkVFLkNsb2NrKCk7XG5cbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuXG4gIHB1YmxpYyBpbml0KCk6IHZvaWQge1xuICAgIFByb21pc2UuYWxsKFtcbiAgICAgIHRoaXMubG9hZEZvbnRBdGxhcygnaG9yaXpvbi5wbmcnKSxcbiAgICAgIHRoaXMubG9hZEZvbnQoJ2hvcml6b24uZm50JylcbiAgICBdKS50aGVuKChbYXRsYXMsIGZvbnRdKSA9PiB7XG4gICAgICBjb25zdCBnZW9tZXRyeSA9IG5ldyBNU0RGVGV4dEdlb21ldHJ5KHtcbiAgICAgICAgdGV4dDogJ0luZmluaXR5JyxcbiAgICAgICAgZm9udDogZm9udCxcbiAgICAgICAgd2lkdGg6IDEwMDAsXG4gICAgICAgIGFsaWduOiAnY2VudGVyJ1xuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IG1hdGVyaWFsID0gbmV3IE1TREZUZXh0TWF0ZXJpYWwoKTtcbiAgICAgIG1hdGVyaWFsLnVuaWZvcm1zLnVNYXAudmFsdWUgPSBhdGxhcztcbiAgICAgIG1hdGVyaWFsLnNpZGUgPSBUSFJFRS5Eb3VibGVTaWRlO1xuXG4gICAgICB0aGlzLm1lc2ggPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICAgICAgdGhpcy5tZXNoLnJvdGF0aW9uLnggPSBNYXRoLlBJO1xuICAgICAgY29uc3Qgc2NhbGUgPSAzO1xuICAgICAgdGhpcy5tZXNoLnBvc2l0aW9uLnggPSAoLWdlb21ldHJ5LmxheW91dC53aWR0aCAvIDIpICogc2NhbGU7XG4gICAgICB0aGlzLm1lc2guc2NhbGUuc2V0KHNjYWxlLCBzY2FsZSwgc2NhbGUpO1xuXG4gICAgICB0aGlzLmNyZWF0ZVJlbmRlclRhcmdldCgpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5jcmVhdGVGbG9vcigpO1xuICAgIHRoaXMuY3JlYXRlTGlnaHQoKTtcbiAgICB0aGlzLmFuaW1hdGUoKTtcbiAgICB0aGlzLmhhbmRsZVJlc2l6ZSgpO1xuICB9XG5cbiAgcHVibGljIGNyZWF0ZUxpZ2h0KCk6IHZvaWQge1xuICAgIHRoaXMuc3BvdExpZ2h0ID0gbmV3IFRIUkVFLlNwb3RMaWdodChcbiAgICAgIDB4ZmZmZmZmLFxuICAgICAgMC41LFxuICAgICAgODAsXG4gICAgICBNYXRoLlBJICogMC4yNSxcbiAgICAgIDAuMixcbiAgICAgIDNcbiAgICApO1xuXG4gICAgdGhpcy5zcG90TGlnaHQucG9zaXRpb24uc2V0KDAsIDEwLCAwKTtcbiAgICB0aGlzLnNwb3RMaWdodC5jYXN0U2hhZG93ID0gdHJ1ZTtcbiAgICB0aGlzLnNwb3RMaWdodC5zaGFkb3cuY2FtZXJhLm5lYXIgPSAwLjU7XG4gICAgdGhpcy5zcG90TGlnaHQuc2hhZG93LmNhbWVyYS5mYXIgPSA0MDtcblxuICAgIHRoaXMuc2NlbmUuYWRkKHRoaXMuc3BvdExpZ2h0KTtcbiAgfVxuXG4gIHB1YmxpYyBsb2FkRm9udEF0bGFzKHBhdGg6IHN0cmluZyk6IFByb21pc2U8VEhSRUUuVGV4dHVyZT4ge1xuICAgIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBsb2FkZXIgPSBuZXcgVEhSRUUuVGV4dHVyZUxvYWRlcigpO1xuICAgICAgbG9hZGVyLmxvYWQocGF0aCwgKHRleHR1cmUpID0+IHtcbiAgICAgICAgcmVzb2x2ZSh0ZXh0dXJlKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHByb21pc2UgYXMgUHJvbWlzZTxUSFJFRS5UZXh0dXJlPjtcbiAgfVxuXG4gIHB1YmxpYyBsb2FkRm9udChwYXRoOiBzdHJpbmcpOiBQcm9taXNlPEZvbnQ+IHtcbiAgICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgbG9hZEZvbnQocGF0aCwgKGVycm9yOiBhbnksIGZvbnQ6IGFueSkgPT4ge1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmVzb2x2ZShmb250KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHByb21pc2UgYXMgUHJvbWlzZTxGb250PjtcbiAgfVxuXG4gIHB1YmxpYyBoYW5kbGVSZXNpemUoKTogdm9pZCB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcbiAgICAgIHNpemVzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICBzaXplcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cbiAgICAgIHRoaXMuY2FtZXJhLmFzcGVjdCA9IHNpemVzLndpZHRoIC8gc2l6ZXMuaGVpZ2h0O1xuICAgICAgdGhpcy5jYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuXG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFNpemUoc2l6ZXMud2lkdGgsIHNpemVzLmhlaWdodCk7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFBpeGVsUmF0aW8oTWF0aC5taW4od2luZG93LmRldmljZVBpeGVsUmF0aW8sIDIpKTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBjcmVhdGVSZW5kZXJUYXJnZXQoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLm1lc2gpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5yZW5kZXJUYXJnZXQgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJUYXJnZXQoXG4gICAgICB3aW5kb3cuaW5uZXJXaWR0aCxcbiAgICAgIHdpbmRvdy5pbm5lckhlaWdodFxuICAgICk7XG5cbiAgICB0aGlzLnJlbmRlclRhcmdldENhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYShcbiAgICAgIDc1LFxuICAgICAgd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQsXG4gICAgICAwLjEsXG4gICAgICAxMDAwMFxuICAgICk7XG4gICAgdGhpcy5yZW5kZXJUYXJnZXRDYW1lcmEucG9zaXRpb24ueiA9IDYwMDtcblxuICAgIHRoaXMucmVuZGVyVGFyZ2V0U2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcblxuICAgIHRoaXMucmVuZGVyVGFyZ2V0U2NlbmUuYWRkKHRoaXMubWVzaCk7XG4gICAgdGhpcy5jcmVhdGVNZXNoKHRoaXMucmVuZGVyVGFyZ2V0LnRleHR1cmUpO1xuICB9XG5cbiAgcHVibGljIGNyZWF0ZU1lc2godGV4dHVyZTogVEhSRUUuVGV4dHVyZSk6IHZvaWQge1xuICAgIGNvbnN0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLlRvcnVzR2VvbWV0cnkoMTAsIDMsIDE2LCAxMDApO1xuXG4gICAgdGhpcy5yZW5kZXJUYXJnZXRNYXRlcmlhbCA9IG5ldyBUSFJFRS5SYXdTaGFkZXJNYXRlcmlhbCh7XG4gICAgICB2ZXJ0ZXhTaGFkZXIsXG4gICAgICBmcmFnbWVudFNoYWRlcixcbiAgICAgIHNpZGU6IFRIUkVFLkZyb250U2lkZSxcbiAgICAgIHVuaWZvcm1zOiB7XG4gICAgICAgIHVfdGltZTogbmV3IFRIUkVFLlVuaWZvcm0oMCksXG4gICAgICAgIHVfdGV4dHVyZTogbmV3IFRIUkVFLlVuaWZvcm0odGV4dHVyZSlcbiAgICAgIH0sXG4gICAgICB0cmFuc3BhcmVudDogdHJ1ZVxuICAgIH0pO1xuXG4gICAgdGhpcy5yZW5kZXJUYXJnZXRNZXNoID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIHRoaXMucmVuZGVyVGFyZ2V0TWF0ZXJpYWwpO1xuXG4gICAgdGhpcy5yZW5kZXJUYXJnZXRNZXNoLnJvdGF0aW9uLnNldCgyLCAyLjgsIDApO1xuICAgIHRoaXMuc2NlbmUuYWRkKHRoaXMucmVuZGVyVGFyZ2V0TWVzaCk7XG4gIH1cblxuICBwdWJsaWMgY3JlYXRlRmxvb3IoKTogdm9pZCB7XG4gICAgY29uc3QgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwoe1xuICAgICAgY29sb3I6IDB4ZmZmZmZmXG4gICAgfSk7XG5cbiAgICBjb25zdCBnZW9tZXRyeSA9IG5ldyBUSFJFRS5DaXJjbGVHZW9tZXRyeSg1MCwgNTApO1xuICAgIGNvbnN0IHBsYW5lID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcblxuICAgIHRoaXMuc2NlbmUuYWRkKHBsYW5lKTtcbiAgICBwbGFuZS5yb3RhdGlvbi54ID0gLU1hdGguUEkgLyAyO1xuICAgIHBsYW5lLnBvc2l0aW9uLnkgPSAtMTUuNTtcbiAgICBwbGFuZS5yZWNlaXZlU2hhZG93ID0gdHJ1ZTtcbiAgfVxuXG4gIHB1YmxpYyBhbmltYXRlKCk6IHZvaWQge1xuICAgIHN0YXRzLmJlZ2luKCk7XG4gICAgY29uc3QgZWxhcHNlZFRpbWUgPSB0aGlzLmNsb2NrLmdldEVsYXBzZWRUaW1lKCk7XG5cbiAgICB0aGlzLm9yYml0Q29udHJvbHMudXBkYXRlKCk7XG5cbiAgICBpZiAoXG4gICAgICB0aGlzLnJlbmRlclRhcmdldCAmJlxuICAgICAgdGhpcy5yZW5kZXJUYXJnZXRTY2VuZSAmJlxuICAgICAgdGhpcy5yZW5kZXJUYXJnZXRDYW1lcmEgJiZcbiAgICAgIHRoaXMucmVuZGVyVGFyZ2V0TWVzaFxuICAgICkge1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRSZW5kZXJUYXJnZXQodGhpcy5yZW5kZXJUYXJnZXQpO1xuICAgICAgdGhpcy5yZW5kZXJlci5yZW5kZXIodGhpcy5yZW5kZXJUYXJnZXRTY2VuZSwgdGhpcy5yZW5kZXJUYXJnZXRDYW1lcmEpO1xuICAgICAgLy8gdGhpcy5yZW5kZXJlci5jbGVhclRhcmdldCh0aGlzLnJlbmRlclRhcmdldCwgdHJ1ZSwgZmFsc2UsIGZhbHNlKTtcblxuICAgICAgY29uc3QgbWVzaE1hdGVyaWFsID0gdGhpcy5yZW5kZXJUYXJnZXRNZXNoXG4gICAgICAgIC5tYXRlcmlhbCBhcyBUSFJFRS5SYXdTaGFkZXJNYXRlcmlhbDtcblxuICAgICAgbWVzaE1hdGVyaWFsLnVuaWZvcm1zLnVfdGltZS52YWx1ZSA9IGVsYXBzZWRUaW1lO1xuICAgICAgbWVzaE1hdGVyaWFsLnVuaWZvcm1zTmVlZFVwZGF0ZSA9IHRydWU7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFJlbmRlclRhcmdldChudWxsKTtcbiAgICB9XG5cbiAgICB0aGlzLnJlbmRlcmVyLnJlbmRlcih0aGlzLnNjZW5lLCB0aGlzLmNhbWVyYSk7XG4gICAgLy8gQW5pbWF0ZVxuICAgIHN0YXRzLmVuZCgpO1xuXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMuYW5pbWF0ZSgpKTtcbiAgfVxufVxuIiwiX193ZWJwYWNrX3JlcXVpcmVfXy5oID0gKCkgPT4gKFwiNzliMDAyOGQyNjk2NDkzODZmM2FcIikiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=