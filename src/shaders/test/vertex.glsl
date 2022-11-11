uniform mat4 projectionMatrix; // clip box coordinates
uniform mat4 viewMatrix; // camera matrix
uniform mat4 modelMatrix; // mesh matrix

attribute vec3 position;
attribute float aRandom;

varying float vRandom;

void main()
{
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  // modelPosition.z += sin(modelPosition.x * 10.0) * 0.1;
  modelPosition.z += aRandom * 0.1;
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;

  gl_Position = projectionPosition;
  // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

  vRandom = aRandom;
}
