import React, { useEffect, useRef } from 'react';
import './App.css';

const win: any = window;

function App() {
  // Flag to indicate whether sport buff has started to init
  const initialisedSportBuff = useRef<boolean>(false);

  const videoContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialisedSportBuff.current) return;
    const init = async () => {
      const videoWrapper = videoContainerRef.current;
      if (!videoWrapper) return;
      const videoPlayer = videoWrapper.querySelector('video');
      if (!videoPlayer) return;
      let sportBuffContainer: Element;

      const appendContainer = (containerToAppend: Element) => {
        sportBuffContainer = containerToAppend;
        videoWrapper.appendChild(containerToAppend);
      };

      const destroyContainer = () => {
        if (!sportBuffContainer) return;
        videoWrapper.removeChild(sportBuffContainer);
      };

      const clientName = 'clientName';
      const streamId = 'streamId';

      const widget = await win.SportBuff.init({
        streamId,
        playlistMode: true,
        clientName,
        player: 'custom-functions',
        appendContainer,
        destroyContainer,
        addFullScreenButton: true,
        fullScreenElement: videoWrapper,
      });

      win.widget = widget;

      const handleMouseOver = () => widget.controls.showUi();
      const handleMouseOut = () => widget.controls.hideUi();

      videoWrapper.addEventListener('mouseover', handleMouseOver);
      videoWrapper.addEventListener('mouseout', handleMouseOut);

      // Only required for VOD
      const handleTimeUpdate = () => {
        widget.controls.updateTimeVOD(videoPlayer.currentTime || 0);
      };
      videoPlayer.addEventListener('timeupdate', handleTimeUpdate);
    };

    if (win.SportBuff) {
      console.log('window.SportBuff loaded');
      init();
    } else {
      console.log('window.SportBuff not loaded');
      win.onSportBuffReady = init;
    }

    initialisedSportBuff.current = true;

    return () => {
      if (win.widget) {
        win.widget.destroy();
      }
    };
  }, []);
  return (
    <div className="App">
      <div id="video-container" ref={videoContainerRef}>
        <video
          src="https://buffup-public.prod.buffup.net/video/FIFA_VOD_SHORT.mp4"
          controls
        />
      </div>
    </div>
  );
}

export default App;
