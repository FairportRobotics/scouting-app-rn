import { PitScoutingQuestion } from "@/constants/Types";

export default [
  {
    key: "driveTeamExperience",
    title: "What experience does your Drive Team have?",
    options: [
      "All New",
      "Mostly New",
      "Mixed",
      "Mostly Veterans",
      "All Veterans",
    ],
    value: "",
  },
  {
    key: "numberOfAutoMethods",
    title: "How many Auto methods do you have?",
    options: ["1", "2", "3", "4", "5+"],
    value: "",
  },
  {
    key: "canPickUpFromGround",
    title: "Can your robot pick up Notes from the ground?",
    options: ["Yes", "No"],
    value: "",
  },
  {
    key: "canReceiveFromSourceChute",
    title: "Can your robot receive Notes from the Source Chute?",
    options: ["Yes", "No"],
    value: "",
  },
  {
    key: "canScoreInAmp",
    title: "Can you score in the Amp?",
    options: ["Yes", "No"],
    value: "",
  },
  {
    key: "canScoreInSpeaker",
    title: "Can you score in the Speaker?",
    options: ["Yes", "No"],
    value: "",
  },
  {
    key: "canScoreInTrap",
    title: "Can you score in the Trap?",
    options: ["Yes", "No"],
    value: "",
  },
  {
    key: "canFitUnderStage",
    title: "Can your robot fit under the Stage?",
    options: ["Yes", "No"],
    value: "",
  },
  {
    key: "canGetOnstage",
    title: "Can your robot get Onstage?",
    options: ["Yes", "No"],
    value: "",
  },
  {
    key: "maximumClearance",
    title:
      "What is the maximum clearance in inches needed for your robot to get Onstage?",
    options: ["24", "25", "26", "27", "28", "29", "30+"],
    value: "",
  },
  {
    key: "onstagePosition",
    title:
      "If you can score in the Trap from Onstage, where does your robot need to be positioned?",
    options: ["Left", "Center", "Right", "Anywhere"],
    value: "",
  },
] as Array<PitScoutingQuestion>;
