# Answers for the App Store and Google Play privacy forms

These match what the app does today (checked against the code). **Re-check each answer against the live form when you fill it in**, because Apple and Google change their wording. If you add analytics, crash reporting, ads or purchases later, these answers change.

## Apple: App Privacy ("nutrition label")

**Do you or your third-party partners collect data from this app?** Yes.
**Is data used to track you?** **No.** (No advertising, no analytics, no data shared with data brokers.)

| Apple data type | Collected | Linked to the user | Used for | Tracking |
|---|---|---|---|---|
| **Contact Info → Email Address** (the parent's email) | Yes | Yes | App Functionality | No |
| **Contact Info → Name** (a child's first name and last initial) | Yes | Yes | App Functionality | No |
| **Identifiers → User ID** (account ID and sign-in token) | Yes | Yes | App Functionality | No |
| **Health & Fitness → Fitness** (exercises ticked, finisher scores) | Yes | Yes | App Functionality | No |
| **User Content → Other User Content** (points, streaks, rank) | Yes | Yes | App Functionality | No |

Everything else (location, contacts, photos, browsing history, purchases, diagnostics, advertising data, sensitive info): **not collected.**

**Privacy Policy URL:** [[PUBLIC LINK TO THE PRIVACY POLICY]]

## Google Play: Data safety form

**Does your app collect or share required user data types?** Yes, it collects. It does **not share** data with other companies for their own use. (Railway and Resend only process it for us as service providers, which Google does not count as "sharing".)

| Google data type | Collected | Shared | Required or optional | Why |
|---|---|---|---|---|
| **Email address** | Yes | No | Required | Account management |
| **Name** (a child's first name and last initial) | Yes | No | Required to join the Challenge | App functionality |
| **User IDs** | Yes | No | Required | Account management |
| **Fitness info** (exercise activity and scores) | Yes | No | Required to join the Challenge | App functionality |
| **Other in-app activity** (points, streaks) | Yes | No | Required to join the Challenge | App functionality |

- **Is all user data encrypted in transit?** Yes (the app only talks to the server over HTTPS).
- **Can users request that their data be deleted?** Yes. In the app (Account → Delete my account) **and** by emailing [[CONTACT EMAIL]].
- **Account deletion web link:** Google requires a **public web page** that explains how to delete an account and data. [[WEB LINK, for example the section "Your choices and rights" of the published privacy policy]]
- **Follows the Families Policy?** See the note on audience below.

## Audience and age rating

- **Target audience:** declare the app as for **adults (parents, guardians and coaches)**. This matches the Terms (accounts need an adult) and avoids the stricter children's rules (Apple's Kids Category, Google's Families Policy). **Do not choose the Kids Category.** Children still take part through a parent's account, so have a lawyer confirm this is the right declaration.
- **Apple age rating:** the app has no violence, mature or gambling content. Answer the questionnaire honestly. A rating of **4+** is likely.
- **Google content rating:** answer the questionnaire honestly (no user-to-user chat, no user-generated content shared between users, no purchases yet).

## For the reviewers
- **Demo login:** both stores need a login that works without reading your email. The server supports a fixed demo sign-in, set by two Railway variables (`REVIEW_EMAIL` and `REVIEW_CODE`). Choose them, set them in Railway, and put them in the store review notes. [[NOT SET YET]]
- **Explain the Challenge:** tell them it runs 1 to 24 December, entry is free, and no purchase is needed. Paid content is shown as "Coming soon" in this version.
- **Competition rules:** link to the Challenge Rules. They include the statement that Apple and Google are not involved.
