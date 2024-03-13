import React from "react";
import { range } from "../../lib/utils";
import { Circle, CircleSlash } from "lucide-react";
import { MAX_MISTAKES } from "../../lib/constants";
import { GameStatusContext } from "../../providers/GameStatusProvider";
import badSmiski from "../../../public/bad-smiski.png";
import goodSmiski from "../../../public/good-smiski.png";

function SingleMistakeDisplay({ isUsed }) {
  return (
    <div>
      {isUsed ? (
        <img src={badSmiski} className="h-8 w-8 mt-1" />
      ) : (
        /* <CircleSlash className="h-4 w-4 mt-1 stroke-neutral-400" /> */
        /* <Circle className="h-4 w-4 mt-1 fill-green-300 stroke-cyan-300" /> */
        <img src={goodSmiski} className="h-8 w-8 mt-1" />
      )}
    </div>
  );
}

function NumberOfMistakesDisplay() {
  const { numMistakesUsed } = React.useContext(GameStatusContext);
  // array size of number of guess. [1, 2, 3, 4]
  const mistakeRange = range(MAX_MISTAKES);
  return (
    <div className="flex flex-row gap-x-4 justify-center items-center">
      <p className="text-base">Mistakes Remaining: </p>
      {mistakeRange.map((el) => (
        <SingleMistakeDisplay key={el} isUsed={el < numMistakesUsed} />
      ))}
    </div>
  );
}

export default NumberOfMistakesDisplay;
