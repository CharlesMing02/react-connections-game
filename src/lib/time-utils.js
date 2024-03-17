import {
  addDays,
  differenceInDays,
  formatISO,
  parseISO,
  startOfDay,
  startOfToday,
  startOfYesterday,
} from "date-fns";
import fetch from "node-fetch";

import queryString from "query-string";

import { CONNECTION_GAMES } from "./data";

export const getToday = () => startOfToday();
export const getYesterday = () => startOfYesterday();

// October 2023 Game Epoch
// https://stackoverflow.com/questions/2552483/why-does-the-month-argument-range-from-0-to-11-in-javascripts-date-constructor
export const firstGameDate = new Date(2023, 9, 23);
export const periodInDays = 7;

export const getLastGameDate = (today) => {
  const t = startOfDay(today);
  let daysSinceLastGame = differenceInDays(t, firstGameDate) % periodInDays;
  return addDays(t, -daysSinceLastGame);
};

export const getNextGameDate = (today) => {
  return addDays(getLastGameDate(today), periodInDays);
};

export const isValidGameDate = (date) => {
  if (date < firstGameDate || date > getToday()) {
    return false;
  }

  return differenceInDays(firstGameDate, date) % periodInDays === 0;
};

export const getIndex = (gameDate) => {
  let start = firstGameDate;
  let index = -1;
  console.log(firstGameDate);
  do {
    index++;
    start = addDays(start, periodInDays);
  } while (start <= gameDate);

  return index;
};

// export const getPuzzleOfDay = (index) => {
//   if (index < 0) {
//     throw new Error("Invalid index");
//   }

//   return CONNECTION_GAMES[index % CONNECTION_GAMES.length];
// };

//OLD DEPRECATED
export const getPuzzleOfDay = async (gameDate) => {
  const dateString = formatISO(gameDate, { representation: "date" });
  const url = `${process.env.REACT_APP_SERVER_URL}/game-data/${dateString}`;
  console.log("URL: ", url);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const gameData = await response.json();
    return gameData;
  } catch (error) {
    console.error("Error fetching game data:", error);
    throw error;
  }
};

export const getPuzzleAnswers = async (gameDate) => {
  const dateString = formatISO(gameDate, { representation: "date" });
  const url = `${process.env.REACT_APP_SERVER_URL}/puzzle-answers/${dateString}`;
  console.log("Fetching Puzzle Answers from URL: ", url);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const puzzleData = await response.json();
    return puzzleData;
  } catch (error) {
    console.error("Error fetching puzzle answers:", error);
    throw error;
  }
};

export const getPickupLines = async (gameDate) => {
  const dateString = formatISO(gameDate, { representation: "date" });
  const url = `${process.env.REACT_APP_SERVER_URL}/pickup-lines/${dateString}`;
  console.log("Fetching Pickup Lines from URL: ", url);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const pickupLinesData = await response.json();
    return pickupLinesData;
  } catch (error) {
    console.error("Error fetching pickup lines:", error);
    throw error;
  }
};

export const getImages = async (gameDate) => {
  const dateString = formatISO(gameDate, { representation: "date" });
  const url = `${process.env.REACT_APP_SERVER_URL}/images/${dateString}`;
  console.log("Fetching Images from URL: ", url);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const imagesData = await response.json();
    return imagesData;
  } catch (error) {
    console.error("Error fetching images:", error);
    throw error;
  }
};

export const getHardcoded = async () => {
  const url = `${process.env.REACT_APP_SERVER_URL}/hardcoded-game`;
  console.log("Fetching Puzzle Answers from URL: ", url);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const puzzleData = await response.json();
    return puzzleData;
  } catch (error) {
    console.error("Error fetching puzzle answers:", error);
    throw error;
  }
};

// export const getSolution = async (gameDate) => {
//   const nextGameDate = getNextGameDate(gameDate);
//   // const index = getIndex(gameDate);
//   const dataOfTheDay = await getPuzzleOfDay(gameDate);
//   console.log("dataOfTheDay: ", dataOfTheDay);
//   console.log("gameDate: ", gameDate);
//   console.log("index for today: ", dataOfTheDay.id);
//   console.log("nextGameDate", nextGameDate.valueOf());
//   // const convertedPuzzle = convertPuzzleData(puzzleOfTheDay);
//   return {
//     puzzleAnswers: dataOfTheDay.data,
//     puzzleGameDate: gameDate,
//     puzzleIndex: dataOfTheDay.id,
//     pickupLines: dataOfTheDay.pickupLines,
//     // images: dataOfTheDay.images,
//     dateOfNextPuzzle: nextGameDate.valueOf(),
//   };
// };

export const getGameDate = () => {
  if (getIsLatestGame()) {
    return getToday();
  }

  const parsed = queryString.parse(window.location.search);
  try {
    const d = startOfDay(parseISO(parsed.d?.toString()));
    if (d >= getToday() || d < firstGameDate) {
      setGameDate(getToday());
    }
    return d;
  } catch (e) {
    console.log(e);
    return getToday();
  }
};

export const setGameDate = (d) => {
  try {
    if (d < getToday()) {
      window.location.href = "/?d=" + formatISO(d, { representation: "date" });
      return;
    }
  } catch (e) {
    console.log(e);
  }
  window.location.href = "/";
};

export const getIsLatestGame = () => {
  // https://github.com/cwackerfuss/react-wordle/pull/505
  const parsed = queryString.parse(window.location.search);
  return parsed === null || !("d" in parsed);
};

// export const { puzzleAnswers, puzzleGameDate, puzzleIndex, dateOfNextPuzzle } =
//   await getSolution(getGameDate());
