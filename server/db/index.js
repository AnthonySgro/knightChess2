const Sequelize = require("sequelize");
const db = new Sequelize(
    process.env.DATABASE_URL || "postgres://localhost/knightChess",
    { logging: false },
);

const syncAndSeed = async () => {
    try {
        await db.sync({ force: true });
        console.log(`

    Database Connected
      
      `);
    } catch (err) {
        console.log(err);
    }
};

module.exports = {
    syncAndSeed,
    db,
};
