import { useRef, useState } from 'react';
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { RigidBody, type RapierRigidBody } from '@react-three/rapier';
import { SHAPES, type ShapeName } from './shapes';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

type GlassObjectProps = {
    shape: ShapeName;
    position: [number, number, number];
    floatStrength?: number;
};

/**
 * Drag implementation is hand-rolled directly on R3F's pointer events rather
 * than going through a gesture library — gives tight control over toggling
 * the rigid body between "dynamic" (normal physics) and "kinematicPosition"
 * (follows the pointer exactly) and over pointer capture, so the drag keeps
 * tracking even if the pointer moves faster than the object's silhouette.
 */
export function GlassObject({ shape, position, floatStrength = 0.0006 }: GlassObjectProps) {
    const rigidBodyRef = useRef<RapierRigidBody>(null);
    const [bodyType, setBodyType] = useState<'dynamic' | 'kinematicPosition'>('dynamic');
    const reducedMotion = usePrefersReducedMotion();
    const phase = useRef(Math.random() * Math.PI * 2);

    const dragState = useRef<{
        pointerId: number;
        startX: number;
        startY: number;
        startPos: [number, number, number];
        lastX: number;
        lastY: number;
        lastTime: number;
        velX: number;
        velY: number;
    } | null>(null);

    const { viewport, size, gl } = useThree();
    const unitsPerPixel = viewport.height / size.height;

    const Shape = SHAPES[shape];

    const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        gl.domElement.setPointerCapture?.(e.pointerId);
        const t = rigidBodyRef.current?.translation();
        const startPos: [number, number, number] = t ? [t.x, t.y, t.z] : position;

        dragState.current = {
            pointerId: e.pointerId,
            startX: e.clientX,
            startY: e.clientY,
            startPos,
            lastX: e.clientX,
            lastY: e.clientY,
            lastTime: performance.now(),
            velX: 0,
            velY: 0,
        };
        setBodyType('kinematicPosition');
    };

    const onPointerMove = (e: ThreeEvent<PointerEvent>) => {
        const drag = dragState.current;
        if (!drag || drag.pointerId !== e.pointerId || !rigidBodyRef.current) return;

        const dx = (e.clientX - drag.startX) * unitsPerPixel;
        const dy = (e.clientY - drag.startY) * unitsPerPixel;
        const nx = drag.startPos[0] + dx;
        const ny = drag.startPos[1] - dy;

        rigidBodyRef.current.setNextKinematicTranslation({ x: nx, y: ny, z: drag.startPos[2] });

        const now = performance.now();
        const dt = Math.max(now - drag.lastTime, 1);
        drag.velX = ((e.clientX - drag.lastX) / dt) * unitsPerPixel * 1000;
        drag.velY = ((e.clientY - drag.lastY) / dt) * unitsPerPixel * 1000;
        drag.lastX = e.clientX;
        drag.lastY = e.clientY;
        drag.lastTime = now;
    };

    const onPointerUp = (e: ThreeEvent<PointerEvent>) => {
        const drag = dragState.current;
        if (!drag || drag.pointerId !== e.pointerId) return;
        setBodyType('dynamic');
        // Throw: hand off the recent pointer velocity so released objects
        // keep moving and collide naturally instead of just stopping dead.
        rigidBodyRef.current?.setLinvel({ x: drag.velX, y: -drag.velY, z: 0 }, true);
        dragState.current = null;
    };

    useFrame((state) => {
        if (reducedMotion || bodyType !== 'dynamic' || !rigidBodyRef.current) return;
        const t = state.clock.elapsedTime;
        // Gentle idle bob — small periodic impulse rather than a continuous
        // force, so it stays subtle and doesn't fight the drag/throw feel.
        rigidBodyRef.current.applyImpulse(
            { x: 0, y: Math.sin(t * 0.6 + phase.current) * floatStrength, z: 0 },
            true,
        );
    });

    return (
        <RigidBody
            ref={rigidBodyRef}
            type={bodyType}
            position={position}
            colliders="cuboid"
            restitution={0.4}
            friction={0.3}
            linearDamping={0.9}
            angularDamping={0.9}
            gravityScale={0.05}
        >
            <group onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
                <Shape />
            </group>
        </RigidBody>
    );
}
