import { Canvas, useThree } from '@react-three/fiber';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';
import { GlassEnvironment } from './GlassEnvironment';
import { GlassObject } from './GlassObject';
import { useScrollY } from './useScrollY';
import type { ShapeName } from './shapes';

export type ZoneObject = {
    shape: ShapeName;
    /** Starting offset from the zone's vertical center, in world units. */
    offset: [number, number, number];
};

export type Zone = {
    /** Distance from the top of the document to the top of this zone, in px. */
    pageTop: number;
    heightPx: number;
    objects: ZoneObject[];
};

function ZoneWalls({ zone, unitsPerPixel }: { zone: Zone; unitsPerPixel: number }) {
    const { viewport } = useThree();
    const halfWidth = viewport.width / 2;
    const depth = 1.5;
    const wallThickness = 0.2;

    const top = -zone.pageTop * unitsPerPixel;
    const bottom = -(zone.pageTop + zone.heightPx) * unitsPerPixel;
    const centerY = (top + bottom) / 2;
    const halfHeight = Math.abs(top - bottom) / 2;

    return (
        <>
            {/* floor / ceiling */}
            <RigidBody type="fixed" colliders={false} position={[0, bottom, 0]}>
                <CuboidCollider args={[halfWidth, wallThickness, depth]} />
            </RigidBody>
            <RigidBody type="fixed" colliders={false} position={[0, top, 0]}>
                <CuboidCollider args={[halfWidth, wallThickness, depth]} />
            </RigidBody>
            {/* left / right */}
            <RigidBody type="fixed" colliders={false} position={[-halfWidth, centerY, 0]}>
                <CuboidCollider args={[wallThickness, halfHeight, depth]} />
            </RigidBody>
            <RigidBody type="fixed" colliders={false} position={[halfWidth, centerY, 0]}>
                <CuboidCollider args={[wallThickness, halfHeight, depth]} />
            </RigidBody>
            {/* near / far — keeps objects roughly at a consistent depth */}
            <RigidBody type="fixed" colliders={false} position={[0, centerY, -depth]}>
                <CuboidCollider args={[halfWidth, halfHeight, wallThickness]} />
            </RigidBody>
            <RigidBody type="fixed" colliders={false} position={[0, centerY, depth]}>
                <CuboidCollider args={[halfWidth, halfHeight, wallThickness]} />
            </RigidBody>

            {zone.objects.map((obj, i) => (
                <GlassObject
                    key={i}
                    shape={obj.shape}
                    position={[obj.offset[0], centerY + obj.offset[1], obj.offset[2]]}
                />
            ))}
        </>
    );
}

function ScrollRig({ zones }: { zones: Zone[] }) {
    const scrollY = useScrollY();
    const { viewport, size } = useThree();
    const unitsPerPixel = viewport.height / size.height;

    return (
        <group position={[0, scrollY * unitsPerPixel, 0]}>
            {zones.map((zone, i) => (
                <ZoneWalls key={i} zone={zone} unitsPerPixel={unitsPerPixel} />
            ))}
        </group>
    );
}

/**
 * Fixed, viewport-sized canvas (never the full document height — that would
 * force the GPU to rasterize far more than is ever on screen). Scroll is
 * simulated by moving the 3D world inside it instead, via ScrollRig, so
 * render cost stays constant no matter how long the page is.
 *
 * z-index 5 currently assumes the hero's content wrapper is z-10 (it is, in
 * Track.tsx) so glass objects sit behind the headline. When zones are added
 * for the footer, footer-area's content currently sits at z-index 1 — bump
 * it to match before objects there would otherwise render on top of it.
 */
export function GlassScene({ zones }: { zones: Zone[] }) {
    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 5 }}>
            <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 8], fov: 45 }} gl={{ alpha: true, antialias: true }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[3, 4, 5]} intensity={0.8} />
                <GlassEnvironment />
                <Physics gravity={[0, 0, 0]}>
                    <ScrollRig zones={zones} />
                </Physics>
            </Canvas>
        </div>
    );
}
