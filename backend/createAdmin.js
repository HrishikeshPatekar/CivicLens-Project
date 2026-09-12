const dns = require("dns");
dns.setServers(["8.8.8.8"]);

const dotenv = require("dotenv");
const mongoose = require("mongoose");
const argon2 = require("argon2");

const User = require("./models/User");

dotenv.config();

const createAdmin = async () => {
    try {

        await mongoose.connect(
            process.env.MONGO_URI
        );

        console.log(
            "MongoDB connected"
        );

        const email =
            "admin@civiclens.com";

        const existing =
            await User.findOne({
                email,
            });

        if (existing) {

            if (
                existing.role !==
                "administrative_officer"
            ) {

                existing.role =
                    "administrative_officer";

                await existing.save();

                console.log(
                    "Existing user converted to admin"
                );

            } else {

                console.log(
                    "Admin already exists"
                );
            }

            process.exit(0);
        }


        const hashedPassword =
            await argon2.hash(
                "Admin@123"
            );


        const admin =
            await User.create({

                name:
                    "Civic Lens Administrator",

                email,

                mobile:
                    "9999999999",

                password:
                    hashedPassword,

                role:
                    "administrative_officer",

                profilePhoto:
                    "",
            });


        console.log(
            "================================"
        );

        console.log(
            "ADMIN CREATED SUCCESSFULLY"
        );

        console.log(
            "Email:",
            admin.email
        );

        console.log(
            "Password: Admin@123"
        );

        console.log(
            "Role:",
            admin.role
        );

        console.log(
            "================================"
        );

        process.exit(0);

    } catch (error) {

        console.error(
            "Create admin error:",
            error
        );

        process.exit(1);
    }
};

createAdmin();