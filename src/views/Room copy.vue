<template>
  <v-container>
    <!-- {{currentRoom.name}} -->
    <v-layout>
      <!-- <div v-for="(peer, p) in currentRoom.users" :key="p">
        <VideoStream :user="peer" />
      </div>-->
      <video id="myvideo" width="250" height="250" autoplay></video>
      <video id="othervideo" width="250" height="250" autoplay></video>
      <!-- <VideoStream :user="`ikke`" /> -->
      <!-- <VideoStream :user="`denanderen`" /> -->
      <!-- <Chat/> -->
      <!-- <v-container absolute fluid class="pa-0" fill-height>
          <v-layout column fill-height justify-space-between>
            <v-flex class="scroll" v-autoscroll>
              <ChatMessage :message="message" v-for="(message, index) in messages" :key="index"
                :mine="message.from == user.name" />
            </v-flex>
            <div>
              <v-layout>
                <v-textarea @keydown.enter.exact.prevent @keyup.enter.exact="checkAndSendMessage" :key="chatMessageKey"
                  autofocus label="Message" box v-model="message" append-icon="send" @click:append="checkAndSendMessage"
                  persistent-hint :hint="randomHint" rows="1" auto-grow />
              </v-layout>
            </div>
          </v-layout>
      </v-container>-->
    </v-layout>
  </v-container>
</template>

<script>

import { mapActions, mapGetters } from "vuex"

import VideoStream from "../components/VideoStream"
import Chat from "../components/Chat"
import ChatMessage from "../components/ChatMessage"
import JanusClient from "janus-videoroom-client"
import Janus from "../plugins/janus"
// import { JimberJanus } from "./../plugins/jimberJanus";
// import JanusClient from "janus-videoroom-client";

