# Las Vegas Music School — website (LVMS Pulse)

Static HTML/CSS/JS prototype for [lasvegasmusicschools.com](https://www.lasvegasmusicschools.com), built in the **LVMS Pulse** design system. No build step, no framework.

## Pages

| File | Page |
| --- | --- |
| `index.html` | Home: animated hero, lessons, adult lessons, online, faculty, locations |
| `instructors.html` | Faculty grid with instrument filters and a daytime toggle (`instructors.html#daytime` opens with it on) |
| `adult-lessons.html` | Adult lessons, the Daytime Studio offer, how to start, FAQ |
| `openings.html` | Calendar of open lesson times, overall and by location (`openings.html#daytime` opens with daytime only). Each time links to the book page with that slot preselected |
| `book.html` | Five-step booking for the complimentary Initial Assessment: who, instrument, location, time, contact details, then a confirmation |

## Run locally

Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

## Publish on GitHub Pages

1. Create a repository and upload everything in this folder, keeping the structure.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
4. The site appears at `https://<username>.github.io/<repo>/` within a few minutes.

## Before launch

- **Placeholders:** anything in square brackets (instructor names, credentials, review count, testimonial, Daytime Studio pricing, Tivoli Village and Gramercy addresses) and grey "Portrait" boxes.
- **Instructor names:** first name and last initial only (owner's instruction). Keep credentials general so they can't be searched back to one person.
- **Openings calendar and booking times:** run on sample data in `assets/js/slots.js`. Replace it with live open slots from the scheduling system before launch. Do not maintain it by hand.
- **Booking requests are not sent yet.** GitHub Pages cannot receive form data, so `book.html` runs in demo mode and says so on the confirmation screen. To go live, either:
  - set `FORM_ENDPOINT` at the top of `assets/js/book.js` to a form service such as Formspree, so each request arrives by email, or
  - replace the `submit()` function with the scheduling system's booking API, so the slot is actually reserved.

  A form service only sends a request. Staff still have to confirm the time, which is why the page promises a call or email within one business day.
- **Children's details:** for students under 18 the form asks for a parent or guardian as the contact and only the student's first name and age range. Keep it that way.
- **Photos:** all photos are shown in black and white (green duotone in daytime blocks) by CSS. Missing: piano, strings, winds, and real faculty portraits. Building photos should be cleared for use; some appear to come from licensed real-estate listings.
- **Logo:** `logo-ink.png` is a dark recolour of the supplied white logo, not a redraw.

## Design system

Colours, type and spacing live at the top of `assets/css/styles.css`.

| Token | Hex | Use |
| --- | --- | --- |
| `--paper` | `#FFFFFF` | Page ground |
| `--ink` | `#0A0A0A` | Text, rules, dots, primary buttons, night blocks |
| `--stone` | `#C8C6C1` | Grey section blocks |
| `--daylight` | `#A9F5A0` | Weekday daytime only: adult block, daytime markers, calendar |

Type: Archivo (Google Fonts). Motion: one hero load sequence and one scroll reveal; both are off for visitors who set their device to reduce motion.
