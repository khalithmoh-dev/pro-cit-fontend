import React, { useEffect, useRef, useState } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import style from './crop-image.module.css';
import Button from '../../../../../button';
import Slider from '../../../../../slider';
interface PropsIF {
  setCroppedImage: (e: any) => void;
  selectedFile: any;
}

const CropImage: React.FC<PropsIF> = ({ setCroppedImage, selectedFile }) => {
  const [crop, setCrop] = useState<any>();
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState<any>(1);
  const [rotate, setRotate] = useState(0);

  useEffect(() => {
    setCroppedImage({ canvas: previewCanvasRef.current, crop: completedCrop });
  }, [completedCrop]); //eslint-disable-line

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 1));
  }
  useDebounceEffect(
    async () => {
      if (completedCrop?.width && completedCrop?.height && imgRef.current && previewCanvasRef.current) {
        canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop, scale, rotate);
      }
    },
    100,
    [completedCrop, scale, rotate],
  );

  return (
    <div className={style.container}>
      <div className={style.leftBox}>
        {Boolean(completedCrop) && (
          <div className={style.canvasContainer}>
            <p>Preview</p>
            <canvas
              ref={previewCanvasRef}
              style={{
                border: '1px solid black',
                objectFit: 'contain',
                height: '220px',
                width: '220px',
              }}
            />
            <Button
              secondary
              disabled={!completedCrop?.width || !completedCrop?.height}
              onClick={() => generateDownload(previewCanvasRef.current, completedCrop)}
            >
              Download
            </Button>
          </div>
        )}
      </div>
      <div className={style.cropContainer}>
        <ReactCrop
          crop={crop}
          onChange={(_: any, percentCrop: any) => setCrop(percentCrop)}
          onComplete={(c: any) => setCompletedCrop(c)}
          aspect={1}
        >
          <img
            ref={imgRef}
            alt="Crop me"
            src={selectedFile}
            style={{
              transform: `scale(${scale}) rotate(${rotate}deg)`,
              height: '300px',
            }}
            onLoad={onImageLoad}
          />
        </ReactCrop>
        <Slider label="Zoom" min={0.2} max={1.9} step={0.01} value={scale} onChange={(val: number) => setScale(val)} />
        <Slider label="Rotate" min={1} max={360} step={1} value={scale} onChange={(val: number) => setRotate(val)} />
      </div>
    </div>
  );
};

export default CropImage;

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}
const generateDownload = async (canvas: any, crop: any) => {
  if (!crop || !canvas) {
    return;
  }
  canvas.toBlob(
    (blob: any) => {
      const previewUrl = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.download = 'cropPreview.png';
      anchor.href = URL.createObjectURL(blob);
      anchor.click();
      window.URL.revokeObjectURL(previewUrl);
    },
    'image/png',
    1,
  );
};

export function useDebounceEffect(fn: () => void, waitTime: number, deps?: any) {
  useEffect(() => {
    const t = setTimeout(() => {
      fn.apply(undefined, deps);
    }, waitTime);

    return () => {
      clearTimeout(t);
    };
  }, [deps]); //eslint-disable-line
}
async function canvasPreview(
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  crop: PixelCrop,
  scale = 1,
  rotate = 0,
) {
  const TO_RADIANS = Math.PI / 180;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  // devicePixelRatio slightly increases sharpness on retina devices
  // at the expense of slightly slower render times and needing to
  // size the image back down if you want to download/upload and be
  // true to the images natural size.
  const pixelRatio = window.devicePixelRatio;
  // const pixelRatio = 1

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = 'high';

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  const rotateRads = rotate * TO_RADIANS;
  const centerX = image.naturalWidth / 2;
  const centerY = image.naturalHeight / 2;

  ctx.save();

  // 5) Move the crop origin to the canvas origin (0,0)
  ctx.translate(-cropX, -cropY);
  // 4) Move the origin to the center of the original position
  ctx.translate(centerX, centerY);
  // 3) Rotate around the origin
  ctx.rotate(rotateRads);
  // 2) Scale the image
  ctx.scale(scale, scale);
  // 1) Move the center of the image to the origin (0,0)
  ctx.translate(-centerX, -centerY);
  ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, 0, 0, image.naturalWidth, image.naturalHeight);

  ctx.restore();
}
