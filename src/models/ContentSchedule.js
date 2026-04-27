module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "ContentSchedule",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      content_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      slot_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rotation_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 5,
      },
    },
    {
      tableName: "content_schedules",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
};

