export interface FutureStation {
    name: string;
    lines: string[];
    opening: string;
    status: string;
    locationRole: string;
    features?: string;
    interestingFact?: string;
  }
  
  export interface FutureLineExtension {
    name: string;
    stations: FutureStation[];
  }
  
  export const futureLineExtensions: FutureLineExtension[] = [
    {
      name: 'Circle Line Stage 6',
      stations: [
        {
          name: 'Keppel',
          lines: ['CC30'],
          opening: 'First half of 2026',
          status: 'Under Construction',
          locationRole:
            'Underground station along Keppel Road serving the Greater Southern Waterfront area. Will improve access to the southern edge of the CBD and surrounding developments.',
          features:
            'Island platform (2 tracks), integrated bicycle facilities. Part of a 4km link with Cantonment and Prince Edward Road stations that complete the Circle Line loop.',
        },
        {
            name: 'Cantonment',
            lines: ['CC31'],
            opening: 'Slated for 2026',
            status: 'Under Construction',
            locationRole:
              'Sited beneath/around the old Tanjong Pagar Railway Station area. Will serve the Greater Southern Waterfront and surrounding residential/offices.',
            interestingFact: 'Close to the historic railway site; part of efforts to connect the new Circle Line loop with city attractions and heritage zones.',
          },
          {
            name: 'Prince Edward Road',
            lines: ['CC32'],
            opening: 'Expected 1H 2026',
            status: 'Under Construction',
            locationRole:
              'Located near Shenton Way and Keppel Road intersections in the Downtown Core. Will help link southern and central business districts more directly via the Circle Line.',
          },
      ],
    },
    {
        name: 'Thomson–East Coast Line Stage 5 & Downtown Line Stage 3 Extension',
        stations: [
            {
                name: 'Sungei Bedok',
                lines: ['TE30', 'DT37'],
                opening: 'Second half of 2026',
                status: 'Under Construction',
                locationRole: 'Situated east of Upper East Coast Road. Will serve as a major interchange connecting the TEL and DTL. Key hub for East Coast developments.',
                features: 'Deep underground station with two island platforms (4 tracks). Designed to be both a terminus and transfer point.',
              },
              {
                name: 'Xilin',
                lines: ['DT36'],
                opening: 'Second half of 2026',
                status: 'Under Construction',
                locationRole: 'Will serve industrial and commercial zones east of Expo, improving connectivity before reaching the major Sungei Bedok interchange.',
              },
              {
                name: 'Bedok South',
                lines: ['TE31'],
                opening: 'Second half of 2026',
                status: 'Under Construction',
                locationRole: 'Positioned on Upper East Coast Road / Bedok South Road. Will serve residential and community areas, providing direct TEL access.',
                features: 'Underground station with island platform, two tracks. Helps complete TEL’s coverage along the east coast.',
              }
              
        ]
    },
    {
        name: 'Future Infill & Reserved Stations',
        stations: [
            {
                name: "Founders' Memorial",
                lines: ['TE22a'],
                opening: 'TBC (Expected 2027)',
                status: 'Under construction',
                locationRole: 'Located near Bay East Garden, serving as a gateway to the Founders’ Memorial site.',
                interestingFact: 'This station will provide direct MRT access to the Founders’ Memorial, commemorating Singapore’s early leaders and nation-building journey.',
            },
            {
                name: 'Marina South',
                lines: ['TE18'],
                opening: 'TBC',
                status: 'Structurally Complete, Not Open',
                locationRole: 'Serves the upcoming high-density mixed-use Greater Southern Waterfront.',
                interestingFact: 'Will open along with surrounding urban development, similar to other stations in new development areas.',
              },
            {
                name: 'Mount Pleasant',
                lines: ['TE9'],
                opening: 'TBC',
                status: 'Completed but not open',
                locationRole: 'Located in the former Old Police Academy area, this station is reserved for future residential redevelopment.',
                interestingFact: 'Trains on the TEL currently pass through this station without stopping. It will be opened when the area is more developed.',
            },
            {
                name: 'Bukit Brown',
                lines: ['CC18'],
                opening: 'TBC',
                status: 'Reserved (Shell station)',
                locationRole: 'A reserved station shell located near the Bukit Brown Cemetery, safeguarded for long-term future development.',
                interestingFact: 'The station exists as a structural shell to avoid costly construction and service disruption in the future. It is located in one of Singapore’s most debated heritage areas.',
            },
            {
                name: 'Brickland',
                lines: ['NS3a'],
                opening: 'Mid-2030s',
                status: 'Under Construction',
                locationRole: 'A new infill station to be built between Choa Chu Kang and Bukit Gombak stations to serve new residential and industrial developments.',
                features: 'Will be the third infill station on the North South Line, after Canberra and the upcoming Sungei Kadut.',
            },
            {
                name: 'Station Code NE2',
                lines: ['NE2'],
                opening: 'N/A',
                status: 'Non-existent / Reserved Code',
                locationRole: 'This is a reserved station code sometimes seen in long-term planning diagrams between HarbourFront (NE1) and Outram Park (NE3).',
                interestingFact: 'There is no confirmed station name or plan for NE2. It remains a placeholder for potential future development in the area.',
            }
        ]
    }
  ];
  
