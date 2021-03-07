$(document).ready(function () {
  // jQuery methods go here...

  setInterval(function () {
    $("#video-column > .card > .card-header").appendTo(".card-footer");
    $("#streamer-avatar").prependTo(".card-footer");
  }, 1000);

  $("#streamer-avatar > a > img").attr("height", "142");
  $("#streamer-avatar > a > img").attr("width", "142");
});
