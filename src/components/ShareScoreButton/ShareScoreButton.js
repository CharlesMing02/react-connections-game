import React from "react";
import { cn } from "../../lib/utils";
import Sparkles from "../Sparkles";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { shareStatus } from "../../lib/share-game";
import { GameStatusContext } from "../../providers/GameStatusProvider";
import { PuzzleDataContext } from "../../providers/PuzzleDataProvider";

function ShareScoreButton({ buttonText = "Share", className = "" }) {
  const { gameData, puzzleIndex, pickupLines } =
    React.useContext(PuzzleDataContext);
  const { submittedGuesses } = React.useContext(GameStatusContext);
  const { toast } = useToast();
  function handleShareToClipboard() {
    toast({
      label: "Notification",
      title: "",
      description: "Copied to clipboard!",
    });
  }
  function handleShareFailure() {
    toast({
      label: "Notification",
      title: "",
      description: "Was unable to copy to clipboard / share.",
    });
  }
  let pickupLine = "";
  if (pickupLines) {
    const flatPickupLines = pickupLines.flat();

    // Find the pickup line with the highest overall score
    const highestScoreLine = flatPickupLines.reduce((acc, line) => {
      const currentScore =
        line.overallScore.Creativity + line.overallScore.Humor;
      let maxScore = acc.overallScore.Creativity + acc.overallScore.Humor;
      return currentScore > maxScore ? line : acc;
    });
    console.log("highestScoreLine: ", highestScoreLine);
    pickupLine = highestScoreLine.line;
  }
  return (
    <Sparkles>
      <Button
        className={cn(className, "w-full")}
        variant="share"
        onClick={() =>
          shareStatus(
            gameData,
            pickupLine,
            submittedGuesses,
            handleShareToClipboard,
            handleShareFailure,
            puzzleIndex,
            false
          )
        }
      >
        {buttonText}
      </Button>
    </Sparkles>
  );
}

export default ShareScoreButton;
