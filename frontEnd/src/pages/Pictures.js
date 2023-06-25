import React from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import 'firebase/compat/database';

const bucketName = 'waffle-hacks-2023-6dea4.appspot.com';

class Pictures extends React.Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
    this.state = {
      devices: [],
      selectedDeviceId: '',
      isRecording: false,
      capturedImage: null,
      images: [],
    };
    // Initialize Firebase
    const firebaseConfig = {
      apiKey: "AIzaSyAid6XyMWBz_Ofgsdf99N2wUVpuLIs0ZOw",
      authDomain: "waffle-hacks-2023-6dea4.firebaseapp.com",
      projectId: "waffle-hacks-2023-6dea4",
      databaseURL : "https://waffle-hacks-2023-6dea4-default-rtdb.firebaseio.com/",
      storageBucket: "waffle-hacks-2023-6dea4.appspot.com",
      messagingSenderId: "174592732626",
      appId: "1:174592732626:web:e21b5f44ead5a4f684ac0b"
    };
    firebase.initializeApp(firebaseConfig);
    this.databaseRef = firebase.database().ref('/');
    this.storageRef = firebase.storage().ref();
    let get = localStorage.getItem("images");
    if(get) try{
      this.state.images = JSON.parse(get);
      for(let i = 0; i<this.state.images.length; i++) this.state.images[i][2] = new Date(Date.parse(this.state.images[i][2]));
    }catch(e){console.log("Unable to load images due to "+e);}
  }

  componentDidMount() {
    this.databaseRef.on('value', this.handleDataChange);
    navigator.mediaDevices.enumerateDevices()
      .then((deviceList) => {
        const videoDevices = deviceList.filter((device) => device.kind === 'videoinput');
        this.setState({
          devices: videoDevices,
          selectedDeviceId: videoDevices[0]?.deviceId || '',
        });
      })
      .catch((error) => {
        console.log('Error accessing camera devices:', error);
      });
  }

  componentDidUpdate(prevProps, prevState) {
    const { selectedDeviceId, isRecording } = this.state;
    if (prevState.selectedDeviceId !== selectedDeviceId) {
      if (selectedDeviceId) {
        navigator.mediaDevices.getUserMedia({ video: { deviceId: selectedDeviceId } })
          .then((stream) => {
            this.videoRef.current.srcObject = stream;
            this.videoRef.current.addEventListener('loadedmetadata', () => {
              this.videoRef.current.play();
            });
          })
          .catch((error) => {
            console.log('Error accessing camera:', error);
          });
      }
    }

    if (prevState.isRecording !== isRecording) {
      if (isRecording) {
        this.startRecording();
      } else {
        this.stopRecording();
      }
    }
  }

  componentWillUnmount() {
    // Detach the listener when the component unmounts
    this.databaseRef.off('value', this.handleDataChange);
  }

  handleDeviceChange = (event) => {
    this.setState({ selectedDeviceId: event.target.value });
  };

  handleClick = () => {
    this.setState({ isRecording: !this.state.isRecording });
  };

  startRecording() {
    this.mediaRecorder = new MediaRecorder(this.videoRef.current.srcObject);
    this.chunks = [];

    this.mediaRecorder.addEventListener('dataavailable', (event) => {
      if (event.data.size > 0) {
        this.chunks.push(event.data);
      }
    });

    this.mediaRecorder.addEventListener('stop', () => {
      const recordedBlob = new Blob(this.chunks, { type: 'video/webm' });
      this.saveVideo(recordedBlob);
    });

    this.mediaRecorder.start();
  }

  stopRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.stop();
    }
  }

  saveVideo(recordedBlob) {
    const { selectedDeviceId } = this.state;
    const timestamp = Date.now().toString();
    const fileName = `video_${selectedDeviceId}_${timestamp}.webm`;
    let nImages = this.state.images.slice();
    nImages.push([`image_${selectedDeviceId}_${timestamp}!jpg`, true, new Date(), ""]);
    this.setState({images: nImages});
    const videoRef = this.storageRef.child(fileName);
    videoRef.put(recordedBlob).then(() => {
      console.log('Video uploaded successfully!');
    }).catch((error) => {
      console.log('Error uploading video:', error);
    });
  }

  handleDataChange = (snapshot) => {
    // Handle data change here
    const data = snapshot.val()
    if(data === null) return;
    const key = Object.keys(data)[0];
    const value = data[key];
    let nImages = this.state.images.slice();
    for(let i = 0; i<nImages.length; i++) if(nImages[i][1] && nImages[i][0] == key){
      nImages[i][0] = "https://firebasestorage.googleapis.com/v0/b/waffle-hacks-2023-6dea4.appspot.com/o/"+key.replace("!", ".")+"?alt=media";
      nImages[i][1] = false;
      nImages[i][3] = value;
      this.setState({images: nImages});
      localStorage.setItem("images", JSON.stringify(nImages));
      this.storageRef.child(key.replace("!", ".")).delete();
      break;
    }
  }

  render() {
    const { devices, selectedDeviceId, isRecording, capturedImage, images } = this.state;
    return (
      <div>
        <div>
          <label htmlFor="camera-select">Select Camera:</label>
          <select id="camera-select" value={selectedDeviceId} onChange={this.handleDeviceChange}>
            {devices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Camera ${device.deviceId}`}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button onClick={this.handleClick}>
            {this.state.isRecording ? "Stop":"Start"} Recording
          </button>
        </div>
        <video ref={this.videoRef} width="640" height="480" />
        <div className="d-flex flex-column align-items-center">
          {this.state.images.map((item, index) => {
            let hr = item[2].getHours(), min = item[2].getMinutes();
            return item[1] ? (
              // Placeholder image or loading spinner
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              // Render the loaded image
              <div>
              <div className="card text-bg-light mb-3 border border-3">
                <div className="card-header">{item[2].toDateString()} {hr%12}:{min < 10 ? ("0"):("")}{min} {hr>12?"PM":"AM"}</div>
                <button onClick={() => {
                  var result = window.confirm("Are you sure you want to delete this image. This action cannot be undone.");
                  if(result){
                    let nImages = images.slice()
                    nImages.splice(index, 1);
                    this.setState({images: nImages});
                    localStorage.setItem("images", JSON.stringify(nImages));
                  }}}>Delete</button>
                <img src={item[0]} alt="Unable to load picture" />
                  <div className="card-body">
                    <input type="text" value={item[3]} className="card-text" onChange={(event) => {
                      let nImages = this.state.images.slice();
                      nImages[index][3] = event.target.value;
                      localStorage.setItem("images", JSON.stringify(nImages));
                      this.setState({images: nImages});
                    }}/>
                  </div>
              </div>
              </div>
            );
          })}
        </div>
        </div>
    );
  }
}

export default Pictures;