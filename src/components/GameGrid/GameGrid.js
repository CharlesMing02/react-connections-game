import React, { useState } from "react";

import WordButton from "../WordButton";

import * as styles from "./GameGrid.module.css";

import { useSpring, animated } from "react-spring";
import { PuzzleDataContext } from "../../providers/PuzzleDataProvider";
import { GameStatusContext } from "../../providers/GameStatusProvider";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Badge } from "../ui/badge";
import badSmiski from "../../../public/bad-smiski.png";
import { set } from "date-fns";

function WordRow({ words }) {
  return (
    <div className={`grid grid-cols-4 gap-2`}>
      {words.map((word) => (
        <WordButton key={word} word={word} fullCandidateSize={words.length} />
      ))}
    </div>
  );
}

export function SolvedWordRow({
  pickupLines = [{}],
  imageSource = "",
  ...props
}) {
  const DIFFICULTY_COLOR_MAP = {
    1: "rgb(74 222 128)", // green
    2: "rgb(251 191 36)", // amber
    3: "rgb(129 140 248)", //indigo
    4: "rgb(34 211 238)", //cyan
  };

  const color = `${DIFFICULTY_COLOR_MAP[props.difficulty]}`;

  const [hasBeenClicked, setHasBeenClicked] = React.useState(false);

  const springProps = useSpring({
    from: {
      opacity: 0,
      transform: "translateY(100%)",
    },
    to: {
      opacity: 1,
      transform: "translateY(0%)",
    },
    delay: 250,
  });
  // const isImageAvailable = props.imageSrc != "";
  const isImageAvailable = imageSource != "";
  // let pickupLinesText = ["No pickup lines available for this category."];
  // if (pickupLines.length > 1) {
  //   pickupLinesText = pickupLines.map((pickupLine) => pickupLine.line);
  // }

  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  const nextLine = () =>
    setCurrentLineIndex((currentLineIndex + 1) % pickupLines.length);
  const previousLine = () =>
    setCurrentLineIndex(
      (currentLineIndex - 1 + pickupLines.length) % pickupLines.length
    );

  return (
    <animated.div style={springProps}>
      <Popover>
        <PopoverTrigger asChild>
          <div
            className="cursor-pointer hover:animate-pulse shadow-md"
            style={{ backgroundColor: color, borderRadius: 8 }}
            onClick={() => setHasBeenClicked(true)}
          >
            {!hasBeenClicked && (
              <Badge className="animate-pulse absolute top-0 right-0 mr-2 mt-2">
                View More
              </Badge>
            )}
            <p className="font-space-mono font-bold pt-2 pl-4">
              {props.category}
            </p>
            <p className="font-space-mono font-thin pb-2 pl-4">
              {props.words.join(", ")}
            </p>
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="flex flex-col max-w-12 items-center py-0.5"
          sideOffset={0}
        >
          <div className="flex justify-between">
            <button onClick={previousLine} className="p-2">
              &lt;
            </button>
            <img
              src={
                isImageAvailable
                  ? `data:image/png;base64,${imageSource}`
                  : badSmiski
              }
              alt="Placeholder"
              className="w-60 h-60 rounded-lg"
            />
            <button onClick={nextLine} className="p-2">
              &gt;
            </button>
          </div>
          <p className="m-2 font-space-mono text-xs text-gray-800 text-center">
            {pickupLines[currentLineIndex]?.line || "No pickup lines."}
          </p>
        </PopoverContent>
      </Popover>
    </animated.div>
  );
}

function GameGrid({ gameRows, shouldGridShake, setShouldGridShake }) {
  const { submittedGuesses, isGameOver, isGameWon, solvedGameData } =
    React.useContext(GameStatusContext);
  // const [pickupLines, setPickupLines] = useState([]);

  const { gameData, pickupLines, images } = React.useContext(PuzzleDataContext);
  console.log("pickupLines: ", pickupLines);

  React.useEffect(() => {
    const shakeEffect = window.setTimeout(() => {
      setShouldGridShake(false);
      // this timeout should probably be calculated since it depends on animation values for the grid shake
    }, 2000);

    // cleanup timeout
    return () => window.clearTimeout(shakeEffect);
  }, [submittedGuesses]);

  const isGameOverAndLost = isGameOver && !isGameWon;
  const isGameOverAndWon = isGameOver && isGameWon;
  const isGameActive = !isGameOver;
  const isGameActiveWithAnySolvedRows =
    isGameActive && solvedGameData.length > 0;

  return (
    <div>
      {(isGameOverAndWon || isGameActiveWithAnySolvedRows) && (
        <div className="grid gap-y-2 pb-2">
          {solvedGameData.map((solvedRowObj) => (
            <SolvedWordRow
              key={solvedRowObj.category}
              {...solvedRowObj}
              pickupLines={
                pickupLines === null
                  ? [{}]
                  : pickupLines[solvedRowObj.difficulty - 1]
              }
              imageSource={!images ? "" : images[solvedRowObj.difficulty - 1]}
            />
          ))}
        </div>
      )}
      {isGameActive && (
        <div className={`grid gap-y-2 ${shouldGridShake ? styles.shake : ""}`}>
          {gameRows.map((row, idx) => (
            <WordRow key={idx} words={row} />
          ))}
        </div>
      )}
      {/* Show correct answers here after the game is over if they lost */}
      {isGameOverAndLost && (
        <div className="grid gap-y-2 pb-2">
          <p>The answer categories are below.</p>
          {gameData.map((obj) => (
            <SolvedWordRow
              key={obj.category}
              {...obj}
              pickupLines={
                pickupLines === null
                  ? [{}]
                  : pickupLines[solvedRowObj.difficulty - 1]
              }
              imageSource={!images ? "" : images[solvedRowObj.difficulty - 1]}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default GameGrid;
