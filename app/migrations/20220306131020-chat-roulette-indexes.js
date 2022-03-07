module.exports = {
  async up(db, client) {

    await db.collection('chatrouletteoffers').createIndex({updatedAt: 1}, { expireAfterSeconds: 5 });
  },

  async down(db, client) {

    await db.collection('chatrouletteoffers').dropIndex({updatedAt: 1});
  }
};
