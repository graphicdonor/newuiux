'use client'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'

export default function TeaPostFX() {
  return (
    <EffectComposer multisampling={0}>
      {/* Warm bloom — makes golden elements glow */}
      <Bloom
        intensity={1.6}
        luminanceThreshold={0.14}
        luminanceSmoothing={0.90}
        mipmapBlur
        radius={0.72}
      />

      {/* Cinematic vignette */}
      <Vignette
        offset={0.20}
        darkness={0.78}
        eskil={false}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  )
}
