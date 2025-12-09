import express from "express";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export function createUser(req, res) {
    if(req.body.role === "admin"){
        if(req.user!= null){
            if(req.user.role == "admin"){
                res.status(403).json({
                    message: "Only admins can create other admin users"
                });
                return;
            }
        }else{
            res.status(403).json({
                message: "Only admins can create other admin users"
            });
            return;
        }
    }


    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    const user = new User({
        email: req.body.email,
        password: hashedPassword,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        role: req.body.role
    });

    user.save()
        .then(() => {
            res.json({
                message: "User added successfully"
            });
        })
        .catch((err) => {
            res.json({
                message: "Error adding user",
                error: err
            });
        });
}


// ---------------------- LOGIN USER ---------------------- //

export function loginUser(req, res) {
    console.log("REQ BODY:", req.body);

    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    User.findOne({ email: email })
        .then((user) => {
             console.log("USER FROM DB:", user); 
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const isPasswordCorrect = bcrypt.compareSync(password, user.password);

            if (isPasswordCorrect) {
                const token = jwt.sign(
                    {
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: user.role,
                        img: user.img ?? null
                    },
                    "aviusersecret-key"
                );

                return res.json({ message: "Login successful", token });
            }

            return res.status(401).json({ message: "Invalid password" });
        })
        .catch((err) => {
            console.log("LOGIN ERROR:", err);
            res.status(500).json({ message: "Error logging in", error: err });
        });
}

export function isAdmin(req){
    if(req.user == null){
        return false;
    }
    if(req.user.role !== "admin"){
        return false;
        }
        return true
    }

 