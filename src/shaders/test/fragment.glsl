precision mediump float;

void main()
{
  // blue to purple gradient
  gl_FragColor = vec4(0.0, 1.0, 1.0, 1.0);
  gl_FragColor = mix(gl_FragColor, vec4(0.0, 0.0, 1.0, 1.0), gl_FragCoord.y / 480.0);

}
