'use client'
import { EffectComposer, Bloom, DepthOfField, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'

export default function FantasyPostFX() {
  return (
    <EffectComposer multisampling={0}>
      <DepthOfField
        focusDistance={0.008}
        focalLength={0.032}
        bokehScale={3.5}
        height={480}
      />
      <Bloom
        intensity={2.4}
        luminanceThreshold={0.06}
        luminanceSmoothing={0.92}
        mipmapBlur
        radius={0.88}
      />
      <Vignette
        offset={0.18}
        darkness={0.92}
        eskil={false}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  )
}
