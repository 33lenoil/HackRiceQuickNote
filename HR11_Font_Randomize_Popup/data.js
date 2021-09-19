var videoId = "BDqvzFY72mg";
const { spawn } = require('child_process');
const { DH_CHECK_P_NOT_PRIME } = require('constants');
const temperatures = []; // Store readings
const sensor = spawn('python', ['text_summarization.py', "BDqvzFY72mg"]);
sensor.stdout.on('data', function (data) {
    temperatures.push(String(data));
    console.log(temperatures);
});
