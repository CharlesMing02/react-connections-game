import React, { useState } from "react";
import { MAX_MISTAKES } from "../../../lib/constants";
import { Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";
import BaseModal from "../BaseModal";
import { PuzzleDataContext } from "../../../providers/PuzzleDataProvider";

function InfoModal() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const { refetch } = React.useContext(PuzzleDataContext);

  const checkPassword = async (inputPassword) => {
    if (inputPassword === process.env.REACT_APP_PASSWORD) {
      setIsAuthorized(true);
      await refetch();
      console.log("Refetched data");
    } else {
      alert("Incorrect password!");
    }
  };

  return (
    <BaseModal
      title=""
      trigger={<Info className="mr-4" />}
      initiallyOpen={false}
      actionButtonText="Got It!"
    >
      <Tabs defaultValue="how-to-play">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="how-to-play">How To Play</TabsTrigger>
          <TabsTrigger value="secret">Secret</TabsTrigger>
        </TabsList>
        <TabsContent value="how-to-play">
          {" "}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What's The Goal?</AccordionTrigger>
              <AccordionContent>
                Find groups of items or names that share something in common.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How Do I Play?</AccordionTrigger>
              <AccordionContent>
                Select the items and tap 'Submit' to check if your guess matches
                one of the answer categories.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>How Many Tries Do I Get?</AccordionTrigger>
              <AccordionContent>
                {`You can make ${MAX_MISTAKES} mistakes before the game ends.`}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
        <TabsContent value="secret">
          {isAuthorized ? (
            <Accordion type="single" collapsible className="w-full">
              {process.env.REACT_APP_MESSAGE}
            </Accordion>
          ) : (
            <div>
              <p>Please enter the password to access this section:</p>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && checkPassword(password)}
                className="password-input"
                placeholder="Password"
              />
              <button onClick={() => checkPassword(password)}>Submit</button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </BaseModal>
  );
}

export default InfoModal;
