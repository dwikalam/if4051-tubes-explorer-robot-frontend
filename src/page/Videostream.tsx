import mqtt, { IClientOptions, MqttClient } from 'mqtt';
import { useEffect, useRef, useState } from 'react';

const Videostream = () => {
    const [imageBlob, setImageBlob] = useState<any|null>(null);
    const [imageBlobDet, setImageBlobDet] = useState<any|null>(null); // Image Blob for object detection

    const [isConnected, setIsConnected] = useState(false);

    const client = useRef<MqttClient | null>(null);
    const [irValue, setIrValue] = useState<string | null>(null);
    const [tempValue, setTempValue] = useState<string | null>(null);
    const [humidValue, setHumidValue] = useState<string | null>(null);
    const [gasValue, setGasValue] = useState<string | null>(null);

    useEffect(()=> {
        console.log("IS CONNECTED", isConnected)
    },[isConnected])


    function randomString(length: number) {
        let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
      
        for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
      
        return result;
      }

    function generateRandomClientId() {
        return 'mqtt_iyoti_' + randomString(10);
      }

    const options = {
        protocol: 'mqtt',
        host: '192.168.1.109',
        port: 9001,
        clientId: generateRandomClientId(),
    
    };


    useEffect(() => {
        // client.current = mqtt.Client();

        client.current = mqtt.connect(options as IClientOptions);
        console.log("CLIENT", client.current)

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
                
                case 'streaming/send':
                    const blob = new Blob([message], { type: 'image/jpeg' }); 
                    setImageBlob(blob);
                    break;

                case 'streaming/receive':
                    const blobObj = new Blob([message], { type: 'image/jpeg' }); 
                    setImageBlobDet(blobObj);
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

    const sendMessage = (message: string) => {
        if (client.current === null || client.current.disconnected) {
            return;
        }
        if (message="s") {
            setImageBlob(null)
        }
        client.current.publish('streaming/control', message, (error?: Error) => {
            if (error) {
              console.log('Publish error: ', error);
              return;
            }
        });
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

        client.current.subscribe('streaming/send', (err: Error | null) => {
            if (err) {
                console.error(`Error on subscribing "streaming/send" topic`, err);
                
                return;
            }
        });

        client.current.subscribe('streaming/receive', (err: Error | null) => {
            if (err) {
                console.error(`Error on subscribing "streaming/receive" topic`, err);
                
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
                        {imageBlobDet && (
                            <div>
                                <div className="d-flex justify-content-center">
                                    <img src={URL.createObjectURL(imageBlobDet)} alt="Blob Image" />
                                </div> 
                            </div>
                        )}
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