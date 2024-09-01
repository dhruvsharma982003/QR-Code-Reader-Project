const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const resultElement = document.getElementById('result');
const canvasContext = canvas.getContext('2d');

navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then((stream) => {
        video.srcObject = stream;
        video.setAttribute('playsinline', true); // required to tell iOS safari we don't want fullscreen
        video.play();
        requestAnimationFrame(tick);
    })
    .catch((err) => {
        console.error("Error accessing camera: " + err);
        resultElement.textContent = "Error accessing camera.";
    });

function tick() {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.hidden = false;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvasContext.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvasContext.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
            drawLine(canvasContext, code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
            drawLine(canvasContext, code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
            drawLine(canvasContext, code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
            drawLine(canvasContext, code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");
            resultElement.textContent = `QR Code Data: ${code.data}`;
        } else {
            resultElement.textContent = "Scanning...";
        }
    }
    requestAnimationFrame(tick);
}

function drawLine(context, begin, end, color) {
    context.beginPath();
    context.moveTo(begin.x, begin.y);
    context.lineTo(end.x, end.y);
    context.lineWidth = 4;
    context.strokeStyle = color;
    context.stroke();
}
