# Fuse — CFA Speed Drill

A timed CFA practice app built with Expo (React Native). No backend server —
content is bundled into the app, and payments go through RevenueCat, which
handles receipt validation on its own servers instead of yours.

This document covers: getting it running on your laptop, how the "no
backend" pieces actually work, how to add more questions (including a
ready-to-use Claude prompt), and what's still a placeholder vs. what's real.

---

## 1. What works right now, out of the box

Everything except real payments works immediately in Expo Go (the free
app-testing app on your phone), with zero setup beyond installing packages:

- The orbit hub, pricing display, and per-level progress
- The full 10-question timed drill for each of the 3 levels, with the pause
  button
- Progress that persists between app launches (via on-device storage)
- The "Reset progress" control

The "Unlock" buttons on the hub are wired up and functional, but run in
**demo mode** until you set up RevenueCat (section 4) — tapping one just
shows a toast confirming what *would* happen. This is intentional: it lets
you test and iterate on the whole app before spending any time on payment
setup.

---

## 2. Installing on your laptop

You'll need [Node.js](https://nodejs.org) (the LTS version) installed
first. Then, the safest path — safer than copying `package.json` by hand,
since it guarantees every package version is compatible with whatever the
current Expo SDK is:

```bash
# 1. Scaffold a fresh Expo project (this picks correct, current versions for you)
npx create-expo-app@latest fuse-cfa
cd fuse-cfa

# 2. Delete the placeholder App.js it creates, then copy in the files
#    from this project: App.js, app.json, and everything under src/

# 3. Install the extra packages this app needs — all standard, well
#    maintained packages, nothing exotic:
npx expo install react-native-svg @react-native-async-storage/async-storage expo-haptics

# 4. Run it
npx expo start
```

Scan the QR code with the **Expo Go** app on your phone (iOS or Android),
or press `i` / `a` in the terminal for a simulator/emulator if you have
Xcode or Android Studio installed. No build step, no native tooling
required for this part.

If you'd rather just copy this whole folder in as-is: it includes a
`package.json`, but treat it as a reference — if `npm install` complains
about version mismatches, the `create-expo-app` path above is the
reliable fallback.

---

## 3. How the "no backend" architecture works

**Content:** `src/data/questions.js` is a plain JavaScript file bundled
into the app at build time. There's no API call, no database, no server —
editing that file and reloading the app is the entire content pipeline.

