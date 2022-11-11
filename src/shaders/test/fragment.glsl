precision mediump float;

varying float vRandom;

void main()
{
  // blue to purple gradient
  gl_FragColor = vec4(0.0, vRandom, 1.0, 1.0);
  gl_FragColor = mix(gl_FragColor, vec4(vRandom, 0.0, 1.0, 1.0), gl_FragCoord.y / 480.0);

}
