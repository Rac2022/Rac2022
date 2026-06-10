# The Failure Log — design plan

## Rationale

The aesthetic is a post-incident ledger: the visual language of places where failure
is recorded as data, not confessed as sin — accounting books, lab notebooks, flight
recorders. Everything is columnar, typographic, and still. Red is the brand color but
it behaves like red ink in a double-entry book: it carries the data itself (entries,
counts, markers) and is never used as alarm styling. The page is near-white with a
faint cool cast, like ledger paper under fluorescent light; rules are hairlines, not
shadows; corners are nearly square. The monospaced face does most of the work of
selling the ledger — dates, counts, and column labels are all mono. Motion is spent
in exactly one place: the stamp when an entry lands. Everything else holds still.

## Palette (design tokens)

| Token            | Hex       | Role                                                  |
| ---------------- | --------- | ----------------------------------------------------- |
| `--color-paper`  | `#F6F7F6` | Page background — near-white, faint cool cast         |
| `--color-card`   | `#FCFCFB` | Raised surfaces (ledger cards, inputs)                |
| `--color-ink`    | `#17191A` | Primary text — near-black                             |
| `--color-soft`   | `#565B5C` | Secondary text (AA on paper, 6.4:1)                   |
| `--color-red`    | `#B3382C` | Brand/data red — entries, counts, markers (5.5:1)     |
| `--color-press`  | `#8F2C22` | Red hover/pressed                                     |
| `--color-tint`   | `#F2E5E2` | Faint red wash — selected chips, stamps               |
| `--color-zero`   | `#5C6165` | Zero Day graphite — text (AA, 5.9:1)                  |
| `--color-zerobg` | `#EEEFEF` | Zero Day row wash                                     |
| `--color-rule`   | `#D8DBDA` | Hairline rules and borders                            |

No other colors. Charts use red, zero-graphite, and rule only.

## Typography (all from Google Fonts, self-hosted via @fontsource)

- **Display: Oswald** — condensed grotesque for headings and big numbers. Used
  sparingly and large; medium weight, slight tracking on labels.
- **Body: Source Sans 3** — highly legible body face for entry text, copy, controls.
- **Mono: IBM Plex Mono** — dates, counts, ledger columns, tags. This is the face
  that sells the ledger.

## Type scale

| Step      | Size/line   | Face    | Use                              |
| --------- | ----------- | ------- | -------------------------------- |
| `caption` | 12/16       | mono    | column labels, tags, gap markers |
| `small`   | 14/20       | body    | secondary copy, hints            |
| `base`    | 16/24       | body    | entry text, controls             |
| `lede`    | 18/26       | body    | onboarding copy                  |
| `h3`      | 22/28       | display | section heads                    |
| `h2`      | 28/32       | display | page heads                       |
| `display` | 40/44       | display | onboarding thesis, prompts       |
| `number`  | 64/64       | display | big counts (streak, rejections)  |

Spacing on a 4px grid. Radius: 2px everywhere. No shadows; hairline borders only.

## Motion

One moment: on submit, the new ledger card stamps in (scale 1.04 → settle, ~360ms)
and the streak counter ticks up. Everything else is instant. All of it is disabled
under `prefers-reduced-motion`.

## Structure note

Streaks & milestones live as the top section of Insights ("The record") rather than
a fifth page: they answer the same question Insights answers — am I showing up — and
a 4-tab nav keeps the phone bottom bar honest. Milestone unlocks surface as one quiet
line on the Today page the day they happen.
