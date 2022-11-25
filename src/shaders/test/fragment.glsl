#define PI 3.1415926535897932384626433832795

varying vec2 vUv;

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

vec2 rotate(vec2 uv, float rotation, vec2 mid) {
    return vec2(
      cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
      cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}

//	Classic Perlin 2D Noise 
//	by Stefan Gustavson
//
vec4 permute(vec4 x)
{
    return mod(((x*34.0)+1.0)*x, 289.0);
}

vec2 fade(vec2 t)
{
    return t*t*t*(t*(t*6.0-15.0)+10.0);
}

float cnoise(vec2 P)
{
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x,gy.x);
    vec2 g10 = vec2(gx.y,gy.y);
    vec2 g01 = vec2(gx.z,gy.z);
    vec2 g11 = vec2(gx.w,gy.w);
    vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}

void main()
{
    // pattern 1: using the texture coordinates to apply gradient
    // gl_FragColor = vec4(vUv, 1.0, 1.0);
 
    // pattern 2: red and green gradient
    // gl_FragColor = vec4(vUv, 0.0, 1.0);

    // pattern 3: black and white gradient X
    // float strength = vUv.x;
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // pattern 4: black and white gradient Y
    // float strength = vUv.y;
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // pattern 5: black and white inverted gradient Y
    // float strength = 1.0 - vUv.y;
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // pattern 6: black and white gradient, small black in the bottom
    // float strength = vUv.y * 10.0;
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // pattern 7: black and white gradient as blinds
    // float strength = vUv.y * 10.0;
    // strength = mod(strength, 1.0);
    // or
    // strength = fract(strength);
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // pattern 8: black and white gradient lines
    // float strength = vUv.y * 10.0;
    // strength = mod(strength, 1.0);
    // strength = step(0.5, strength);
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // pattern 9: black and white gradient lines narrow
    // float strength = mod(vUv.y * 10.0, 1.0);
    // strength = step(0.8, strength);
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // pattern 10: black and white gradient lines narrow vertical
    // float strength = mod(vUv.x * 10.0, 1.0);
    // strength = step(0.8, strength);
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // pattern 11: black and white gradient lines cross
    // float strength = step(0.9,  mod(vUv.x * 10.0, 1.0));
    // strength += step(0.9,  mod(vUv.y * 10.0, 1.0));
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // pattern 12: mesh of dots
    // float strength = step(0.9,  mod(vUv.x * 10.0, 1.0));
    // strength *= step(0.9,  mod(vUv.y * 10.0, 1.0));
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // pattern 13: dashed lines
    // float strength = step(0.4,  mod(vUv.x * 10.0, 1.0));
    // strength *= step(0.8,  mod(vUv.y * 10.0, 1.0));
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // pattern 14: pattern of corners
    // float barX = step(0.4,  mod(vUv.x * 10.0, 1.0));
    // barX *= step(0.8,  mod(vUv.y * 10.0, 1.0));
    // float barY = step(0.4,  mod(vUv.y * 10.0, 1.0));
    // barY *= step(0.8,  mod(vUv.x * 10.0, 1.0));
    // float strength = barX + barY;
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // pattern 15: pattern of crosses
    // float barX = step(0.4,  mod(vUv.x * 10.0, 1.0));
    // barX *= step(0.8,  mod(vUv.y * 10.0 + 0.2, 1.0));
    // float barY = step(0.4,  mod(vUv.y * 10.0, 1.0));
    // barY *= step(0.8,  mod(vUv.x * 10.0 + 0.2, 1.0));
    // float strength = barX + barY;
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // pattern 16: mirrored gradient
    // float strength = vUv.x - 0.5;
    // strength = abs(strength);
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // pattern 17: mirrored gradient 2 axes
    // float strength = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // pattern 18: mirrored gradient 2 axes angled
    // float strength = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // pattern 19: black square in the middle
    // float strength = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // pattern 20: black square in the middle, with a border
    // float strength1 = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    // float strength2 = 1.0 - step(0.25, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    // float strength = strength1 * strength2;
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // pattern 21: steps shades of gray
    // float strength = vUv.x;
    // strength = floor(strength * 10.0) / 10.0;
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // pattern 22: squares shades of gray
    // float barY = vUv.y;
    // barY = floor(barY * 10.0) / 20.0;
    // float barX = vUv.x;
    // barX = floor(barX * 10.0) / 20.0;
    // float strength = barX + barY;
    // gl_FragColor = vec4(strength , strength, strength, 1);
    // or
    // float strength = floor(vUv.x * 10.0) / 10.0;
    // strength *= floor(vUv.y * 10.0) / 10.0;
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // patern 23: tv noise (random)
    // float strength = random(vUv);
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // pattern 24: random shades of gray grid
    // vec2 gridUv = vec2(
    //   floor(vUv.x * 10.0) / 10.0,
    //   floor(vUv.y * 10.0) / 10.0
    // );
    // float strength = random(gridUv);
    // or
    // float strength = random(floor(vUv * 10.0));
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // pattern 25: random shades of gray grid inclined
    // vec2 gridUv = vec2(
    //   floor(vUv.x * 10.0) / 10.0,
    //   floor(vUv.y * 10.0 + vUv.x * 4.0) / 10.0
    // );
    // float strength = random(gridUv);
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // pattern 26: gradient black and white 1 corner
    // float strength = length(vUv);
    // gl_FragColor = vec4(strength, strength, strength, 1);
    
    // pattern 27: gradient black and white 1 using distance
    // float strength = distance(vUv, vec2(0.0, 0.0));
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // pattern 28
    // float strength = 1.0 - distance(vUv, vec2(0.5));
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // pattern 29
    // float strength = 0.015 / distance(vUv, vec2(0.5, 0.5));
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // pattern 30
    // vec2 lightUv = vec2(
    //   vUv.x * 0.5 + 0.25, 
    //   vUv.y * 3.0 - 1.0
    //   );
    // float strength = 0.08 / distance(lightUv, vec2(0.5));
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // pattern 31
    // vec2 lightUvX = vec2(vUv.x * 0.1 + 0.45, vUv.y * 0.5 + 0.25);
    // float lightX = 0.015 / distance(lightUvX, vec2(0.5));
    // vec2 lightUvY = vec2(vUv.y * 0.1 + 0.45, vUv.x * 0.5 + 0.25);
    // float lightY = 0.015 / distance(lightUvY, vec2(0.5));
    // float strength = lightX * lightY;
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // pattern 32
    // vec2 rotatedUv = rotate(vUv, PI * 0.25, vec2(0.5));
    // vec2 lightUvX = vec2(rotatedUv.x * 0.1 + 0.45, rotatedUv.y * 0.5 + 0.25);
    // float lightX = 0.015 / distance(lightUvX, vec2(0.5));
    // vec2 lightUvY = vec2(rotatedUv.y * 0.1 + 0.45, rotatedUv.x * 0.5 + 0.25);
    // float lightY = 0.015 / distance(lightUvY, vec2(0.5));
    // float strength = lightX * lightY;
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // pattern 33
    // float strength = distance(vUv, vec2(0.5));
    // strength = step(0.25, strength);
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // pattern 34
    // float strength = abs(distance(vUv, vec2(0.5)) - 0.25);
    // gl_FragColor = vec4(strength, strength, strength, 1);


    // pattern 35
    // float strength = abs(distance(vUv, vec2(0.5)) - 0.25);
    // strength = step(0.01, strength);
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // pattern 36
    // float strength = abs(distance(vUv, vec2(0.5)) - 0.25);
    // strength = 1.0 - step(0.01, strength);
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // pattern 37
    // vec2 wavedUv = vec2(
    //   vUv.x,
    //   vUv.y + sin(vUv.x * 30.0) * 0.1
    // );
    // float strength = abs(distance(wavedUv, vec2(0.5)) - 0.25);
    // strength = 1.0 - step(0.01, strength);
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // pattern 38
    // vec2 wavedUv = vec2(
    //   vUv.x + sin(vUv.y * 30.0) * 0.1,
    //   vUv.y + sin(vUv.x * 30.0) * 0.1
    // );
    // float strength = abs(distance(wavedUv, vec2(0.5)) - 0.25);
    // strength = 1.0 - step(0.01, strength);
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // pattern 39
    //  vec2 wavedUv = vec2(
    //   vUv.x + sin(vUv.y * 110.0) * 0.1,
    //   vUv.y + sin(vUv.x * 110.0) * 0.1
    // );
    // float strength = abs(distance(wavedUv, vec2(0.5)) - 0.25);
    // strength = 1.0 - step(0.01, strength);
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // pattern 40
    // float angle = atan(vUv.x, vUv.y);
    // float strength = angle;
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // pattern 41
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // float strength = angle;
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // pattern 42
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // angle /= PI * 2.0;
    // angle += 0.5;
    // float strength = angle;
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // pattern 43
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // angle /= PI * 2.0;
    // angle += 0.5;
    // angle *= 20.0;
    // angle = mod(angle, 1.0);
    // float strength = angle;
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // pattern 44
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // angle /= PI * 2.0;
    // angle += 0.5;
    // float strength = sin(angle * 50.0);
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // pattern 45
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // angle /= PI * 2.0;
    // angle += 0.5;
    // float sinusoid = sin(angle * 100.0);

    // float radius = 0.45 + sinusoid * 0.02;
    // float strength = abs(distance(vUv, vec2(0.5)) - radius);
    // strength = 1.0 - step(0.01, strength);
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // pattern 46: Perlin noise
    // float strength = cnoise(vUv * 10.0);
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // pattern 47: Perlin noise stepped
    // float strength = cnoise(vUv * 10.0);
    // strength = step(0.0, strength);
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // pattern 48: Perlin noise glowing
    // float strength = 1.0 - abs(cnoise(vUv * 10.0));
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // pattern 49
    // float strength = sin(cnoise(vUv * 10.0) * 20.0);
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // pattern 50
    // float strength = sin(cnoise(vUv * 10.0) * 20.0);
    // strength = step(0.9, strength);
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // pattern 51
    float strength = sin(cnoise(vUv * 10.0) * 20.0);
    strength = step(0.9, strength);
    strength = clamp(strength, 0.0, 1.0);

    vec3 blackColor = vec3(0.0);
    vec3 uvColor = vec3(vUv, 1.0);
    gl_FragColor = vec4(mix(blackColor, uvColor, strength), 1.0);

    // gl_FragColor = vec4(strength, strength, strength, 1);
}
