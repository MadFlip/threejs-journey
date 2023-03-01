uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform vec3 uFogColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vElavation;
varying float vFogFactor;

void main()
{
    float mixStrength = (vElavation + uColorOffset) * uColorMultiplier;
    vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);
    gl_FragColor = vec4(color, 1.0);
    
    // Fog
    vec3 fogColor = mix(uFogColor, color, vFogFactor);
    gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, gl_FragColor.a);
}
