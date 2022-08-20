export const vertexShader = `
#define PI 3.14159265359

attribute vec3 a_position;
attribute vec4 a_randomNess;
uniform float uScale;
uniform float uTime;

varying float v_transparency;
varying vec2 v_uv;
varying vec3 v_position;
varying float v_strength;


void main(){
    float strength = 0.015 * distance(a_position, vec3(0.)) * a_randomNess.w;
    vec3 transformed = position.xyz + a_position * strength;
    
    float distortion = sin(a_randomNess.w * 2.5 * uTime) * 1.25;
    transformed += a_randomNess.xyz * distortion;

    gl_Position = projectionMatrix* modelViewMatrix * vec4(transformed, 1.);
    
    v_uv = uv;
    v_position = transformed;
    v_transparency = a_randomNess.w;
    v_strength = strength;
  }
`;

export const fragmentShader = `
uniform float uTime;
varying float v_transparency;
varying vec2 v_uv;
varying vec3 v_position;
varying float v_strength;

  void main(){
   
    vec3 color = vec3(0.0);
    gl_FragColor = vec4(color, 1.-v_strength);
  }
`;
