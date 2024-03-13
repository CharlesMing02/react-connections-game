import React, { useEffect, useState } from "react";
import { getSolution, getGameDate } from "../../lib/time-utils";

export const PuzzleDataContext = React.createContext();

function PuzzleDataProvider({ children }) {
  const [gameData, setGameData] = useState(null);
  const [puzzleIndex, setPuzzleIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const gameDate = getGameDate();
        const data = await getSolution(gameDate);
        setGameData(data.puzzleAnswers);
        setPuzzleIndex(data.puzzleIndex);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch game data:", error);
        // Handle errors as needed
        setLoading(false);
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
      value={{ gameData, numCategories, categorySize, puzzleIndex }}
    >
      {children}
    </PuzzleDataContext.Provider>
  );
}

export default PuzzleDataProvider;
