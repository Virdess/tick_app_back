import { body } from "express-validator";

export const loginValidation = [
    body('userName', 'Укажите имя (мин. 3 смвола)').isLength({min: 3}),
    body('password', 'Пароль должен быть минимум 5 символов').isLength({min: 5}),
]

export const registerValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 5 символов').isLength({min: 5}),
    body('userName', 'Укажите имя (мин. 3 смвола)').isLength({min: 3}),
    body('avatarUrl', 'Неверная ссылка').optional().isURL(),
]

export const userProfileValidation = [
    body('firstName', 'Введите имя (Мин. 3 символа)').isLength({min: 3}).isString(),
    body('midName', 'Введите фамилию (Мин. 10 символов)').isLength({min: 10}).isString(),
    body('lastName', 'Отчество').optional().isString(),
    body('role', 'роль не добавлена...').isString(),
]