import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";

export const TransitionSession = sequelize.define("TransitionSession", {
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isIn: [["switch_on", "switch_off"]] },
  },
  durationMin: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 40,
  },
  intentions: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});
