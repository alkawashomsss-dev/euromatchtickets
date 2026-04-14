import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def fix_all():
    client = AsyncIOMotorClient('mongodb://localhost:27017')
    db = client['euromatchtickets']
    
    deleted = 0
    updated = 0

    # ============================================================
    # 1. DELETE DUPLICATES AND TEST EVENTS
    # ============================================================
    slugs_to_delete = [
        # FINAL_TEST event
        'finaltest-event-2026-munich-tickets',
        # Duplicate El Clasico (keep the football one, remove match duplicate)
        'real-madrid-vs-barcelona-2026-tickets',  # duplicate of el-clasico
        'real-madrid-vs-barcelona-el-clasico-2026-tickets',  # another duplicate
        # Duplicate Harry Styles
        'harry-styles-together-together-tour-2026-london-tickets',  # duplicate tour name
        'harry-styles-love-on-tour-2026-london-tickets-785d0b',  # duplicate with hash
        # Duplicate Monaco GP (keep the main one)
        'f1-monaco-grand-prix-2026-race-day-monte-carlo-tickets',  # duplicate "race day"
        # Duplicate Singapore GP
        'f1-singapore-grand-prix-2026-tickets',  # duplicate (keep the night race one)
        # Duplicate Las Vegas GP  
        'f1-las-vegas-grand-prix-2026-las-vegas-2027-tickets',  # duplicate
        # Duplicate World Cup matches (keep worldcup type, remove match type duplicates)
        'fifa-world-cup-2026-usa-vs-england-new-york-tickets',
        'fifa-world-cup-2026-argentina-vs-france-los-angeles-tickets',
        'fifa-world-cup-2026-brazil-vs-germany-dallas-tickets',
        'fifa-world-cup-2026-spain-vs-portugal-mexico-city-tickets',
        'fifa-world-cup-2026-italy-vs-netherlands-miami-tickets',
        'fifa-world-cup-2026-belgium-vs-croatia-atlanta-tickets',
        'fifa-world-cup-2026-mexico-vs-canada-mexico-city-tickets',
        'fifa-world-cup-2026-japan-vs-south-korea-vancouver-tickets',
        'fifa-world-cup-2026-winner-group-a-vs-runner-up-group-b-new-york-tickets',
        'fifa-world-cup-2026-winner-group-c-vs-runner-up-group-d-los-angeles-tickets',
        'fifa-world-cup-2026-qf-match-1-vs-qf-match-2-dallas-tickets',
        'fifa-world-cup-2026-qf-match-3-vs-qf-match-4-miami-tickets',
        'fifa-world-cup-2026-sf-match-1-vs-sf-match-2-new-york-tickets',
        'fifa-world-cup-2026-sf-match-3-vs-sf-match-4-los-angeles-tickets',
        'fifa-world-cup-2026-finalist-1-vs-finalist-2-new-york-tickets',
        # Boxing/UFC with 2025 slugs
        'canelo-alvarez-vs-david-benavidez-super-middleweight-las-vegas-2025-tickets',
        'tyson-fury-vs-oleksandr-usyk-iii-undisputed-riyadh-2025-tickets',
        'ufc-310-heavyweight-championship-las-vegas-2025-tickets',
    ]
    
    for slug in slugs_to_delete:
        result = await db.events.delete_one({'slug': slug})
        if result.deleted_count > 0:
            deleted += 1
            print(f'  DELETED: {slug}')
    
    print(f'\nTotal deleted: {deleted}')

    # ============================================================
    # 2. FIX F1 2026 CALENDAR - REAL DATES
    # ============================================================
    # Based on typical F1 scheduling (SpaGPPage says Aug 28-30)
    f1_fixes = {
        'f1-bahrain-grand-prix-2026-sakhir-tickets':       {'event_date': '2026-03-08T15:00:00Z', 'title': 'Bahrain Grand Prix 2026'},
        'f1-saudi-arabian-grand-prix-2026-jeddah-tickets':  {'event_date': '2026-03-22T17:00:00Z', 'title': 'Saudi Arabian Grand Prix 2026'},
        'f1-australian-grand-prix-2026-melbourne-tickets':  {'event_date': '2026-04-06T05:00:00Z', 'title': 'Australian Grand Prix 2026'},
        'f1-japanese-grand-prix-2026-suzuka-tickets':       {'event_date': '2026-04-20T05:00:00Z', 'title': 'Japanese Grand Prix 2026'},
        'f1-chinese-grand-prix-2026-shanghai-tickets':      {'event_date': '2026-05-04T07:00:00Z', 'title': 'Chinese Grand Prix 2026'},
        'f1-miami-grand-prix-2026-tickets':                 {'event_date': '2026-05-18T20:00:00Z', 'title': 'Miami Grand Prix 2026'},
        'f1-emilia-romagna-grand-prix-2026-imola-tickets':  {'event_date': '2026-05-25T13:00:00Z', 'title': 'Emilia Romagna Grand Prix 2026'},
        'f1-monaco-grand-prix-2026-monte-carlo-2026-tickets': {'event_date': '2026-05-31T13:00:00Z', 'title': 'Monaco Grand Prix 2026'},
        'f1-spanish-grand-prix-2026-barcelona-2026-tickets': {'event_date': '2026-06-14T13:00:00Z', 'title': 'Spanish Grand Prix 2026'},
        'f1-canadian-grand-prix-2026-montreal-tickets':     {'event_date': '2026-06-28T18:00:00Z', 'title': 'Canadian Grand Prix 2026'},
        'f1-austrian-grand-prix-2026-spielberg-tickets':    {'event_date': '2026-07-05T13:00:00Z', 'title': 'Austrian Grand Prix 2026'},
        'f1-british-grand-prix-2026-silverstone-2026-tickets': {'event_date': '2026-07-19T14:00:00Z', 'title': 'British Grand Prix 2026'},
        'f1-hungarian-grand-prix-2026-budapest-2026-tickets': {'event_date': '2026-08-02T13:00:00Z', 'title': 'Hungarian Grand Prix 2026'},
        'f1-belgian-grand-prix-2026-stavelot-2026-tickets': {'event_date': '2026-08-30T13:00:00Z', 'title': 'Belgian Grand Prix 2026'},
        'f1-dutch-grand-prix-2026-zandvoort-2026-tickets':  {'event_date': '2026-09-06T13:00:00Z', 'title': 'Dutch Grand Prix 2026'},
        'f1-italian-grand-prix-2026-monza-2026-tickets':    {'event_date': '2026-09-13T13:00:00Z', 'title': 'Italian Grand Prix 2026'},
        'f1-singapore-grand-prix-2026-night-race-tickets':  {'event_date': '2026-10-04T20:00:00Z', 'title': 'Singapore Grand Prix 2026'},
        'f1-united-states-grand-prix-2026-austin-tickets':  {'event_date': '2026-10-18T19:00:00Z', 'title': 'United States Grand Prix 2026'},
        'f1-mexico-city-grand-prix-2026-mexico-city-tickets': {'event_date': '2026-10-25T20:00:00Z', 'title': 'Mexico City Grand Prix 2026'},
        'f1-brazilian-grand-prix-2026-s-o-paulo-2027-tickets': {'event_date': '2026-11-08T17:00:00Z', 'title': 'Brazilian Grand Prix 2026'},
        'f1-las-vegas-grand-prix-2026-night-race-las-vegas-tickets': {'event_date': '2026-11-22T22:00:00Z', 'title': 'Las Vegas Grand Prix 2026'},
        'f1-qatar-grand-prix-2026-lusail-2027-tickets':     {'event_date': '2026-11-29T17:00:00Z', 'title': 'Qatar Grand Prix 2026'},
        'f1-abu-dhabi-grand-prix-2026-abu-dhabi-2027-tickets': {'event_date': '2026-12-06T13:00:00Z', 'title': 'Abu Dhabi Grand Prix 2026'},
    }
    
    for slug, fixes in f1_fixes.items():
        result = await db.events.update_one({'slug': slug}, {'$set': fixes})
        if result.modified_count > 0:
            updated += 1

    # ============================================================
    # 3. FIX FOOTBALL MATCH DATES
    # ============================================================
    football_fixes = {
        'el-clasico-real-madrid-vs-barcelona-2026-tickets': {'event_date': '2026-04-12T20:00:00Z', 'title': 'El Clasico: Real Madrid vs Barcelona'},
        'bayern-munich-vs-real-madrid-ucl-quarter-final-2026-tickets': {'event_date': '2026-04-08T20:00:00Z'},
        'real-madrid-vs-bayern-munich-ucl-quarter-final-2nd-leg-2026-tickets': {'event_date': '2026-04-15T20:00:00Z'},
        'champions-league-semi-final-1st-leg-tickets': {'event_date': '2026-04-29T20:00:00Z'},
        'champions-league-semi-final-2nd-leg-tickets': {'event_date': '2026-05-06T20:00:00Z'},
        'uefa-champions-league-final-2026-munich-tickets': {'event_date': '2026-05-30T20:00:00Z'},
        'manchester-united-vs-liverpool-premier-league-2026-tickets': {'event_date': '2026-04-19T16:30:00Z'},
        'liverpool-vs-arsenal-2026-tickets': {'event_date': '2026-08-16T17:30:00Z'},
        'manchester-derby-man-united-vs-man-city-2026-tickets': {'event_date': '2026-09-12T16:30:00Z'},
        'north-london-derby-arsenal-vs-tottenham-2026-tickets': {'event_date': '2026-09-26T16:30:00Z'},
        'super-bowl-lxi-2027-tickets': {'event_date': '2027-02-08T18:30:00Z'},
        'super-bowl-lxi-2027-vip-experience-tickets': {'event_date': '2027-02-08T15:00:00Z'},
    }
    
    for slug, fixes in football_fixes.items():
        result = await db.events.update_one({'slug': slug}, {'$set': fixes})
        if result.modified_count > 0:
            updated += 1

    # ============================================================
    # 4. FIX FIFA WORLD CUP 2026 DATES (worldcup type)
    # ============================================================
    wc_fixes = {
        'world-cup-world-cup-2026-germany-vs-brazil-new-york-tickets': {'event_date': '2026-06-15T18:00:00Z'},
        'world-cup-fifa-world-cup-2026-usa-vs-england-los-angeles-tickets': {'event_date': '2026-06-15T21:00:00Z'},
        'world-cup-world-cup-2026-argentina-vs-france-dallas-tickets': {'event_date': '2026-06-18T21:00:00Z'},
        'world-cup-world-cup-2026-england-vs-spain-los-angeles-tickets': {'event_date': '2026-06-20T18:00:00Z'},
        'world-cup-fifa-world-cup-2026-brazil-vs-argentina-dallas-tickets': {'event_date': '2026-06-22T20:00:00Z'},
        'world-cup-fifa-world-cup-2026-quarter-final-1-mexico-city-tickets': {'event_date': '2026-07-09T18:00:00Z'},
        'world-cup-fifa-world-cup-2026-quarter-final-2-vancouver-tickets': {'event_date': '2026-07-09T21:00:00Z'},
        'world-cup-fifa-world-cup-2026-semi-final-1-dallas-tickets': {'event_date': '2026-07-14T20:00:00Z'},
        'world-cup-fifa-world-cup-2026-semi-final-2-los-angeles-tickets': {'event_date': '2026-07-15T20:00:00Z'},
        'world-cup-fifa-world-cup-2026-final-new-york-tickets': {'event_date': '2026-07-19T20:00:00Z'},
        'world-cup-fifa-world-cup-2026-final-premium-new-york-tickets': {'event_date': '2026-07-19T20:00:00Z'},
    }
    
    for slug, fixes in wc_fixes.items():
        result = await db.events.update_one({'slug': slug}, {'$set': fixes})
        if result.modified_count > 0:
            updated += 1

    # ============================================================
    # 5. FIX FIFA CLUB WORLD CUP DATES
    # ============================================================
    cwc_fixes = {
        'fifa-club-world-cup-2026-real-madrid-vs-flamengo-miami-tickets': {'event_date': '2026-06-15T20:00:00Z'},
        'fifa-club-world-cup-2026-manchester-city-vs-al-ahly-orlando-tickets': {'event_date': '2026-06-16T20:00:00Z'},
        'fifa-club-world-cup-2026-bayern-munich-vs-boca-juniors-philadelphia-tickets': {'event_date': '2026-06-17T20:00:00Z'},
        'fifa-club-world-cup-2026-semi-final-1-dallas-tickets': {'event_date': '2026-07-01T20:00:00Z'},
        'fifa-club-world-cup-2026-final-new-york-tickets': {'event_date': '2026-07-13T20:00:00Z'},
    }
    
    for slug, fixes in cwc_fixes.items():
        result = await db.events.update_one({'slug': slug}, {'$set': fixes})
        if result.modified_count > 0:
            updated += 1

    # ============================================================
    # 6. FIX FESTIVAL DATES (realistic summer dates)
    # ============================================================
    festival_fixes = {
        'rock-am-ring-2026-n-rburg-2026-tickets': {'event_date': '2026-06-05T12:00:00Z'},
        'glastonbury-festival-2026-pilton-2026-tickets': {'event_date': '2026-06-24T12:00:00Z'},
        'primavera-sound-barcelona-2026-2026-tickets': {'event_date': '2026-06-04T14:00:00Z'},
        'tomorrowland-2026-boom-2026-tickets': {'event_date': '2026-07-17T12:00:00Z'},
        'tomorrowland-2026-weekend-2-boom-2026-tickets': {'event_date': '2026-07-24T12:00:00Z'},
        'creamfields-2026-warrington-2026-tickets': {'event_date': '2026-08-28T12:00:00Z'},
        'sziget-festival-2026-budapest-2026-tickets': {'event_date': '2026-08-12T14:00:00Z'},
        'oktoberfest-2026-beer-tent-entry-munich-2026-tickets': {'event_date': '2026-09-19T11:00:00Z'},
    }
    
    for slug, fixes in festival_fixes.items():
        result = await db.events.update_one({'slug': slug}, {'$set': fixes})
        if result.modified_count > 0:
            updated += 1

    # ============================================================
    # 7. FIX TENNIS DATES (realistic 2026 schedule)
    # ============================================================
    tennis_fixes = {
        'italian-open-2026-rome-2026-tickets': {'event_date': '2026-05-11T11:00:00Z'},
        'roland-garros-2026-semifinals-paris-2026-tickets': {'event_date': '2026-06-05T14:00:00Z'},
        'roland-garros-2026-final-paris-2026-tickets': {'event_date': '2026-06-07T14:00:00Z'},
        'wimbledon-2026-ground-pass-london-2026-tickets': {'event_date': '2026-06-29T11:00:00Z'},
        'wimbledon-2026-womens-final-london-2026-tickets': {'event_date': '2026-07-11T14:00:00Z'},
        'wimbledon-2026-centre-court-london-2026-tickets': {'event_date': '2026-07-12T14:00:00Z'},
        'madrid-open-2026-2026-tickets': {'event_date': '2026-05-04T12:00:00Z'},
    }
    
    for slug, fixes in tennis_fixes.items():
        result = await db.events.update_one({'slug': slug}, {'$set': fixes})
        if result.modified_count > 0:
            updated += 1

    # ============================================================
    # 8. FIX CONCERT DATES  
    # ============================================================
    concert_fixes = {
        'harry-styles-love-on-tour-2026-london-tickets': {'event_date': '2026-06-20T19:30:00Z'},
        'harry-styles-vip-experience-berlin-2026-tickets': {'event_date': '2026-06-27T19:30:00Z'},
        'coldplay-berlin-2026-tickets': {'event_date': '2026-07-04T19:30:00Z'},
        'coldplay-music-of-the-spheres-barcelona-2026-tickets': {'event_date': '2026-07-11T20:30:00Z'},
        'taylor-swift-eras-tour-2026-london-tickets': {'event_date': '2026-06-19T18:30:00Z'},
        'taylor-swift-eras-tour-wembley-night-1-tickets': {'event_date': '2026-06-19T18:30:00Z'},
        'taylor-swift-eras-tour-wembley-night-2-tickets': {'event_date': '2026-06-20T18:30:00Z'},
        'taylor-swift-eras-tour-wembley-night-3-tickets': {'event_date': '2026-06-21T18:30:00Z'},
        'taylor-swift-eras-tour-wembley-night-4-tickets': {'event_date': '2026-06-26T18:30:00Z'},
        'taylor-swift-eras-tour-wembley-night-5-tickets': {'event_date': '2026-06-27T18:30:00Z'},
        'taylor-swift-eras-tour-wembley-night-6-tickets': {'event_date': '2026-06-28T18:30:00Z'},
        'maroon-5-world-tour-2026-munich-tickets': {'event_date': '2026-07-18T20:00:00Z'},
        'guns-n-roses-european-stadium-tour-2026-tickets': {'event_date': '2026-07-25T19:00:00Z'},
        'metallica-m72-world-tour-2026-paris-tickets': {'event_date': '2026-08-08T19:30:00Z'},
        'bad-bunny-debi-tirar-mas-fotos-tour-london-tickets': {'event_date': '2026-08-22T20:00:00Z'},
        'the-weeknd-after-hours-til-dawn-tour-london-tickets': {'event_date': '2026-09-05T20:00:00Z'},
        'bruno-mars-the-romantic-tour-london-tickets': {'event_date': '2026-09-19T20:00:00Z'},
        'bruno-mars-the-romantic-tour-berlin-tickets': {'event_date': '2026-09-26T20:00:00Z'},
        'john-legend-live-in-abu-dhabi-abu-dhabi-2026-tickets': {'event_date': '2026-10-17T20:30:00Z'},
        'metallica-at-the-sphere-las-vegas-las-vegas-2026-tickets': {'event_date': '2026-11-14T20:00:00Z'},
        'acl-festival-2026-austin-city-limits-tickets': {'event_date': '2026-10-02T11:00:00Z'},
    }
    
    for slug, fixes in concert_fixes.items():
        result = await db.events.update_one({'slug': slug}, {'$set': fixes})
        if result.modified_count > 0:
            updated += 1

    # ============================================================
    # 9. FIX MOTOGP DATES (realistic schedule)
    # ============================================================
    motogp_fixes = {
        'motogp-qatar-motogp-2026-lusail-tickets': {'event_date': '2026-03-08T17:00:00Z'},
        'motogp-portuguese-motogp-2026-portim-o-tickets': {'event_date': '2026-03-22T14:00:00Z'},
        'italian-motogp-2026-mugello-qualifying-tickets': {'event_date': '2026-05-30T13:00:00Z'},
        'italian-motogp-2026-mugello-race-day-tickets': {'event_date': '2026-05-31T13:00:00Z'},
        'isle-of-man-tt-2026-superbike-race-tickets': {'event_date': '2026-06-07T10:30:00Z'},
        'isle-of-man-tt-2026-senior-race-tickets': {'event_date': '2026-06-13T10:30:00Z'},
        'motogp-americas-motogp-2026-austin-tickets': {'event_date': '2026-04-12T19:00:00Z'},
        'motogp-spanish-motogp-2026-jerez-tickets': {'event_date': '2026-04-26T13:00:00Z'},
        'motogp-french-motogp-2026-le-mans-tickets': {'event_date': '2026-05-17T13:00:00Z'},
        'motogp-catalunya-motogp-2026-barcelona-tickets': {'event_date': '2026-06-07T13:00:00Z'},
        'motogp-italian-motogp-2026-mugello-tickets': {'event_date': '2026-05-31T13:00:00Z'},
        'motogp-dutch-motogp-2026-assen-tickets': {'event_date': '2026-06-28T13:00:00Z'},
        'motogp-german-motogp-2026-hohenstein-ernstthal-tickets': {'event_date': '2026-07-12T13:00:00Z'},
        'motogp-british-motogp-2026-silverstone-tickets': {'event_date': '2026-08-02T13:00:00Z'},
        'motogp-austrian-motogp-2026-spielberg-tickets': {'event_date': '2026-08-16T13:00:00Z'},
        'motogp-aragon-motogp-2026-alca-iz-tickets': {'event_date': '2026-09-06T13:00:00Z'},
        'motogp-san-marino-motogp-2026-misano-adriatico-tickets': {'event_date': '2026-09-13T13:00:00Z'},
        'motogp-japanese-motogp-2026-motegi-tickets': {'event_date': '2026-10-04T05:00:00Z'},
        'motogp-indonesian-motogp-2026-lombok-tickets': {'event_date': '2026-10-18T08:00:00Z'},
        'motogp-australian-motogp-2026-phillip-island-tickets': {'event_date': '2026-10-25T04:00:00Z'},
        'motogp-thai-motogp-2026-buriram-2027-tickets': {'event_date': '2026-11-01T09:00:00Z'},
        'motogp-malaysian-motogp-2026-sepang-2027-tickets': {'event_date': '2026-11-08T08:00:00Z'},
        'motogp-valencia-motogp-2026-2027-tickets': {'event_date': '2026-11-15T13:00:00Z'},
    }
    
    for slug, fixes in motogp_fixes.items():
        result = await db.events.update_one({'slug': slug}, {'$set': fixes})
        if result.modified_count > 0:
            updated += 1

    # ============================================================
    # 10. FIX ISLE OF MAN TT DATES
    # ============================================================
    tt_fixes = {
        'isle-of-man-tt-2026-superbike-douglas-tickets': {'event_date': '2026-06-06T10:00:00Z'},
        'isle-of-man-tt-2026-full-week-pass-douglas-tickets': {'event_date': '2026-06-06T09:00:00Z'},
        'isle-of-man-tt-2026-supersport-douglas-tickets': {'event_date': '2026-06-09T10:00:00Z'},
        'isle-of-man-tt-2026-superstock-douglas-tickets': {'event_date': '2026-06-11T10:00:00Z'},
        'isle-of-man-tt-2026-senior-tt-douglas-tickets': {'event_date': '2026-06-13T10:00:00Z'},
    }
    
    for slug, fixes in tt_fixes.items():
        result = await db.events.update_one({'slug': slug}, {'$set': fixes})
        if result.modified_count > 0:
            updated += 1

    # ============================================================
    # 11. FIX ATHLETICS DATES (World Athletics Budapest Sep 2026)
    # ============================================================
    athletics_fixes = {
        'world-athletics-championships-2026-day-1-tickets': {'event_date': '2026-08-15T10:00:00Z'},
        'world-athletics-championships-2026-100m-final-tickets': {'event_date': '2026-08-17T20:30:00Z'},
        'world-athletics-championships-2026-200m-final-tickets': {'event_date': '2026-08-19T20:30:00Z'},
        'world-athletics-championships-2026-marathon-tickets': {'event_date': '2026-08-22T07:00:00Z'},
        'world-athletics-championships-2026-final-day-tickets': {'event_date': '2026-08-23T18:00:00Z'},
    }
    
    for slug, fixes in athletics_fixes.items():
        result = await db.events.update_one({'slug': slug}, {'$set': fixes})
        if result.modified_count > 0:
            updated += 1

    print(f'\nTotal updated: {updated}')
    print(f'Total deleted: {deleted}')
    
    # Final count
    total = await db.events.count_documents({})
    print(f'Total events remaining: {total}')

asyncio.run(fix_all())
