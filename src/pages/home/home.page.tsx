import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect } from 'react';
import * as faceapi from '@vladmandic/face-api';
import { DEPLOYED_URL } from 'src/app/constants';
import { Button, Input } from 'react-daisyui';
import { useLocalStorageState } from 'ahooks';
import * as R from 'ramda';
import { ReactComponent as LoadingSvg } from 'src/assets/images/loading.svg';

type TSavedFace = {
  name: string;
  encodedFace: number[];
};

type TFaceDetection = faceapi.WithFaceDescriptor<
  faceapi.WithFaceLandmarks<
    {
      detection: faceapi.FaceDetection;
    },
    faceapi.FaceLandmarks68
  >
>;

type TRecognizedFace = {
  name: string;
  distance: number;
};

const HomePage = observer(() => {
  const [savedFaces, setSavedFaces] = useLocalStorageState<TSavedFace[]>('savedFaces', {
    defaultValue: [],
  });
  const [modelsLoaded, setModelsLoaded] = React.useState(false);
  const [nameInput, setNameInput] = React.useState('');
  const [detection, setDetection] = React.useState<TFaceDetection>();
  const [playing, setPlaying] = React.useState(true);

  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const recognizeFace = useCallback(
    (detection: TFaceDetection, savedFaces: TSavedFace[]): TRecognizedFace | null => {
      if (!detection || !savedFaces?.length) {
        return null;
      }
      const curEncodedFace = detection.descriptor;

      const minDistance = R.reduce(
        (acc, cur) => {
          const res = faceapi.euclideanDistance(curEncodedFace, new Float32Array(cur.encodedFace));
          return res < acc.distance ? { distance: res, name: cur.name } : acc;
        },
        { distance: 100, name: '' },
        savedFaces,
      );

      if (minDistance.distance > 0.6) {
        return null;
      }

      return {
        name: minDistance.name,
        distance: minDistance.distance,
      };
    },
    [],
  );

  const drawFaces = useCallback(
    (data: TFaceDetection[], fps: number, recogFaces: Array<TRecognizedFace | null> = []) => {
      if (!canvasRef.current) {
        return;
      }

      const ctx: CanvasRenderingContext2D | null = canvasRef.current.getContext('2d', {
        willReadFrequently: true,
      });

      if (!ctx) {
        return;
      }

      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.font = 'small-caps 20px "Segoe UI"';
      ctx.fillStyle = 'white';
      ctx.fillText(`FPS: ${Math.round(fps)}`, 10, 25);

      for (const [index, person] of data.entries()) {
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#4834d4';
        ctx.fillStyle = '#4834d4';
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.rect(
          person.detection.box.x,
          person.detection.box.y,
          person.detection.box.width,
          person.detection.box.height,
        );
        ctx.stroke();

        ctx.fillStyle = '#ecf0f1';
        ctx.fillText(
          `${recogFaces[index]?.name || 'Unknown'} - ${recogFaces[index]?.distance.toFixed(2)}`,
          person.detection.box.x + 10,
          person.detection.box.y + 25,
        );

        ctx.globalAlpha = 0.8;
        ctx.fillStyle = '#ecf0f1';
        const pointSize = 2;
        for (let i = 0; i < person.landmarks.positions.length; i++) {
          ctx.beginPath();
          ctx.arc(
            person.landmarks.positions[i].x,
            person.landmarks.positions[i].y,
            pointSize,
            0,
            2 * Math.PI,
          );
          ctx.fill();
        }
      }
    },
    [],
  );

  const detectVideo = useCallback(
    async (savedFaces: TSavedFace[]) => {
      try {
        if (!videoRef.current) return false;

        const t0 = performance.now();
        const detections = await faceapi
          .detectAllFaces(
            videoRef.current,
            new faceapi.SsdMobilenetv1Options({ minConfidence: 0.2, maxResults: 5 }),
          )
          .withFaceLandmarks()
          .withFaceDescriptors();
        setDetection(detections[0]);

        if (savedFaces?.length) {
          const recogFaces = detections.map(detection => recognizeFace(detection, savedFaces));
          drawFaces(detections, 0, recogFaces);
          requestAnimationFrame(() => detectVideo(savedFaces));

          return true;
        }

        const fps = 1000 / (performance.now() - t0);
        drawFaces(detections, fps);

        requestAnimationFrame(() => detectVideo(savedFaces));

        return true;
      } catch (error) {
        console.log(error);

        return false;
      }
    },
    [drawFaces, recognizeFace],
  );

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = `${DEPLOYED_URL}/models`;

      Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]).then(() => {
        setModelsLoaded(true);
      });
    };
    loadModels();
  }, []);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: false, video: { facingMode: 'user' } })
      .then(stream => {
        if (!videoRef.current) {
          return;
        }

        const video = videoRef.current;

        video.srcObject = stream;
      })
      .catch(err => {
        console.error('error:', err);
      });
  }, []);

  useEffect(() => {
    if (!playing) {
      videoRef.current?.pause();
    } else {
      videoRef.current?.play();
    }
  }, [playing]);

  return (
    <div className="container max-w-md mx-auto p-2">
      {modelsLoaded ? (
        <div className="relative flex justify-center rounded-box overflow-hidden">
          <video
            className=""
            ref={videoRef}
            autoPlay
            playsInline
            onLoadedMetadata={e => {
              if (!canvasRef.current) {
                return;
              }
              canvasRef.current.width = e.currentTarget.videoWidth;
              canvasRef.current.height = e.currentTarget.videoHeight;
              // detectVideo(savedFaces || []);
            }}
          />
          <canvas className="absolute top-0 left-0 w-full" ref={canvasRef} />
        </div>
      ) : (
        <div className="w-full rounded-box h-64 flex justify-center items-center bg-base-200">
          <LoadingSvg />
        </div>
      )}

      <div className="my-2"></div>

      <div className="flex w-full space-x-2">
        <Input
          className="flex-1"
          placeholder="Enter your name"
          value={nameInput}
          onChange={e => setNameInput(e.target.value)}
        />

        <Button
          color="primary"
          variant="outline"
          onClick={() => {
            if (!detection) {
              return;
            }
            setSavedFaces([
              ...(savedFaces || []),
              {
                name: nameInput,
                encodedFace: Array.from(detection.descriptor),
              },
            ]);

            setNameInput('');
            alert('Saved');
          }}
        >
          Save face
        </Button>
      </div>

      <div className="my-2"></div>

      <div className="flex space-x-2">
        <Button
          color="error"
          variant="outline"
          disabled={!savedFaces?.length}
          onClick={() => {
            setSavedFaces([]);
            alert('Deleted');
          }}
        >
          Delete all
        </Button>

        <Button onClick={() => setPlaying(!playing)}>{playing ? 'Pause' : 'Play'}</Button>

        <Button
          color="primary"
          disabled={!detection || !savedFaces?.length}
          onClick={() => {
            if (!detection || !savedFaces?.length) {
              return;
            }

            const result = recognizeFace(detection, savedFaces);
            if (!result || result.distance > 0.6) {
              return alert('Not recognized');
            }

            alert(`${result.name} - ${result.distance.toFixed(2)}`);
          }}
        >
          Recognize
        </Button>
      </div>
    </div>
  );
});

HomePage.displayName = 'HomePage';
export default HomePage;
