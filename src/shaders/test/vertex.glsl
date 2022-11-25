uniform vec2 uFrequency; // frequency of the wave
uniform float uTime; // time

varying vec2 vUv;
varying float vElevation;

void main()
{
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  float elevation = sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
  elevation += modelPosition.z += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;

  modelPosition.z += elevation;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;

  gl_Position = projectionPosition;
  vUv = uv;
  vElevation = elevation;
}
