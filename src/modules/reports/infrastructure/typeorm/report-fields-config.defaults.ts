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
    exampleValue: '77 miesiecy',
  },
  {
    slug: 'maxWeight',
    label: 'Dopuszczalna masa calkowita',
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
    label: 'Jednostka napedowa',
    fieldType: 'text',
    exampleValue: 'Silnik benzynowy',
  },
  {
    slug: 'engineCapacity',
    label: 'Pojemnosc silnika',
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
