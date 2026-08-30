# TIME MACHINE — year pages: folder map

## Where everything lives

```
project root/
├── index.html                 ← your existing time-machine homepage (unchanged)
├── 1857.html                  ← NEW — thin loader page for 1857
├── 1914.html                  ← (not created yet — copy 1857.html, see below)
├── 1941.html                  ← (not created yet)
├── 1971.html                  ← (not created yet)
├── 1999.html                  ← (not created yet)
│
├── shared/                    ← NEW — reusable engine, used by ALL years
│   ├── year-engine.js         ← drives title card → 3 scenes → MCQs → ending
│   └── year.css               ← all visual styling for year pages
│
└── years/                     ← NEW — one subfolder per year
    └── 1857/
        ├── data.js            ← 1857's script: scene prompts, MCQ options, endings
        └── videos/            ← 1857's video files go here
            ├── scene1.mp4
            ├── scene2.mp4
            ├── scene3.mp4
            ├── ending-martyr.mp4
            ├── ending-falters.mp4
            ├── ending-survivor.mp4
            └── ending-default.mp4
```

`src/config/destinations.js` in your existing project already points each
year button at `./1857.html`, `./1914.html`, etc., so `1857.html` sitting
at the project root is exactly where it needs to be for the wormhole
travel sequence to land on it.

## The two kinds of file, and which one you touch

- **`shared/year-engine.js` and `shared/year.css`** — write once, reused by
  every year. You should basically never need to edit these when adding a
  new year. (You *would* come back here if you want to change the shared
  look-and-feel or flow for all 5 years at once — e.g. add a timer, change
  the letterbox bars, add a sound track.)
- **`years/<year>/data.js`** — this is where 100% of a year's actual
  content lives: the 3 scene prompts, each MCQ's options (2, 3 or 4 — the
  engine doesn't care), and the ending rules. This is the only file you
  write per year.

## How the ending is chosen

Each option in `data.js` carries a free-form tag (in the 1857 file it's
`"rebel" | "neutral" | "loyalist"`, but you can call it anything or add
more fields). After all 3 MCQs are answered, the engine walks the
`endings` array **top to bottom** and plays the first one whose `when()`
function returns `true` for the 3 choices made. Always keep a final
`when: () => true` entry — it's the catch-all so something always plays.

This means endings aren't limited to "one ending per exact combo" — you
can write rules like "at least 2 rebel picks" that match many different
paths through the story, which keeps the number of ending videos you
actually have to generate manageable (1857 uses only 4 ending videos to
cover every possible combination of answers across the 3 scenes).

## Testing before your videos exist

Open `1857.html` (through a local server — see below) and click through.
If a video file isn't there yet, you'll see an on-screen notice instead
of a blank screen, with a "Continue anyway" button — so you can validate
your whole branching story and MCQ flow before a single clip is rendered.

You need a local server (not `file://`) because the page uses ES module
imports. From the project root:

```
python3 -m http.server 8000
# then open http://localhost:8000/index.html
```

or `npx serve .` if you have Node installed.

## Copy-pasting this setup for the other 4 years

For each remaining year (1914, 1941, 1971, 1999):

1. Duplicate `years/1857/` → `years/1914/` (etc.), including its `videos/`
   subfolder.
2. Duplicate `1857.html` → `1914.html` at the project root. Inside it,
   change only:
   - the `<title>` text
   - `./years/1857/data.js` → `./years/1914/data.js`
3. Open `years/1914/data.js` and rewrite the content: `title`, `subtitle`,
   `introText`, the 3 scenes' `video` paths / `prompt` / `options`, and
   the `endings` array + their `video` paths.
4. Drop that year's video clips into `years/1914/videos/` using whatever
   filenames you referenced in step 3.
5. `src/config/destinations.js` already has an entry with `url:
   "./1914.html"` for each year, so no other changes are needed — the
   homepage buttons already point at the right place.

You never need to touch `shared/year-engine.js` or `shared/year.css` for
any of this — that's the whole point of keeping them separate from the
per-year `data.js` files.
