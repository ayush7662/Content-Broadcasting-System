const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

// Models
const User = require("./User")(sequelize, DataTypes);
const Content = require("./Content")(sequelize, DataTypes);
const ContentSlot = require("./ContentSlot")(sequelize, DataTypes);
const ContentSchedule = require("./ContentSchedule")(sequelize, DataTypes);

// Associations
User.hasMany(Content, { foreignKey: "uploaded_by", as: "uploads" });
Content.belongsTo(User, { foreignKey: "uploaded_by", as: "uploader" });

User.hasMany(Content, { foreignKey: "approved_by", as: "approvals" });
Content.belongsTo(User, { foreignKey: "approved_by", as: "approver" });

Content.hasMany(ContentSchedule, { foreignKey: "content_id", as: "schedules" });
ContentSlot.hasMany(ContentSchedule, { foreignKey: "slot_id", as: "slotSchedules" });

ContentSchedule.belongsTo(Content, { foreignKey: "content_id", as: "content" });
ContentSchedule.belongsTo(ContentSlot, { foreignKey: "slot_id", as: "slot" });

// Export
module.exports = {
  sequelize,
  User,
  Content,
  ContentSlot,
  ContentSchedule,
};

