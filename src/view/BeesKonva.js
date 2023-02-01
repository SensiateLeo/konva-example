import React, { useEffect, useMemo, useRef, useState } from "react";
import { Image, Layer, Stage } from "react-konva";
import Konva from "konva";

import "./BeesKonva.scss";

import Bee from "../assets/images/bee.png";
import Hive from "../assets/images/hive.png";

const downloadImage = (url, name) => {
  var link = document.createElement("a");
  link.download = name;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const BeesKonva = () => {
  const konvaWidth = window.innerWidth;
  const konvaHeight = window.innerHeight - 56;

  const stageRef = useRef();
  const layerRef = useRef();
  const beeRef = useRef();

  const [rotation, setRotation] = useState(0);
  const [opacity, setOpacity] = useState(100);
  const [blur, setBlur] = useState(0);
  const [brighten, setBrighten] = useState(0);

  const bee = useMemo(() => {
    const image = new window.Image();
    image.src= Bee;
    return image;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hive = new window.Image();
  hive.src = Hive;

  // Animation
  const [animating, setAnimation] = useState(false);
  useEffect(() => {
    if (!animating) {
      return;
    }
    const node = beeRef.current;
    const anim = new Konva.Animation(
      (frame) => {
        const centerX = konvaWidth / 2;
        const centerY = konvaHeight / 2;
        const radius = 200;

        node.x(centerX - radius * Math.cos(frame.time / 1000));
        node.y(centerY - radius * Math.sin(frame.time / 1000));
      },
      [node.getLayer()]
    );
    anim.start();
    return () => anim.stop();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animating]);

  // Export image
  const handleExport = () => {
    const url = stageRef.current.toDataURL();
    downloadImage(url, "bee.png");
  };

  useEffect(() => {
    if (bee) {
      // you many need to reapply cache on some props changes like shadow, stroke, etc.
      beeRef.current.cache();
    }
  }, [bee]);

  return (
    <>
    <div className="header">
      <div>
        Opacity:
        <input
          className="slider"
          type="range"
          min="1"
          max="100"
          value={opacity}
          onChange={(e) => setOpacity(e.target.value)}
        />
      </div>
      <div>
        Blur:
        <input
          className="slider"
          type="range"
          min="0"
          max="100"
          value={blur}
          onChange={(e) => setBlur(e.target.value)}
        />
      </div>
      <div>
        Brighten:
        <input
          className="slider"
          type="range"
          min="-100"
          max="100"
          value={brighten}
          onChange={(e) => setBrighten(e.target.value)}
        />
      </div>
      <button
        className="button"
        onClick={() => setAnimation(oldAnimation => !oldAnimation)}
      >
        Animate Bee
      </button>
      <button
        className="button"
        onClick={() => setRotation(oldRotation => oldRotation - 90)}
      >
        Rotate Bee
      </button>
      <button
        className="button"
        onClick={() => handleExport()}
      >
        Export Bee Image
      </button>
    </div>
    <Stage width={konvaWidth} height={konvaHeight} ref={stageRef}>
        <Layer ref={layerRef}>
          <Image
            ref={beeRef}
            image={bee}
            x={50}
            y={50}
            width={100}
            height={100}
            offsetX={50}
            offsetY={50}
            draggable
            rotation={rotation}
            opacity={opacity/100}
            filters={[Konva.Filters.Blur, Konva.Filters.Brighten]}
            blurRadius={blur}
            brightness={brighten / 100}
          />
          <Image
            image={hive}
            x={konvaWidth / 2}
            y={konvaHeight / 2}
            width={200}
            height={200}
            offsetX={100}
            offsetY={100}
          />
        </Layer>
      </Stage>
    </>
  );
};

export default BeesKonva;
