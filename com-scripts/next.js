var itunesApp = WScript.CreateObject("iTunes.Application");
itunesApp.nextTrack();
WScript.StdOut.Write(itunesApp.playerState);