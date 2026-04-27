module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "ContentSlot",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      subject: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    {
      tableName: "content_slots",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
};

