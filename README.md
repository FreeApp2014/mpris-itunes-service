# iTunes MPRIS service
A service intended to integrate iTunes into D-Bus session
## Support
Supports setting metadata, pause, resume, next, previous
## Configuration
To use this you should
* Set `wineprefix` in index.js to location of your iTunes prefix
* In the prefix, install `wsh57` (`WINEPREFIX=/path/ winetricks wsh57`)
* Run using node
(A more streamlined procedure involving a systemd unit is under development)