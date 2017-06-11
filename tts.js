const tts = require('yandex-speech');
const config = require('./config')
const fs = require('fs')
module.exports = function(message, done) {
    let filename = 'tts-temp.mp3'
    tts.TTS({
        text: message,
        file: filename,
    }, function() {
        done()
    });
}
