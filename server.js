const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")
require("dotenv").config()

const User = require("./models/User")
const Note = require("./models/Notas")
const PORT = 3000;
const SECRET = process.env.SECRET_KEY

const app = express();

app.use(cors());
app.use(express.json());

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB conectado");
  } catch (err) {
    console.error("❌ Erro no MongoDB:", err);
    process.exit(1);
  }
}
connectToDB();

function verificarToken(req, res, next) {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    res.status(401).json({ error: 'Token não fornecido' })
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Token invalido ou expirado' })
  }
}

app.post('/users', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'Usuario Existente' })
    }

    const senhaHashed = await bcrypt.hash(password, 10)

    const newUser = new User({ username, email, password: senhaHashed, role: 'user' });
    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao registrar usuario' })
  }
});

app.post('/notes', verificarToken, async (req, res) => {
  try {
    const { title, note } = req.body;

    if (!title || !note) {
      return res.status(400).json({ error: "preencha todos os campos" })
    }

    const userId = req.user.id;

    const newNote = new Note({ title, note, userId });
    await newNote.save()

    res.status(201).json({ message: 'Nota criada com sucesso!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao criar nota' });
  }
})

app.get('/notes', verificarToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const findNotes = await Note.find({ userId });

    if (!findNotes) {
      return res.status(404).json({ error: 'Notas nao encontrdas' })
    }

    res.json(findNotes)
  } catch (error) {

  }
})

app.get('/users', async (req, res) => {
  const users = await User.find();
  res.json(users)
})

app.get('/user', verificarToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password')

    if (!user) {
      return res.status(404).json({ erro: 'Usuario nao encontrado' })
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao busca Usuario' })
  }
})

app.patch('/updateUsername', verificarToken, async (req, res) => {
  try {
    const userId = req.user.id
    const user = await User.findById(userId)
    const { username } = req.body;

    if (!user) {
      return res.status(404).json({ error: 'Usuario não encontrado' })
    }

    user.username = username;

    await user.save()

    res.json({ message: 'Nome de usuario atualizado com sucesso' })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Falha ao atualizar nome de usuario' })
  }
});

app.patch('/updateEmail', verificarToken, async (req, res) => {
  try {
    const userId = req.user.id
    const { email } = req.body
    const findEmail = await User.findById(userId)

    if (!findEmail) {
      return res.status(404).json({ error: 'Usuario nao encontrado' })
    }

    findEmail.email = email;

    await findEmail.save()

    res.json({ message: 'Email atualizado com sucesso' })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Falha ao atualizar o email' })
  }
})