export default {
  components: {
    VideoStream,
    Chat
  },
  data: () => ({
    // peers: [{ name: 'badjas' }, { name: 'cunt' }, { name: 'singlecore' }]
    // jimberJanus: new JimberJanus()
    myroom: 0
  }),
  computed: {
    ...mapGetters(["currentRoom", "userName"]),
    roomName() {
      return this.$route.params.roomName
    }
  },
  mounted() {
    document.title = `FFC - ${this.roomName}`
    console.log("Mounted")

    this.setCurrentRoom(this.roomName)
    var tmpId = 0;

    for (var i = 0; i < this.roomName.length; i++) {
      console.log(this.roomName.charCodeAt(i))
      tmpId = tmpId + this.roomName.charCodeAt(i);
    }

    // tmpId = tmpId;
    console.log("Room name translates to id: " + tmpId);

    var server = null;
    if(window.location.protocol === 'http:')
      server = "http://" + window.location.hostname + ":8088/janus";
    else
      server = "https://" + window.location.hostname + ":8089/janus";

    var janus = null;
    var sfutest = null;
    var opaqueId = "videoroomtest-"+Janus.randomString(12);

    // var myroom = 1234;	// Demo room
    var myusername = null;
    var myid = null;
    var mystream = null;
    // We use this other ID just to map our subscriptions to us
    var mypvtid = null;

    var feeds = [];
    var bitrateTimer = [];

    var doSimulcast = (getQueryStringValue("simulcast") === "yes" || getQueryStringValue("simulcast") === "true");
    var doSimulcast2 = (getQueryStringValue("simulcast2") === "yes" || getQueryStringValue("simulcast2") === "true");

    var page = this;

    Janus.init({
      debug: "all", 
      callback: function() {

        janus = new Janus({
          server: 'http://localhost:8088/janus',
          success: function() {
            console.log("janus success")

            janus.attach({
              //opaqueId: 'videoroomtest-' + Janus.randomString(12),
              plugin: 'janus.plugin.videoroom',
              success: function(pluginHandle) {
									// $('#details').remove();
									sfutest = pluginHandle;
									Janus.log("Plugin attached! (" + sfutest.getPlugin() + ", id=" + sfutest.getId() + ")");
                  Janus.log("  -- This is a publisher/manager");

                  // myroom = 9456

                  // Retrieve rooms
                  sfutest.send({
                    message: {
                      'request': 'list',
                      message: {
                        'audio': true,
                        'video': true
                      }
                    },
                    error: (err) => {
                      console.error('Error retrieving list of rooms: ', err)
                    },
                    success: (data) => {
                      console.log('List of rooms: ', data.list)
                      if (data.list.some(room => room.room === tmpId)) {
                        console.log("ROOM EXISTS")

                        var username = "SingleCore";

                        var register = { "request": "join", "room": tmpId, "ptype": "publisher", "display": username };
                        myusername = username;
                        sfutest.send({"message": register});

                      } else {
                        console.log("ROOM DOESNT EXIST, WE NEED TO CREATE IT!")
                        console.log("Attempting to create: ", tmpId)

                        sfutest.send({
                          message: {
                            'request': 'create',
                            'room': tmpId,
                            'description': this.roomName,
                            'is_private': false
                          },
                          error: (err) => {
                            console.log('Error creating room: ', err)
                          },
                          success: (data) => {
                            console.log('Success creating room: ', data)
                            
                            var username = "SingleCore";

                            var register = { "request": "join", "room": tmpId, "ptype": "publisher", "display": username };
                            myusername = username;
                            sfutest.send({"message": register});

                          }
                        })

                      }
                    }
                  })

                  // createrom if not exists



                  
									// Prepare the username registration
									// $('#videojoin').removeClass('hide').show();
									// $('#registernow').removeClass('hide').show();
									// $('#register').click(registerUsername);
									// $('#username').focus();
									// $('#start').removeAttr('disabled').html("Stop")
									// 	.click(function() {
									// 		$(this).attr('disabled', true);
									// 		janus.destroy();
									// 	});
								},
								error: function(error) {
									Janus.error("  -- Error attaching plugin...", error);
									// bootbox.alert("Error attaching plugin... " + error);
								},
								consentDialog: function(on) {
									Janus.debug("Consent dialog should be " + (on ? "on" : "off") + " now");
									// if(on) {
									// 	// Darken screen and show hint
									// 	$.blockUI({
									// 		message: '<div><img src="up_arrow.png"/></div>',
									// 		css: {
									// 			border: 'none',
									// 			padding: '15px',
									// 			backgroundColor: 'transparent',
									// 			color: '#aaa',
									// 			top: '10px',
									// 			left: (navigator.mozGetUserMedia ? '-100px' : '300px')
									// 		} });
									// } else {
									// 	// Restore screen
									// 	$.unblockUI();
									// }
								},
								mediaState: function(medium, on) {
									Janus.log("Janus " + (on ? "started" : "stopped") + " receiving our " + medium);
								},
								webrtcState: function(on) {
									Janus.log("Janus says our WebRTC PeerConnection is " + (on ? "up" : "down") + " now");
									// $("#videolocal").parent().parent().unblock();
									if(!on)
										return;
									// $('#publish').remove();
									// This controls allows us to override the global room bitrate cap
									// $('#bitrate').parent().parent().removeClass('hide').show();
									// $('#bitrate a').click(function() {
									// 	var id = $(this).attr("id");
									// 	var bitrate = parseInt(id)*1000;
									// 	if(bitrate === 0) {
									// 		Janus.log("Not limiting bandwidth via REMB");
									// 	} else {
									// 		Janus.log("Capping bandwidth to " + bitrate + " via REMB");
									// 	}
									// 	$('#bitrateset').html($(this).html() + '<span class="caret"></span>').parent().removeClass('open');
									// 	sfutest.send({"message": { "request": "configure", "bitrate": bitrate }});
									// 	return false;
									// });
								},
								onmessage: function(msg, jsep) {
									Janus.debug(" ::: Got a message (publisher) :::");
									Janus.debug(msg);
									var event = msg["videoroom"];
									Janus.debug("Event: " + event);
									if(event != undefined && event != null) {
										if(event === "joined") {
											// Publisher/manager created, negotiate WebRTC and attach to existing feeds, if any
											myid = msg["id"];
											mypvtid = msg["private_id"];
											Janus.log("Successfully joined room " + msg["room"] + " with ID " + myid);
											publishOwnFeed(true);
											// Any new feed to attach to?
											if(msg["publishers"] !== undefined && msg["publishers"] !== null) {
												var list = msg["publishers"];
												Janus.debug("Got a list of available publishers/feeds:");
												Janus.debug(list);
												for(var f in list) {
													var id = list[f]["id"];
													var display = list[f]["display"];
													var audio = list[f]["audio_codec"];
													var video = list[f]["video_codec"];
													Janus.debug("  >> [" + id + "] " + display + " (audio: " + audio + ", video: " + video + ")");
													newRemoteFeed(id, display, audio, video);
												}
											}
										} else if(event === "destroyed") {
											// The room has been destroyed
											Janus.warn("The room has been destroyed!");
											// bootbox.alert("The room has been destroyed", function() {
											// 	window.location.reload();
											// });
										} else if(event === "event") {
											// Any new feed to attach to?
											if(msg["publishers"] !== undefined && msg["publishers"] !== null) {
												var list = msg["publishers"];
												Janus.debug("Got a list of available publishers/feeds:");
												Janus.debug(list);
												for(var f in list) {
													var id = list[f]["id"];
													var display = list[f]["display"];
													var audio = list[f]["audio_codec"];
													var video = list[f]["video_codec"];
													Janus.debug("  >> [" + id + "] " + display + " (audio: " + audio + ", video: " + video + ")");
													newRemoteFeed(id, display, audio, video);
												}
											} else if(msg["leaving"] !== undefined && msg["leaving"] !== null) {
												// One of the publishers has gone away?
												var leaving = msg["leaving"];
												Janus.log("Publisher left: " + leaving);
												var remoteFeed = null;
												for(var i=1; i<6; i++) {
													if(feeds[i] != null && feeds[i] != undefined && feeds[i].rfid == leaving) {
														remoteFeed = feeds[i];
														break;
													}
												}
												if(remoteFeed != null) {
													Janus.debug("Feed " + remoteFeed.rfid + " (" + remoteFeed.rfdisplay + ") has left the room, detaching");
													// $('#remote'+remoteFeed.rfindex).empty().hide();
													// $('#videoremote'+remoteFeed.rfindex).empty();
													feeds[remoteFeed.rfindex] = null;
													remoteFeed.detach();
												}
											} else if(msg["unpublished"] !== undefined && msg["unpublished"] !== null) {
												// One of the publishers has unpublished?
												var unpublished = msg["unpublished"];
												Janus.log("Publisher left: " + unpublished);
												if(unpublished === 'ok') {
													// That's us
													sfutest.hangup();
													return;
												}
												var remoteFeed = null;
												for(var i=1; i<6; i++) {
													if(feeds[i] != null && feeds[i] != undefined && feeds[i].rfid == unpublished) {
														remoteFeed = feeds[i];
														break;
													}
												}
												if(remoteFeed != null) {
													Janus.debug("Feed " + remoteFeed.rfid + " (" + remoteFeed.rfdisplay + ") has left the room, detaching");
													// $('#remote'+remoteFeed.rfindex).empty().hide();
													// $('#videoremote'+remoteFeed.rfindex).empty();
													feeds[remoteFeed.rfindex] = null;
													remoteFeed.detach();
												}
											} else if(msg["error"] !== undefined && msg["error"] !== null) {
												// if(msg["error_code"] === 426) {
												// 	// This is a "no such room" error: give a more meaningful description
												// 	bootbox.alert(
												// 		"<p>Apparently room <code>" + myroom + "</code> (the one this demo uses as a test room) " +
												// 		"does not exist...</p><p>Do you have an updated <code>janus.plugin.videoroom.cfg</code> " +
												// 		"configuration file? If not, make sure you copy the details of room <code>" + myroom + "</code> " +
												// 		"from that sample in your current configuration file, then restart Janus and try again."
												// 	);
												// } else {
												// 	bootbox.alert(msg["error"]);
												// }
											}
										}
									}
									if(jsep !== undefined && jsep !== null) {
										Janus.debug("Handling SDP as well...");
										Janus.debug(jsep);
										sfutest.handleRemoteJsep({jsep: jsep});
										// Check if any of the media we wanted to publish has
										// been rejected (e.g., wrong or unsupported codec)
										var audio = msg["audio_codec"];
										if(mystream && mystream.getAudioTracks() && mystream.getAudioTracks().length > 0 && !audio) {
											// Audio has been rejected
											toastr.warning("Our audio stream has been rejected, viewers won't hear us");
										}
										var video = msg["video_codec"];
										if(mystream && mystream.getVideoTracks() && mystream.getVideoTracks().length > 0 && !video) {
											// Video has been rejected
											toastr.warning("Our video stream has been rejected, viewers won't see us");
											// Hide the webcam video
											// $('#myvideo').hide();
											// $('#videolocal').append(
											// 	'<div class="no-video-container">' +
											// 		'<i class="fa fa-video-camera fa-5 no-video-icon" style="height: 100%;"></i>' +
											// 		'<span class="no-video-text" style="font-size: 16px;">Video rejected, no webcam</span>' +
											// 	'</div>');
										}
									}
								},
								onlocalstream: function(stream) {
									Janus.debug(" ::: Got a local stream :::");
									mystream = stream;
									Janus.debug(stream);
									// $('#videojoin').hide();
									// $('#videos').removeClass('hide').show();
									// if($('#myvideo').length === 0) {
									// 	$('#videolocal').append('<video class="rounded centered" id="myvideo" width="100%" height="100%" autoplay playsinline muted="muted"/>');
									// 	// Add a 'mute' button
									// 	$('#videolocal').append('<button class="btn btn-warning btn-xs" id="mute" style="position: absolute; bottom: 0px; left: 0px; margin: 15px;">Mute</button>');
									// 	$('#mute').click(toggleMute);
									// 	// Add an 'unpublish' button
									// 	$('#videolocal').append('<button class="btn btn-warning btn-xs" id="unpublish" style="position: absolute; bottom: 0px; right: 0px; margin: 15px;">Unpublish</button>');
									// 	$('#unpublish').click(unpublishOwnFeed);
									// }
                  // $('#publisher').removeClass('hide').html(myusername).show();
                  
                  Janus.attachMediaStream(document.getElementById('myvideo'), stream);
                  
                  // $("#myvideo").get(0).muted = "muted";
                  
									if(sfutest.webrtcStuff.pc.iceConnectionState !== "completed" &&
											sfutest.webrtcStuff.pc.iceConnectionState !== "connected") {
										// $("#videolocal").parent().parent().block({
										// 	message: '<b>Publishing...</b>',
										// 	css: {
										// 		border: 'none',
										// 		backgroundColor: 'transparent',
										// 		color: 'white'
										// 	}
										// });
                  }
                  
									var videoTracks = stream.getVideoTracks();
									// if(videoTracks === null || videoTracks === undefined || videoTracks.length === 0) {
									// 	// No webcam
									// 	$('#myvideo').hide();
									// 	if($('#videolocal .no-video-container').length === 0) {
									// 		$('#videolocal').append(
									// 			'<div class="no-video-container">' +
									// 				'<i class="fa fa-video-camera fa-5 no-video-icon"></i>' +
									// 				'<span class="no-video-text">No webcam available</span>' +
									// 			'</div>');
									// 	}
									// } else {
									// 	$('#videolocal .no-video-container').remove();
									// 	$('#myvideo').removeClass('hide').show();
									// }
								},
								onremotestream: function(stream) {
									// The publisher stream is sendonly, we don't expect anything here
								},
								oncleanup: function() {
									Janus.log(" ::: Got a cleanup notification: we are unpublished now :::");
									mystream = null;
									// $('#videolocal').html('<button id="publish" class="btn btn-primary">Publish</button>');
									// $('#publish').click(function() { publishOwnFeed(true); });
									// $("#videolocal").parent().parent().unblock();
									// $('#bitrate').parent().parent().addClass('hide');
									// $('#bitrate a').unbind('click');
								}
            })

          },
          error: function(error) {
            console.log("janus Error")
            console.log(error)
					},
					destroyed: function() {
						console.log("janus destroyed")
					}
        })
      }
    })

    function publishOwnFeed(useAudio) {
      sfutest.createOffer(
      {
        media: { audioRecv: false, videoRecv: false, audioSend: useAudio, videoSend: true },	// Publishers are sendonly
        simulcast: doSimulcast,
        simulcast2: doSimulcast2,
        success: function(jsep) {
          Janus.debug("Got publisher SDP!");
          Janus.debug(jsep);

          var publish = { "request": "configure", "audio": useAudio, "video": true };
          sfutest.send({"message": publish, "jsep": jsep});
        },
        error: function(error) {
          Janus.error("WebRTC error:", error);
          if (useAudio) {
            publishOwnFeed(false);
          } else {
            bootbox.alert("WebRTC error... " + JSON.stringify(error));
            $('#publish').removeAttr('disabled').click(function() { publishOwnFeed(true); });
          }
        }
      });
    }

    function newRemoteFeed(id, display, audio, video) {
      // A new feed has been published, create a new plugin handle and attach to it as a subscriber
      var remoteFeed = null;
      janus.attach(
        {
          plugin: "janus.plugin.videoroom",
          opaqueId: opaqueId,
          success: function(pluginHandle) {
            remoteFeed = pluginHandle;
            remoteFeed.simulcastStarted = false;
            Janus.log("Plugin attached! (" + remoteFeed.getPlugin() + ", id=" + remoteFeed.getId() + ")");
            Janus.log("  -- This is a subscriber");
            // We wait for the plugin to send us an offer
            var subscribe = { "request": "join", "room": tmpId, "ptype": "subscriber", "feed": id, "private_id": mypvtid };
            // In case you don't want to receive audio, video or data, even if the
            // publisher is sending them, set the 'offer_audio', 'offer_video' or
            // 'offer_data' properties to false (they're true by default), e.g.:
            // 		subscribe["offer_video"] = false;
            // For example, if the publisher is VP8 and this is Safari, let's avoid video
            if(Janus.webRTCAdapter.browserDetails.browser === "safari" &&
                (video === "vp9" || (video === "vp8" && !Janus.safariVp8))) {
              if(video)
                video = video.toUpperCase()
              toastr.warning("Publisher is using " + video + ", but Safari doesn't support it: disabling video");
              subscribe["offer_video"] = false;
            }
            remoteFeed.videoCodec = video;
            remoteFeed.send({"message": subscribe});
          },
          error: function(error) {
            Janus.error("  -- Error attaching plugin...", error);
            //bootbox.alert("Error attaching plugin... " + error);
          },
          onmessage: function(msg, jsep) {
            Janus.debug(" ::: Got a message (subscriber) :::");
            Janus.debug(msg);
            var event = msg["videoroom"];
            Janus.debug("Event: " + event);
            if(msg["error"] !== undefined && msg["error"] !== null) {
              bootbox.alert(msg["error"]);
            } else if(event != undefined && event != null) {
              if(event === "attached") {
                // Subscriber created and attached
                for(var i=1;i<6;i++) {
                  if(feeds[i] === undefined || feeds[i] === null) {
                    feeds[i] = remoteFeed;
                    remoteFeed.rfindex = i;
                    break;
                  }
                }
                remoteFeed.rfid = msg["id"];
                remoteFeed.rfdisplay = msg["display"];
                // if(remoteFeed.spinner === undefined || remoteFeed.spinner === null) {
                //   var target = document.getElementById('videoremote'+remoteFeed.rfindex);
                //   remoteFeed.spinner = new Spinner({top:100}).spin(target);
                // } else {
                //   remoteFeed.spinner.spin();
                // }
                Janus.log("Successfully attached to feed " + remoteFeed.rfid + " (" + remoteFeed.rfdisplay + ") in room " + msg["room"]);
                // $('#remote'+remoteFeed.rfindex).removeClass('hide').html(remoteFeed.rfdisplay).show();
              } else if(event === "event") {
                // Check if we got an event on a simulcast-related event from this publisher
                var substream = msg["substream"];
                var temporal = msg["temporal"];
                if((substream !== null && substream !== undefined) || (temporal !== null && temporal !== undefined)) {
                  if(!remoteFeed.simulcastStarted) {
                    remoteFeed.simulcastStarted = true;
                    // Add some new buttons
                    // addSimulcastButtons(remoteFeed.rfindex, remoteFeed.videoCodec === "vp8" || remoteFeed.videoCodec === "h264");
                  }
                  // We just received notice that there's been a switch, update the buttons
                  // updateSimulcastButtons(remoteFeed.rfindex, substream, temporal);
                }
              } else {
                // What has just happened?
              }
            }
            if(jsep !== undefined && jsep !== null) {
              Janus.debug("Handling SDP as well...");
              Janus.debug(jsep);
              // Answer and attach
              remoteFeed.createAnswer(
                {
                  jsep: jsep,
                  // Add data:true here if you want to subscribe to datachannels as well
                  // (obviously only works if the publisher offered them in the first place)
                  media: { audioSend: false, videoSend: false },	// We want recvonly audio/video
                  success: function(jsep) {
                    Janus.debug("Got SDP!");
                    Janus.debug(jsep);
                    var body = { "request": "start", "room": tmpId };
                    remoteFeed.send({"message": body, "jsep": jsep});
                  },
                  error: function(error) {
                    Janus.error("WebRTC error:", error);
                    // bootbox.alert("WebRTC error... " + JSON.stringify(error));
                  }
                });
            }
          },
          webrtcState: function(on) {
            Janus.log("Janus says this WebRTC PeerConnection (feed #" + remoteFeed.rfindex + ") is " + (on ? "up" : "down") + " now");
          },
          onlocalstream: function(stream) {
            // The subscriber stream is recvonly, we don't expect anything here
          },
          onremotestream: function(stream) {
            Janus.debug("Remote feed #" + remoteFeed.rfindex);
            var addButtons = false;
            // if($('#remotevideo'+remoteFeed.rfindex).length === 0) {
            //   addButtons = true;
            //   // No remote video yet
            //   // $('#videoremote'+remoteFeed.rfindex).append('<video class="rounded centered" id="waitingvideo' + remoteFeed.rfindex + '" width=320 height=240 />');
            //   // $('#videoremote'+remoteFeed.rfindex).append('<video class="rounded centered relative hide" id="remotevideo' + remoteFeed.rfindex + '" width="100%" height="100%" autoplay playsinline/>');
            //   // $('#videoremote'+remoteFeed.rfindex).append(
            //   //   '<span class="label label-primary hide" id="curres'+remoteFeed.rfindex+'" style="position: absolute; bottom: 0px; left: 0px; margin: 15px;"></span>' +
            //   //   '<span class="label label-info hide" id="curbitrate'+remoteFeed.rfindex+'" style="position: absolute; bottom: 0px; right: 0px; margin: 15px;"></span>');
            //   // // Show the video, hide the spinner and show the resolution when we get a playing event
            //   $("#remotevideo"+remoteFeed.rfindex).bind("playing", function () {
            //     // if(remoteFeed.spinner !== undefined && remoteFeed.spinner !== null)
            //     //   remoteFeed.spinner.stop();
            //     // remoteFeed.spinner = null;
            //     // $('#waitingvideo'+remoteFeed.rfindex).remove();
            //     // if(this.videoWidth)
            //       // $('#remotevideo'+remoteFeed.rfindex).removeClass('hide').show();
            //     var width = this.videoWidth;
            //     var height = this.videoHeight;
            //     // $('#curres'+remoteFeed.rfindex).removeClass('hide').text(width+'x'+height).show();
            //     // if(Janus.webRTCAdapter.browserDetails.browser === "firefox") {
            //     //   // Firefox Stable has a bug: width and height are not immediately available after a playing
            //     //   // setTimeout(function() {
            //     //   //   var width = $("#remotevideo"+remoteFeed.rfindex).get(0).videoWidth;
            //     //   //   var height = $("#remotevideo"+remoteFeed.rfindex).get(0).videoHeight;
            //     //   //   $('#curres'+remoteFeed.rfindex).removeClass('hide').text(width+'x'+height).show();
            //     //   // }, 2000);
            //     // }
            //   });
            // }

            Janus.attachMediaStream(document.getElementById('othervideo'), stream);

            var videoTracks = stream.getVideoTracks();

            // if(videoTracks === null || videoTracks === undefined || videoTracks.length === 0) {
            //   // No remote video
            //   $('#remotevideo'+remoteFeed.rfindex).hide();
            //   if($('#videoremote'+remoteFeed.rfindex + ' .no-video-container').length === 0) {
            //     $('#videoremote'+remoteFeed.rfindex).append(
            //       '<div class="no-video-container">' +
            //         '<i class="fa fa-video-camera fa-5 no-video-icon"></i>' +
            //         '<span class="no-video-text">No remote video available</span>' +
            //       '</div>');
            //   }
            // } else {
            //   $('#videoremote'+remoteFeed.rfindex+ ' .no-video-container').remove();
            //   $('#remotevideo'+remoteFeed.rfindex).removeClass('hide').show();
            // }
            if(!addButtons)
              return;
            if(Janus.webRTCAdapter.browserDetails.browser === "chrome" || Janus.webRTCAdapter.browserDetails.browser === "firefox" ||
                Janus.webRTCAdapter.browserDetails.browser === "safari") {
              // $('#curbitrate'+remoteFeed.rfindex).removeClass('hide').show();
              // bitrateTimer[remoteFeed.rfindex] = setInterval(function() {
              //   // Display updated bitrate, if supported
              //   var bitrate = remoteFeed.getBitrate();
              //   // $('#curbitrate'+remoteFeed.rfindex).text(bitrate);
              //   // Check if the resolution changed too
              //   var width = $("#remotevideo"+remoteFeed.rfindex).get(0).videoWidth;
              //   var height = $("#remotevideo"+remoteFeed.rfindex).get(0).videoHeight;
              //   if(width > 0 && height > 0)
              //     $('#curres'+remoteFeed.rfindex).removeClass('hide').text(width+'x'+height).show();
              // }, 1000);
            }
          },
          oncleanup: function() {
            Janus.log(" ::: Got a cleanup notification (remote feed " + id + ") :::");
            // if(remoteFeed.spinner !== undefined && remoteFeed.spinner !== null)
            //   remoteFeed.spinner.stop();
            // remoteFeed.spinner = null;
            // $('#remotevideo'+remoteFeed.rfindex).remove();
            // $('#waitingvideo'+remoteFeed.rfindex).remove();
            // $('#novideo'+remoteFeed.rfindex).remove();
            // $('#curbitrate'+remoteFeed.rfindex).remove();
            // $('#curres'+remoteFeed.rfindex).remove();
            if(bitrateTimer[remoteFeed.rfindex] !== null && bitrateTimer[remoteFeed.rfindex] !== null)
              clearInterval(bitrateTimer[remoteFeed.rfindex]);
            bitrateTimer[remoteFeed.rfindex] = null;
            remoteFeed.simulcastStarted = false;
            // $('#simulcast'+remoteFeed.rfindex).remove();
          }
        });
    }

  },
  methods: {
    ...mapActions(["setCurrentRoom"]),
  },
  destroyed() {
    console.log("room destroyed");
  }
}

function getQueryStringValue(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
</script>

<style>
</style>
