import weaviate, { ApiKey } from 'weaviate-ts-client';
import fetch from 'node-fetch';


const client = weaviate.client({
  scheme: 'https',
  host: 'hackathoncluster-u4dweh7m.weaviate.network', 
  apiKey: new ApiKey('zCiAl0rR5IPkDZ55UJ7VlHpKewHhD9FqFwgR'), 
  headers: { 'X-OpenAI-Api-Key': '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' }, 
});


const classObj = {
  'class': 'Question',
  'vectorizer': 'text2vec-openai',  
  'moduleConfig': {
    'text2vec-openai': {},
    'generative-openai': {}  
  },
};

async function addSchema() {
  const res = await client.schema.classCreator().withClass(classObj).do();
  console.log(res);
}

async function getJsonData() {
  const file = await fetch('https://raw.githubusercontent.com/weaviate-tutorials/quickstart/main/data/jeopardy_tiny.json');
  return file.json();
}

async function importQuestions() {
  const data = await getJsonData();

  let batcher = client.batch.objectsBatcher();
  let counter = 0;
  const batchSize = 100;

  for (const question of data) {

    const obj = {
      class: 'Question',
      properties: {
        answer: question.Answer,
        question: question.Question,
        category: question.Category,
      },
    };
    

    batcher = batcher.withObject(obj);


    if (counter++ == batchSize) {
      const res = await batcher.do();
      console.log(res);

      counter = 0;
      batcher = client.batch.objectsBatcher();
    }
  }


  const res = await batcher.do();
  console.log(res);
}

async function run() {
  await addSchema();
  await importQuestions();
}

await run();



