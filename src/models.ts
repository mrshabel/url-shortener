import { DataTypes, Model } from "sequelize";
import { sequelize } from "./config";

class URL extends Model {
    public id!: string;
    public url!: string;
    public urlKey!: string;
}
export const Url = URL.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        urlKey: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    },
    {
        tableName: "urls",
        sequelize,
    }
);
