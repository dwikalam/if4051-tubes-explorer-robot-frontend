import mqtt, { IClientOptions, MqttClient } from 'mqtt';
import { useEffect, useRef, useState } from 'react';

const Videostream = () => {
    const socket = useRef<WebSocket | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [imageBlob, setImageBlob] = useState(null);
    const worker = useRef<Worker | null>(null); // Reference to Web Worker

    const client = useRef<MqttClient | null>(null);
    const [irValue, setIrValue] = useState<string | null>(null);
    const [tempValue, setTempValue] = useState<string | null>(null);
    const [humidValue, setHumidValue] = useState<string | null>(null);
    const [gasValue, setGasValue] = useState<string | null>(null);

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

    useEffect(() => {
        client.current = mqtt.connect(`wss://<SERVER-ADDRESS>:443/mqtt`);

        client.current.on('connect', () => {
            console.log('Connected');

            subscribeToAllTopics();
        });

        client.current.on('error', (err: Error | mqtt.ErrorWithReasonCode) => {
            console.error(`Connection error: ${err}`);

            client.current?.end();
        });

        client.current.on('reconnect', () => {
            console.log('Reconnecting');
        });
        
        client.current.on('message', (topic: string, message: Buffer) => {
            const messageStr = message.toString();

            switch (topic) {
                case '/explorobot/ir':
                    setIrValue(messageStr);
                    break;

                case '/explorobot/temperature':
                    setTempValue(messageStr);
                    break;

                case '/explorobot/humidity':
                    setHumidValue(messageStr);
                    break;

                case '/explorobot/gas':
                    setGasValue(messageStr);
                    break;

                default:
                    break;
            }
        });

        return () => {
            client.current?.end();
        };
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            switch (event.key) {
                case 'w':
                    publishControlTopic('forward');
                    break;
                case 'a':
                    publishControlTopic('left');
                    break;
                case 'x':
                    publishControlTopic('backward');
                    break;
                case 'd':
                    publishControlTopic('right');
                    break;
                case 's':
                    publishControlTopic('stop');
                    break;
                default:
                    break;
            }
        };
    
        window.addEventListener('keydown', handleKeyDown);
    
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    // Function to draw bounding boxes on the video feed
    function drawBoundingBoxes(objects: any, imageData: any) {
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

    const subscribeToAllTopics = () => {
        if (client.current === null || client.current.disconnected) {
            return;
        }

        client.current.subscribe('/explorobot/ir', (err: Error | null) => {
            if (err) {
                console.error(`Error on subscribing '/explorobot/ir' topic`, err);

                return;
            }
        });

        client.current.subscribe('/explorobot/temperature', (err: Error | null) => {
            if (err) {
                console.error(`Error on subscribing '/explorobot/temperature' topic`, err);
                
                return;
            }
        });

        client.current.subscribe('/explorobot/humidity', (err: Error | null) => {
            if (err) {
                console.error(`Error on subscribing '/explorobot/humidity' topic`, err);
                
                return;
            }
        });

        client.current.subscribe('/explorobot/gas', (err: Error | null) => {
            if (err) {
                console.error(`Error on subscribing "/explorobot/gas" topic`, err);
                
                return;
            }
        });
    }

    const publishControlTopic = (keyInput: 'forward' | 'backward' | 'left' | 'right' | 'stop') => {
        if (client.current === null || client.current.disconnected) {
            return;
        }

        client.current.publish('/explorobot/control', keyInput, (error?: Error) => {
            if (error) {
              console.log('Publish error: ', error);

              return;
            }
        });
    }

    return (
        <div className="container py-2">
            <div className="row">
                <section className="col">
                    <div className="d-flex flex-column">
                        <h1 className="d-flex justify-content-center">Live Video Stream</h1>
                        {imageBlob && (
                            <div>
                                <div className="d-flex justify-content-center">
                                    <img src={URL.createObjectURL(imageBlob)} alt="Blob Image" />
                                </div>
                                <div>
                                    <div>IR: {irValue ? irValue : '-'}</div>
                                    <div>Temperature: {tempValue ? tempValue : '-'}</div>
                                    <div>Humidity: {humidValue ? humidValue : '-'}</div>
                                    <div>Gas: {gasValue ? gasValue : '-'}</div>
                                </div>
                            </div>
                        )}
                        <div className="d-flex justify-content-center">
                            <button onClick={() => sendMessage("p")}>Start</button>
                            <button onClick={() => {sendMessage("s"); setImageBlob(null)}}>Stop</button>
                        </div>
                    </div>

                    <div className="d-flex flex-column align-items-center">
                        <h1>Object Detection</h1>
                        <div>
                            <canvas id="canvas" style={{border: "solid"}} ref={canvasRef} width="640" height="480"></canvas>
                        </div>
                    </div>
                </section>

                <section className="col">
                    <div className="d-flex flex-column align-items-center">
                        <h1>Controller</h1>
                        <div>
                            <button onClick={() => publishControlTopic('forward')}>Forward</button>
                            <button onClick={() => publishControlTopic('backward')}>Backward</button>
                            <button onClick={() => publishControlTopic('left')}>Left</button>
                            <button onClick={() => publishControlTopic('right')}>Right</button>
                            <button onClick={() => publishControlTopic('stop')}>Stop</button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Videostream;