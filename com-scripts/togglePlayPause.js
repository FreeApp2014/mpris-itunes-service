var itunesApp = WScript.CreateObject("iTunes.Application");
itunesApp.playPause();
WScript.StdOut.Write(itunesApp.playerState);