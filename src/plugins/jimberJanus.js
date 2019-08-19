import Janus from './janus'
import vm from '../main'

var timeout = false
var currentBigScreen = 0
var switchDelay = 5000

var isWebRtcSupported = function () {
  return window.RTCPeerConnection !== undefined && window.RTCPeerConnection !== null && navigator.getUserMedia !== undefined && navigator.getUserMedia !== null
}

var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

export default class JimberJanus {
  constructor () {
    Janus.init({
      debug: false,
      callback: function () {
        if (!isWebRtcSupported()) console.error('WebRTC not supported in this browser.')
      }
    })
  }

  createJanus (serverip) {
    // var server = `https://${serverip}:8088/janus`
    var server = `http://localhost:8088/janus`
    // var server = `https://janus.conf.meetecho.com/janus`

    return new Promise((resolve, reject) => {
      var janus = new Janus({
        server: server,
        debug: true,
        // iceServers: [{ url: 'turn:numb.viagenie.ca', username: 'alexander.mol@jimber.org', credential: '!eC4gRCtCl3f' }],
        success: () => {
          resolve(janus)
        },
        mediaState: () => {
          console.log('mediastate')
        },
        onlocalstream: () => {
          console.log('onlocalstream')
        }
      })
    })
  }

  createReceiver (janus, receiverip, secret, pin) {
    var streamingPlugin = null

    return new Promise((resolve, reject) => {
      janus.attach({
        plugin: 'janus.plugin.videoroom',
        success: function (pluginHandle) {
          streamingPlugin = pluginHandle
          streamingPlugin.send({
            message: {
              'request': 'list',
              message: {
                'audio': true,
                'video': true
              }
            },
            error: (err) => {
              console.error(err)
            },
            success: (data) => {
              console.log(data)
            }
          })
          resolve(streamingPlugin)
        },
        error: function (error) {
          console.error('  -- Error attaching plugin...', error)
        },
        onmessage: function (msg, jsep) {
          Janus.debug(' ::: Got a message :::')
          Janus.debug(msg)
          if (jsep !== undefined && jsep !== null) {
            Janus.debug('Handling SDP as well...')
            Janus.debug(jsep)
            streamingPlugin.handleRemoteJsep({
              jsep: jsep
            })
          }
        },
        slowLink: function (uplink, nacks) {},
        oncleanup: function () {},
        onlocalstream: function (stream) {
          console.log('test')
        }
      })
    })
  }

  createStreamPlugin (janus) {
    return new Promise((resolve, reject) => {
      var streaming = null
      janus.attach({
        plugin: 'janus.plugin.streaming',
        success: function (pluginHandle) {
          streaming = pluginHandle
          console.log('successful streaming plugin')
          try {
            var stream = document.getElementById('ikke').srcObject
            console.log(stream)
            streaming.createOffer({
              stream: stream,
              success: (data) => {
                console.log('Successfully created offer', data)
                streaming.send({
                  message: {
                    request: 'create',
                    type: 'rtp',
                    video: true,
                    videoport: 4445,
                    videopt: 100,
                    videortpmap: ' opus/48000/2'
                  },
                  'jsep': data
                })
              },
              error: (err) => {
                console.log('Error while createing offer', err)
              }
            })
          } catch (error) {
            console.log(error)
          }

          resolve(streaming)
        },
        error: function (error) {
          Janus.error('  -- Error attaching plugin... ', error)
        },
        onmessage: function (msg, jsep) {
          console.log('Streaming plugin message', msg, jsep)
          if (jsep !== undefined && jsep !== null) {
            var answerObject = {
              jsep: jsep,
              media: {
                audio: false,
                video: false,
                audioSend: false,
                videoSend: false
              },
              success: function (jsep) {
                var body = {
                  'request': 'start'
                }
                streaming.send({
                  'message': body,
                  'jsep': jsep
                })
              },
              error: function (error) {
                Janus.error('WebRTC error:', error)
              },
              stream: document.getElementById('ikke').srcObject
            }

            if (document.getElementById('ikke').srcObject) {
              answerObject.stream = document.getElementById('ikke').srcObject
            }

            streaming.createAnswer(answerObject)
          }
        },
        slowLink: function (uplink, nacks) {},
        oncleanup: function () {},
        iceState: function (state) {
          if (state === 'checking' && isSafari && !window.navigator.userAgent.match(/iPad/i) && !window.navigator.userAgent.match(/iPhone/i)) {
            navigator.mediaDevices.getUserMedia({
              audio: true,
              video: true
            }).then((stream) => {
              console.log('got stream in safari')
            }).catch(e => {
              console.log("couldn't get stream in safari", e)
            })
          }
          console.log('iceState ', state)
        },
        mediaState: function (medium, on) {
          console.log('media state')
        },
        webrtcState: function (on) {},
        onlocalstream: function (stream) {
          console.log('onlocal', stream)
          document.getElementById('denanderen').srcObject = stream
          streaming.send({
            message: {
              'request': 'list',
              message: {
                'audio': true,
                'video': true
              }
            },
            error: (err) => {
              console.error('err request', err)
            },
            success: (data) => {
              console.log('success request', data)
            }
          })
        },
        onremotestream: function (stream) {
          console.log('onremote')
          // We have a remote stream (working PeerConnection!) to display
        }
      })
    })
  }

  getStream (streaming, id, pin, desktop) {
    var body = {
      'request': 'watch',
      id: parseInt(id),
      pin: pin
    }
    id = desktop ? 'bigScreen' : id
    streaming.onRemoteStream = function (stream) {
      Janus.debug(' ::: Got a remote rtp forward stream :::')
      Janus.debug(stream)
      if (!desktop) {
        var AudioContext = window.AudioContext || window.webkitAudioContext || false
        let audioContext = new AudioContext()
        if (audioContext) {
          let analyser = audioContext.createAnalyser()
          let microphone = audioContext.createMediaStreamSource(stream)
          let javascriptNode = audioContext.createScriptProcessor(2048, 1, 1)

          analyser.smoothingTimeConstant = 0.8
          analyser.fftSize = 1024

          microphone.connect(analyser)
          analyser.connect(javascriptNode)
          javascriptNode.connect(audioContext.destination)
          javascriptNode.onaudioprocess = function () {
            var array = new Uint8Array(analyser.frequencyBinCount)
            analyser.getByteFrequencyData(array)
            var values = 0

            var length = array.length
            for (var i = 0; i < length; i++) {
              values += (array[i])
            }

            var average = values / length
            if (average > 20) {
              if (currentBigScreen !== id && !timeout) {
                currentBigScreen = id
                timeout = true
                setTimeout(() => {
                  timeout = false
                }, switchDelay)
                if (!vm.$store.getters.someoneScreenSharing) {
                  vm.$store.dispatch('isMakingNoise', id)
                  vm.$store.dispatch('setBigScreenStream', {
                    desktop: desktop,
                    stream: stream
                  })
                }
              }
            }
          }
        }
      }
      if (!vm.$store.getters.someoneScreenSharing) {
        vm.$store.dispatch('isMakingNoise', id)
        vm.$store.dispatch('setBigScreenStream', {
          desktop: desktop,
          stream: stream
        })
      }
      if (document.getElementById(id)) {
        Janus.attachMediaStream(document.getElementById(id), stream)
        setInterval(function () {
          if (document.getElementById(id) && document.getElementById(id).readyState === 0) {
            Janus.attachMediaStream(document.getElementById(id), stream)
          }
        }, 30000)
      }
    }
    streaming.send({
      'message': body,
      success: (data) => {
        console.log('success', data)
      },
      error: (e) => {
        console.log(e)
      }
    })
  }
}
