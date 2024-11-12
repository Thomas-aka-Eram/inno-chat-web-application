import React, { useEffect, useRef } from "react";
import { Player } from "@lordicon/react";

interface PlayOnceProps {
  imglink: any;
  tsize: any;
  color: any;
  onComplete?: () => void; // Make onComplete optional
}

const defaultOnComplete = (playerRef: React.RefObject<Player>) => () => {
  if (playerRef.current) {
    setTimeout(() => {
      playerRef.current?.playFromBeginning();
    }, 500);
  }
};

const PlayOnce: React.FC<PlayOnceProps> = ({
  imglink,
  tsize,
  color,
  onComplete,
}) => {
  const playerRef = useRef<Player>(null);

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.playFromBeginning();
    }
  }, [imglink]); // Re-run the effect when imglink changes

  const handleComplete = onComplete || defaultOnComplete(playerRef);

  return (
    <Player
      ref={playerRef}
      icon={imglink}
      size={tsize}
      colorize={color}
      onComplete={handleComplete} // Use the passed or default onComplete function
    />
  );
};

export default PlayOnce;
