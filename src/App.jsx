import { useState } from "react";
import "./App.css";

//MediaRecorder用のグローバル変数
let recorder = null;
//録画した映像を格納する配列
let chunks = [];

function App() {
  const [recording, setRecording] = useState(true);

  //初期化処理
  useEffect(() => {
    changeRecording();
    setRecording(!recording);
  }, []);

  //録画開始をさせる処理
  const startRecording = () => {
    recorder.start();
    console.log(recorder.state);
    console.log("recorgin now : " + recording);
    setRecording(!recording);
  };

  //録画終了をさせる処理
  const stopRecording = async () => {
    recorder.stop();
    console.log(recorder.state);
    console.log("recorgin now : " + recording);
    setRecording(!recording);
  };

  //レコーディング状態を交互に変更する
  const changeRecording = () => {
    navigator.mediaDevices
      .getUserMedia({
        audio: { recording },
        video: true,
      })
      .then((stream) => {
        //MediaRecorderの設定
        recorder = new MediaRecorder(stream, {
          mimeType: "video/webm; codecs=vp9",
          audioBitsPerSecond: 16 * 1000,
          videoBitsPerSecond: 5 * 1000 * 1000,
        });

        //(recorder.stop時に発火)
        recorder.addEventListener("dataavailable", (event) => {
          chunks.push(event.data);
        });

        //録画終了
        recorder.addEventListener("stop", async(e) => {
          const recordingFile = new File(chunks, "test.webm", { type: "video/webm" });
          const video = document.getElementById("recordedVideo");
          console.log(recordingFile.lastModified);
          video.src = URL.createObjectURL(recordingFile);
          video.loop = true;
          video.play();
          // video.srcObject = recordingFile;//srcObjectは使えない(ブラウザの問題？？)
        });

        //録画した映像をvideoタグに流す
        const video = document.getElementById("nowCameraVideo");
        video.srcObject = stream;
        video.muted = true;
        video.play();
      });
  };

  return (
    <>
      <button onClick={startRecording}>REC STSRT</button>
      <button onClick={stopRecording}>REC STOP</button>
      <video id="nowCameraVideo"></video>
      <video id="recordedVideo"></video>
    </>
  );
}

export default App;
