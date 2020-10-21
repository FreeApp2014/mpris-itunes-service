const MprisPlayer = require("mpris-service");

const wineprefix = "~/ituneswine/"

const player = MprisPlayer({
    name: "itunes",
    identity: "Apple iTunes (wine)",
    supportedInterfaces: ["player"],
    supportedUriSchemes: ["file"],
    supportedMimeTypes: ["audio/mpeg", "audio/mp4a-latm", "audio/aiff"]
});

var cp = require('child_process');
let scriptOutput = "";
let child = cp.exec('script --return -qc "bash -c \'WINEPREFIX=' + wineprefix +' wine wscript ./com-scripts/mainLoop.js\' 2> /dev/null " /dev/null');
child.stdout.setEncoding('utf8');
child.stdout.on('data', function(data) {
    if (data.replace(/[\x00-\x1F\x7F]*/g, "").replace(/\[(\?25\S|K)/g, "") == "") return;
    let result = data.replace(/[\x00-\x1F\x7F]*/g, "").replace(/\[(\?25\S|K)/g, "");
    // console.log(require("util").inspect(result), result.length, result[0], result[result.length], result[result.length-1]);
    let obj;
    try {
        obj = JSON.parse(result);
    } catch {
        console.log(result);
    }
    if (obj.name){
        player.metadata = {
            "mpris:trackid": player.objectPath('track/' + Math.floor(Math.random() * 100)),
            "mpris.length": obj.duration * 1000 * 1000,
            "mpris:artUrl": "file://" + __dirname + "/com-scripts/artwork" + obj.artKey,
            "xesam:title": obj.name,
            "xesam:album": obj.album,
            "xesam:artist": [ obj.artist ]
        }
        player.playbackStatus = MprisPlayer.PLAYBACK_STATUS_PLAYING;
    } else {
        player.playbackStatus = obj.newStatus
    }
});

child.on('close', function(code) {
    console.log("Main loop exited, exiting script");
    process.exit();
});

player.getPosition = function() {
    // return the position of your player
    return 0;
  }

var events = ['raise', 'quit', 'stop', 'seek', 'position', 'open', 'volume', 'loopStatus', 'shuffle'];
events.forEach(function (eventName) {
	player.on(eventName, function () {
		console.log('Event:', eventName, arguments);
	});
});

function pause() {
    let a = cp.execSync('script --return -qc "bash -c \'WINEPREFIX=' + wineprefix +' wine wscript ./com-scripts/togglePlayPause.js\' 2> /dev/null " /dev/null').toString();
    switch (a) {
        case "0": 
            player.playbackStatus = "Paused";
            break;
        case "1":
            player.playbackStatus = MprisPlayer.PLAYBACK_STATUS_PLAYING;
    }
}

player.on("playpause", pause);
player.on("pause", pause);
player.on("play", pause);

player.on("next", () => {
    let a = cp.execSync('script --return -qc "bash -c \'WINEPREFIX=' + wineprefix +' wine wscript ./com-scripts/next.js\' 2> /dev/null " /dev/null').toString();
    switch (a) {
        case "0": 
            player.playbackStatus = "Stopped";
            break;
        case "1":
            player.playbackStatus = MprisPlayer.PLAYBACK_STATUS_PLAYING;
    }
})

player.on("previous", () => {
let a = cp.execSync('script --return -qc "bash -c \'WINEPREFIX=' + wineprefix +' wine wscript ./com-scripts/previous.js\' 2> /dev/null " /dev/null').toString();
    switch (a) {
        case "0": 
            player.playbackStatus = MprisPlayer.PLAYBACK_STATUS_PAUSED;
            break;
        case "1":
            player.playbackStatus = MprisPlayer.PLAYBACK_STATUS_PLAYING;
    }
})