app.post('/check-username', async (req, res) => {
  try {
    const palavrasInapropriadas = ["aidética","aidético","aleijada","aleijado","anã","analfabeta","analfabeto","anão","anus","apenada","apenado","arrombado","babaca","baba-ovo","babaovo","bacura","bagos","baianada","baitola","bárbaro","barbeiro","barraco","beata","bêbado","bêbedo","bebum","besta","bicha","bisca","bixa","boazuda","boçal","boceta","boco","boiola","bokete","bolagato","bolcat","boquete","bosseta","bosta","bostana","branquelo","brecha","brexa","brioco","bronha","buca","buceta","bugre","bunda","bunduda","burra","burro","busseta","caceta","cacete","cachorra","cachorro","cadela","caga","cagado","cagao","cagão","cagona","caipira","canalha","canceroso","caralho","casseta","cassete","ceguinho","checheca","chereca","chibumba","chibumbo","chifruda","chifrudo","chochota","chota","chupada","chupado","ciganos","clitoris","clitóris","cocaina","cocaína","coco","cocô","comunista","corna","cornagem","cornão","cornisse","corno","cornuda","cornudo","corrupta","corrupto","coxo","cretina","cretino","criolo","crioulo","cruz-credo","cu","cú","culhao","culhão","curalho","cuzao","cuzão","cuzuda","cuzudo","debil","débil","debiloide","debilóide","deficiente","defunto","demonio","demônio","denegrir","denigrir","detento","difunto","doida","doido","egua","égua","elemento","encostado","esclerosado","escrota","escroto","esporrada","esporrado","esporro","estupida","estúpida","estupidez","estupido","estúpido","facista","fanatico","fanático","fascista","fedida","fedido","fedor","fedorenta","feia","feio","feiosa","feioso","feioza","feiozo","felacao","felação","fenda","foda","fodao","fodão","fode","fodi","fodida","fodido","fornica","fornição","fudeção","fudendo","fudida","fudido",
      "furada","furado","furão","furnica","furnicar","furo","furona","gai","gaiata","gaiato","gay","gilete","goianada","gonorrea","gonorreia","gonorréia","gosmenta","gosmento","grelinho","grelo","gringo","homo-sexual","homosexual","homosexualismo","homossexual","homossexualismo","idiota","idiotice","imbecil","inculto","iscrota","iscroto","japa","judiar","ladra","ladrao","ladrão","ladroeira","ladrona","lalau","lazarento","leprosa","leproso","lesbica","lésbica","louco","macaca","macaco","machona","macumbeiro","malandro","maluco","maneta","marginal","masturba","meleca","meliante","merda","mija","mijada","mijado","mijo","minorias","mocrea","mocreia","mocréia","moleca","moleque","mondronga","mondrongo","mongol","mongoloide","mongolóide","mulata","mulato","naba","nadega","nádega","nazista","negro","nhaca","nojeira","nojenta","nojento","nojo","olhota","otaria","otária","otario","otário","paca","palhaco","palhaço","paspalha","paspalhao","paspalho","pau","peão","peia","peido","pemba","penis","pênis","pentelha","pentelho","perereca","perneta","peru","pica","picao","picão","pilantra","pinel","pintão","pinto","pintudo","piranha","piroca","piroco","piru","pivete","porra","prega","prequito","preso","priquito","prostibulo","prostituta","prostituto","punheta","punhetao","punhetão","pus","pustula","puta","puto","puxa-saco","puxasaco","rabao","rabão","rabo","rabuda","rabudao","rabudão","rabudo","rabudona","racha","rachada","rachadao","rachadinha","rachadinho","rachado","ramela","remela","retardada","retardado","ridícula","roceiro","rola","rolinha","rosca","sacana","safada","safado","sapatao","sapatão","sifilis","sífilis","siririca","tarada","tarado","testuda","tesuda","tesudo","tezao","tezuda","tezudo","traveco","trocha","trolha","troucha","trouxa","troxa","tuberculoso","tupiniquim","turco","vaca","vadia",
      "vagabunda","vagabundo","vagal","vagina","veada","veadao","veado","viada","viadagem","viadao","viadão","viado","víado","xana","xaninha","xavasca","xerereca","xexeca","xibiu","xibumba","xiíta","xochota","xota","xoxota"];

      const { username } = req.body

      if (!username || typeof username !== 'string') {
      return res.status(400).json({ error: 'Nome de usuário inválido.' });
    }

      const nomeMinisculo = username.toLowerCase()

      const nomeInapropriado = palavrasInapropriadas.some(palavra =>
        nomeMinisculo.includes(palavra)
      )

      if (nomeInapropriado) {
        return res.json({permitido : false});
      }

      res.json({permitido : true})

  } catch (error) {
     console.error(error)
     res.status(500).json({error: 'Erro na validação'})
  }
})

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ error: 'Usuario inexistente' })
    }

    const validarSenha = await bcrypt.compare(password, user.password);
    if (!validarSenha) {
      return res.status(400).json({ error: 'Senha incorreta' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      SECRET,
      { expiresIn: '5d' }
    );


    res.status(200).json({ message: 'Login Sucedido', token })
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'erro ao fazer login' })
  }
})

app.listen(PORT, () => console.log(`Servidor Rodando na Porta ${PORT}`))