**Progress:** stored on-device using `@react-native-async-storage/async-storage`
(the standard local key-value store for React Native — think of it as
the mobile equivalent of a browser's local storage). Nothing leaves the
phone.

**Payments:** this is the one place a "backend" would normally be
required — someone has to validate that a purchase actually happened
with Apple/Google before you unlock content. RevenueCat does that job as
a hosted service, so you write zero server code. See section 4.

---

## 4. Adding real payments (do this later, when you're ready to ship)

This part requires more than `npx expo start` — plan for it as a separate
step, not something to set up on day one.

**What you'll need:**
1. An Apple Developer account (~$99/year) and/or Google Play Developer
   account (~$25 one-time) — unavoidable platform costs for any paid app.
2. A free [RevenueCat](https://www.revenuecat.com) account. Their free
   tier covers apps earning up to $2,500/month in tracked revenue, then
   takes a percentage above that — check their pricing page directly for
   the current rate before finalizing your numbers, since this can change.
3. In App Store Connect / Google Play Console, create in-app purchase
   products matching the IDs already referenced in `src/config.js`
   (`fuse_l1_topic`, `fuse_l1_full`, etc. — rename them if you prefer,
   just keep `config.js` in sync).
4. In your RevenueCat dashboard, connect those store products to
   RevenueCat "offerings," and grab your iOS and Android API keys.
5. Paste those keys into `PURCHASES.REVENUECAT_API_KEY_IOS` /
   `_ANDROID` in `src/config.js`, and flip `DEMO_MODE` to `false`.
6. Install the SDK: `npx expo install react-native-purchases`.

**The one real gotcha:** `react-native-purchases` is a *native* module —
it will not run inside plain Expo Go. To actually test a purchase, you
need a **development build** instead:

```bash
npx expo run:ios      # or
npx expo run:android
```

This builds a custom version of the app with the native purchase code
included (Expo Go only ships with a fixed set of pre-installed modules,
and RevenueCat isn't one of them). Everything else in this app keeps
working exactly the same in a dev build as it did in Expo Go — this only
matters for the unlock buttons.

---

## 5. How to add more questions

Open `src/data/questions.js`. Each level is a plain array of question
objects. To add more, the top of that file has a ready-to-use prompt —
copy it into a Claude conversation, fill in the level and topic, and
paste the returned array straight into the file.

The short version of the format:

```js
{
  topic: "FIXED INCOME",
  vignette: "One-to-two sentence scenario.",
  stem: "The question, one sentence. Wrap a key term in <em>...</em> if useful.",
  options: ["...", "...", "..."],   // exactly 3
  correct: 1,                        // index of the right answer
  explain: "Why the right answer is right, in plain terms."
}
```

The house style (already baked into the prompt template): vignette + stem
+ 3 options, designed to be quick to answer but genuinely easy to
mis-pick — numerator/denominator swaps, sign errors, similar-sounding
concepts — followed by a short "why" explanation.

---

## 6. Tuning numbers without touching logic

`src/config.js` is the one file meant for frequent editing:

- `timeOptions` — the seconds-per-question choices offered on the Ready
  screen (currently 5/10/15). Add or remove numbers freely.
- `pricing` — per-level topic price and full-unlock price. Change these
  any time; nothing else in the code needs to change.

---

## 6.5. Contact + Terms/Privacy

A "Contact us · Terms · Privacy" footer sits at the bottom of the hub
screen:

- **Contact us** opens the phone's mail app via a `mailto:` link,
  pre-filled with a subject line. Change the address in
  `src/data/legal.js` (`CONTACT_EMAIL`) — it's the one thing in that file
  you must edit.
- **Terms** and **Privacy** open a scrollable in-app modal showing the
  text in `src/data/legal.js` (`TERMS_TEXT` / `PRIVACY_TEXT`).

**Before you ship, please read this properly — it isn't just a
formality:**

1. **This is starter boilerplate, not legal advice.** Have an actual
   solicitor review both documents before publishing, particularly the
   liability/refund wording and anything specific to UK consumer law or
   GDPR given your audience.
2. **The CFA Institute trademark disclaimer in `TERMS_TEXT` is there on
   purpose, not just filler** — "CFA" is a trademark owned by CFA
   Institute, and third-party prep tools routinely include a "not
   affiliated with / endorsed by" disclaimer. Don't remove it without
   understanding why it's there.
3. **In-app text isn't enough for App Store Connect / Google Play
   Console.** Both stores want a **Privacy Policy URL** in their listing
   metadata — a link to a page you control, not just text shown inside
   the app. The in-app modal is good for user convenience, but you'll
   also need to host `PRIVACY_TEXT` (or an equivalent) somewhere public
   too — a free GitHub Pages page or a public Notion page both work fine
   for this without needing a real backend.

---

---

## 6.6. App icon, adaptive icon, and splash screen

`assets/icon.png`, `assets/adaptive-icon.png`, and `assets/splash.png` are
already generated and wired into `app.json` — no placeholder-file errors,
these are real images ready to build with.

**Design, on purpose:** the amber "dial" ring with radiating tick marks
(the same motif as the countdown ring in the drill screen) paired with an
ascending bar-chart glyph — reads as "timed" + "financial growth" without
using the word "CFA" anywhere, so the icon itself carries no trademark
risk regardless of what you decide about the app's display name.

**To regenerate or tweak them:** `scripts/gen-icons.js` builds all three
from one SVG "mark" definition using `sharp` (not a runtime dependency of
the app — only needed if you want to rerun this script):

```bash
npm install --no-save sharp
node scripts/gen-icons.js
```

Edit the colors, ring radius, tick count, or bar heights at the top of
that script and rerun it any time — no design tool required.

**One naming thing worth deciding, not fixing automatically:** the app's
display name in `app.json` is still `"Fuse — CFA Speed Drill"`, which
will appear directly under this CFA-free icon on the home screen and in
store listings. If avoiding the literal word "CFA" matters for the icon,
it's worth deciding deliberately whether it should also apply to the
name — happy to suggest alternatives if you want to change it, but I
haven't touched it since that's a bigger branding call than the icon
itself.

---

---

## 6.7. Topic-level unlocking and practice

Tapping a topic row on the hub's detail panel now does one of two
things:

- **Locked topic** → triggers the purchase flow (same as before), and
  on any non-error, non-cancelled result — including demo mode — the
  topic is marked unlocked locally (`src/utils/entitlements.js`) so you
  can verify the whole flow works before real payments are wired up.
- **Unlocked topic** → starts a quiz using *only* that topic's
  questions, via the Ready screen, same pause/timer mechanics as a
  full-level run.

**Entitlements are stored separately from quiz progress on purpose** —
tapping "Reset progress" clears scores/streaks but never revokes
something unlocked. If you need to clear entitlements while testing
(e.g. to re-test the locked state), the current way is clearing the
app's storage/reinstalling, since there's no dev-only "wipe unlocks"
control in the UI — happy to add one if you want faster iteration here.

**One thing this doesn't do yet:** a topic-scoped quiz result isn't
folded into the level's overall progress stats shown on the hub (that
schema assumes a full, mixed-topic run) — it just shows its own score
on the results screen and returns you to the hub. Worth knowing so the
numbers don't look like they're missing something.

---

---

## 6.8. Pre-purchase confirmation, and where refunds actually happen

Every purchase — single topic or full level — now shows a confirmation
screen first, stating exactly what you're about to get (real question
counts, computed live from `questions.js`, never a rounded marketing
number) and the exact price, with an explicit Confirm/Cancel choice.
This sits *in front of* the native App Store/Play Store payment sheet,
which still shows its own confirmation too — so there are two
confirmation steps before any charge, which is deliberately cautious.

**On refunds/cancellations:** there's nothing to build here, and that's
a direct consequence of not running a backend, not a gap in it. Apple
and Google both handle refunds entirely on their own — Apple doesn't
even give developers a self-service refund tool in App Store Connect;
Google Play Console has a limited order-management refund tool, but
most refunds still flow through Google's own customer-facing process.
Since this app stores no purchase records of its own, there's nothing
for it to reconcile.

**One real tradeoff worth knowing:** if RevenueCat/the stores ever
process a refund, this app has no way to find out and re-lock that
content — `entitlements.js` only reacts to purchases, not refunds,
since listening for refund events would need a small piece of server
(a RevenueCat webhook), which is exactly the backend this project set
out to avoid. Low-stakes for a one-time purchase in this price range,
but worth knowing if you ever scale this up.

---

---

## 6.9. Larger, centrally-controlled text size

Every font size in the app now routes through one multiplier —
`FONT_SCALE` in `src/theme.js` (currently `1.15`, "a bit larger" than
the original build). Change that one number and every screen resizes
together; nothing else needs touching. Under the hood, every
`fontSize: 14` became `fontSize: rem(14)`, where `rem()` just applies
the multiplier — a one-off migration script (`scripts/apply-font-scale.js`)
did this mechanically across all 8 screen/component files so nothing
was missed or double-converted.

---

## 6.10. First-launch walkthrough

New users now see a 3-step animated walkthrough on first opening the
app: tap an orbiting node → tap "Start trial" → tap a topic afterward
to unlock more. It only shows once (tracked via `src/utils/onboarding.js`),
has a "Don't show this again" option, and can be replayed any time via
the small "?" button next to "Reset progress" on the hub.

---

## 6.11. Per-question completion stats ("X/Y done")

Every question now has a stable `id` (e.g. `L2-07`) — see section 5's
updated instructions for how these get assigned automatically when you
add new questions. `src/utils/questionStats.js` records which question
IDs have been answered (and whether correctly) the moment each one is
answered in the drill — not just at the end of a round, so it counts
even if someone pauses and quits partway through.

This powers two things on the hub's detail panel:
- An overall **"QUESTIONS SEEN X/Y"** stat with a progress bar for the
  whole level, plus a line like "12 questions left to see."
- A smaller **"X/Y seen"** label under each topic name, using the same
  underlying counts filtered to that topic.

Both work identically whether a topic has 3 questions or 300 — it's
just counting how many of that pool's IDs show up in the seen map, so
nothing here needs to change as the question bank grows.

**Scope note:** this shows completion *counts*, not a scrollable list
of every individual question with a checkmark next to it. That's a
reasonable next step if you want it (a dedicated "question log"
screen), but is a bigger UI to build than the stats shown here — happy
to build it if the count-based view doesn't end up being enough.

**Tied to "Reset progress":** unlike entitlements (purchases), seen-question
stats are cleared by "Reset progress" — completion is progress, not
something paid for, so it makes sense for the two to reset together.

---

---

## 6.12. Merging large batches without pasting them into chat

Once you're generating full topic batches (75-170 questions each, per
the content-generation prompt pack), pasting that much text into a
chat for merging doesn't scale — and asking an LLM to compare
hundreds of questions across many topics in one shot is unreliable
anyway (that's what `merge-batches.js` replaces).

Instead: save each topic's raw generated output as its own file under
`new-batches/level-1/` (or `level-2`/`level-3`), then run:

```bash
node scripts/merge-batches.js
```

See `new-batches/README.md` for the full walkthrough. Short version:
it validates structure, flags likely duplicates (against existing
content and within your new batch) using text similarity — not an
LLM judgment call — and merges everything else straight into
`questions.js`. Flagged items go into `merge-report.txt` instead of
being silently kept or dropped, so you decide. Run
`add-question-ids.js` afterward as usual.

---

## 7. Known rough edges, worth knowing about up front

- **The orbit animation** on the hub uses React Native's `Animated` API
  with `useNativeDriver: true`, which should stay smooth even on older
  phones — but it hasn't been tested on real low-end Android hardware.
  If it ever feels heavy, the fix is deleting the `Animated.loop(...)`
  calls in `NodeOrbit.js` and letting the nodes sit at their fixed
  starting angles instead.
- **Sound vs. haptics:** the original web prototype used synthesized
  audio beeps (Web Audio has no direct equivalent in React Native
  without extra native audio packages). This version uses haptic
  feedback instead — a light tap each second, a stronger one in the
  final stretch, and a success/failure buzz on each answer. If you want
  actual sound later, `expo-av` is the standard Expo package for it.
- **Fonts:** this uses system monospace/sans fonts rather than the exact
  JetBrains Mono / Inter pairing from the web version, to avoid the extra
  font-loading packages and splash-screen delay. Swapping in
  `@expo-google-fonts/jetbrains-mono` later is a small, contained change
  if you want the exact look back.
- **This hasn't been run in a live simulator** as part of building it —
  it's been written carefully and should work, but budget time for the
  normal `expo start` → read error → fix loop on first run, especially
  around any package version mismatches `create-expo-app` didn't
  anticipate.

---

## 8. Project structure

```
fuse-cfa/
  App.js                    — screen router (no navigation library used)
  app.json                  — Expo config (rename the bundle IDs before shipping)
  scripts/
    gen-icons.js              — regenerates icon/adaptive-icon/splash assets
    apply-font-scale.js       — one-off migration that wrapped fontSize values in rem()
    add-question-ids.js       — assigns stable IDs to new questions (idempotent, safe to re-run)
  src/
    config.js                — timer options + pricing (edit this often)
    theme.js                 — colors, fonts, and FONT_SCALE (the app-wide text-size dial)
    data/
      questions.js            — the entire question bank + the Claude prompt
      legal.js                 — contact email + Terms/Privacy text (edit CONTACT_EMAIL)
    utils/
      storage.js               — on-device progress persistence
      entitlements.js           — on-device unlock tracking (separate from progress)
      questionStats.js         — per-question "seen" tracking, powers the X/Y stats
      onboarding.js             — first-launch walkthrough "seen" flag
      haptics.js               — pause/tick/success/fail feedback
      purchases.js             — RevenueCat wrapper (demo mode by default)
    components/
      FuseRing.js              — the countdown ring (drill screen)
      NodeOrbit.js             — the orbiting hub visual
      LegalModal.js            — scrollable Terms/Privacy modal
      ConfirmModal.js          — pre-purchase confirmation dialog
      OnboardingModal.js       — first-launch walkthrough
    screens/
      HubScreen.js
      ReadyScreen.js
      DrillScreen.js           — includes the pause button/modal
      ResultsScreen.js
```
