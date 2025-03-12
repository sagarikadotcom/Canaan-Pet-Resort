import React from "react";
import { useGLTF } from "@react-three/drei";

export default function Model({ modelPath }) {
  const { scene } = useGLTF(modelPath);
  return <primitive object={scene} scale={1.5} />;
}
