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
            loader.load(path, resolve);
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
/******/ 	__webpack_require__.h = () => ("63545be7d0ed1019ac75")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5iODFjYTQ5N2MwMmFiODgzZDA5MC5ob3QtdXBkYXRlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsbUdBQStCO0FBQy9CLG9IQUE2QjtBQUM3QixxSEFBbUM7QUFDbkMsNEZBQWdEO0FBQ2hELHFIQUFxRTtBQUNyRSxrR0FBb0Q7QUFDcEQsMEpBQTBFO0FBRTFFLElBQU0sS0FBSyxHQUFHLElBQUksa0JBQUssRUFBRSxDQUFDO0FBQzFCLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxtQ0FBbUM7QUFDdkQsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBRXJDO0lBZ0JFLGdCQUFZLE1BQWU7UUFDekIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUMvQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUNsQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksS0FBSyxDQUFDLGFBQWEsQ0FBQyxFQUFFLE1BQU0sVUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUNwRSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUM3RCxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xFLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQyxZQUFZLENBQUM7UUFDbEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFdEMsSUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDO1FBQ3BELElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDaEUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUUzQixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksNkJBQWEsQ0FDcEMsSUFBSSxDQUFDLE1BQU0sRUFDWCxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FDekIsQ0FBQztRQUNGLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFL0IsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ2pCLENBQUM7SUFFTSw4QkFBYSxHQUFwQixVQUFxQixJQUFZO1FBQy9CLElBQU0sT0FBTyxHQUFHLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU07WUFDMUMsSUFBTSxNQUFNLEdBQUcsSUFBSSxLQUFLLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDekMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDN0IsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLE9BQU8sQ0FBQztJQUNqQixDQUFDO0lBRU0sK0JBQWMsR0FBckI7UUFBQSxpQkFpQkM7UUFoQkMseUJBQVEsRUFBQyxlQUFlLEVBQUUsVUFBQyxLQUFVLEVBQUUsSUFBUztZQUM5QyxJQUFJLEtBQUssRUFBRTtnQkFDVCxPQUFPO2FBQ1I7WUFFRCxJQUFNLFFBQVEsR0FBRyxJQUFJLGtDQUFnQixDQUFDO2dCQUNwQyxJQUFJLEVBQUUsSUFBSTtnQkFDVixJQUFJLEVBQUUsTUFBTTthQUNiLENBQVEsQ0FBQztZQUVWLElBQU0sTUFBTSxHQUFHLElBQUksS0FBSyxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBRXpDLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLFVBQUMsT0FBTztnQkFDbkMsS0FBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDckMsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFTSwyQkFBVSxHQUFqQixVQUNFLFFBQThCLEVBQzlCLE9BQXNCO1FBRXRCLElBQU0sUUFBUSxHQUFHLElBQUksa0NBQWdCLENBQUM7WUFDcEMsSUFBSSxFQUFFLEtBQUssQ0FBQyxTQUFTO1lBQ3JCLFdBQVcsRUFBRSxJQUFJO1lBQ2pCLE9BQU8sRUFBRTtnQkFDUCxRQUFRLEVBQUUsS0FBSzthQUNoQjtZQUNELFVBQVUsRUFBRTtnQkFDVixXQUFXLEVBQUUsSUFBSTthQUNsQjtZQUNELFFBQVEsRUFBRTtnQkFDUixTQUFTO2dCQUNULFFBQVEsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUU7Z0JBQ3RCLE1BQU0sRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEVBQUU7Z0JBQzdDLElBQUksRUFBRSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUU7Z0JBQ3hCLFlBQVk7Z0JBQ1osVUFBVSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRTtnQkFDM0IsVUFBVSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRTtnQkFDM0IsVUFBVTtnQkFDVixZQUFZLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxFQUFFO2dCQUNuRCxrQkFBa0IsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUU7Z0JBQ2xDLGlCQUFpQixFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRTthQUNsQztTQUNGLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLFFBQVEsWUFBRSxRQUFRLFlBQUUsQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFFTSxtQ0FBa0IsR0FBekIsVUFBMEIsR0FHekI7UUFDUyxZQUFRLEdBQWUsR0FBRyxTQUFsQixFQUFFLFFBQVEsR0FBSyxHQUFHLFNBQVIsQ0FBUztRQUNuQyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUM3QyxNQUFNLENBQUMsVUFBVSxFQUNqQixNQUFNLENBQUMsV0FBVyxDQUNuQixDQUFDO1FBRUYsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUV6QyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDM0MsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsR0FBRyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFL0QsSUFBTSxJQUFJLEdBQUcsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUVoRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRU0sMkJBQVUsR0FBakIsVUFBa0IsT0FBc0I7UUFDdEMsSUFBTSxRQUFRLEdBQUcsSUFBSSxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFaEQsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDO1lBQ3RELFlBQVk7WUFDWixjQUFjO1lBQ2QsSUFBSSxFQUFFLEtBQUssQ0FBQyxTQUFTO1lBQ3JCLFFBQVEsRUFBRTtnQkFDUixNQUFNLEVBQUUsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDNUIsU0FBUyxFQUFFLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUM7YUFDdEM7U0FDRixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUU1RSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQy9DLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFTSx3QkFBTyxHQUFkO1FBQUEsaUJBNkJDO1FBNUJDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNkLElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7UUFFaEQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUU1QixTQUFTO1FBQ1QsSUFDRSxJQUFJLENBQUMsWUFBWTtZQUNqQixJQUFJLENBQUMsaUJBQWlCO1lBQ3RCLElBQUksQ0FBQyxrQkFBa0I7WUFDdkIsSUFBSSxDQUFDLGdCQUFnQixFQUNyQjtZQUNBLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNqRCxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7WUFFdEUsSUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLGdCQUFnQjtpQkFDdkMsUUFBbUMsQ0FBQztZQUV2QyxZQUFZLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsV0FBVyxDQUFDO1lBQ2pELFlBQVksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUM7WUFDdkMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDckM7UUFFRCxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM5QyxVQUFVO1FBQ1YsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBRVoscUJBQXFCLENBQUMsY0FBTSxZQUFJLENBQUMsT0FBTyxFQUFFLEVBQWQsQ0FBYyxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUNILGFBQUM7QUFBRCxDQUFDO0FBeEtZLHdCQUFNOzs7Ozs7Ozs7VUNabkIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wcm9qZWN0LWJvaWxlcnBsYXRlLy4vYXBwL3dlYmdsL2NhbnZhcy50cyIsIndlYnBhY2s6Ly9wcm9qZWN0LWJvaWxlcnBsYXRlL3dlYnBhY2svcnVudGltZS9nZXRGdWxsSGFzaCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tICd0aHJlZSc7XG5pbXBvcnQgU3RhdHMgZnJvbSAnc3RhdHMuanMnO1xuaW1wb3J0IGxvYWRGb250IGZyb20gJ2xvYWQtYm1mb250JztcbmltcG9ydCB7IHZlcnRleFNoYWRlciB9IGZyb20gJy4vc2hhZGVycy92ZXJ0ZXgnO1xuaW1wb3J0IHsgTVNERlRleHRHZW9tZXRyeSwgTVNERlRleHRNYXRlcmlhbCB9IGZyb20gJ3RocmVlLW1zZGYtdGV4dCc7XG5pbXBvcnQgeyBmcmFnbWVudFNoYWRlciB9IGZyb20gJy4vc2hhZGVycy9mcmFnbWVudCc7XG5pbXBvcnQgeyBPcmJpdENvbnRyb2xzIH0gZnJvbSAndGhyZWUvZXhhbXBsZXMvanNtL2NvbnRyb2xzL09yYml0Q29udHJvbHMnO1xuXG5jb25zdCBzdGF0cyA9IG5ldyBTdGF0cygpO1xuc3RhdHMuc2hvd1BhbmVsKDEpOyAvLyAwOiBmcHMsIDE6IG1zLCAyOiBtYiwgMys6IGN1c3RvbVxuZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzdGF0cy5kb20pO1xuXG5leHBvcnQgY2xhc3MgQ2FudmFzIHtcbiAgcHVibGljIGNhbWVyYTogVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmE7XG4gIHB1YmxpYyByZW5kZXJUYXJnZXRDYW1lcmE/OiBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYTtcbiAgcHVibGljIHJlbmRlcmVyOiBUSFJFRS5XZWJHTFJlbmRlcmVyO1xuICBwdWJsaWMgc2NlbmU6IFRIUkVFLlNjZW5lO1xuICBwdWJsaWMgcmVuZGVyVGFyZ2V0U2NlbmU/OiBUSFJFRS5TY2VuZTtcbiAgcHVibGljIHJlbmRlclRhcmdldE1hdGVyaWFsPzogVEhSRUUuUmF3U2hhZGVyTWF0ZXJpYWw7XG4gIHB1YmxpYyByZW5kZXJUYXJnZXRNZXNoPzogVEhSRUUuTWVzaDtcbiAgcHVibGljIHNwaGVyZT86IFRIUkVFLk1lc2g7XG4gIHB1YmxpYyBmbG9vcj86IFRIUkVFLk1lc2g7XG4gIHB1YmxpYyBjb3VudDogbnVtYmVyO1xuICBwdWJsaWMgY2xvY2s6IFRIUkVFLkNsb2NrO1xuICBwdWJsaWMgc3VyZmFjZT86IFRIUkVFLk1lc2g7XG4gIHB1YmxpYyByZW5kZXJUYXJnZXQ/OiBUSFJFRS5XZWJHTFJlbmRlclRhcmdldDtcbiAgcHVibGljIG9yYml0Q29udHJvbHM6IE9yYml0Q29udHJvbHM7XG5cbiAgY29uc3RydWN0b3IoY2FudmFzOiBFbGVtZW50KSB7XG4gICAgdGhpcy5zY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xuICAgIHRoaXMuY291bnQgPSA4MDAwO1xuICAgIHRoaXMucmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcih7IGNhbnZhcywgc3RlbmNpbDogZmFsc2UgfSk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyhNYXRoLm1pbih3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbywgMikpO1xuICAgIHRoaXMucmVuZGVyZXIub3V0cHV0RW5jb2RpbmcgPSBUSFJFRS5zUkdCRW5jb2Rpbmc7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRDbGVhckNvbG9yKDB4ZmZmZmZmKTtcblxuICAgIGNvbnN0IG5lYXIgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICB0aGlzLmNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSg3NSwgbmVhciwgMC4xLCAxMDAwMCk7XG4gICAgdGhpcy5jYW1lcmEucG9zaXRpb24ueiA9IDM7XG5cbiAgICB0aGlzLm9yYml0Q29udHJvbHMgPSBuZXcgT3JiaXRDb250cm9scyhcbiAgICAgIHRoaXMuY2FtZXJhLFxuICAgICAgdGhpcy5yZW5kZXJlci5kb21FbGVtZW50XG4gICAgKTtcbiAgICB0aGlzLmNsb2NrID0gbmV3IFRIUkVFLkNsb2NrKCk7XG5cbiAgICB0aGlzLmFuaW1hdGUoKTtcbiAgfVxuXG4gIHB1YmxpYyBsb2FkRm9udEF0bGFzKHBhdGg6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBsb2FkZXIgPSBuZXcgVEhSRUUuVGV4dHVyZUxvYWRlcigpO1xuICAgICAgbG9hZGVyLmxvYWQocGF0aCwgcmVzb2x2ZSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIHB1YmxpYyBoYW5kbGVMb2FkRm9udCgpOiB2b2lkIHtcbiAgICBsb2FkRm9udCgnLi9ob3Jpem9uLmZudCcsIChlcnJvcjogYW55LCBmb250OiBhbnkpID0+IHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGdlb21ldHJ5ID0gbmV3IE1TREZUZXh0R2VvbWV0cnkoe1xuICAgICAgICBmb250OiBmb250LFxuICAgICAgICB0ZXh0OiAndGVzdCdcbiAgICAgIH0pIGFzIGFueTtcblxuICAgICAgY29uc3QgbG9hZGVyID0gbmV3IFRIUkVFLlRleHR1cmVMb2FkZXIoKTtcblxuICAgICAgbG9hZGVyLmxvYWQoJy4vaG9yaXpvbi5wbmcnLCAodGV4dHVyZSkgPT4ge1xuICAgICAgICB0aGlzLmluaXRpYWxpemUoZ2VvbWV0cnksIHRleHR1cmUpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgaW5pdGlhbGl6ZShcbiAgICBnZW9tZXRyeTogVEhSRUUuQnVmZmVyR2VvbWV0cnksXG4gICAgdGV4dHVyZTogVEhSRUUuVGV4dHVyZVxuICApOiB2b2lkIHtcbiAgICBjb25zdCBtYXRlcmlhbCA9IG5ldyBNU0RGVGV4dE1hdGVyaWFsKHtcbiAgICAgIHNpZGU6IFRIUkVFLkZyb250U2lkZSxcbiAgICAgIHRyYW5zcGFyZW50OiB0cnVlLFxuICAgICAgZGVmaW5lczoge1xuICAgICAgICBJU19TTUFMTDogZmFsc2VcbiAgICAgIH0sXG4gICAgICBleHRlbnNpb25zOiB7XG4gICAgICAgIGRlcml2YXRpdmVzOiB0cnVlXG4gICAgICB9LFxuICAgICAgdW5pZm9ybXM6IHtcbiAgICAgICAgLy8gQ29tbW9uXG4gICAgICAgIHVPcGFjaXR5OiB7IHZhbHVlOiAxIH0sXG4gICAgICAgIHVDb2xvcjogeyB2YWx1ZTogbmV3IFRIUkVFLkNvbG9yKCcjZmZmZmZmJykgfSxcbiAgICAgICAgdU1hcDogeyB2YWx1ZTogdGV4dHVyZSB9LFxuICAgICAgICAvLyBSZW5kZXJpbmdcbiAgICAgICAgdVRocmVzaG9sZDogeyB2YWx1ZTogMC4wNSB9LFxuICAgICAgICB1QWxwaGFUZXN0OiB7IHZhbHVlOiAwLjAxIH0sXG4gICAgICAgIC8vIFN0cm9rZXNcbiAgICAgICAgdVN0cm9rZUNvbG9yOiB7IHZhbHVlOiBuZXcgVEhSRUUuQ29sb3IoJyNmZjAwMDAnKSB9LFxuICAgICAgICB1U3Ryb2tlT3V0c2V0V2lkdGg6IHsgdmFsdWU6IDAuMCB9LFxuICAgICAgICB1U3Ryb2tlSW5zZXRXaWR0aDogeyB2YWx1ZTogMC4zIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuY3JlYXRlUmVuZGVyVGFyZ2V0KHsgZ2VvbWV0cnksIG1hdGVyaWFsIH0pO1xuICB9XG5cbiAgcHVibGljIGNyZWF0ZVJlbmRlclRhcmdldChvcHQ6IHtcbiAgICBnZW9tZXRyeTogYW55O1xuICAgIG1hdGVyaWFsOiBUSFJFRS5TaGFkZXJNYXRlcmlhbDtcbiAgfSk6IHZvaWQge1xuICAgIGNvbnN0IHsgZ2VvbWV0cnksIG1hdGVyaWFsIH0gPSBvcHQ7XG4gICAgdGhpcy5yZW5kZXJUYXJnZXQgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJUYXJnZXQoXG4gICAgICB3aW5kb3cuaW5uZXJXaWR0aCxcbiAgICAgIHdpbmRvdy5pbm5lckhlaWdodFxuICAgICk7XG5cbiAgICB0aGlzLnJlbmRlclRhcmdldENhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSg0NSwgMSwgMC4xLCAxMDAwKTtcbiAgICB0aGlzLnJlbmRlclRhcmdldENhbWVyYS5wb3NpdGlvbi56ID0gMi41O1xuXG4gICAgdGhpcy5yZW5kZXJUYXJnZXRTY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xuICAgIHRoaXMucmVuZGVyVGFyZ2V0U2NlbmUuYmFja2dyb3VuZCA9IG5ldyBUSFJFRS5Db2xvcignI2ZmMDBmZicpO1xuXG4gICAgY29uc3QgdGV4dCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbCk7XG5cbiAgICB0aGlzLnJlbmRlclRhcmdldFNjZW5lLmFkZCh0ZXh0KTtcbiAgICB0aGlzLmNyZWF0ZU1lc2godGhpcy5yZW5kZXJUYXJnZXQudGV4dHVyZSk7XG4gIH1cblxuICBwdWJsaWMgY3JlYXRlTWVzaCh0ZXh0dXJlOiBUSFJFRS5UZXh0dXJlKTogdm9pZCB7XG4gICAgY29uc3QgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkoMSwgMSwgMSk7XG5cbiAgICB0aGlzLnJlbmRlclRhcmdldE1hdGVyaWFsID0gbmV3IFRIUkVFLlJhd1NoYWRlck1hdGVyaWFsKHtcbiAgICAgIHZlcnRleFNoYWRlcixcbiAgICAgIGZyYWdtZW50U2hhZGVyLFxuICAgICAgc2lkZTogVEhSRUUuRnJvbnRTaWRlLFxuICAgICAgdW5pZm9ybXM6IHtcbiAgICAgICAgdV90aW1lOiBuZXcgVEhSRUUuVW5pZm9ybSgwKSxcbiAgICAgICAgdV90ZXh0dXJlOiBuZXcgVEhSRUUuVW5pZm9ybSh0ZXh0dXJlKVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5yZW5kZXJUYXJnZXRNZXNoID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIHRoaXMucmVuZGVyVGFyZ2V0TWF0ZXJpYWwpO1xuXG4gICAgdGhpcy5yZW5kZXJUYXJnZXRNZXNoLnJvdGF0aW9uLnNldCgxMCwgMi41LCAwKTtcbiAgICB0aGlzLnNjZW5lLmFkZCh0aGlzLnJlbmRlclRhcmdldE1lc2gpO1xuICB9XG5cbiAgcHVibGljIGFuaW1hdGUoKTogdm9pZCB7XG4gICAgc3RhdHMuYmVnaW4oKTtcbiAgICBjb25zdCBlbGFwc2VkVGltZSA9IHRoaXMuY2xvY2suZ2V0RWxhcHNlZFRpbWUoKTtcblxuICAgIHRoaXMub3JiaXRDb250cm9scy51cGRhdGUoKTtcblxuICAgIC8vIFJlbmRlclxuICAgIGlmIChcbiAgICAgIHRoaXMucmVuZGVyVGFyZ2V0ICYmXG4gICAgICB0aGlzLnJlbmRlclRhcmdldFNjZW5lICYmXG4gICAgICB0aGlzLnJlbmRlclRhcmdldENhbWVyYSAmJlxuICAgICAgdGhpcy5yZW5kZXJUYXJnZXRNZXNoXG4gICAgKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFJlbmRlclRhcmdldCh0aGlzLnJlbmRlclRhcmdldCk7XG4gICAgICB0aGlzLnJlbmRlcmVyLnJlbmRlcih0aGlzLnJlbmRlclRhcmdldFNjZW5lLCB0aGlzLnJlbmRlclRhcmdldENhbWVyYSk7XG5cbiAgICAgIGNvbnN0IG1lc2hNYXRlcmlhbCA9IHRoaXMucmVuZGVyVGFyZ2V0TWVzaFxuICAgICAgICAubWF0ZXJpYWwgYXMgVEhSRUUuUmF3U2hhZGVyTWF0ZXJpYWw7XG5cbiAgICAgIG1lc2hNYXRlcmlhbC51bmlmb3Jtcy51X3RpbWUudmFsdWUgPSBlbGFwc2VkVGltZTtcbiAgICAgIG1lc2hNYXRlcmlhbC51bmlmb3Jtc05lZWRVcGRhdGUgPSB0cnVlO1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRSZW5kZXJUYXJnZXQobnVsbCk7XG4gICAgfVxuXG4gICAgdGhpcy5yZW5kZXJlci5yZW5kZXIodGhpcy5zY2VuZSwgdGhpcy5jYW1lcmEpO1xuICAgIC8vIEFuaW1hdGVcbiAgICBzdGF0cy5lbmQoKTtcblxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLmFuaW1hdGUoKSk7XG4gIH1cbn1cbiIsIl9fd2VicGFja19yZXF1aXJlX18uaCA9ICgpID0+IChcIjYzNTQ1YmU3ZDBlZDEwMTlhYzc1XCIpIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9