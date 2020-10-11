var itunesApp = WScript.CreateObject("iTunes.Application");
itunesApp.previousTrack();
WScript.StdOut.Write(itunesApp.playerState);