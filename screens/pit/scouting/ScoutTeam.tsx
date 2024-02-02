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
  const onChangeHelloWorld = (option: string) => {
    console.log("onChangeHelloWorld option:", option);
  };

  const handleCanPickUpNoteFromGround = (value: string) => {
    console.log("Changed to", value)
  }
  const cangetfromsource = (value: string) => {
    console.log("Changed to", value)
  }
  const canscoreamp = (value: string) => {
    console.log("Changed to", value)
  }
  const canscorespeaker = (value: string) => {
    console.log("Changed to", value)
  }
  const canscoretrap = (value: string) => {
    console.log("Changed to", value)
  }
  const canpark = (value: string) => {
    console.log("Changed to", value)
  }
  const cangetonstage = (value: string) => {
    console.log("Changed to", value)
  }
  const canachieveharmony = (value: string) => {
    console.log("Changed to", value)
  }
  const teamexperiance = (value: string) => {
    console.log("Changed to", value)
  }
  const isbotready = (value: string) => {
    console.log("Changed to", value)
  }
  const canbotrecover = (value: string) => {
    console.log("Changed to", value)
  }
  const botdimenions = (value: string) => {
    console.log("Changed to", value)
  }
  const canfitonstage = (value: string) => {
    console.log("Changed to", value)
  }
  const canfitunderstage = (value: string) => {
    console.log("Changed to", value)
  }
  const automethids = (value: string) => {
    console.log("Changed to", value)
  }
  const climbingplan = (value: string) => {
    console.log("Changed to", value)
  }
  const canscoretrap2 = (value: string) => {
    console.log("Changed to", value)
  }


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
        onChange={cangetfromsource}
      />
      <OptionSelect
        label="Can you score in the Amp?"
        options={["Yes", "No"]}
        onChange={canscoreamp}
      />
      <OptionSelect
        label="Can you score in the Speaker?"
        options={["Yes", "No"]}
        onChange={canscorespeaker}
      />
      <OptionSelect
        label="Can you score in the trap?"
        options={["Yes", "No"]}
        onChange={canscoretrap}
      />
      <OptionSelect
        label="Can you park?"
        options={["Yes", "No"]}
        onChange={canpark}
      />
      <OptionSelect
        label="Can you get Onstage?"
        options={["Yes", "No"]}
        onChange={cangetonstage}
      />
      <OptionSelect
        label="Can you achieve Harmony?"
        options={["Yes", "No"]}
        onChange={canachieveharmony}
      />
      <OptionSelect
        label="What experiance does your Drive Team have?"
        options={["New","Mixed", "Veterans"]}
        onChange={teamexperiance}
      />
      <OptionSelect
        label="Is your robot ready now?"
        options={["Yes", "No"]}
        onChange={isbotready}
      />
      <OptionSelect
        label="Can your Robot recover from a Note improperly attached to it?"
        options={["Yes", "No"]}
        onChange={canbotrecover}
      />
      <OptionSelect
        label="What are the dimentions of your Robot?"
        options={["Do Later"]}
        onChange={botdimenions}
      />
      <OptionSelect
        label="How many can fit onstage at the same time?"
        options={["1", "2", "3"]}
        onChange={canfitonstage}
      />
      <OptionSelect
        label="Can your Robot fit under the Stage?"
        options={["Yes", "No"]}
        onChange={canfitunderstage}
      />
      <OptionSelect
        label="How many Auto methods do you have?"
        options={["1", "2", "3+"]}
        onChange={automethids}
      />
      <OptionSelect
        label="Do you plan on climbing?"
        options={["Yes", "No"]}
        onChange={climbingplan}
      />
      <OptionSelect
        label="Do you plan on scoring in the Trap?"
        options={["Yes", "No"]}
        onChange={canscoretrap2}
      />
    </ScrollView>
  );
}
