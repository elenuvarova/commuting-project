import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";

export const TransitionSession = sequelize.define("TransitionSession", {
  // Anonymous per-browser owner (set from an httpOnly cookie) so a visitor only
  // ever reads/writes their own transitions — never the global list.
  ownerKey: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isIn: [["switch_on", "switch_off"]] },
  },
  durationMin: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 40,
    validate: { min: 1, max: 600 },
  },
  intentions: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: { len: [0, 1000] },
  },
  completed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});
