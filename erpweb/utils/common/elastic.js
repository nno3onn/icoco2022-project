import { Client } from '@elastic/elasticsearch';

const ELASTIC_ID =
  'icoco:YXNpYS1ub3J0aGVhc3QzLmdjcC5lbGFzdGljLWNsb3VkLmNvbSRhYjMyZjY2YjMzYjg0MjU4YWI5ZTcyNWQ3NzNhNzBjYSRmMDEyYjQxOTgyNGI0MWU2ODRkMDEwNWE4M2E3MjE3Ng==';
const ELASTIC_USERNAME = 'elastic';
const ELASTIC_PASSWORD = '5Ufo421OiNcVAr6xi5nm5DHm';

export default () => {
  try {
    const client = new Client({
      cloud: {
        id: ELASTIC_ID,
        username: ELASTIC_USERNAME,
        password: ELASTIC_PASSWORD,
      },
    });

    return client;
  } catch (err) {
    console.error(err);
  }
};
