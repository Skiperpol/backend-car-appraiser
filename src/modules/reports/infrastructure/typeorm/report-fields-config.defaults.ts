export const DEFAULT_REPORT_FIELD_CONFIGS = [
  {
    slug: 'odometer',
    label: 'Wskazanie drogomierza',
    fieldType: 'text',
    exampleValue: '53235 km',
  },
  {
    slug: 'usageMonths',
    label: 'Okres eksploatacji pojazdu',
    fieldType: 'text',
    exampleValue: '77 miesięcy',
  },
  {
    slug: 'maxWeight',
    label: 'Dopuszczalna masa całkowita',
    fieldType: 'text',
    exampleValue: '2375 kg',
  },
  {
    slug: 'bodyType',
    label: 'Rodzaj nadwozia',
    fieldType: 'text',
    exampleValue: 'SUV',
  },
  {
    slug: 'driveUnit',
    label: 'Jednostka napędowa',
    fieldType: 'text',
    exampleValue: 'Silnik benzynowy',
  },
  {
    slug: 'engineCapacity',
    label: 'Pojemność silnika',
    fieldType: 'text',
    exampleValue: '1998 cm3',
  },
  {
    slug: 'enginePower',
    label: 'Moc silnika',
    fieldType: 'text',
    exampleValue: '150 KM',
  },
] as const;
