const express = require("express");
const {Server} = require("socket.io");
const Contenedor = require("./managers/contenedorProductos");
const Chat = require("./managers/contenedorChat")

//servicios
const productsService = new Contenedor("productos.txt");
const chatService = new Chat("chat.txt")

const app = express();

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, ()=>console.log(`listening on port ${PORT}`));
const io = new Server(server);

//trabajar con archivos estaticos de la carpeta public
app.use(express.static(__dirname+"/public"));

const historicoMensajes = [];


//websocket
io.on("connection",async(socket)=>{
    console.log("nuevo usuario conectado", socket.id);

    //enviar todos los productos al usuario cuando se conecte.
    socket.emit("products", await productsService.getAll())

    //recibimos el nuevo producto del cliente y lo guardamos
    socket.on("newProduct",async(data)=>{
        await productsService.save(data);
        //enviamos la lista de productos actualizada a todos los sockets conectados
        io.sockets.emit("products", await productsService.getAll());
    })

    //enviar a todos menos al socket conectado
    socket.broadcast.emit("newUser");

 
    socket.emit("historico",await chatService.getAll());


    socket.on("message",async data=>{
        await chatService.save(data)
        io.sockets.emit("historico",await chatService.getAll());
    });
})