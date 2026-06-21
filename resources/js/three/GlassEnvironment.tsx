import { Environment, Lightformer, MeshTransmissionMaterial } from '@react-three/drei';

/**
 * Lights the scene for the transmission glass material. A full HDRI would
 * look better but costs real bytes and GPU time — these Lightformers
 * (flat emissive planes) are nearly free and are tuned to your existing
 * sky-blue palette so reflections feel native to the page instead of a
 * generic studio.
 */
export function GlassEnvironment() {
    return (
        <Environment resolution={256}>
            <Lightformer intensity={2} color="#D5ECFF" position={[0, 4, -5]} scale={[10, 5, 1]} />
            <Lightformer intensity={1.5} color="#53B2FF" position={[-5, -2, 2]} scale={[6, 6, 1]} />
            <Lightformer intensity={1.5} color="#ffffff" position={[5, 2, 3]} scale={[4, 4, 1]} />
            <Lightformer intensity={0.8} color="#67BBFF" position={[0, -5, -2]} scale={[8, 3, 1]} />
        </Environment>
    );
}

/**
 * Shared "glossy tinted glass" preset. Spread this onto MeshTransmissionMaterial
 * wherever a glass surface is needed, so every shape reads as one consistent
 * material rather than a one-off look per object.
 *
 * Note: exact prop names/availability shift slightly between drei versions.
 * If your installed version warns about an unknown prop here, check
 * node_modules/@react-three/drei/core/MeshTransmissionMaterial.d.ts for the
 * exact list and adjust — the visual intent (low roughness, full transmission,
 * blue tint) is what matters.
 */
export const glassMaterialProps = {
    thickness: 0.6,
    roughness: 0.06,
    transmission: 1,
    ior: 1.3,
    chromaticAberration: 0.02,
    anisotropy: 0.1,
    distortion: 0.1,
    distortionScale: 0.2,
    temporalDistortion: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    attenuationDistance: 1.2,
    attenuationColor: '#A8D8FF',
    color: '#CCE8FF',
    resolution: 256,
    samples: 6,
} as const;

export { MeshTransmissionMaterial };
