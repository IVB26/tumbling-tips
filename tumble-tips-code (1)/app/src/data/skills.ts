// Generated from the HTML prototype. Each clip is [name, cue, seconds].
export type Clip = [name: string, cue: string, seconds: number];
export type FigKey = "roll"|"handstand"|"cartwheel"|"bridge"|"backhand"|"circuit"|"ladder"|"salto"|"layout"|"twist"|"mat";
export type Skill = { id: string; title: string; fig: FigKey; tint: number; price: number; level: string;
  breakdown: Clip[]; drills: Clip[]; tips: Clip[] };
export const SKILL_LEVELS = ["Novice","Level 1","Level 2","Level 3","Level 4","Level 5"] as const;
export const SKILLS: Skill[] = [
 {
  "id": "s1",
  "title": "Forward Roll",
  "fig": "roll",
  "tint": 0,
  "price": 3.99,
  "level": "Novice",
  "breakdown": [
   [
    "Squat, hands flat",
    "Fingers point forward",
    20
   ],
   [
    "Chin to chest",
    "Look at your belly",
    15
   ],
   [
    "Push from the feet",
    "Bottom goes up high",
    20
   ],
   [
    "Roll on the back",
    "Round like a ball",
    15
   ],
   [
    "Stand up, arms forward",
    "No hands on the floor",
    20
   ]
  ],
  "drills": [
   [
    "Rock and roll",
    "Rock back and forth in a tuck",
    30
   ],
   [
    "Roll down a wedge",
    "Downhill makes it easier",
    30
   ],
   [
    "Roll to stand",
    "Reach arms forward to finish",
    30
   ]
  ],
  "tips": [
   [
    "Use a mat or cushion",
    "Never on a hard floor",
    20
   ],
   [
    "Hands touch first",
    "Then the back of the head",
    20
   ],
   [
    "Neck hurts? Stop",
    "Check the chin tuck again",
    15
   ]
  ]
 },
 {
  "id": "s10",
  "title": "Backward Roll",
  "fig": "roll",
  "tint": 1,
  "price": 3.99,
  "level": "Novice",
  "breakdown": [
   [
    "Sit in a tuck",
    "Chin to chest, hold your knees",
    15
   ],
   [
    "Hands by ears",
    "Palms up, fingers to shoulders",
    15
   ],
   [
    "Rock back",
    "Stay round like a ball",
    20
   ],
   [
    "Push through the hands",
    "Press the floor as your hips go over",
    20
   ],
   [
    "Land on your feet",
    "Finish in a squat, then stand",
    15
   ]
  ],
  "drills": [
   [
    "Rock and roll, hands by ears",
    "Hands touch the floor behind",
    30
   ],
   [
    "Backward roll down a wedge",
    "Downhill makes it easier",
    30
   ],
   [
    "Pizza hands push",
    "Push the floor from a back rock",
    30
   ]
  ],
  "tips": [
   [
    "Never roll over the neck",
    "Your hands take the weight",
    15
   ],
   [
    "Stay tucked tight",
    "Opening early stops the roll",
    15
   ],
   [
    "Use a slope",
    "A cheese mat or cushion helps",
    15
   ]
  ]
 },
 {
  "id": "s3",
  "title": "Handstand",
  "fig": "handstand",
  "tint": 2,
  "price": 4.99,
  "level": "Novice",
  "breakdown": [
   [
    "Lunge and reach",
    "Arms by ears",
    20
   ],
   [
    "Hands shoulder-width",
    "Fingers spread wide",
    15
   ],
   [
    "Kick and stack",
    "Hips over shoulders",
    25
   ],
   [
    "Squeeze and hold",
    "Tight tummy, pointed toes",
    30
   ],
   [
    "Step down",
    "Same leg first",
    15
   ]
  ],
  "drills": [
   [
    "Hollow hold",
    "Lower back on the floor",
    30
   ],
   [
    "Wall walk",
    "Walk the feet up the wall",
    40
   ],
   [
    "Chest-to-wall hold",
    "Only the toes touch",
    30
   ]
  ],
  "tips": [
   [
    "Push the floor away",
    "Shoulders by the ears",
    15
   ],
   [
    "Look between your hands",
    "Not at your knees",
    15
   ],
   [
    "Falling? Cartwheel out",
    "Turn, don't topple",
    20
   ]
  ]
 },
 {
  "id": "s2",
  "title": "Cartwheel",
  "fig": "cartwheel",
  "tint": 1,
  "price": 4.99,
  "level": "Novice",
  "breakdown": [
   [
    "Lunge",
    "Strong leg forward, arms by ears",
    20
   ],
   [
    "Hand, hand",
    "Lead hand turned in",
    20
   ],
   [
    "Kick through the top",
    "Legs wide like a star",
    25
   ],
   [
    "Foot, foot",
    "Land facing back",
    20
   ],
   [
    "Lunge finish",
    "Arms stay up",
    15
   ]
  ],
  "drills": [
   [
    "Cartwheel on a line",
    "Hands and feet on the line",
    30
   ],
   [
    "Bench cartwheel",
    "Hands on a bench, kick over",
    30
   ],
   [
    "Wall star",
    "Star shape against the wall",
    30
   ],
   [
    "Lead-arm cartwheel",
    "One hand only",
    30
   ]
  ],
  "tips": [
   [
    "Pick a strong side",
    "Same leg leads every time",
    15
   ],
   [
    "Look at your hands",
    "Not your feet",
    15
   ],
   [
    "Straight legs come later",
    "Get the shape first",
    15
   ]
  ]
 },
 {
  "id": "s30",
  "title": "Cartwheel Cartwheel",
  "fig": "cartwheel",
  "tint": 2,
  "price": 3.99,
  "level": "Novice",
  "breakdown": [
   [
    "Lunge",
    "Strong leg forward, arms by ears",
    15
   ],
   [
    "First cartwheel",
    "Hand, hand, foot, foot",
    20
   ],
   [
    "Land in a lunge facing forward",
    "Step through, don't stop",
    20
   ],
   [
    "Second cartwheel",
    "Same lead leg and hand",
    20
   ],
   [
    "Lunge finish",
    "Arms up to show control",
    15
   ]
  ],
  "drills": [
   [
    "Cartwheel on a line",
    "Hands and feet on the line",
    30
   ],
   [
    "Cartwheel to lunge",
    "Finish facing the way you came",
    30
   ],
   [
    "Two cartwheels down a mat",
    "Keep the rhythm",
    30
   ]
  ],
  "tips": [
   [
    "Step through the lunge",
    "Turn to face forward again",
    15
   ],
   [
    "Same side both times",
    "Lead with the same leg",
    15
   ],
   [
    "Keep it straight",
    "Stay on the line",
    15
   ]
  ]
 },
 {
  "id": "s4",
  "title": "Bridge",
  "fig": "bridge",
  "tint": 3,
  "price": 3.99,
  "level": "Novice",
  "breakdown": [
   [
    "Lie down, knees bent",
    "Feet flat, hip-width",
    15
   ],
   [
    "Hands by ears",
    "Fingers point to toes",
    15
   ],
   [
    "Push the hips up",
    "Hips first, then arms",
    20
   ],
   [
    "Straighten the arms",
    "Shoulders over hands",
    25
   ],
   [
    "Come down slowly",
    "Chin to chest",
    15
   ]
  ],
  "drills": [
   [
    "Wall shoulder stretch",
    "Hands high, chest to wall",
    30
   ],
   [
    "Bridge rocks",
    "Rock shoulders over hands",
    30
   ],
   [
    "Bridge on a wedge",
    "Head end raised",
    30
   ]
  ],
  "tips": [
   [
    "Warm up the back",
    "Cat-cow, 8 slow",
    20
   ],
   [
    "Straight arms matter most",
    "Bent arms strain the back",
    15
   ],
   [
    "Never force it",
    "Flexibility grows week by week",
    15
   ]
  ]
 },
 {
  "id": "s28",
  "title": "Bridge Kickover",
  "fig": "bridge",
  "tint": 1,
  "price": 3.99,
  "level": "Novice",
  "breakdown": [
   [
    "Push up to a bridge",
    "Straight arms, shoulders over hands",
    20
   ],
   [
    "Walk the hands closer",
    "Small steps toward the feet",
    15
   ],
   [
    "Lift one leg",
    "Point the toe to the ceiling",
    20
   ],
   [
    "Kick over",
    "Push through the shoulders",
    25
   ],
   [
    "Land in a lunge",
    "Arms up to finish",
    15
   ]
  ],
  "drills": [
   [
    "Bridge rocks",
    "Rock shoulders over hands",
    30
   ],
   [
    "One-leg bridge hold",
    "10 s each leg",
    30
   ],
   [
    "Kickover down a wedge",
    "Downhill makes it easier",
    30
   ]
  ],
  "tips": [
   [
    "Strong bridge first",
    "Straight arms, 10-second hold",
    15
   ],
   [
    "Kick with a straight leg",
    "Keep it long",
    15
   ],
   [
    "A parent can help",
    "Hand under the lower back",
    15
   ]
  ]
 },
 {
  "id": "s11",
  "title": "Backward Roll to Front Support",
  "fig": "roll",
  "tint": 2,
  "price": 4.99,
  "level": "Level 1",
  "breakdown": [
   [
    "Pike sit",
    "Arms forward, chin in",
    15
   ],
   [
    "Roll back with straight legs",
    "Hands by ears",
    20
   ],
   [
    "Push hard through the hands",
    "Arms straighten fast",
    20
   ],
   [
    "Shoot the legs back",
    "Toes reach the floor behind",
    20
   ],
   [
    "Front support",
    "Straight body, like a push-up",
    15
   ]
  ],
  "drills": [
   [
    "Backward roll down a wedge",
    "Focus on the push",
    30
   ],
   [
    "Candlestick to push",
    "Roll back and push the floor",
    30
   ],
   [
    "Front support hold",
    "Tight body, 20 s",
    30
   ],
   [
    "Rock to hands",
    "Practise the hand push",
    30
   ]
  ],
  "tips": [
   [
    "Push early",
    "Press as soon as your hips are over",
    15
   ],
   [
    "Straight arms to finish",
    "No bent elbows in support",
    15
   ],
   [
    "Hollow body",
    "Ribs in, bottom tucked under",
    15
   ]
  ]
 },
 {
  "id": "s12",
  "title": "Handstand Forward Roll",
  "fig": "handstand",
  "tint": 3,
  "price": 4.99,
  "level": "Level 1",
  "breakdown": [
   [
    "Kick to handstand",
    "Hips stacked over shoulders",
    20
   ],
   [
    "Hold for a moment",
    "Tight, straight line",
    20
   ],
   [
    "Tuck the chin",
    "Look at your tummy",
    15
   ],
   [
    "Bend the arms slowly",
    "Lower with control",
    20
   ],
   [
    "Roll to stand",
    "Arms forward, no hands",
    20
   ]
  ],
  "drills": [
   [
    "Wall handstand hold",
    "Hold 20 s",
    30
   ],
   [
    "Handstand roll onto a crash mat",
    "Soft landing",
    30
   ],
   [
    "Pike stand lower to roll",
    "Practise the lowering",
    30
   ]
  ],
  "tips": [
   [
    "Control the lower",
    "Don't collapse",
    15
   ],
   [
    "Chin in before you bend",
    "Protects the neck",
    15
   ],
   [
    "Use a soft mat",
    "Until it feels smooth",
    15
   ]
  ]
 },
 {
  "id": "s5",
  "title": "Round-off",
  "fig": "cartwheel",
  "tint": 2,
  "price": 5.99,
  "level": "Level 1",
  "breakdown": [
   [
    "Hurdle",
    "Long and low",
    20
   ],
   [
    "Reach",
    "Far-away hands",
    20
   ],
   [
    "Turn on the hands",
    "Second hand turns in",
    20
   ],
   [
    "Snap down",
    "Feet together fast",
    20
   ],
   [
    "Rebound",
    "Arms up, chest up",
    20
   ]
  ],
  "drills": [
   [
    "Hurdle on a line",
    "Three steps, hurdle, lunge",
    30
   ],
   [
    "Handstand snap-downs",
    "Land in a hollow",
    30
   ],
   [
    "Round-off off a block",
    "Onto an 8-inch mat",
    30
   ],
   [
    "Rebound jumps",
    "Stiff ankles",
    30
   ]
  ],
  "tips": [
   [
    "Feet land behind hands",
    "Not under them",
    15
   ],
   [
    "Hollow, not arched",
    "Ribs in on the snap",
    15
   ],
   [
    "Clean cartwheel first",
    "It makes the round-off easy",
    15
   ]
  ]
 },
 {
  "id": "s7",
  "title": "Front Walkover",
  "fig": "bridge",
  "tint": 1,
  "price": 6.99,
  "level": "Level 1",
  "breakdown": [
   [
    "Lunge",
    "Arms by ears",
    15
   ],
   [
    "Split handstand",
    "Legs wide at the top",
    25
   ],
   [
    "Lead foot lands",
    "Close to the hands",
    20
   ],
   [
    "Push through the shoulders",
    "Hips forward",
    25
   ],
   [
    "Stand, arms up",
    "Head comes up last",
    15
   ]
  ],
  "drills": [
   [
    "Split handstand hold",
    "Three seconds",
    30
   ],
   [
    "Walkover over a barrel",
    "Coach rolls the barrel",
    30
   ],
   [
    "Stand up from bridge",
    "Rock up",
    30
   ]
  ],
  "tips": [
   [
    "Check the bridge first",
    "Shoulders over hands",
    15
   ],
   [
    "Head stays back",
    "It lifts last",
    15
   ],
   [
    "Spot the lower back",
    "Not the legs",
    15
   ]
  ]
 },
 {
  "id": "s6",
  "title": "Back Walkover",
  "fig": "bridge",
  "tint": 0,
  "price": 6.99,
  "level": "Level 1",
  "breakdown": [
   [
    "Stand, one leg forward",
    "Arms by ears",
    15
   ],
   [
    "Reach back",
    "Look for the floor",
    25
   ],
   [
    "Hands land",
    "Shoulders over hands",
    20
   ],
   [
    "Kick over",
    "Lead leg first, in a split",
    25
   ],
   [
    "Lunge to stand",
    "Arms up",
    15
   ]
  ],
  "drills": [
   [
    "Bridge kickover",
    "Kick over from a bridge",
    30
   ],
   [
    "Walkover down a wedge",
    "Downhill",
    30
   ],
   [
    "Back limber",
    "Both legs together",
    30
   ]
  ],
  "tips": [
   [
    "Strong bridge first",
    "Straight arms, 10-second hold",
    15
   ],
   [
    "Keep the split wide",
    "It helps you get over",
    15
   ],
   [
    "Spot the lower back",
    "Hand under the arch",
    20
   ]
  ]
 },
 {
  "id": "s14",
  "title": "Valdez",
  "fig": "bridge",
  "tint": 0,
  "price": 6.99,
  "level": "Level 1",
  "breakdown": [
   [
    "Sit, one leg bent",
    "Straight leg forward, hand behind you",
    20
   ],
   [
    "Reach the other arm back",
    "Look for the floor",
    20
   ],
   [
    "Push the hips up and kick",
    "The straight leg kicks over",
    25
   ],
   [
    "Pass through handstand",
    "Legs in a split",
    20
   ],
   [
    "Step down to a lunge",
    "Arms up to finish",
    15
   ]
  ],
  "drills": [
   [
    "Bridge kickover",
    "Kick over from a bridge",
    30
   ],
   [
    "Valdez off a wedge",
    "Sit on the high end",
    30
   ],
   [
    "One-leg bridge",
    "Hold 10 s each leg",
    30
   ]
  ],
  "tips": [
   [
    "Hips high before you kick",
    "Push up first",
    15
   ],
   [
    "Turn the back hand out",
    "Fingers point away",
    15
   ],
   [
    "Strong shoulders",
    "Practise bridge pushes daily",
    15
   ]
  ]
 },
 {
  "id": "s9",
  "title": "Straddle to Handstand",
  "fig": "handstand",
  "tint": 1,
  "price": 6.99,
  "level": "Level 1",
  "breakdown": [
   [
    "Straddle stand, hands flat",
    "Hands shoulder-width, close to your feet",
    20
   ],
   [
    "Shoulders forward",
    "Lean until your hips start to lift",
    25
   ],
   [
    "Hips over shoulders",
    "Squeeze through the core",
    25
   ],
   [
    "Legs rise wide",
    "Straight legs, pointed toes",
    25
   ],
   [
    "Close to handstand",
    "Legs together, tight body",
    20
   ]
  ],
  "drills": [
   [
    "Straddle stand compression",
    "Hands flat, lift one foot at a time",
    30
   ],
   [
    "Box straddle lifts",
    "Feet on a box, lift hips over hands",
    30
   ],
   [
    "Wall-assisted press",
    "Back to the wall, walk the feet up",
    30
   ],
   [
    "Seated straddle leg lifts",
    "Hands by hips, lift both legs",
    30
   ]
  ],
  "tips": [
   [
    "Flexibility first",
    "Pancake stretch every day",
    15
   ],
   [
    "Lean, don't jump",
    "Shoulders go past the hands",
    15
   ],
   [
    "Use a block under your hands",
    "It makes the lift easier",
    15
   ]
  ]
 },
 {
  "id": "s13",
  "title": "Back Walkover Switch",
  "fig": "bridge",
  "tint": 2,
  "price": 7.99,
  "level": "Level 1",
  "breakdown": [
   [
    "Stand, one leg forward",
    "Arms by ears",
    15
   ],
   [
    "Reach back",
    "Look for the floor",
    20
   ],
   [
    "Hands land, kick over",
    "Pass through split handstand",
    20
   ],
   [
    "Switch the legs",
    "Scissor through the top",
    25
   ],
   [
    "Land on the other leg",
    "Finish in a lunge",
    15
   ]
  ],
  "drills": [
   [
    "Back walkover",
    "Clean and controlled first",
    30
   ],
   [
    "Split handstand switches",
    "Against a wall",
    30
   ],
   [
    "Kickover switch from a bridge",
    "Slow and controlled",
    30
   ]
  ],
  "tips": [
   [
    "Work your splits",
    "Both sides",
    15
   ],
   [
    "Switch at the top",
    "Not too early",
    15
   ],
   [
    "Strong walkover first",
    "Make it easy before adding the switch",
    15
   ]
  ]
 },
 {
  "id": "s8",
  "title": "Back Handspring",
  "fig": "backhand",
  "tint": 3,
  "price": 9.99,
  "level": "Level 2",
  "breakdown": [
   [
    "Sit like a chair",
    "Knees behind toes",
    20
   ],
   [
    "Swing and jump back",
    "Arms by ears",
    20
   ],
   [
    "Hands land",
    "Fingers forward",
    20
   ],
   [
    "Snap down",
    "Feet together",
    20
   ],
   [
    "Rebound",
    "Arms up",
    20
   ]
  ],
  "drills": [
   [
    "Chair fall-back",
    "Onto an 8-inch crash mat",
    30
   ],
   [
    "Barrel handspring",
    "Coach spots",
    30
   ],
   [
    "Handstand snap-down",
    "Hollow landing",
    30
   ],
   [
    "Wedge downhill BHS",
    "Light spot",
    30
   ]
  ],
  "tips": [
   [
    "Learn it in a gym",
    "It needs a trained spotter",
    15
   ],
   [
    "Don't throw the head",
    "Look back with the eyes",
    15
   ],
   [
    "Stuck? Go back a stage",
    "Use the progression ladder",
    15
   ]
  ]
 },
 {
  "id": "s15",
  "title": "Back Handspring Step-out",
  "fig": "backhand",
  "tint": 1,
  "price": 9.99,
  "level": "Level 2",
  "breakdown": [
   [
    "Sit like a chair",
    "Arms swing forward",
    20
   ],
   [
    "Jump back",
    "Arms by ears",
    20
   ],
   [
    "Hands land",
    "Shoulders open",
    20
   ],
   [
    "Split the legs over the top",
    "One leg leads",
    20
   ],
   [
    "Step out to a lunge",
    "One foot at a time",
    20
   ]
  ],
  "drills": [
   [
    "Back walkover",
    "Same leg pattern",
    30
   ],
   [
    "Barrel handspring step-out",
    "Coach spots",
    30
   ],
   [
    "Handstand step-down",
    "Practise the split landing",
    30
   ]
  ],
  "tips": [
   [
    "Learn it in a gym",
    "With a coach spotting",
    15
   ],
   [
    "Keep the split wide",
    "It helps the step-out",
    15
   ],
   [
    "Use it to link skills",
    "Great into a round-off",
    15
   ]
  ]
 },
 {
  "id": "s16",
  "title": "Front Handspring",
  "fig": "backhand",
  "tint": 2,
  "price": 9.99,
  "level": "Level 2",
  "breakdown": [
   [
    "Run and hurdle",
    "Arms by ears",
    20
   ],
   [
    "Reach far",
    "Hands flat, shoulders open",
    20
   ],
   [
    "Block",
    "Push off the hands fast",
    20
   ],
   [
    "Fly over",
    "Body stays straight",
    20
   ],
   [
    "Land standing",
    "Arms up, chest up",
    20
   ]
  ],
  "drills": [
   [
    "Handstand flat-back onto a mat",
    "Stay tight",
    30
   ],
   [
    "Front handspring over a barrel",
    "Coach spots",
    30
   ],
   [
    "Hurdle to handstand",
    "Long and low hurdle",
    30
   ],
   [
    "Block drills",
    "Push off from handstand",
    30
   ]
  ],
  "tips": [
   [
    "Don't duck the head",
    "Head stays between the arms",
    15
   ],
   [
    "Kick fast",
    "The kick leg drives you over",
    15
   ],
   [
    "Try a slope first",
    "A downhill wedge helps",
    15
   ]
  ]
 },
 {
  "id": "s17",
  "title": "Flyspring Step-out",
  "fig": "backhand",
  "tint": 3,
  "price": 9.99,
  "level": "Level 2",
  "breakdown": [
   [
    "Hurdle to two feet",
    "Punch off both feet",
    20
   ],
   [
    "Dive to the hands",
    "Both hands land together",
    20
   ],
   [
    "Block",
    "Push hard off the hands",
    20
   ],
   [
    "Split the legs",
    "One leg leads",
    20
   ],
   [
    "Step out",
    "One foot, then the other",
    20
   ]
  ],
  "drills": [
   [
    "Front handspring step-out",
    "Off one foot first",
    30
   ],
   [
    "Punch dive onto a mat",
    "Two-foot take-off",
    30
   ],
   [
    "Handstand block drill",
    "Push off the hands",
    30
   ]
  ],
  "tips": [
   [
    "Learn it in a gym",
    "With a coach",
    15
   ],
   [
    "Fast hands",
    "Both hands land at the same time",
    15
   ],
   [
    "Head neutral",
    "Look at the floor",
    15
   ]
  ]
 },
 {
  "id": "s32",
  "title": "Round-off Double",
  "fig": "backhand",
  "tint": 0,
  "price": 9.99,
  "level": "Level 2",
  "breakdown": [
   [
    "Round-off",
    "Fast snap down, feet together",
    20
   ],
   [
    "Rebound into the first back handspring",
    "Arms by ears",
    20
   ],
   [
    "Hands land, snap down",
    "Shoulders open, fast feet",
    20
   ],
   [
    "Second back handspring",
    "Straight into it, no pause",
    20
   ],
   [
    "Rebound",
    "Arms up, chest up",
    20
   ]
  ],
  "drills": [
   [
    "Round-off rebound",
    "Tall and fast",
    30
   ],
   [
    "Round-off back handspring",
    "Clean single first",
    30
   ],
   [
    "Back handspring, back handspring down a wedge",
    "Keep the rhythm",
    30
   ],
   [
    "Handstand snap-downs",
    "Fast feet under the hips",
    30
   ]
  ],
  "tips": [
   [
    "Low and fast",
    "Each handspring travels back",
    15
   ],
   [
    "Don't stop between",
    "One smooth rhythm",
    15
   ],
   [
    "Strong round-off back handspring first",
    "Then add the second",
    15
   ]
  ]
 },
 {
  "id": "s18",
  "title": "Front Sault",
  "fig": "salto",
  "tint": 0,
  "price": 9.99,
  "level": "Level 3",
  "breakdown": [
   [
    "Run and hurdle",
    "Arms up on the hurdle",
    20
   ],
   [
    "Punch",
    "Straight legs, quick feet",
    20
   ],
   [
    "Lift the arms",
    "Chest up, hips up",
    20
   ],
   [
    "Tuck tight",
    "Knees to chest, hold the shins",
    20
   ],
   [
    "Open and land",
    "Spot the floor, land standing",
    20
   ]
  ],
  "drills": [
   [
    "Punch jumps",
    "Rebound off two feet",
    30
   ],
   [
    "Front tuck onto a crash mat",
    "Raised landing",
    30
   ],
   [
    "Tuck jumps",
    "Knees to chest",
    30
   ],
   [
    "Trampoline front tucks",
    "With a coach",
    30
   ]
  ],
  "tips": [
   [
    "Learn it in a gym",
    "It needs a coach spotting",
    15
   ],
   [
    "Don't throw the head",
    "Chin stays neutral",
    15
   ],
   [
    "Hips up first",
    "Then tuck",
    15
   ]
  ]
 },
 {
  "id": "s20",
  "title": "Round-off Back Sault",
  "fig": "salto",
  "tint": 2,
  "price": 9.99,
  "level": "Level 3",
  "breakdown": [
   [
    "Round-off",
    "Fast snap down",
    20
   ],
   [
    "Rebound",
    "Arms up, chest up",
    20
   ],
   [
    "Hips up",
    "Lift the knees",
    20
   ],
   [
    "Tuck tight",
    "Grab the shins",
    20
   ],
   [
    "Spot and land",
    "See the floor, land standing",
    20
   ]
  ],
  "drills": [
   [
    "Round-off rebound",
    "Tall and fast",
    30
   ],
   [
    "Round-off back tuck onto a mat",
    "Raised landing",
    30
   ],
   [
    "Tuck jumps",
    "Knees to chest",
    30
   ],
   [
    "Trampoline back tucks",
    "With a coach",
    30
   ]
  ],
  "tips": [
   [
    "Learn it in a gym",
    "It needs a trained spotter",
    15
   ],
   [
    "Height before rotation",
    "Jump up, not back",
    15
   ],
   [
    "Don't throw the head",
    "Eyes look back late",
    15
   ]
  ]
 },
 {
  "id": "s24",
  "title": "Round-off Back Handspring Sault",
  "fig": "salto",
  "tint": 0,
  "price": 9.99,
  "level": "Level 3",
  "breakdown": [
   [
    "Round-off",
    "Fast snap down",
    20
   ],
   [
    "Back handspring",
    "Low and fast, arms by ears",
    20
   ],
   [
    "Rebound and set",
    "Arms up, chest up",
    20
   ],
   [
    "Tuck tight",
    "Knees to chest",
    20
   ],
   [
    "Spot and land",
    "See the floor, land standing",
    20
   ]
  ],
  "drills": [
   [
    "Round-off back handspring rebound",
    "Tall and fast",
    30
   ],
   [
    "Back handspring to tuck onto a raised mat",
    "Coach spots",
    30
   ],
   [
    "Tuck jumps",
    "Knees to chest",
    30
   ],
   [
    "Trampoline back tucks",
    "With a coach",
    30
   ]
  ],
  "tips": [
   [
    "Learn it in a gym",
    "It needs a trained spotter",
    15
   ],
   [
    "Keep the handspring low and fast",
    "It gives the sault more height",
    15
   ],
   [
    "Set before you tuck",
    "Lift first, then rotate",
    15
   ]
  ]
 },
 {
  "id": "s31",
  "title": "Straddle Double",
  "fig": "backhand",
  "tint": 3,
  "price": 9.99,
  "level": "Level 3",
  "breakdown": [
   [
    "Straddle jump",
    "High, legs wide, toes pointed",
    20
   ],
   [
    "Land in a chair position",
    "Feet together, ready to go back",
    20
   ],
   [
    "First back handspring",
    "Arms by ears, fast snap down",
    20
   ],
   [
    "Second back handspring",
    "Straight into it, no pause",
    20
   ],
   [
    "Rebound",
    "Arms up, chest up",
    20
   ]
  ],
  "drills": [
   [
    "Straddle jump to chair sit",
    "Land balanced, knees behind toes",
    30
   ],
   [
    "Back handspring, back handspring down a wedge",
    "Keep the rhythm",
    30
   ],
   [
    "Handstand snap-downs",
    "Fast feet under the hips",
    30
   ],
   [
    "Straddle jump back handspring",
    "Link one first",
    30
   ]
  ],
  "tips": [
   [
    "Land the jump ready",
    "Chest up and arms up after the straddle",
    15
   ],
   [
    "Low and fast",
    "Each handspring travels back",
    15
   ],
   [
    "Strong single back handspring first",
    "Then link two",
    15
   ]
  ]
 },
 {
  "id": "s19",
  "title": "Front Sault Step-out",
  "fig": "salto",
  "tint": 1,
  "price": 9.99,
  "level": "Level 4",
  "breakdown": [
   [
    "Run and hurdle",
    "Arms up",
    20
   ],
   [
    "Punch",
    "Quick feet",
    20
   ],
   [
    "Lift and rotate",
    "Chest up",
    20
   ],
   [
    "Split the legs",
    "One leg leads down",
    20
   ],
   [
    "Step out",
    "One foot, then the other",
    20
   ]
  ],
  "drills": [
   [
    "Front tuck",
    "Solid tuck first",
    30
   ],
   [
    "Front walkover step-out",
    "Same leg pattern",
    30
   ],
   [
    "Trampoline step-outs",
    "With a coach",
    30
   ]
  ],
  "tips": [
   [
    "Learn it in a gym",
    "It needs a coach",
    15
   ],
   [
    "Split late",
    "Rotate first",
    15
   ],
   [
    "Chest up on landing",
    "Arms up",
    15
   ]
  ]
 },
 {
  "id": "s21",
  "title": "Standing Tuck",
  "fig": "salto",
  "tint": 3,
  "price": 9.99,
  "level": "Level 4",
  "breakdown": [
   [
    "Stand tall",
    "Arms up",
    15
   ],
   [
    "Swing and jump up",
    "Jump up, not back",
    20
   ],
   [
    "Hips up",
    "Lift the knees",
    20
   ],
   [
    "Tuck tight",
    "Grab the shins",
    20
   ],
   [
    "Spot and land",
    "See the floor, land standing",
    20
   ]
  ],
  "drills": [
   [
    "Back tuck off a block",
    "Onto a crash mat",
    30
   ],
   [
    "Tuck jumps",
    "Knees to chest",
    30
   ],
   [
    "Spotted standing tuck",
    "Coach hand on the back",
    30
   ],
   [
    "Trampoline back tucks",
    "With a coach",
    30
   ]
  ],
  "tips": [
   [
    "Learn it in a gym",
    "It needs a trained spotter",
    15
   ],
   [
    "Big arm swing",
    "Arms drive the height",
    15
   ],
   [
    "Don't throw the head",
    "Eyes look back late",
    15
   ]
  ]
 },
 {
  "id": "s22",
  "title": "Back Layout",
  "fig": "layout",
  "tint": 0,
  "price": 11.99,
  "level": "Level 4",
  "breakdown": [
   [
    "Round-off",
    "Fast snap down",
    20
   ],
   [
    "Back handspring",
    "Low and fast",
    20
   ],
   [
    "Set high",
    "Arms up, chest up",
    20
   ],
   [
    "Straight body",
    "Hollow, legs together",
    20
   ],
   [
    "Land",
    "Spot the floor",
    20
   ]
  ],
  "drills": [
   [
    "Round-off back handspring rebound",
    "Tall rebound",
    30
   ],
   [
    "Layouts on trampoline",
    "With a coach",
    30
   ],
   [
    "Hollow hold",
    "Tight body, 30 s",
    30
   ],
   [
    "Layout onto a raised mat",
    "Coach spots",
    30
   ]
  ],
  "tips": [
   [
    "Learn it in a gym",
    "With a coach",
    15
   ],
   [
    "Hollow, not arched",
    "Ribs in",
    15
   ],
   [
    "Height first",
    "Rotation follows",
    15
   ]
  ]
 },
 {
  "id": "s25",
  "title": "Whip",
  "fig": "layout",
  "tint": 2,
  "price": 9.99,
  "level": "Level 4",
  "breakdown": [
   [
    "Round-off",
    "Fast snap down",
    20
   ],
   [
    "Rebound low and back",
    "Arms swing back fast",
    20
   ],
   [
    "Arch through",
    "Chest lifts, hips drive up",
    20
   ],
   [
    "Snap the legs over",
    "Fast heels to the floor",
    20
   ],
   [
    "Land and rebound",
    "Ready for the next skill",
    20
   ]
  ],
  "drills": [
   [
    "Round-off rebound",
    "Fast and low",
    30
   ],
   [
    "No-hands back handspring drill",
    "Onto a raised mat",
    30
   ],
   [
    "Bridge rocks",
    "Open the shoulders",
    30
   ],
   [
    "Whips on trampoline",
    "With a coach",
    30
   ]
  ],
  "tips": [
   [
    "Learn it in a gym",
    "It needs a coach spotting",
    15
   ],
   [
    "Low and fast",
    "It travels like a back handspring without hands",
    15
   ],
   [
    "Strong back handspring first",
    "Same shape, more speed",
    15
   ]
  ]
 },
 {
  "id": "s33",
  "title": "Back Handspring Back Handspring Tuck",
  "fig": "salto",
  "tint": 1,
  "price": 11.99,
  "level": "Level 4",
  "breakdown": [
   [
    "First back handspring",
    "Sit back, arms by ears",
    20
   ],
   [
    "Second back handspring",
    "Low and fast",
    20
   ],
   [
    "Snap down and set",
    "Arms up, chest up",
    20
   ],
   [
    "Tuck tight",
    "Knees to chest",
    20
   ],
   [
    "Spot and land",
    "See the floor, land standing",
    20
   ]
  ],
  "drills": [
   [
    "Back handspring, back handspring rebound",
    "Tall rebound at the end",
    30
   ],
   [
    "Back handspring to tuck onto a raised mat",
    "Coach spots",
    30
   ],
   [
    "Tuck jumps",
    "Knees to chest",
    30
   ],
   [
    "Back tucks on trampoline",
    "With a coach",
    30
   ]
  ],
  "tips": [
   [
    "Learn it in a gym",
    "It needs a trained spotter",
    15
   ],
   [
    "Set before you tuck",
    "Lift first, then rotate",
    15
   ],
   [
    "Fast handsprings give height",
    "Keep them low",
    15
   ]
  ]
 },
 {
  "id": "s23",
  "title": "Full",
  "fig": "twist",
  "tint": 1,
  "price": 12.99,
  "level": "Level 5",
  "breakdown": [
   [
    "Round-off back handspring",
    "Fast and low",
    20
   ],
   [
    "Set high",
    "Arms up",
    20
   ],
   [
    "Start the twist",
    "Arms wrap in tight",
    20
   ],
   [
    "Full twist in layout",
    "Straight body, look over the shoulder",
    25
   ],
   [
    "Open and land",
    "Arms out to stop",
    20
   ]
  ],
  "drills": [
   [
    "Jump full turns",
    "Arms wrap tight",
    30
   ],
   [
    "Layout half twist",
    "On trampoline",
    30
   ],
   [
    "Back drop to full on trampoline",
    "With a coach",
    30
   ],
   [
    "Hollow log rolls",
    "Twist in a tight hollow",
    30
   ]
  ],
  "tips": [
   [
    "Learn it in a gym",
    "With a coach",
    15
   ],
   [
    "Layout first",
    "A solid layout before twisting",
    15
   ],
   [
    "Pick one direction",
    "Always twist the same way",
    15
   ]
  ]
 },
 {
  "id": "s26",
  "title": "Arabian",
  "fig": "salto",
  "tint": 2,
  "price": 12.99,
  "level": "Level 5",
  "breakdown": [
   [
    "Take off facing backwards",
    "From a round-off or hurdle step",
    20
   ],
   [
    "Jump up and back",
    "Arms lift high",
    20
   ],
   [
    "Half turn",
    "Turn early, look for the floor",
    20
   ],
   [
    "Front tuck",
    "Knees to chest",
    20
   ],
   [
    "Land",
    "Chest up, arms up",
    20
   ]
  ],
  "drills": [
   [
    "Jump half turns",
    "Arms tight on the turn",
    30
   ],
   [
    "Back jump half turn to forward roll",
    "Onto a crash mat",
    30
   ],
   [
    "Front tuck",
    "A solid front sault first",
    30
   ],
   [
    "Arabians on trampoline",
    "With a coach",
    30
   ]
  ],
  "tips": [
   [
    "Learn it in a gym",
    "It needs a coach",
    15
   ],
   [
    "Turn before you tuck",
    "Half turn first, then rotate",
    15
   ],
   [
    "Strong front sault first",
    "Same landing",
    15
   ]
  ]
 },
 {
  "id": "s27",
  "title": "Front Layout",
  "fig": "layout",
  "tint": 3,
  "price": 12.99,
  "level": "Level 5",
  "breakdown": [
   [
    "Run and hurdle",
    "Arms up on the hurdle",
    20
   ],
   [
    "Punch",
    "Straight legs, fast feet",
    20
   ],
   [
    "Lift the hips",
    "Heels drive up and over",
    20
   ],
   [
    "Straight body",
    "Hollow, legs together",
    20
   ],
   [
    "Land",
    "Chest up, arms up",
    20
   ]
  ],
  "drills": [
   [
    "Front tuck",
    "A solid tuck first",
    30
   ],
   [
    "Front pike",
    "Bridges tuck to layout",
    30
   ],
   [
    "Front layout onto a raised mat",
    "Coach spots",
    30
   ],
   [
    "Hollow hold",
    "Tight body, 30 s",
    30
   ]
  ],
  "tips": [
   [
    "Learn it in a gym",
    "It needs a coach",
    15
   ],
   [
    "Height from the punch",
    "Block hard off two feet",
    15
   ],
   [
    "Stay hollow",
    "Don't arch",
    15
   ]
  ]
 },
 {
  "id": "s29",
  "title": "Front Sault Front Sault",
  "fig": "salto",
  "tint": 0,
  "price": 12.99,
  "level": "Level 5",
  "breakdown": [
   [
    "Run and hurdle",
    "Arms up on the hurdle",
    20
   ],
   [
    "First front sault",
    "Tight tuck, land on the balls of the feet",
    20
   ],
   [
    "Punch straight away",
    "No pause between the two",
    20
   ],
   [
    "Second front sault",
    "Arms up, chest up, tuck tight",
    20
   ],
   [
    "Land",
    "Spot the floor and stick it",
    20
   ]
  ],
  "drills": [
   [
    "Front sault to punch",
    "Land and rebound straight up",
    30
   ],
   [
    "Punch front onto a crash mat",
    "Soft landing for the second sault",
    30
   ],
   [
    "Rebound jumps",
    "Fast, stiff ankles",
    30
   ],
   [
    "Front to front on trampoline",
    "With a coach",
    30
   ]
  ],
  "tips": [
   [
    "Learn it in a gym",
    "It needs a coach",
    15
   ],
   [
    "Land ready to punch",
    "Chest up, feet slightly in front",
    15
   ],
   [
    "Strong single first",
    "Make one easy before linking two",
    15
   ]
  ]
 }
];
