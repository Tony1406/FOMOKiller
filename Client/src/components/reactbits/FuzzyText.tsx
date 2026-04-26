import { useEffect, useRef } from 'react';

interface FuzzyTextProps {
    children: string;
    fontSize?: string | number;
    fontWeight?: string | number;
    color?: string;
    baseIntensity?: number;
    hoverIntensity?: number;
    displaceScale?: number;
}

let idCounter = 0;

export default function FuzzyText({
    children,
    fontSize = 'clamp(4rem, 12vw, 9rem)',
    fontWeight = 900,
    color = 'white',
    baseIntensity = 0.18,
    hoverIntensity = 0.4,
    displaceScale = 8,
}: FuzzyTextProps) {
    const filterId = useRef(`fuzzy-${++idCounter}`);
    const turbRef = useRef<SVGFETurbulenceElement>(null);
    const frameRef = useRef(0);
    const hovered = useRef(false);

    useEffect(() => {
        let t = 0;

        const tick = () => {
            t += 0.012;
            const i = hovered.current ? hoverIntensity : baseIntensity;

            turbRef.current?.setAttribute(
                'baseFrequency',
                `${(i + Math.sin(t) * 0.04).toFixed(4)} ${(i + Math.cos(t * 0.8) * 0.04).toFixed(4)}`
            );

            frameRef.current = requestAnimationFrame(tick);
        };
        frameRef.current = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(frameRef.current);
    }, [baseIntensity, hoverIntensity]);

    const id = filterId.current;

    return (
        <span
            style={{ display: 'inline-block', filter: `url(#${id})` }}
            onMouseEnter={() => { hovered.current = true; }}
            onMouseLeave={() => { hovered.current = false; }}
        >
            <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }}>
                <defs>
                    <filter id={id} x="-30%" y="-30%" width="160%" height="160%">
                        <feTurbulence
                            ref={turbRef}
                            type="fractalNoise"
                            baseFrequency="0.02 0.02"
                            numOctaves="4"
                            seed="5"
                            result="noise"
                        />
                        <feDisplacementMap
                            in="SourceGraphic"
                            in2="noise"
                            scale={displaceScale}
                            xChannelSelector="R"
                            yChannelSelector="G"
                        />
                    </filter>
                </defs>
            </svg>
            <span style={{
                fontSize,
                fontWeight,
                color,
                fontFamily: 'inherit',
                lineHeight: 1,
                display: 'block',
            }}>
                {children}
            </span>
        </span>
    );
}
