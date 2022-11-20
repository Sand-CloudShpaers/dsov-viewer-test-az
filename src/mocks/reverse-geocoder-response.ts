import { ReverseGeocoderResponse } from '~viewer/kaart/types/reverse-geocoder.model';

export const reverseGeocoderResponseInside = {
  response: {
    docs: [
      {
        afstand: 0,
        weergavenaam: 'Gemeente Kwamzaniktrui',
      },
    ],
  },
} as ReverseGeocoderResponse;

export const reverseGeocoderResponseOutside = {
  response: {
    docs: [
      {
        afstand: 1,
        weergavenaam: 'Gemeente Kwamzaniktrui',
      },
    ],
  },
} as ReverseGeocoderResponse;
