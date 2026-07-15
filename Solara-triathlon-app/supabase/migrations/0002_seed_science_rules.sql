insert into public.science_references(id, topic, citation, url, summary, evidence_level, reviewed_at) values
('ref-polarized','Intensity distribution','Stöggl TL, Sperlich B. Front Physiol. 2015.','https://doi.org/10.3389/fphys.2015.00295','Endurance plans emphasize substantial low-intensity work while remaining responsive to athlete context.','review',current_date),
('ref-cycle','Menstrual cycle and performance','McNulty KL et al. Sports Med. 2020.','https://doi.org/10.1007/s40279-020-01319-3','Group-level effects are small and uncertain; use individual symptoms and preference.','systematic-review',current_date),
('ref-strength','Strength for endurance athletes','Blagrove RC et al. Sports Med. 2018.','https://doi.org/10.1007/s40279-017-0835-7','Appropriate strength training can support endurance performance and economy.','systematic-review',current_date),
('ref-fueling','Sports nutrition','Thomas DT et al. Med Sci Sports Exerc. 2016.','https://doi.org/10.1249/MSS.0000000000000852','Fueling and hydration should reflect training demand and individual context.','position-stand',current_date),
('ref-reds','Low energy availability and REDs','Mountjoy M et al. Br J Sports Med. 2023.','https://doi.org/10.1136/bjsports-2023-106994','Persistent low energy availability can affect health and performance and warrants qualified support.','consensus',current_date);

insert into public.admin_training_rules(rule_key, version, rule, reference_ids, active) values
('intensity_distribution',1,'{"low_intensity_target":0.8,"scope":"appropriate_training_blocks","exact_weekly_split":false}'::jsonb,array['ref-polarized'],true),
('weekly_progression',1,'{"default_cap":0.1,"exceptions":["recovery","taper","illness","travel"]}'::jsonb,array['ref-polarized'],true),
('cycle_symptoms',1,'{"phase_only_adjustment":false,"inputs":["symptoms","history","recovery","preference"]}'::jsonb,array['ref-cycle'],true),
('strength_frequency',1,'{"base":2,"build":2,"peak":1,"taper":1}'::jsonb,array['ref-strength'],true);

insert into public.admin_nutrition_rules(rule_key, version, rule, reference_ids, active) values
('adequate_fueling',1,'{"restriction_bias":false,"carbohydrate_periodization":true,"protein_distribution":true}'::jsonb,array['ref-fueling','ref-reds'],true),
('clinical_referral',1,'{"flags":["pregnancy","postpartum","anemia","reds","eating_disorder","persistent_gi"]}'::jsonb,array['ref-reds'],true);

