'use client'
import { EffectComposer, Bloom, DepthOfField, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'

export default function PostProcessing() {
  return (
    <EffectComposer multisampling={0}>
      {/* Depth of field — focus near origin, blur far/close objects */}
      <DepthOfField
        focusDistance={0.012}
        focalLength={0.028}
        bokehScale={4.5}
        height={480}
      />

      {/* Bloom — makes emissive surfaces glow and bleed into surrounding pixels */}
      <Bloom
        intensity={1.8}
        luminanceThreshold={0.10}
        luminanceSmoothing={0.88}
        mipmapBlur
        radius={0.82}
      />

      {/* Vignette — cinematic edge darkening */}
      <Vignette
        offset={0.22}
        darkness={0.88}
        eskil={false}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  )
}
