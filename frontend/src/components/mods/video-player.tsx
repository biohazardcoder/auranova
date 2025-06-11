
import { Player } from 'video-react';
import 'video-react/dist/video-react.css';

const VideoPlayer = ({ videoUrl }:{videoUrl:string}) => {
  return (
    <div  className="video-container flex items-center justify-center" style={{ maxWidth: '800px', margin: 'auto' }}>
      <Player
        playsInline
        src={videoUrl}
      />
    </div>
  );
};

export default VideoPlayer;
