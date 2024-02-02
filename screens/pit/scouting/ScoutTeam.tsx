import { ScrollView } from "react-native";
import OptionSelect from "@/components/OptionSelect";

/*
Following are the questions we need to ask and record. Note that the current wording
may need to change so treat this as a guide in how to ask the question and what we
might name the variable and data properties.

[ ] Can your robot pick up from the ground?  [Yes/No] 
[ ] Can your robot collect from Source? [Yes/No] 
[ ] Can you score in the Amp? [Yes/No] 
[ ] Can you score in the Speaker?  [Yes/No] 
[ ] Can you score in the Trap? [Yes/No] 
[ ] Can you Park?  [Yes/No] 
[ ] Can you get Onstage?  [Yes/No] 
[ ] Can you achieve Harmony? [Yes/No] 
[ ] What experience does the Drive Team have? [New/Mixed/Veterans] 
[ ] Is your robot ready to go now? [Yes/No] 
[ ] Can your robot recover from a Note improperly attached to it? [Yes/No] 
[ ] What are the dimensions of your robot? [W/L] 
[ ] How many can fit Onstage (on the same chain)? [1,2,3] 
[ ] Can your robot fit under the Stage? [Yes/No] 
[ ] How many Auto methods do you have? [0,1,2,3+] 
[ ] Do you plan on climbing? [Yes/No] 
[ ] Do you plan on scoring in the trap? [Yes/No] 

*/

export default function ScoutTeam() {
  const handleCanPickUpNoteFromGround = (value: string) => {
    console.log("Changed to", value);
  };
  const canGetFromSource = (value: string) => {
    console.log("Changed to", value);
  };
  const canScoreAmp = (value: string) => {
    console.log("Changed to", value);
  };
  const canScoreSpeaker = (value: string) => {
    console.log("Changed to", value);
  };
  const canScoreTrap = (value: string) => {
    console.log("Changed to", value);
  };
  const canPark = (value: string) => {
    console.log("Changed to", value);
  };
  const canGetOnStage = (value: string) => {
    console.log("Changed to", value);
  };
  const canAchieveHarmony = (value: string) => {
    console.log("Changed to", value);
  };
  const teamExperiance = (value: string) => {
    console.log("Changed to", value);
  };
  const isRobotReady = (value: string) => {
    console.log("Changed to", value);
  };
  const canRobotRecover = (value: string) => {
    console.log("Changed to", value);
  };
  const robotDimenions = (value: string) => {
    console.log("Changed to", value);
  };
  const canFitOnStage = (value: string) => {
    console.log("Changed to", value);
  };
  const canFitUnderStage = (value: string) => {
    console.log("Changed to", value);
  };
  const numberOfAutoMethods = (value: string) => {
    console.log("Changed to", value);
  };
  const planOnClimbing = (value: string) => {
    console.log("Changed to", value);
  };
  const planOnScoringTrap = (value: string) => {
    console.log("Changed to", value);
  };

  return (
    <ScrollView style={{ margin: 10 }}>
      <OptionSelect
        label="Can your robot pick up Notes from the ground?"
        options={["Yes", "No"]}
        onChange={handleCanPickUpNoteFromGround}
      />
      <OptionSelect
        label="Can your robot receive Notes from the Source?"
        options={["Yes", "No"]}
        onChange={canGetFromSource}
      />
      <OptionSelect
        label="Can you score in the Amp?"
        options={["Yes", "No"]}
        onChange={canScoreAmp}
      />
      <OptionSelect
        label="Can you score in the Speaker?"
        options={["Yes", "No"]}
        onChange={canScoreSpeaker}
      />
      <OptionSelect
        label="Can you score in the trap?"
        options={["Yes", "No"]}
        onChange={canScoreTrap}
      />
      <OptionSelect
        label="Can you park?"
        options={["Yes", "No"]}
        onChange={canPark}
      />
      <OptionSelect
        label="Can you get Onstage?"
        options={["Yes", "No"]}
        onChange={canGetOnStage}
      />
      <OptionSelect
        label="Can you achieve Harmony?"
        options={["Yes", "No"]}
        onChange={canAchieveHarmony}
      />
      <OptionSelect
        label="What experiance does your Drive Team have?"
        options={["New", "Mixed", "Veterans"]}
        onChange={teamExperiance}
      />
      <OptionSelect
        label="Is your robot ready now?"
        options={["Yes", "No"]}
        onChange={isRobotReady}
      />
      <OptionSelect
        label="Can your Robot recover from a Note improperly attached to it?"
        options={["Yes", "No"]}
        onChange={canRobotRecover}
      />
      <OptionSelect
        label="What are the dimentions of your Robot?"
        options={["Do Later"]}
        onChange={robotDimenions}
      />
      <OptionSelect
        label="How many can fit onstage at the same time?"
        options={["1", "2", "3"]}
        onChange={canFitOnStage}
      />
      <OptionSelect
        label="Can your Robot fit under the Stage?"
        options={["Yes", "No"]}
        onChange={canFitUnderStage}
      />
      <OptionSelect
        label="How many Auto methods do you have?"
        options={["1", "2", "3+"]}
        onChange={numberOfAutoMethods}
      />
      <OptionSelect
        label="Do you plan on climbing?"
        options={["Yes", "No"]}
        onChange={planOnClimbing}
      />
      <OptionSelect
        label="Do you plan on scoring in the Trap?"
        options={["Yes", "No"]}
        onChange={planOnScoringTrap}
      />
    </ScrollView>
  );
}
