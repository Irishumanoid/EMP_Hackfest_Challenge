import weaviate, { ApiKey } from 'weaviate-ts-client';
import fetch from 'node-fetch';

import { GraphQLClient, gql } from 'graphql-request';

const client = weaviate.client({
    scheme: 'https',
    host: 'hackathoncluster-u4dweh7m.weaviate.network', 
    apiKey: new ApiKey('zCiAl0rR5IPkDZ55UJ7VlHpKewHhD9FqFwgR'), 
    headers: { 'X-OpenAI-Api-Key': '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' }, 
  });


//location test

async function addLocationInSeattle() {
    const locationObject = {
      class: 'Location',
      properties: {
        latitude: 47.6062, // Seattle's latitude
        longitude: -122.3321, // Seattle's longitude
        name: 'Seattle, Washington' // Location name
      }
    };
  
    try {
        const response = await client.data
            .creator()
            .withClassName('Location')
            .withProperties({
                latitude: 47.6062, // Seattle's latitude
                longitude: -122.3321, // Seattle's longitude
                name: 'Seattle, Washington' // Location name
                })
            .do();
      console.log('Location added successfully:', response);
    } catch (error) {
      console.error('Error adding location:', error);
    }
  }
    
  await addLocationInSeattle();


  const endpoint = 'https://hackathoncluster-u4dweh7m.weaviate.network/graphql'; 
  const g_client = new GraphQLClient(endpoint);
  const query = gql`
    {
      Get {
        Location {
          name
          latitude
          longitude
        }
      }
    }
  `;
  
  async function getSeattleLocations() {
    try {
      console.log("awaiting result...");
      const data = await g_client.request(query);
      const locations = data.Get.Location;
  
      if (locations && locations.length > 0) {
        console.log('Seattle Locations:');
        locations.forEach((location, index) => {
          console.log(`Location ${index + 1}:`);
          console.log(`Name: ${location.name}`);
          console.log(`Latitude: ${location.latitude}`);
          console.log(`Longitude: ${location.longitude}`);
          console.log('------------------------');
        });
      } else {
        console.log('No Seattle locations found.');
      }
    } catch (error) {
      console.error('Error retrieving Seattle locations:', error.message);
    }
  }


  
  //getSeattleLocations();

  const result = await client.data
  .getterById()
  .withClassName('Location')
  .withId('a6ad7ab3-f406-4a78-84ef-5a006ef6edbb')
  .withVector()
  .do();

console.log(JSON.stringify(result, null, 2));