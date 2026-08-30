/**
 * TIME MACHINE — 1857 content file
 * ================================================
 * This is the ONLY file you edit to change what happens in the 1857
 * timeline. The engine (/shared/year-engine.js) reads this object and
 * drives the whole experience — you never touch the engine itself.
 *
 * WHAT TO DO:
 *  1. Put your 3 scene clips + your ending clip(s) in ./videos/
 *     (see the exact filenames referenced below).
 *  2. Rewrite prompt / option labels / descriptions to match your story.
 *  3. Each option can carry any custom field you like (here we use
 *     "tag") — you read it back inside an ending's `when()` function
 *     to decide which ending plays.
 *
 * HOW ENDINGS ARE CHOSEN:
 *  `endings` is checked TOP TO BOTTOM. The first ending whose `when()`
 *  returns true wins. `when` receives `selections`, an array of the
 *  3 option objects the player picked (in order — selections[0] is
 *  Scene 1's pick, selections[1] is Scene 2's, etc.).
 *  ALWAYS keep a final ending with `when: () => true` as a catch-all
 *  fallback, or nothing will play if no rule matches.
 */

export const YEAR_DATA = {
  id: "1857",
  title: "1857",
  subtitle: "The First War of Independence",
  introText:
    "Meerut, 10 May 1857. Sepoy discontent over the new Enfield cartridges has reached breaking point. What you choose in the next three moments will decide the timeline.",

  scenes: [
    {
      id: "scene1",
      label: "The Cartridge Parade",
      video: "years/1857/videos/scene1.mp4",
      prompt: "The parade ground falls silent, waiting on you. Do you defy the order, stall for time, or comply?",
      options: [
        { id: "s1-defy", label: "Refuse the cartridge outright, in front of the regiment", tag: "rebel" },
        { id: "s1-negotiate", label: "Request the officers delay the drill", tag: "neutral" },
        { id: "s1-comply", label: "Comply and load the cartridge", tag: "loyalist" },
      ],
    },
    {
      id: "scene2",
      label: "The Meerut Uprising",
      video: "years/1857/videos/scene2.mp4",
      prompt: "Night falls over the cantonment. The regiment is ready to move. Do you march for Delhi, or hold your position?",
      options: [
        { id: "s2-march", label: "March for Delhi before dawn breaks", tag: "rebel" },
        { id: "s2-hold", label: "Hold the cantonment and wait for orders", tag: "neutral" },
      ],
    },
    {
      id: "scene3",
      label: "Before the Red Fort",
      video: "years/1857/videos/scene3.mp4",
      prompt: "You stand before Bahadur Shah Zafar. How do you counsel him?",
      options: [
        { id: "s3-lead", label: "Urge him to lead the rebellion openly", tag: "rebel" },
        { id: "s3-caution", label: "Urge caution — dig in and defend", tag: "neutral" },
        { id: "s3-retreat", label: "Advise a tactical retreat to regroup", tag: "loyalist" },
        { id: "s3-surrender", label: "Recommend negotiating surrender terms", tag: "loyalist" },
      ],
    },
  ],

  endings: [
    {
      id: "ending-martyr",
      title: "Martyr of 1857",
      video: "years/1857/videos/ending-martyr.mp4",
      description:
        "Every choice you made pushed the rebellion forward. Your name is etched into 1857's story of defiance — its cost was everything.",
      when: (selections) => selections.filter((o) => o.tag === "rebel").length >= 3,
    },
    {
      id: "ending-uprising-falters",
      title: "The Uprising Falters",
      video: "years/1857/videos/ending-falters.mp4",
      description:
        "You threw your weight behind the rebellion, but hesitation elsewhere in the ranks left it exposed. The revolt is put down by 1858 — but the idea it planted outlives it.",
      when: (selections) => selections.filter((o) => o.tag === "rebel").length === 2,
    },
    {
      id: "ending-survivor",
      title: "A Cautious Survivor",
      video: "years/1857/videos/ending-survivor.mp4",
      description:
        "You chose the careful path at every turn. You live to see 1858 — but history remembers the ones who didn't hold back.",
      when: (selections) => selections.filter((o) => o.tag === "loyalist").length >= 2,
    },
    {
      id: "ending-default",
      title: "History Remembers",
      video: "years/1857/videos/ending-default.mp4",
      description:
        "Your choices were mixed — part caution, part defiance. The timeline settles into an uneasy middle path.",
      when: () => true, // fallback — keep this last, always matches
    },
  ],
};
