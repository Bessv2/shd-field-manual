# SHD Field Manual

A comprehensive, interactive Division 2 build reference guide — gear sets, weapons, recalibration workflow, and a build matchmaker. Everything lives in a single `index.html` file with no build step, no framework, and no dependencies beyond a Google Fonts import.

**🔗 Live site: https://bessv2.github.io/shd-field-manual/**

![SHD Field Manual screenshot](screenshot.png)

## What's inside

- **Foundations** — the three core attributes and six specializations everything else is built around
- **Build Matchmaker** — pick a gear set to see its best weapons/skills, or a weapon to see which gear sets are built around it, with every recommendation clickable
- **Recombinant Modifiers, Recalibration & Optimization workflow** — the current season's systems laid out as a strict step-by-step process
- **PvE, Raid/Legendary and PvP build cards** — full loadouts, filterable by tag and searchable by name
- **Weapon tier list, Exotics directory, Gear Sets, Brand Sets, Attribute cheat sheet, Glossary** — reference tables, all wired into the same global search
- **Build Creator** — assemble a custom loadout, save it to your browser, or copy a shareable link
- Talent tooltips, scroll-spy navigation, a light/dark/auto theme toggle, and a responsive layout for mobile

## Running it locally

There's nothing to install or build — it's one static HTML file.

```bash
git clone https://github.com/Bessv2/shd-field-manual.git
cd shd-field-manual
python3 -m http.server 8000   # or: npx serve
```

Then open `http://localhost:8000`. Opening `index.html` directly in a browser also works.

## Contributing

This manual aggregates community theorycrafting and is kept current by hand each season. If you spot a stale number, a missing build, or a broken interaction, please [open an issue](https://github.com/Bessv2/shd-field-manual/issues/new/choose) or send a pull request — corrections to build data live in the `CARDS`, `GLOSSARY`, and related arrays near the top of the `<script>` block in `index.html`.

## Disclaimer

This manual aggregates community theorycrafting current as of Red Horizon (Y8S3, ~September 2026). The Division 2's balance shifts nearly every season — treat exact percentages, material costs and drop tables as directional and verify against in-game tooltips before farming.

## License

Code in this repository is available under the [MIT License](LICENSE). The Division 2 and all associated names, items, and assets referenced here are property of Ubisoft; this is an unofficial, fan-made reference.
