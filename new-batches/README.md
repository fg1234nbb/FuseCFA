# new-batches/

Put your generated content here, then run the merge script — nothing
in this folder needs to be pasted into a chat.

## Setup

For each topic you've generated, save its raw output as its own file
in the matching level folder:

```
new-batches/
  level-1/
    quant.txt
    fsa.txt
    ethics.txt
    ...(one file per topic)
  level-2/
  level-3/
```

- Filename doesn't matter — the `topic` field inside each question is
  what actually gets used.
- Paste the raw array Claude gave you as-is. Markdown code fences
  (```) are stripped automatically if present.
- If you ran multiple batches for one topic (e.g. Ethics' 12 batches),
  just paste them all into the same file, one array concatenated after
  another is fine — or combine them into one array yourself first,
  either works.

## Running it

```bash
node scripts/merge-batches.js
```

By default this merges `level-1`. To do Level II or III, open
`scripts/merge-batches.js` and change the `LEVEL` constant near the
top, then run it again.

**What it does:**
- Validates every question (3 options, valid `correct` index, all
  required fields present).
- Flags likely duplicates — both against what's already in
  `questions.js`, and within your own new file (in case multiple
  batches overlapped) — using text-similarity, not an LLM judgment
  call. This is a heuristic: it will occasionally flag two genuinely
  different questions that share a lot of wording (false positive —
  just glance and keep both), and can miss a duplicate that's been
  completely reworded (false negative). Worth a skim of the report,
  not a guarantee.
- Merges everything that passes into `questions.js` directly.
- Writes `merge-report.txt` listing anything flagged or structurally
  broken — **nothing in that report was added**, so review it and
  manually paste in anything you decide to keep after all.

**Then run** `node scripts/add-question-ids.js` to assign IDs to
whatever was just merged.

## After a successful merge

You can delete the files from `new-batches/` once they're merged in —
they're just staging, not part of the app.
