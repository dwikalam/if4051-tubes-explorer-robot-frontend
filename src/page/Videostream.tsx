import { useEffect, useRef, useState } from 'react';



const Videostream = () => {
    const socket = useRef<WebSocket | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [imageBlob, setImageBlob] = useState(null);
    const worker = useRef<Worker | null>(null); // Reference to Web Worker

    useEffect(() => {
        // Create a new instance of the Web Worker
        worker.current = new Worker('imageWorker.js');
    
        // Clean up worker on component unmount
        return () => {
          if (worker.current) {
            worker.current.terminate();
          }
        };
      }, []);


    useEffect(() => {
        socket.current = new WebSocket(`${import.meta.env.VITE_WS_URL}`);
  
        socket.current.onopen = () => {
        console.log('WebSocket connection opened');
        };

        // Handle WebSocket messages
        socket.current.onmessage = (event) => {
            const newMessage = event.data;
            // convert the blob to an image
            setImageBlob(newMessage);
        };

        // Handle WebSocket errors
        socket.current.onerror = (error: Event | ErrorEvent ) => {
        console.error('WebSocket error:', error);
        };

        // Handle WebSocket connection closed
        socket.current.onclose = () => {
        console.log('WebSocket connection closed');
        };

        // Clean up WebSocket connection on component unmount
        return () => {
            if (socket.current !== null) {
                socket.current.close();
            }
        };
    }, []);

    // Function to draw bounding boxes on the video feed
    function drawBoundingBoxes(objects:any, imageData: any) {
        // Draw each detected object as a bounding box
        // remove the application/octet-stream;base64, from the image data and changeit to data:image/jpeg;base64,
        let imageNew = imageData.replace(/^data:application\/octet-stream;base64,/, 'data:image/jpeg;base64,');

        const canvas = canvasRef.current!.getContext('2d');
        if (!canvas) return;
        const img = new Image();
        img.src = imageNew;

        img.onload = () => {
            canvas.clearRect(0, 0, 640, 480);
            canvas.drawImage(img, 0, 0, 640, 480);
        };
        
        objects.forEach(function(object:any) {
            var box = object.box;
            canvas.beginPath();
            canvas.rect(box[0], box[1], box[2] - box[0], box[3] - box[1]);
            canvas.lineWidth = 1;
            canvas.strokeStyle = 'red';
            canvas.fillStyle = 'red';
            canvas.stroke();
            canvas.font = '16px Arial';
            canvas.fillText(object.class, box[0], box[1] - 5);
        });
    }

    const sendMessage = (message: string) => {
        if (socket.current!.readyState === WebSocket.OPEN) {
          socket.current!.send(message);
        }
    }

    useEffect(() => {
        if (!imageBlob) return;
      
        const handleMessage = (event:any) => {
          const detectedObjects = event.data;
          drawBoundingBoxes(detectedObjects.result, detectedObjects.image);
        };
      
        // Send image data to the Web Worker for object detection
        worker.current?.postMessage(imageBlob);
      
        // Listen for messages from the Web Worker
        worker.current?.addEventListener('message', handleMessage);
      
        // Clean up Web Worker message handler
        return () => {
          worker.current?.removeEventListener('message', handleMessage);
          console.log("unmounting")
        };
      }, [imageBlob]);


    return (
        <div className="py-2">
            <div className="d-flex justify-content-center">
                <h5>Live Video Stream</h5>
            </div>
            <div className="d-flex justify-content-center">
            {imageBlob && (
                <img src={URL.createObjectURL(imageBlob)} alt="Blob Image" />
            )}
            </div>
            <div className="d-flex justify-content-center">
                <button onClick={() => sendMessage("p")}>Start</button>
                <button onClick={() => {sendMessage("s"); setImageBlob(null)}}>Stop</button>
            </div>

            <div className="d-flex justify-content-center">
                <h1> Object Detection </h1>
            </div>
            <div className="d-flex justify-content-center">
                <canvas id="canvas" style={{border: "solid"}}ref={canvasRef} width="640" height="480"></canvas>
            </div>
        </div>
    );
}

export default Videostream;