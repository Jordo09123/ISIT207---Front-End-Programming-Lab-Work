// superman video buttons

var video = document.querySelector("#superman-video");
function PlayPause() {
    if (video.paused)
        video.play();
    else
        video.pause();
}

function Big() {
    video.style.width = "500px";
    video.style.height = "auto";
}

function Small() {
    video.style.width = "100px";
    video.style.height = "auto";
}

function Normal() {
    video.style.width = "200px";
    video.style.height = "auto";
}