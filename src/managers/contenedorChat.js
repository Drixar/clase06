const fs = require("fs");
const path = require("path");

class Chat{
    constructor(nameFile){
        this.nameFile = path.join(__dirname,"..",`files/${nameFile}`);
    }

    save = async(message)=>{
        try {
            if(fs.existsSync(this.nameFile)){
                const messages = await this.getAll();
                const date = new Date();
                const newMessage={
                    id: date.toLocaleString(),
                    ...message
                }
                messages.push(newMessage);
                await fs.promises.writeFile(this.nameFile, JSON.stringify(messages, null, 2))
                return messages;
            } else{
                // si el archivo no existe
                const date = new Date();
                const newMessage={
                    id: date.toLocaleString(),
                    ...message
                }
                await fs.promises.writeFile(this.nameFile, JSON.stringify([newMessage], null, 2));
            }
        } catch (error) {
            console.log(error);
        }
    }

    // getById = async(id)=>{
    //     try {
    //         if(fs.existsSync(this.nameFile)){
    //             const messages = await this.getAll();
    //             const producto = messages.find(item=>item.id===id);
    //             return producto
    //         }
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    getAll = async()=>{
        if(fs.existsSync(this.nameFile)){
            try {
                const contenido = await fs.promises.readFile(this.nameFile,"utf8");
                const messages = JSON.parse(contenido);
                return messages;
            } catch (error) {
                console.log(error)
            }
        }
        return {status:'error',message:"No hay Mensajes"}
    }

    // deleteById = async(id)=>{
    //     try {
    //         const messages = await this.getAll();
    //         const newMessages = messages.filter(item=>item.id!==id);
    //         await fs.promises.writeFile(this.nameFile, JSON.stringify(newMessages, null, 2));
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    // deleteAll = async()=>{
    //     try {
    //         await fs.promises.writeFile(this.nameFile, JSON.stringify([]));
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    // updateById = async(id, body)=>{
    //     try {
    //         const messages = await this.getAll();
    //         const productPos = messages.findIndex(elm=>elm.id === id);
    //         messages[productPos] = {
    //             id:id,
    //             ...body
    //         };
    //         await fs.promises.writeFile(this.nameFile, JSON.stringify(messages, null, 2))
    //         return messages;
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }
}

module.exports = Chat;