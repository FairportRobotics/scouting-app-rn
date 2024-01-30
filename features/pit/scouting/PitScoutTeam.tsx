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

export default function PitScoutTeam() {
  const onChangeHelloWorld = (option: string) => {
    console.log("onChangeHelloWorld option:", option);
  };

  return (
    <ScrollView style={{ margin: 10 }}>
      <OptionSelect
        label="Can your robot pick up Notes from the ground?"
        options={["Yes", "No"]}
        onChange={onChangeHelloWorld}
      />
      <OptionSelect
        label="Can your robot receive Notes from the Source?"
        options={["Yes", "No"]}
        onChange={onChangeHelloWorld}
      />
    </ScrollView>
  );
}
