function includeFile (filename) {
    var fso = new ActiveXObject ("Scripting.FileSystemObject");
    var file = fso.getFile(WScript.ScriptFullName);
    var path = fso.getParentFolderName(file);
    var fileStream = fso.openTextFile (path + "\\" + filename);
    var fileData = fileStream.readAll();
    fileStream.Close();
    eval(fileData);
}
includeFile("json2.js"); // Load JSON support

var itunesApp = WScript.CreateObject("iTunes.Application");

function ITEvent_OnPlayerPlayEvent (newTrack) {
    //Write newline to stdout to separate outputs
    WScript.StdOut.WriteBlankLines(1);
    //Save album image to a file
    var fso = new ActiveXObject ("Scripting.FileSystemObject");
    var file = fso.getFile(WScript.ScriptFullName);
    var path = fso.getParentFolderName(file);
    //Delete all previous files
    var f = fso.getFolder(path);
    var fc = new Enumerator(f.files);
    for (; !fc.atEnd(); fc.moveNext()) {
        if (fc.item().Name.indexOf("artwork") != -1) fc.item().Delete();
    }
    //Write current image
    var a = Math.random() * 10;
    newTrack.artwork.item(1).saveArtworkToFile(path + "\\artwork" + a);
    var updatePacket = {
        newStatus: itunesApp.playerState,
        name: newTrack.name,
        artist: newTrack.artist,
        album: newTrack.album,
        duration: newTrack.duration,
        position: itunesApp.playerPosition,
        artKey: a
    }
    WScript.StdOut.Write(JSON.stringify(updatePacket));
}

function ITEvent_OnQuittingEvent(){
    WScript.Quit()
}

function ITEvent_OnAboutToPromptUserToQuitEvent(){
    WScript.DisconnectObject(itunesApp);
    WScript.Quit();
}

var ITEvent_OnPlayerPlayingTrackChangedEvent = ITEvent_OnPlayerPlayEvent;
var ITEvent_OnPlayerStopEvent = ITEvent_OnPlayerPlayEvent;

WScript.ConnectObject(itunesApp, "ITEvent_");

while(true) WScript.Sleep(100);