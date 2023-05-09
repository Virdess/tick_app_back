import express from 'express'
import multer from 'multer';
import mongoose from 'mongoose';

import {registerValidation,loginValidation} from './validations/validations.js'

import checkAuth from './utils/checkAuth.js';
import handleValidationErrors from './utils/handleValidationErrors.js';

import {UserController, UserProfileController, QRCodeController} from './Controllers/ControllersIndex.js'




//Я не знаю, зачем это, это посоветовал сделать сам монгуст
mongoose.set('strictQuery', false);

//Подключение к базе данных
mongoose.connect(
    'mongodb://127.0.0.1:27017/blog?retryWrites=true&w=majority'
    ).then(()=>{
        console.log("DB OK")
    }).catch((err)=>{
        console.log('!!!DB ERROR: ' + err)
    })

const app = express();

//Я не знаю доподлинно, как оно работает, вроде как работает над сохранением файлов
//#######TODO Сделать уникальные имена для каждого файла
const storage = multer.diskStorage({
    destination: (_, __, cb) =>{
        cb(null, 'uploads') //папка сохранения
    },
    filename:(req, file, cb) =>{
        cb(null, req.userID + "-" + "profile" + ".jpg") //сохранение файла + даём ему имя получая оригинальное название файла через file.originalname
    },
})

const upload = multer({
    storage
})

//Объясняем express что при любой ссылке /uploads надо выдать сам файл
app.use('/uploads', express.static('uploads'))

//Эндпоинт для загрузки файлов (в момент 13.01.2023 для загрузки аватарок)
//На момент 20.01.2023 вырезано за ненадобностью на данный момент.
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.userID + "-" + "profile" + ".jpg"}`,
    })
})

//Учим экспресс приложение работать с json
app.use(express.json())


//Проверочный эедпоинт, для просмотра работает ли сервер
app.get('/', (req, res) =>{
    return res.send('OK')
})

//Эндпоинты для работы с регистрацией и аутентификацией (в т.ч профилей)
app.post('/auth/login', loginValidation, handleValidationErrors,UserController.login)
app.post('/auth/reg', registerValidation, handleValidationErrors, UserController.register)//     ######TODO######        роли пользователей (Преподаватель, студент, админ, супервайзер)
app.get('/auth/me', checkAuth, UserController.getMe)
app.get('/profile', checkAuth, UserProfileController.profileGetMe)
app.post('/profile', checkAuth, UserProfileController.profileCreate)
app.patch('/auth/me', checkAuth, UserController.editStatus)
//app.patch('/profile', checkAuth, UserProfileController.profileUpdate)


//Эндпоинт для обновления данных профиля ######TODO######
//app.patch('/profile', checkAuth, UserProfileController.profileUpdate)

//Эндпоинт для модерации аккаунтов при регистрации (Модерирующий пользователь - супервайзер/админ)


//Эндпоинты для qr      ######TODO######
//generating endpoints
/************************* */
app.get('/qr_code/sym',checkAuth, QRCodeController.generateAsSymbols)
app.get('/qr_code/str',checkAuth, QRCodeController.generateAsString)
/************************* */


//scanning endpoints


//Эндпоинты для создания достижений (Загрузка изображений с подписью)

//Эндпоинты для чатов (пока что тех.поддержка)





















//Запуск приложения
app.listen(4444, (err) => {
    if(err){
        return console.log(err)
    }
    console.log('server OK')
});
