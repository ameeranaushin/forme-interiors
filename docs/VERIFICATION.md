# Verification

Updated on 10 November 2026 in `C:\websites\forme website`.

- The Next.js production build passes, including TypeScript checking and static page generation.
- All seven studio, Good company, and project photographs are verified at scale 0 offscreen, in progress on entry, and scale 1 after the reveal. Representative images in each of the three sections also pass upward re-entry and a third downward entry. All four Good company photos have independent scale-reveal wrappers.
- The Studio, Good company, and Places with personality headings are verified hidden before entry, animated during entry, complete afterward, reset offscreen, and animated again when re-entering from above.
- Footer letters reset and replay their staggered upward movement on two successive entries. Supporting labels, copy, project titles, and links use the same replay behavior.
- Chrome checks cover 1440 x 900, 1366 x 620, 1536 x 660, 768 x 1024, 320 x 568, 390 x 844, 430 x 932, and 667 x 375. The hero title, controls, and photo ribbon occupy separate rows with visible gaps. There is no document-level horizontal overflow.
- Mobile studio headings use compact content-based height rather than a full viewport. Checks confirm limited space above and below the heading; supporting copy and the photograph follow directly. The 390px studio layout was visually inspected.
- At all tested phone widths, the footer logo and navigation occupy separate rows. Navigation labels and arrows remain together, and all links fit the viewport. The 320px and 390px footer screenshots were visually inspected.
- Touch expansion still increases a photo panel to 420px. After its height transition settles, the project image correctly reveals, resets, and replays in both directions with the refreshed scroll positions.
- Live system reduced motion removes pin spacers and split text and restores all seven photograph wrappers to full opacity and scale 1 at every responsive viewport.
- There are no browser console errors, hydration errors, or GSAP warnings.

The reference-led horizontal hero ribbon, scroll-linked headline shrink, eight-photo story sequence, and practice/contact scroll headings remain in place. Earlier verification of the complete ribbon loop and the story sequence is retained in local artifacts.

Current detailed measurements: `artifacts/replay-layout-verification.json`. Verification script: `artifacts/verify-replay-layout.cjs`. Development screenshots and reports are ignored local files and are not shipped with the website.
