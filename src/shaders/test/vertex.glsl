uniform mat4 projectionMatrix; // clip box coordinates
uniform mat4 viewMatrix; // camera matrix
uniform mat4 modelMatrix; // mesh matrix
uniform vec2 uFrequency; // frequency of the wave
uniform float uTime; // time

attribute vec3 position;

void main()
{
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  modelPosition.z += sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
  modelPosition.z += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;

  gl_Position = projectionPosition;
}
