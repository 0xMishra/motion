"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogUpdationSchema = exports.blogCreationSchema = exports.signinSchema = exports.signupSchema = void 0;
const zod_1 = require("zod");
exports.signupSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    name: zod_1.z.string().trim().min(3).max(20),
    password: zod_1.z.string().min(6),
});
exports.signinSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
exports.blogCreationSchema = zod_1.z.object({
    title: zod_1.z.string().min(3),
    content: zod_1.z.string().min(3),
    published: zod_1.z.boolean().default(false),
});
exports.blogUpdationSchema = zod_1.z.object({
    title: zod_1.z.string().min(3),
    content: zod_1.z.string().min(3),
    published: zod_1.z.boolean().default(false),
});
