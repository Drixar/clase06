console.log("javascript funcionando");


const socketClient = io();

let user;
Swal.fire({
    title:"Hola usuario",
    text:"bienvenido, ingresa tu usario",
    input:"text",
    allowOutsideClick:false
}).then(respuesta=>{
    user = respuesta.value;
});

const productForm = document.getElementById("productForm");
productForm.addEventListener("submit",(evt)=>{
    evt.preventDefault();
    const product ={
        title: document.getElementById("title").value,
        price: document.getElementById("price").value,
        thumbnail: document.getElementById("thumbnail").value
    }
    socketClient.emit("newProduct",product);
    document.getElementById("title").value = "";
    document.getElementById("price").value = "";
    document.getElementById("thumbnail").value = "";
})

const createTable = async(data)=>{
    const response = await fetch("./templates/table.handlebars");
    const result = await response.text();
    const template = Handlebars.compile(result);
    const html = template({products:data});
    return html;
}

const productsContainer = document.getElementById("productsContainer");
socketClient.on("products",async(data)=>{
    // console.log(data)
    //generar el html basado en la plantilla de hbs con todos los productos
    const htmlProducts = await createTable(data);
    productsContainer.innerHTML = htmlProducts;
})



//logica del chat
//enviar el mensaje desde el cliente
const campo = document.getElementById("messageField");
const boton = document.getElementById("sendBoton");
boton.addEventListener("click",(evt)=>{
    // console.log(evt.key)
    // if(evt.key === "Enter"){
        socketClient.emit("message",{
            username:user,
            message:campo.value
        })
        campo.value ="";
    }
)

//mostrar los mensajes cuando el usuario carga la página
const messageContainer = document.getElementById("messageContainer");
socketClient.on("historico",async (data)=>{
    let elementos="";
    await data.forEach(item=>{
        elementos = elementos + `<p class="text-start"><strong>${item.username}</strong>: ${item.message}</p>`;
    });
    messageContainer.innerHTML = elementos;
})

// socketClient.on("newUser",()=>{
//     Swal.fire({
//         text:"nuevo usuario conectado",
//         toast:true
//     })
// })