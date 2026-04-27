module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Content",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      subject: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      file_path: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      file_type: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      file_size: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("uploaded", "pending", "approved", "rejected"),
        defaultValue: "pending",
        allowNull: false,
      },
      rejection_reason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      start_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      end_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      uploaded_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      approved_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
      },
      approved_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "contents",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
};
