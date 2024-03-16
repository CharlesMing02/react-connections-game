import React, { useEffect, useState } from "react";
import {
  getImages,
  getPuzzleAnswers,
  getPickupLines,
  getGameDate,
} from "../../lib/time-utils";

export const PuzzleDataContext = React.createContext();

function PuzzleDataProvider({ children }) {
  const [gameData, setGameData] = useState(null);
  const [puzzleIndex, setPuzzleIndex] = useState(null);
  const [pickupLines, setPickupLines] = useState(null);
  const [images, setImages] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const gameDate = getGameDate();
        const puzzleData = await getPuzzleAnswers(gameDate); // Fetch puzzle answers (fast)
        console.log("puzzleData: ", puzzleData);
        setGameData(puzzleData.data);
        setPuzzleIndex(puzzleData.id);
        setLoading(false); // Set loading to false as the game can now be rendered with puzzle data

        const pickupData = await getPickupLines(gameDate); // Fetch pickup lines (slower)
        console.log("pickupData: ", pickupData);
        setPickupLines(pickupData.pickupLines); // Update the context with pickup lines once fetched

        const imageData = await getImages(gameDate); // Fetch images (slower)
        console.log("imagesFetched: ", imageData !== null);
        setImages(imageData.images); // Update the context with pickup lines once fetched
      } catch (error) {
        console.error("Failed to fetch game data:", error);
        setLoading(false); // Ensure loading is set to false even if an error occurs
      }
    };

    fetchGameData();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or any other loading state representation
  }

  const categorySize = 4;
  const numCategories = 4;

  return (
    <PuzzleDataContext.Provider
      value={{
        gameData,
        numCategories,
        categorySize,
        puzzleIndex,
        pickupLines,
        images,
      }}
    >
      {children}
    </PuzzleDataContext.Provider>
  );
}

export default PuzzleDataProvider;
