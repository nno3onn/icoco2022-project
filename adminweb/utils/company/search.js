import client from 'utils/common/initAlgolia';

const searchCompany = async ({ keyword, offset = 0 }) => {
  try {
    const index = client.initIndex('company');
    const so = { length: 8, offset };

    const { hits } = await index.search(keyword || '', so);
    return hits;
  } catch (err) {
    console.error(err);
  }
};

export default searchCompany;
