const {v4: uuidv4} = require('uuid')
const User = require('../models/user')
const {setUser} = require('../service/auth')

async function handleUserSignup(req, res) {
  const {name, email, password} = req.body
  await User.create({
    name,
    email,
    password,
  }) 
  return res.redirect('/')
}

async function handleUserLogin(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.render('login', {
        error: 'Invalid Username and password'
      });
    }
    
    const token = setUser(user)
    res.cookie('token', token)
    return res.redirect('/');
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).send('Internal Server Error');
  }
} 


module.exports = {
  handleUserSignup,
  handleUserLogin,
}