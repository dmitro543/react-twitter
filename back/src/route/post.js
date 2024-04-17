// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

const { Post } = require('../class/post')
// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.post('/post-create', function (req, res) {
    try {
       const { username, text, postId} = req.body

       if (!username || !text) {
          return res.status(400).json({
            message:
              "Потрібно передати всі данні для створення поста",
          })
       }

       let post = null

       console.log(postId, 'postId')

       if (postId) {
         post = Post.getById(Number(postId))
         console.log('post', post)

         if(!post) {
            return res.status(400).json({
                message: "Пост з таким ID не існує",
            })
         }
       }

       const replyPost = Post.create(username, text, post)

       return res.status(200).json({
          post: {
            id: replyPost.id,
            text: replyPost.text,
            username: replyPost.username,
            date: replyPost.date,
          }
       })
    } catch (e) {
        return res.status(400).json({
            message: e.message,
         })
    }
})

router.get('/post-list', function (req, res) {
    try {
       const list = Post.getlist()

       if (list.length === 0) {
          return res.status(200).json({
            list: [],
          })
       }
       
       return res.status(200).json({
          list: list.map(({ id, username, text, date }) => ({
            id, 
            username, 
            text, 
            date,
          }))
       })
    } catch(e) {
        return res.status(400).json({
            message: e.message,
        })
    }
})

router.get('/post-item', function (req, res) {
    try {
       const { id } = req.query

       if (!id) {
          return res.status(400).json({
            message: "Потрібно передати ID поста"
          })
       }

       const post = Post.getById(Number(id))

       if (!post) {
        return res.status(400).json({
          message: "Пост з таким ID не існує"
        })
     }
       
       return res.status(200).json({
          post: {
            id: post.id,
            text: post.text,
            username: post.username,
            date: post.date,

            rerly: post.reply.map((reply) => ({
                id: reply.id,
                text: reply.text,
                username: reply.username,
                date: reply.date,
            }))
          }
       })
    } catch(e) {
        return res.status(400).json({
            message: e.message,
        })
    }
})
module.exports = router