import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI

declare global {
    var mongooseCache: {
        conn: typeof mongoose | null
        promise: Promise<typeof mongoose> | null
    }
}

//Se intenta recuperar la variable global
let cached  = global.mongooseCache

//Si no existe se inicializa con valores null
if(!cached){
    cached = global.mongooseCache = {conn:null, promise:null}
}

export const connectToDatabase = async () =>{
    if(!MONGODB_URI) throw new Error('MONGODB_URI must be set within .env')

    //Si hay una conexion existente la devuelve inmediatamente para ahorrar tiempo y recursos
    if(cached.conn) return cached.conn

    //Si no hay conexion existente, crea una y la almacena como promesa
    if(!cached.promise){
        cached.promise = mongoose.connect(MONGODB_URI, {bufferCommands:false})
    }

    try {
        //Espera a que la promesa se resuelva, es decir, se realice la conexión
        cached.conn = await cached.promise
    } catch (error) {
        cached.promise = null
        throw error
    }
    console.log(`Connected to database ${process.env.NODE_ENV} - ${MONGODB_URI}`)

}
