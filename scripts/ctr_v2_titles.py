"""
CTR v2 — Titles + Meta upgrade per user feedback (Apr 25, 2026 - 06:30 UTC).

User feedback: previous titles felt "cold". Add explicit "Compare" + marketplace
language. Meta descriptions must lead with "Compare X listings from multiple
sellers" so searchers know it's a marketplace and have a clear reason to click.

Pattern:
  Title:  "[Race Name] [Year] Tickets ([Subtitle]) — Compare Prices & Availability | EuroMatchTickets"
  Meta:   "Compare [Event Name] ticket listings from multiple sellers. View current prices, seating options, and availability for the [Year] [Subtitle]."
"""
import re
from pathlib import Path

PAGES = Path("/app/frontend/src/pages")

# Each entry: (filename, old_title_substring, new_title, new_description)
UPDATES = [
    (
        "MonzaGPPage.jsx",
        "Monza F1 Tickets 2026 (Italian GP) — Prices & Availability | EuroMatchTickets",
        "Monza F1 Tickets 2026 (Italian Grand Prix) — Compare Prices & Availability",
        "Compare Italian Grand Prix 2026 ticket listings from multiple sellers at Monza. View current prices, Parabolica & Ascari grandstand options, and availability for the Italian GP weekend.",
    ),
    (
        "MonacoGPTicketsPage.jsx",
        "Monaco GP 2026 Tickets — Prices & Availability | EuroMatchTickets",
        "Monaco GP 2026 Tickets (Monte Carlo F1) — Compare Prices & Availability",
        "Compare Monaco Grand Prix 2026 ticket listings from multiple sellers. View current prices, grandstand and yacht hospitality options, and availability for the Monte Carlo F1 weekend.",
    ),
    (
        "SaudiGPPage.jsx",
        "Saudi GP 2026 Tickets (Jeddah F1) — Prices & Availability | EuroMatchTickets",
        "Saudi Arabian GP 2026 Tickets (Jeddah F1) — Compare Prices & Availability",
        "Compare Saudi Arabian Grand Prix 2026 ticket listings from multiple sellers at the Jeddah Corniche Circuit. View current prices, seating options, and availability for the night race weekend.",
    ),
    (
        "AbuDhabiGPPage.jsx",
        "Abu Dhabi GP 2026 Tickets (Yas Marina F1) — Prices & Availability | EuroMatchTickets",
        "Abu Dhabi GP 2026 Tickets (Yas Marina F1) — Compare Prices & Availability",
        "Compare Abu Dhabi Grand Prix 2026 ticket listings from multiple sellers at Yas Marina Circuit. View current prices, twilight-race grandstand options, and availability for the F1 season finale.",
    ),
    (
        "SilverstoneGPPage.jsx",
        "British GP 2026 Tickets (Silverstone F1) — Prices & Availability | EuroMatchTickets",
        "British GP 2026 Tickets (Silverstone F1) — Compare Prices & Availability",
        "Compare British Grand Prix 2026 ticket listings from multiple sellers at Silverstone. View current prices, Copse, Club and Maggotts grandstand options, and availability for the F1 race weekend.",
    ),
    (
        "JapanGPPage.jsx",
        "Japanese GP 2026 Tickets (Suzuka F1) — Prices & Availability | EuroMatchTickets",
        "Japanese GP 2026 Tickets (Suzuka F1) — Compare Prices & Availability",
        "Compare Japanese Grand Prix 2026 ticket listings from multiple sellers at the Suzuka Circuit. View current prices, 130R, S-Curves and Hairpin grandstand options, and availability.",
    ),
    (
        "SingaporeGPPage.jsx",
        "Singapore GP 2026 Tickets (Marina Bay F1) — Prices & Availability | EuroMatchTickets",
        "Singapore GP 2026 Tickets (Marina Bay F1) — Compare Prices & Availability",
        "Compare Singapore Grand Prix 2026 ticket listings from multiple sellers at the Marina Bay Street Circuit. View current prices, Turn 1, Pit Grandstand and VIP Hospitality options, and availability for the night race weekend.",
    ),
    (
        "AustraliaGPPage.jsx",
        "Australian GP 2026 Tickets (Melbourne F1) — Prices & Availability | EuroMatchTickets",
        "Australian GP 2026 Tickets (Melbourne F1) — Compare Prices & Availability",
        "Compare Australian Grand Prix 2026 ticket listings from multiple sellers at Albert Park, Melbourne. View current prices, Jones, Brabham and Prost grandstand options, and availability.",
    ),
    (
        "AustriaGPPage.jsx",
        "Austrian GP 2026 Tickets (Red Bull Ring F1) — Prices & Availability | EuroMatchTickets",
        "Austrian GP 2026 Tickets (Red Bull Ring F1) — Compare Prices & Availability",
        "Compare Austrian Grand Prix 2026 ticket listings from multiple sellers at the Red Bull Ring, Spielberg. View current prices, mountain-circuit grandstand options, and availability.",
    ),
    (
        "HungaryGPPage.jsx",
        "Hungarian GP 2026 Tickets (Hungaroring F1) — Prices & Availability | EuroMatchTickets",
        "Hungarian GP 2026 Tickets (Hungaroring F1) — Compare Prices & Availability",
        "Compare Hungarian Grand Prix 2026 ticket listings from multiple sellers at the Hungaroring, Budapest. View current prices, grandstand and VIP Hospitality options, and availability.",
    ),
    (
        "SpainGPPage.jsx",
        "Spanish GP 2026 Tickets (Barcelona F1) — Prices & Availability | EuroMatchTickets",
        "Spanish GP 2026 Tickets (Barcelona F1) — Compare Prices & Availability",
        "Compare Spanish Grand Prix 2026 ticket listings from multiple sellers at the Circuit de Barcelona-Catalunya. View current prices, Grandstand G, C, H options, and availability.",
    ),
    (
        "MiamiGPPage.jsx",
        "Miami GP 2026 Tickets (F1 Hard Rock Stadium) — Prices & Availability | EuroMatchTickets",
        "Miami GP 2026 Tickets (F1 International Autodrome) — Compare Prices & Availability",
        "Compare Miami Grand Prix 2026 ticket listings from multiple sellers at the Miami International Autodrome. View current prices, Beach Grandstand, Turn 1 and Marina view options, and availability.",
    ),
    (
        "LasVegasGPPage.jsx",
        "Las Vegas GP 2026 Tickets (Strip F1 Night Race) — Prices & Availability | EuroMatchTickets",
        "Las Vegas GP 2026 Tickets (Strip F1 Night Race) — Compare Prices & Availability",
        "Compare Las Vegas Grand Prix 2026 ticket listings from multiple sellers along the Strip. View current prices, Sphere Grandstand, Strip View and VIP Hospitality options, and availability.",
    ),
    (
        "ZandvoortGPPage.jsx",
        "Dutch GP 2026 Tickets (Zandvoort F1) — Prices & Availability | EuroMatchTickets",
        "Dutch GP 2026 Tickets (Zandvoort F1) — Compare Prices & Availability",
        "Compare Dutch Grand Prix 2026 ticket listings from multiple sellers at Circuit Zandvoort, Aug 29-31. View current prices, grandstand options, and availability for the F1 weekend.",
    ),
    (
        "BahrainGPPage.jsx",
        "Bahrain GP 2026 Tickets (Sakhir F1 Night Race) — Prices & Availability | EuroMatchTickets",
        "Bahrain GP 2026 Tickets (Sakhir F1 Night Race) — Compare Prices & Availability",
        "Compare Bahrain Grand Prix 2026 ticket listings from multiple sellers at the Bahrain International Circuit. View current prices, grandstand, VIP and Paddock Club options, and availability.",
    ),
    (
        "BayernRealMadridPage.jsx",
        "Bayern vs Real Madrid 2026 Tickets (UCL Allianz Arena) — Prices & Availability | EuroMatchTickets",
        "Bayern vs Real Madrid 2026 Tickets (UCL · Allianz Arena) — Compare Prices & Availability",
        "Compare Bayern Munich vs Real Madrid Champions League 2026 ticket listings from multiple sellers at the Allianz Arena. View current prices, seating options, and availability for the UCL match.",
    ),
    (
        "WorldCupLandingPage.jsx",
        "FIFA World Cup 2026 Tickets — Prices & Availability (USA, Mexico, Canada) | EuroMatchTickets",
        "FIFA World Cup 2026 Tickets (USA · Mexico · Canada) — Compare Prices & Availability",
        "Compare FIFA World Cup 2026 ticket listings from multiple sellers across USA, Mexico and Canada. View current prices, group-stage to Final seating options, and availability for every match.",
    ),
    (
        "SpaGPPage.jsx",
        "F1 Spa Tickets 2026 (Belgian GP) — Prices, Dates & Availability | EuroMatchTickets",
        "Spa F1 Tickets 2026 (Belgian Grand Prix) — Compare Prices & Availability",
        "Compare Spa F1 ticket listings from multiple sellers for the 2026 Belgian Grand Prix. View current prices, Eau Rouge Grandstand and Paddock Club options, and availability for the race weekend.",
    ),
]


