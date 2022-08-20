import * as THREE from 'three';
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import Stats from 'stats.js';
import loadFont from 'load-bmfont';
import { vertexShader } from './shaders/vertex';
import { MSDFTextGeometry, MSDFTextMaterial } from 'three-msdf-text';
import { fragmentShader } from './shaders/fragment';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const stats = new Stats();
stats.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

export class Canvas {
  public camera: THREE.PerspectiveCamera;
  public renderTargetCamera?: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public scene: THREE.Scene;
  public renderTargetScene?: THREE.Scene;
  public renderTargetMaterial?: THREE.RawShaderMaterial;
  public renderTargetMesh?: THREE.Mesh;
  public sphere?: THREE.Mesh;
  public floor?: THREE.Mesh;
  public mesh?: THREE.Mesh;
  public count: number;
  public clock: THREE.Clock;
  public surface?: THREE.Mesh;
  public renderTarget?: THREE.WebGLRenderTarget;
  public orbitControls: OrbitControls;
  public spotLight: THREE.SpotLight;
  public ambientLight: THREE.AmbientLight;

  constructor(canvas: Element) {
    this.scene = new THREE.Scene();
    this.count = 8000;
    this.renderer = new THREE.WebGLRenderer({
      canvas
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.setClearColor(0x0000ff);

    this.ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(this.ambientLight);

    this.spotLight = new THREE.SpotLight(
      0xffffff,
      17,
      80,
      Math.PI * 0.25,
      0.2,
      3
    );

    this.spotLight.position.set(0, 10, 0);
    this.spotLight.castShadow = true;
    this.spotLight.shadow.camera.near = 0.5;
    this.spotLight.shadow.camera.far = 40;

    this.scene.add(this.spotLight);

    const near = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(75, near, 0.1, 10000);
    this.camera.position.z = 40;

    this.orbitControls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );

    this.orbitControls.enableZoom = false;
    this.clock = new THREE.Clock();

    this.init();
  }

  public init(): void {
    Promise.all([
      this.loadFontAtlas('horizon.png'),
      this.loadFont('horizon.fnt')
    ]).then(([atlas, font]) => {
      const geometry = new MSDFTextGeometry({
        text: 'Infinity',
        font: font,
        width: 1000,
        align: 'center'
      });

      const material = new MSDFTextMaterial();
      material.uniforms.uMap.value = atlas;
      material.side = THREE.DoubleSide;

      this.mesh = new THREE.Mesh(geometry, material);
      this.mesh.rotation.x = Math.PI;
      const scale = 3;
      this.mesh.position.x = (-geometry.layout.width / 2) * scale;
      this.mesh.scale.set(scale, scale, scale);

      this.createRenderTarget();
    });

    this.createFloor();
    this.animate();
    this.handleResize();
  }
  public loadFontAtlas(path: string): Promise<THREE.Texture> {
    const promise = new Promise((resolve, reject) => {
      const loader = new THREE.TextureLoader();
      loader.load(
        path,
        (texture) => {
          resolve(texture);
        },
        () => {
          console.log('progress');
        },
        (event) => {
          reject(event);
        }
      );
    });

    return promise as Promise<THREE.Texture>;
  }

  public loadFont(path: string): Promise<Font> {
    const promise = new Promise((resolve, reject) => {
      loadFont(path, (error: any, font: any) => {
        if (error) {
          reject();
        }
        resolve(font);
      });
    });

    return promise as Promise<Font>;
  }

  public handleResize(): void {
    window.addEventListener('resize', () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      this.camera.aspect = sizes.width / sizes.height;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(sizes.width, sizes.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
  }

  public createRenderTarget(): void {
    if (!this.mesh) {
      return;
    }
    this.renderTarget = new THREE.WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight
    );

    this.renderTargetCamera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    this.renderTargetCamera.position.z = 375;

    this.renderTargetScene = new THREE.Scene();

    this.renderTargetScene.add(this.mesh);
    this.createMesh(this.renderTarget.texture);
  }

  public createMesh(texture: THREE.Texture): void {
    const geometry = new THREE.TorusGeometry(10, 3, 30, 100);

    this.renderTargetMaterial = new THREE.RawShaderMaterial({
      vertexShader,
      fragmentShader,
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
  }

  public createFloor(): void {
    const material = new THREE.MeshStandardMaterial({
      color: 0x0000ff
    });

    const geometry = new THREE.CircleGeometry(50, 50);
    const plane = new THREE.Mesh(geometry, material);

    this.scene.add(plane);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -15.5;
    plane.receiveShadow = true;
  }

  public animate(): void {
    stats.begin();
    const elapsedTime = this.clock.getElapsedTime();

    this.orbitControls.update();

    if (
      this.renderTarget &&
      this.renderTargetScene &&
      this.renderTargetCamera &&
      this.renderTargetMesh
    ) {
      this.renderer.setRenderTarget(this.renderTarget);
      this.renderer.render(this.renderTargetScene, this.renderTargetCamera);

      const meshMaterial = this.renderTargetMesh
        .material as THREE.RawShaderMaterial;

      meshMaterial.uniforms.u_time.value = elapsedTime;
      meshMaterial.uniformsNeedUpdate = true;
      this.renderer.setRenderTarget(null);
    }

    this.renderer.render(this.scene, this.camera);
    stats.end();

    requestAnimationFrame(() => this.animate());
  }
}
