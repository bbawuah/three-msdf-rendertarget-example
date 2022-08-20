import { Canvas } from './webgl/canvas';
import * as THREE from 'three';

window.THREE = THREE;

const canvas = document.querySelector('.webgl-canvas');

init();

function init() {
  if (!canvas) {
    return;
  }

  new Canvas(canvas);
}
