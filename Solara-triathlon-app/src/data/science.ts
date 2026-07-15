export interface ScienceReference {
  id: string;
  topic: string;
  citation: string;
  url: string;
  summary: string;
}

export const scienceReferences: ScienceReference[] = [
  { id: 'ref-polarized', topic: 'Intensity distribution', citation: 'Stöggl TL, Sperlich B. Front Physiol. 2015.', url: 'https://doi.org/10.3389/fphys.2015.00295', summary: 'Endurance plans commonly emphasize substantial low-intensity work; distribution should remain responsive to context.' },
  { id: 'ref-cycle', topic: 'Menstrual cycle and performance', citation: 'McNulty KL et al. Sports Med. 2020.', url: 'https://doi.org/10.1007/s40279-020-01319-3', summary: 'Group-level effects are small and uncertain; individualized, symptom-led decisions are more appropriate than rigid phase rules.' },
  { id: 'ref-strength', topic: 'Strength for endurance athletes', citation: 'Blagrove RC et al. Sports Med. 2018.', url: 'https://doi.org/10.1007/s40279-017-0835-7', summary: 'Strength training can support endurance performance and economy when programmed with appropriate load and recovery.' },
  { id: 'ref-fueling', topic: 'Sports nutrition', citation: 'Thomas DT et al. Med Sci Sports Exerc. 2016.', url: 'https://doi.org/10.1249/MSS.0000000000000852', summary: 'Energy, carbohydrate, protein, fluid, and micronutrient needs should reflect training demand and individual context.' },
  { id: 'ref-reds', topic: 'Low energy availability and REDs', citation: 'Mountjoy M et al. Br J Sports Med. 2023.', url: 'https://doi.org/10.1136/bjsports-2023-106994', summary: 'Persistent low energy availability can affect multiple body systems and warrants qualified clinical support.' },
  { id: 'ref-migraine', topic: 'Migraine self-management', citation: 'American Migraine Foundation. Lifestyle changes for migraine.', url: 'https://americanmigrainefoundation.org/resource-library/lifestyle-changes-for-migraine/', summary: 'Consistent sleep, meals, hydration, and individualized trigger awareness can support migraine management; unusual symptoms need medical care.' },
];

