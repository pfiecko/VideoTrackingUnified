<script>
// This is a modified video tracking script which was originally developed by CardinalPath.com
//enable the JavaScript API for an embedded player
for (var e = document.getElementsByTagName("iframe"), x = e.length; x--;)
  if (/youtube.com\/embed/.test(e[x].src))
     if(e[x].src.indexOf('enablejsapi=') === -1)
        e[x].src += (e[x].src.indexOf('?') ===-1 ? '?':'&') + 'enablejsapi=1';

var gtmYTListeners = []; // support multiple players on the same page
// attach our YT listener once the API is loaded
function onYouTubeIframeAPIReady() {
    for (var e = document.getElementsByTagName("iframe"), x = e.length; x--;) {
        if (/youtube.com\/embed/.test(e[x].src)) {
            gtmYTListeners.push(new YT.Player(e[x], {
                events: {
                    onStateChange: onPlayerStateChange,
                    onError: onPlayerError
                }
            }));
            YT.gtmLastAction = "p";
        }
    }
}

// listen for play, pause and end states
// also report % played every second
function onPlayerStateChange(e) {
    e["data"] == YT.PlayerState.PLAYING && setTimeout(onPlayerPercent, 1000, e["target"]);
    var video_data = e.target["getVideoData"](),
        label = video_data.title;
		// Get title of the current page
        var pageTitle = document.title;
    if (e["data"] == YT.PlayerState.PLAYING && YT.gtmLastAction == "p") {
	    label = video_data.title;
        dataLayer.push({
            'event': 'youtubeVideo',
		    'gaEventCategory': 'Youtube Videos',
			'gaEventAction': "Play",
            'gaEventLabel': label
        });
        YT.gtmLastAction = "";
    }
    if (e["data"] == YT.PlayerState.PAUSED) {
	label = video_data.title;
        dataLayer.push({
            'event': 'youtubeVideo',
			'gaEventCategory': 'Youtube Videos',
            'gaEventAction': "Pause",
            'gaEventLabel': label
        });
        YT.gtmLastAction = "p";
    }

}

// catch all to report errors through the GTM data layer
// once the error is exposed to GTM, it can be tracked in UA as an event!
function onPlayerError(e) {
    dataLayer.push({
        'event': 'youtubeVideo',
		'gaEventCategory': 'Youtube Videos',
        'gaEeventAction': 'Error',
        'gaEventLabel': "youtube:" + e["target"]["src"] + "-" + e["data"]
    })
}

// report the % played if it matches 0%, 25%, 50%, 75% or completed
function onPlayerPercent(e) {
    if (e["getPlayerState"]() == YT.PlayerState.PLAYING) {
        var t = e["getDuration"]() - e["getCurrentTime"]() <= 1.5 ? 1 : (Math.floor(e["getCurrentTime"]() / e

["getDuration"]() * 4) / 4).toFixed(2);         if (!e["lastP"] || t > e["lastP"]) {
            var video_data = e["getVideoData"](),
                label = video_data.title;
				// Get title of the current page
                var pageTitle = document.title;
            e["lastP"] = t;
			label = video_data.title;
          	var action = t * 100 + "%"
          dataLayer.push({
                'event': 'youtubeVideo',
				'gaEventCategory': 'Youtube Videos',
                'gaEventAction': action,
                'gaEeventLabel': label
            })
        }
        e["lastP"] != 1 && setTimeout(onPlayerPercent, 1000, e);
    }
}

// load the Youtube JS api and get going
var j = document.createElement("script"),
    f = document.getElementsByTagName("script")[0];
j.src = "//www.youtube.com/iframe_api";
j.async = true;
f.parentNode.insertBefore(j, f);
</script>
