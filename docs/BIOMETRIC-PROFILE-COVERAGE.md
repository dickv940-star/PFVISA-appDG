# PFVISA biometric profile coverage

Last reviewed: 2026-11-05 (Taiwan 4 × 6 cm working preset added; source discrepancy documented)

This document distinguishes official requirements from editor presets and third-party size catalogs. A country being present in the selector does **not** mean every document type or application channel in that country has an officially verified biometric profile.

## Officially sourced profiles currently represented

| Country / region | Document and channel | Officially sourced values used |
|---|---|---|
| Indonesia | e-Visa digital upload | 400 × 600 px minimum; head height 50–60% of image; eye line 50–60% measured from bottom; maximum 2 MB |
| United States | Paper passport photo | 2 × 2 in; head height 25–35 mm |
| United States | Visa photo composition | 2 × 2 in; digital head height 50–69%; eye line 56–69% from bottom; paper head/eye dimensions are separately described by the State Department template |
| United Kingdom | Printed passport photo | 35 × 45 mm; head height 29–34 mm. The online passport workflow is not treated as a manual crop profile |
| Canada | Adult passport photo, print/in-person/mail | 50 × 70 mm; head height 31–36 mm |
| Canada | Temporary Resident Visa (TRV), printed photo | Minimum 35 × 45 mm; head height 31–36 mm |
| Australia | Passport photo | Accepted print dimensions 35–40 × 45–50 mm; head height 32–36 mm |
| China | Visa photo, CVASC paper specification | 33 × 48 mm; head height 28–33 mm; head width 15–22 mm; crown-to-top margin 3–5 mm |
| Japan | Passport photo | 45 × 35 mm; head height 32–36 mm |
| Japan | Visa application in Indonesia | 35 × 45 mm; no numeric head/eye/top-margin target is inferred |
| South Korea | Passport photo (Indonesia reference) | 35 × 45 mm; head height 32–36 mm |
| South Korea | Visa application form | 35 × 45 mm; no numeric head/eye/top-margin target is inferred |
| Saudi Arabia | Tourist e-Visa upload only | 200 × 200 px; 5–100 KB; face occupies about 70–80% of image |
| India | e-Visa digital upload | Square JPEG; 10 KB–1 MB; full face, centered; no numeric head/eye target specified |
| France | Visa application | 35–40 mm wide; face height 32–36 mm (70–80% of photo), chin to forehead excluding hair |
| Singapore | Passport/IC ICA e-Services | 400 × 514 px; accepted JPG/JPEG/HEIC/HEIF/PNG; maximum 8 MB; no numeric head-height target |
| Singapore | Visa ICA e-Service | JPEG 400 × 514 px; maximum 60 KB; recent within 3 months; white background; no numeric head-height target |
| Taiwan | Visa application in Indonesia (requested 4 × 6 cm working preset) | 40 × 60 mm preset based on a TETO Indonesia document dated 14 July 2016; unverified as current. BOCA visitor-visa guidance updated 14 October 2025 lists 45 × 35 mm, so applicants must confirm with the handling TETO office |

## Profiles intentionally left unverified or incomplete

- Generic Schengen visa and residence-permit presets: dimensions are only working presets; national consulates and residence authorities can add or change requirements.
- Australia visa, Canada visa/immigration, India visa/e-Visa, UK visa, China national passport, Saudi national passport, UAE visa/ID, and generic Indonesia identity documents: do not inherit biometric targets from a different document or channel.
- Countries added from the photo-size directory: directory presence and suggested dimensions are not official verification. They remain provisional until a current primary government/authority source is checked.

## Measurement limitations

- MediaPipe landmarks estimate facial geometry. The estimated crown, chin, eye line and cheek width can be wrong when hair, headwear, pose, occlusion, lighting or image quality affect landmarks.
- Cheek-to-cheek landmark width is a face-width estimate, not necessarily the authority's definition of head width. It must never be marked as official head-width compliance.
- A green in-range state is only available when the selected profile is officially sourced and all numeric targets that can be measured are within range. Unmeasured official requirements keep the result in verification-needed state.
- An omitted target means the source does not establish a universal numeric value for that profile. PFVISA must not invent one.
- The application provides crop guidance, not a guarantee of acceptance. Users must follow the current portal instructions for their exact document, application type and submission channel.
