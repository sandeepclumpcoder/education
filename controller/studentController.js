const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const studentModel = require("../models/students");
const saltRounds = 10;
const random = require("random");


// Signup api for student registration

module.exports.signup = async (req, res) => {
    try {
        // check wheter the user with the same email
        let studentsDetails = await studentModel.findOne({
            where: {
                email: req.body.email
            }
        });
        if (studentsDetails && studentsDetails.email) {
            return res.status(400).json({
                error:
                    "Sorry a user with same credentials already exist. please try with an unique credentials",
            });
        } else {

            // password encryption

            const salt = bcrypt.genSaltSync(saltRounds);
            const securePass = bcrypt.hashSync(req.body.password, salt);

            // create a new user___________________________
            const profile_img = req.files.profile_img;
            const newName = await saveImageInDirectory(profile_img);
            let user = await studentModel.create({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                password: securePass,
                gender: req.body.gender,
                dob: req.body.dob,
                contact: req.body.contact,
                level: req.body.level,
                profile_img: newName
            });
            res.status(201).json({ message: "successfully signup" })
        }
    } catch (error) {
        console.log('error', error);
        res.status(500).send("Internal Server Error:" + error.message);
    }
}


// Login api for student 

module.exports.login = async (req, res) => {

    //check This is a valid User
    try {
        let user = await studentModel.findOne({
            where: { email: req.body.email }
        });
        if (!user) {
            res.statusCode = 400;
            res.json({ message: "please try to login with correct credentials" })
        } else {
            const comparePass = await bcrypt.compare(req.body.password, user.password);
            if (!comparePass) {
                res.statusCode = 400;
                res.json({ error: "Please Enter Valid Password" });
            } else {
                let data = {
                    user: {
                        id: user.student_id,
                        email: user.email
                    }
                }
                const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '2h' });
                res.statusCode = 200;
                res.json({ token, message: "SuccessFully Logged In" });
            }
        }
    } catch (error) {
        console.log("error", error);
        res.json(
            "Internal Server Error:" + error.message
        )
    }
}

// EDIT API :  Find by id 

module.exports.editProfile = async (req, res) => {
    try {
        let student_id = req.params.student_id;
        let student = await studentModel.findOne({ where: { student_id: student_id } })
        if (student && student.dataValues) {
            let response = {
                studentInfo: student.dataValues
            }
            res.statusCode = 200;
            res.json({ response });
        } else {
            res.statusCode = 404;
            res.json({ message: "User Not Found" });
        }
    } catch (error) {
        res.json(
            "Internal Server Error:" + error.message
        )
    }
}

// UPDATE PROFILE : BY STUDENT ID

module.exports.updateProfile = async (req, res) => {
    try {
        const student_id = req.params.student_id;
        let studentInfo = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            gender: req.body.gender,
            dob: req.body.dob,
            contact: req.body.contact,
            level: req.body.level,
            profile_img: null
        }
        if (req.files && req.files.profile_img) {
            const image = req.files.profile_img;
            let newName = await saveImageInDirectory(image);
            studentInfo.profile_img = newName;
            await studentModel.update(studentInfo, { where: { student_id: student_id } });
            res.status(200).json({ message: "Data successfully updated" });
        } else {
            await studentModel.update(studentInfo, { where: { student_id: student_id } });
            res.status(200).json({ message: "Data successfully updated" });
        }
    } catch (error) {
        console.log("update profile api", error);
        res.status(500).send("Internal Server Error:" + error.message);
    }
}

// CHANGE PASSWORD:  API

module.exports.changePassword = async (req, res) => {
    try {
        let student_id = req.user.id;
        let user = await studentModel.findOne({ where: { student_id } });

        // bcrypt password compare

        const comparePass = await bcrypt.compare(req.body.currentPass, user.password);
        if (!comparePass) {
            res.statusCode = 400;
            res.json({ error: "please enter valid current password" });
        } else {
            let newPass = req.body.newPass;
            let re_enterPass = req.body.re_enterPass;
            if (newPass == re_enterPass) {

                // password encryption

                const salt = bcrypt.genSaltSync(saltRounds);
                const securePass = bcrypt.hashSync(req.body.newPass, salt);
                if (req.body.currentPass == securePass) {
                    res.json({ message: "current password and new password should be diffrent" })
                } else {
                    user.password = securePass;
                    user.save();
                    res.status(200).json({ message: "password change successfully" });
                }
            } else {
                res.status(400).json("new password and re-enter password should be match")
            }
        }
    } catch (error) {
        console.log("change password error", error);
        res.status(500).send("Internal Server Error:" + error.message);
    }
}

// Save image in Directory 

saveImageInDirectory = async (image) => {
    return new Promise((resolve, reject) => {
        const imageNameArray = image.name.split('.');
        const imageExtention = imageNameArray.slice(-1);
        const todaysDate = new Date();
        const imageNewName = todaysDate.getTime() + '' + random.int(1, 1000) + '.' + imageExtention;
        const uploadPath = __dirname + '../../public/students/' + imageNewName;
        image.mv(uploadPath, function (error, result) {
            if (error) {
                let response = {
                    error: error
                }
                reject(response);
            } else {
                resolve(imageNewName);
            }
        });
    });
}




