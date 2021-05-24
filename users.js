module.exports = [
    {
      username: 'global',
      config: {
        visualization1: {
          clientId: process.env.CLIENT_ID, clientSecret: process.env.CLIENT_SECRET, embedId: process.env.EMBED_ID,
          //filters: [{"column": "Region", "operator": "IN", "values": ["West"]}]
          filters: []
        }
      }
    },
    {
      username: 'emea',
      config: {
        visualization1: {
          clientId: process.env.CLIENT_ID, clientSecret: process.env.CLIENT_SECRET, embedId: process.env.EMBED_ID,
          filters: [{"column": "Region", "operator": "IN", "values": ["EMEA"]}]
        },
      }
    },
    {
      username: 'apac',
      config: {
        visualization1: {
          clientId: process.env.CLIENT_ID, clientSecret: process.env.CLIENT_SECRET, embedId: process.env.EMBED_ID,
          filters: [{"column": "Region", "operator": "IN", "values": ["APAC"]}]
        },
      }
    }
  ];