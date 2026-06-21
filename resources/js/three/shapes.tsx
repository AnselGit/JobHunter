import { RoundedBox } from '@react-three/drei';
import { glassMaterialProps, MeshTransmissionMaterial } from './GlassEnvironment';

/** Flattened rounded card — reads as a resume/document/offer letter. */
export function DocumentShape() {
    return (
        <RoundedBox args={[1.1, 1.5, 0.08]} radius={0.12} smoothness={4}>
            <MeshTransmissionMaterial {...glassMaterialProps} />
        </RoundedBox>
    );
}

/** Smooth disc — reads as a badge / approval stamp / seal. */
export function BadgeShape() {
    return (
        <mesh>
            <cylinderGeometry args={[0.7, 0.7, 0.18, 48]} />
            <MeshTransmissionMaterial {...glassMaterialProps} />
        </mesh>
    );
}

/** Rounded box body + half-torus handle — reads as a briefcase. */
export function BriefcaseShape() {
    return (
        <group>
            <RoundedBox args={[1.4, 0.9, 0.7]} radius={0.1} smoothness={4} position={[0, -0.1, 0]}>
                <MeshTransmissionMaterial {...glassMaterialProps} />
            </RoundedBox>
            <mesh position={[0, 0.45, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.22, 0.05, 16, 32, Math.PI]} />
                <MeshTransmissionMaterial {...glassMaterialProps} />
            </mesh>
        </group>
    );
}

export const SHAPES = {
    document: DocumentShape,
    badge: BadgeShape,
    briefcase: BriefcaseShape,
} as const;

export type ShapeName = keyof typeof SHAPES;
