import { ZoekLocatieSystem } from '~model/internal/zoek-locatie-info';
import { DataType, RES_GET_SESSION_DATA, SessionType } from '~model/session/session';

export const sessionResponseLocatieAddress: RES_GET_SESSION_DATA = {
  type: SessionType.RES_GET_SESSION_DATA,
  eventStatus: 'OK',
  value: {
    dataType: DataType.LOCATIE,
    version: '1.0',
    data: {
      rd: {
        type: 'Polygon',
        coordinates: [],
      },
      wgs84: {
        type: 'Polygon',
        coordinates: [],
      },
      label: 'Boompjes 200, 3011XD Rotterdam',
      source: {
        address: {
          numberindicationId: '0599200000217638',
          street: 'Boompjes',
          number: '200',
          zipcode: '3011XD',
          residence: 'Rotterdam',
          pdokId: 'pcl-bd99cc0d911df400725754554c3e0fe8',
        },
      },
    },
  },
};

export const sessionResponseLocatieCadastral: RES_GET_SESSION_DATA = {
  type: SessionType.RES_GET_SESSION_DATA,
  eventStatus: 'OK',
  value: {
    dataType: DataType.LOCATIE,
    version: '1.0',
    data: {
      rd: {
        type: 'Polygon',
        coordinates: [],
      },
      wgs84: {
        type: 'Polygon',
        coordinates: [],
      },
      label: 'Boompjes 200, 3011XD Rotterdam',
      source: {
        cadastral: {
          municipalityCode: 'LWR01',
          section: 'C',
          lotnumber: '5714',
          pdokId: 'pcl-bd99cc0d911df400725754554c3e0fe8',
        },
      },
    },
  },
};

export const sessionResponseLocatieCoordinate: RES_GET_SESSION_DATA = {
  type: SessionType.RES_GET_SESSION_DATA,
  eventStatus: 'OK',
  value: {
    dataType: DataType.LOCATIE,
    version: '1.0',
    data: {
      rd: {
        type: 'MultiPolygon',
        coordinates: [],
      },
      wgs84: {
        type: 'MultiPolygon',
        coordinates: [],
      },
      label: 'Boompjes 200, 3011XD Rotterdam',
      source: {
        coordinate: {
          system: 'RD' as ZoekLocatieSystem,
          geometry: {
            type: 'Point',
            coordinates: [142957.811, 440635.838],
          },
        },
      },
    },
  },
};

export const sessionResponseLocatieContour: RES_GET_SESSION_DATA = {
  type: SessionType.RES_GET_SESSION_DATA,
  eventStatus: 'OK',
  value: {
    dataType: DataType.LOCATIE,
    version: '1.0',
    data: {
      rd: {
        type: 'Polygon',
        coordinates: [
          [
            [92960.14, 436718.206],
            [93104.628, 436472.963],
            [93302.814, 436657.779],
            [93097.902, 436818.977],
            [92960.14, 436718.206],
          ],
        ],
      },
      wgs84: {
        type: 'MultiPolygon',
        coordinates: [],
      },
      label: 'Boompjes 200, 3011XD Rotterdam',
      source: {
        contour: {
          system: 'WGS84',
          geometry: {
            type: 'Polygon',
            coordinates: [],
          },
        },
      },
    },
  },
};

export const sessionResponseLocatieNoSource: RES_GET_SESSION_DATA = {
  type: SessionType.RES_GET_SESSION_DATA,
  eventStatus: 'OK',
  value: {
    dataType: DataType.LOCATIE,
    version: '1.0',
    data: {
      rd: {
        type: 'Polygon',
        coordinates: [],
      },
      wgs84: {
        type: 'Polygon',
        coordinates: [],
      },
      label: 'Boompjes 200, 3011XD Rotterdam',
    },
  },
};

export const sessionResponseActiviteitenSingle: RES_GET_SESSION_DATA = {
  type: SessionType.RES_GET_SESSION_DATA,
  eventStatus: 'OK',
  value: {
    dataType: DataType.ACTIVITEITEN,
    version: '1.0',
    data: [
      {
        functionalStructureRef:
          'https://standaarden.omgevingswet.overheid.nl/activiteit/id/concept/BouwactiviteitRuimtelijk',
        urn: 'Bouwactiviteit',
        activityName: 'Bouwactiviteit ruimtelijk',
        subActivities: [],
      },
    ],
  },
};

export const sessionResponseActiviteitenNone: RES_GET_SESSION_DATA = {
  type: SessionType.RES_GET_SESSION_DATA,
  eventStatus: 'OK',
  value: {
    dataType: DataType.ACTIVITEITEN,
    version: '1.0',
    data: [],
  },
};

export const sessionResponseActiviteitenNoData: RES_GET_SESSION_DATA = {
  type: SessionType.RES_GET_SESSION_DATA,
  eventStatus: 'OK',
  value: {
    dataType: DataType.ACTIVITEITEN,
    version: '1.0',
  },
};

export const sessionResponseActiviteitenNoValue: RES_GET_SESSION_DATA = {
  type: SessionType.RES_GET_SESSION_DATA,
  eventStatus: 'OK',
};
