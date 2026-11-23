# Product idea evaluation

Give a verdict on an idea the user already has: `proceed`, `narrow` or `stop`,
with the evidence behind it and the cheapest test that would change the answer.

## Use when

The user brings an idea: "is this worth building", "would anyone pay for X",
"should I keep going with my side project". If they want options instead, use
`product.discovery`.

## Inputs

- the idea in one paragraph, plus who the user believes pays for it
- what the user can build today, with evidence
- hours per week and money available
- what has already been tried: users spoken to, code written, money spent
- competitors or alternatives the user knows of

## Steps

1. **Restate the idea as a testable hypothesis.** "`<audience>` will pay
   `<price>` for `<outcome>` because `<current alternative>` is worse." If the
   user cannot fill a slot, that slot is the first finding.
2. **Audit the evidence.** Separate what the user knows from what they assume:
   conversations held, payments taken, usage observed. Count them.
3. **Score it** with the rubric in `references/methodology.md`, and name the two
   weakest criteria. Existing competitors score the "willingness to pay" line
   honestly rather than automatically badly — competition is evidence of a
   market.
4. **Price the build against the user's capacity.** Weeks at their hours per
   week, and the skills the core needs. If the first usable version exceeds two
   weeks of their time, say what to cut.
5. **Choose the verdict**, with the reason tied to a criterion.
6. **Design the cheapest test that could flip the verdict**, and the numeric
   result that would flip it.

## Deliverable

1. The hypothesis, restated with every slot filled or marked as a gap.
2. Scores per criterion with the two weakest named.
3. The verdict and its reason in two sentences.
4. The next test: what to do, cost, date, and the number that changes the answer.
5. Existing evidence that conflicts with the verdict, if any — do not bury it.

## Verdict definitions

| Verdict   | Means                                                                                                                |
| --------- | -------------------------------------------------------------------------------------------------------------------- |
| `proceed` | The evidence supports spending the next two weeks building the slice.                                                |
| `narrow`  | A market exists, but the current wedge is too broad or the user's access is weak; respecify audience or scope first. |
| `stop`    | A criterion is scored 1–2 and cannot be fixed within the user's budget; name what would make it worth revisiting.    |

## Quality bar

- Politeness is not a verdict. If the idea is weak, say `stop` and why.
- Sunk cost is not evidence; time already spent never raises a score.
- Every assumption is labelled and every gap is listed.
- The test is cheaper than the thing it is testing.

## Failure modes

- Scoring the technology instead of the customer.
- Treating "no competitors" as good news without checking who the buyer pays
  today.
- Recommending more research when five conversations would answer it.
- A verdict with no numeric threshold attached.
