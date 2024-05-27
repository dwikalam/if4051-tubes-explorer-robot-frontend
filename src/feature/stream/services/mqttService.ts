import mqtt, { ClientSubscribeCallback, ISubscriptionGrant, MqttClient } from "mqtt";

const websocketUrl: string = "wss://<SERVER-ADDRESS>:443/mqtt";
const apiEndpoint: string = "<API-ENDPOINT>/";

interface ErrorHandler {
    (message: string): void;
}

interface MessageHandler {
    (message: any): void;
}

function getClient(errorHandler: ErrorHandler): MqttClient {
    const client: MqttClient = mqtt.connect(websocketUrl);

    client.stream.on("error", (err: Error) => {
        errorHandler(`Connection to ${websocketUrl} failed`);
        client.end();
    });

    return client;
}

function subscribe(client: MqttClient, topic: string, errorHandler: ErrorHandler): void {
    const callBack: ClientSubscribeCallback = (err: Error | null, granted?: ISubscriptionGrant[]) => {
        if (err) {
            errorHandler("Subscription request failed");
        }
    };
    
    client.subscribe(apiEndpoint + topic, callBack);
}

function onMessage(client: MqttClient, callBack: MessageHandler): void {
    client.on("message", (topic: string, message: Buffer, packet: mqtt.Packet) => {
        callBack(JSON.parse(new TextDecoder("utf-8").decode(message)));
    });
}

function unsubscribe(client: MqttClient, topic: string): void {
    client.unsubscribe(apiEndpoint + topic);
}

function closeConnection(client: MqttClient): void {
    client.end();
}

const mqttService = {
    getClient,
    subscribe,
    onMessage,
    unsubscribe,
    closeConnection,
};

export default mqttService;