def update_file(path: Path, old_title: str, new_title: str, new_desc: str) -> bool:
    src = path.read_text()
    # Replace old title
    new = src.replace(old_title, new_title, 1)
    # Replace ANY description="..." that follows the title (the existing one)
    if new == src:
        return False  # title wasn't found

    # Now find the description= attribute that follows this title and replace it.
    # We search for `title="<new_title>"` then find the next `description="..."`.
    title_pos = new.find(f'"{new_title}"')
    if title_pos == -1:
        path.write_text(new)
        return True

    # Find next description= within ~600 chars
    snippet = new[title_pos: title_pos + 1200]
    desc_match = re.search(r'description="([^"]*)"', snippet)
    if desc_match:
        old_desc = desc_match.group(1)
        new = new.replace(f'description="{old_desc}"', f'description="{new_desc}"', 1)

    path.write_text(new)
    return True


def main():
    changed = 0
    for filename, old_title, new_title, new_desc in UPDATES:
        p = PAGES / filename
        if not p.exists():
            print(f"  [skip] {filename} — missing")
            continue
        if update_file(p, old_title, new_title, new_desc):
            changed += 1
            print(f"  [v2  ] {filename}")
        else:
            print(f"  [miss] {filename} — old title not found")
    print(f"\nDone. Updated {changed} files.")


if __name__ == "__main__":
    main()
