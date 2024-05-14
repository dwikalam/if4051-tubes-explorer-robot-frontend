// imageWorker.js
self.onmessage = async function(event) {
    const imageData = event.data;
    
    // Perform object detection on the received image data
    const string64 = await blobToBase64Sync(imageData);

    const received = await captureFrame(string64)

    
    self.postMessage({result: received, image: string64});
  };

async function blobToBase64Sync(blob) {
    let reader = new FileReader();
    reader.readAsDataURL(blob);

    return new Promise((resolve, reject) => {
        reader.onloadend = function() {
            resolve(reader.result);
        };
    });

}
  
    // Function to capture video frames and send to backend
async function captureFrame(imageBlob) {
    if (!imageBlob) return;
    const imageTemp = imageBlob;
    // Send the image data to the backend for object detection
    
    const result = await fetch('http://127.0.0.1:5000/detect', {//api diganti nanti
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image: imageTemp })
    })
    // don't use then, use await
    const data = await result.json();
    return data;
}