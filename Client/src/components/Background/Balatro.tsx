import { useEffect, useRef, useMemo } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform float uSpinRotation;
uniform float uSpinSpeed;
uniform vec2 uOffset;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uContrast;
uniform float uLighting;
uniform float uSpinAmount;
uniform float uPixelFilter;
uniform float uSpinEase;

out vec4 fragColor;

void main() {
    // Pixelation
    vec2 p = (gl_FragCoord.xy - 0.5 * uResolution.xy) / min(uResolution.y, uResolution.x);
    if(uPixelFilter > 0.0) {
        p = floor(p * uPixelFilter) / uPixelFilter;
    }

    float t = uTime * uSpinSpeed;
    float uvLength = length(p);
    
    // Spin effect
    float angle = atan(p.y, p.x) + uSpinRotation + (uSpinAmount / (uvLength + uSpinEase)) * sin(t);
    vec2 rotatedP = vec2(cos(angle), sin(angle)) * uvLength;
    rotatedP += uOffset;

    // Colorful procedural noise/waves
    float noise = sin(10.0 * (rotatedP.x + rotatedP.y) + t) * 
                  cos(10.0 * (rotatedP.x - rotatedP.y) - t);
                  
    vec3 c1 = uColor1;
    vec3 c2 = uColor2;
    vec3 c3 = uColor3;

    vec3 color = mix(c1, c2, 0.5 + 0.5 * noise);
    color = mix(color, c3, 0.5 + 0.5 * sin(uvLength * 5.0 - t));
    
    // Contrast & Lighting
    color = (color - 0.5) * uContrast + 0.5 + uLighting;
    
    fragColor = vec4(color, 1.0);
}
`;

/**
 * Converting HEX to normalized RGB [0, 1]
 */
const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return [r, g, b];
};

interface BalatroProps {
    spinRotation?: number;
    spinSpeed?: number;
    offset?: [number, number];
    color1?: string;
    color2?: string;
    color3?: string;
    contrast?: number;
    lighting?: number;
    spinAmount?: number;
    pixelFilter?: number;
    spinEase?: number;
}

export default function Balatro({
    spinRotation = 0.5,
    spinSpeed = 0.2,
    offset = [0.0, 0.0],
    color1 = "#0047AB", // Dark Blue (FOMO base)
    color2 = "#071C3A", // Deep Navy
    color3 = "#2979FF", // Accent Blue
    contrast = 1.2,
    lighting = -0.1,
    spinAmount = 0.3,
    pixelFilter = 0.0,
    spinEase = 0.1,
}: BalatroProps) {
    const ctnDom = useRef<HTMLDivElement>(null);

    const colors = useMemo(() => ({
        c1: hexToRgb(color1),
        c2: hexToRgb(color2),
        c3: hexToRgb(color3),
    }), [color1, color2, color3]);

    useEffect(() => {
        const ctn = ctnDom.current;
        if (!ctn) return;

        const renderer = new Renderer({ alpha: true, premultipliedAlpha: true });
        const gl = renderer.gl;
        (gl.canvas as HTMLCanvasElement).style.display = "block";
        (gl.canvas as HTMLCanvasElement).style.width = "100%";
        (gl.canvas as HTMLCanvasElement).style.height = "100%";
        ctn.appendChild(gl.canvas);

        const geometry = new Triangle(gl);
        const program = new Program(gl, {
            vertex: VERT,
            fragment: FRAG,
            uniforms: {
                uTime: { value: 0 },
                uResolution: { value: [0, 0] },
                uSpinRotation: { value: spinRotation },
                uSpinSpeed: { value: spinSpeed },
                uOffset: { value: offset },
                uColor1: { value: colors.c1 },
                uColor2: { value: colors.c2 },
                uColor3: { value: colors.c3 },
                uContrast: { value: contrast },
                uLighting: { value: lighting },
                uSpinAmount: { value: spinAmount },
                uPixelFilter: { value: pixelFilter },
                uSpinEase: { value: spinEase },
            },
        });

        const mesh = new Mesh(gl, { geometry, program });

        function resize() {
            if (!ctn) return;
            const width = ctn.offsetWidth;
            const height = ctn.offsetHeight;
            const dpr = window.devicePixelRatio || 1;

            renderer.setSize(width * dpr, height * dpr);
            gl.canvas.style.width = `${width}px`;
            gl.canvas.style.height = `${height}px`;

            program.uniforms.uResolution.value = [width * dpr, height * dpr];
        }
        window.addEventListener("resize", resize);
        resize();

        let animateId = 0;
        const update = (t: number) => {
            animateId = requestAnimationFrame(update);
            program.uniforms.uTime.value = t * 0.001;
            renderer.render({ scene: mesh });
        };
        animateId = requestAnimationFrame(update);

        return () => {
            cancelAnimationFrame(animateId);
            window.removeEventListener("resize", resize);
            if (gl.canvas.parentNode === ctn) {
                ctn.removeChild(gl.canvas);
            }
            gl.getExtension("WEBGL_lose_context")?.loseContext();
        };
    }, [spinRotation, spinSpeed, offset, colors, contrast, lighting, spinAmount, pixelFilter, spinEase]);

    return <div ref={ctnDom} style={{ width: "100%", height: "100%" }} />;
}
