# Legal drafts: read this first

These are **drafts written for you to finish, not legal advice**. They describe what the app does today, checked against the code. Have a lawyer read them before they go public, because they cover children.

## What is here
| File | What it is |
|---|---|
| `privacy-policy.md` | The privacy policy both stores require. |
| `challenge-rules.md` | The official rules for the Christmas Strength Challenge. Apple requires rules for competitions. |
| `terms-of-use.md` | Short terms of use, including the training safety warning. |
| `store-privacy-answers.md` | Ready answers for the Apple and Google privacy forms, plus audience and age-rating notes. |

## Fill in (search for `[[`)
- **Business name, ABN, postal address and a contact email.** Every document needs them.
- **Effective date.**
- **Retention period** (how long you keep Challenge data after it ends) and **backup period** (ask Railway or check your plan).
- **Governing state**, for example New South Wales.
- **Prizes, claim period and voucher redemption** in the Challenge rules.
- **Links** between the documents, once they have web addresses.

## Decisions only you can make
1. **Can you deliver every prize?** The design promises: $50 and $25 vouchers, 20% off, a free skill unlock (day 12), personal video feedback (day 18) and a free breakdown video (day 24). Today **paid content is switched off**, so vouchers and skill unlocks **cannot be used yet**. Either change the prizes, or say clearly when and how they can be redeemed.
2. **Is a permit needed?** A competition where the winner is decided by points earned (skill) is usually treated differently from one decided by chance, but rules differ by state. Ask a lawyer before you launch.
3. **Is "adults only" the right audience?** The documents assume accounts are for adults and children take part under a parent. That choice decides which store rules apply.

## What I changed in the code for the policy to be true
The server used to keep the email address from an unfinished sign-in until that person asked for another code. It now **deletes expired sign-in codes and sessions every hour** (with a test). Without this change, the policy statement in section 8 would be false.

## Not covered yet
- **A web address for each document.** Both stores need the privacy policy at a **public link**, and Google also needs a public page about deleting an account. Options: publish the pages from this GitHub repo (GitHub Pages), or serve them from your Railway server. Ask me and I'll set up whichever you choose.
- **Paid content.** When you switch on purchases, update the Terms (section 7), the store answers, and add refund and tax wording.
- **New data.** If you add analytics, crash reports, ads, push notifications or photos, the privacy policy and both store forms must change first.
