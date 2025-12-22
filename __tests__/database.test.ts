import { connectToDatabase } from '../database/mongoose'
import mongoose from 'mongoose'

describe('Database Connection', () => {
  // Cerrar todas las conexiones después de todos los tests
  afterAll(async () => {
    // Limpiar el cache global
    if (global.mongooseCache) {
      global.mongooseCache.conn = null
      global.mongooseCache.promise = null
    }

    // Cerrar la conexión de mongoose si está abierta
    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect()
      }
    } catch (error) {
      // Ignorar errores al cerrar
    }
  }, 30000)

  test('debe conectarse exitosamente a la base de datos', async () => {
    // Verificar que MONGODB_URI esté definida
    expect(process.env.MONGODB_URI).toBeDefined()
    expect(process.env.MONGODB_URI).not.toBe('')
    console.log(`\n🔗 Intentando conectar a: ${process.env.MONGODB_URI?.replace(/\/\/.*@/, '//***@')}`)

    // Limpiar cache antes de conectar para asegurar una conexión fresca
    if (global.mongooseCache) {
      global.mongooseCache.conn = null
      global.mongooseCache.promise = null
    }

    try {
      // Intentar conectar
      await connectToDatabase()

      // Esperar a que la conexión se establezca completamente
      let attempts = 0
      const maxAttempts = 30

      while (mongoose.connection.readyState !== 1 && attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 500))
        attempts++
      }

      // Verificar que la conexión esté establecida
      expect(mongoose.connection.readyState).toBe(1) // 1 = connected

      // Verificar que la conexión tenga información del host
      expect(mongoose.connection.host).toBeDefined()
      expect(mongoose.connection.name).toBeDefined()

      console.log(`✅ Conexión exitosa a MongoDB: ${mongoose.connection.host}/${mongoose.connection.name}`)
    } catch (error: any) {
      // Si el error es de whitelist, proporcionar información útil
      if (error.message?.includes('whitelist') || error.message?.includes('IP')) {
        console.error(`\n⚠️  Error de conexión: Tu IP no está en la whitelist de MongoDB Atlas`)
        console.error(`   Por favor, agrega tu IP actual a la whitelist en MongoDB Atlas`)
        console.error(`   Detalles del error: ${error.message}`)
        throw new Error(`Conexión fallida: IP no autorizada. Agrega tu IP a la whitelist de MongoDB Atlas. Error original: ${error.message}`)
      }
      // Para otros errores, lanzarlos normalmente
      throw error
    }
  }, 60000) // Timeout de 60 segundos para la conexión

  test('debe reutilizar la conexión existente en llamadas subsecuentes', async () => {
    // Primera conexión (puede reutilizar la del test anterior)
    await connectToDatabase()

    // Esperar a que la conexión se establezca
    let attempts = 0
    while (mongoose.connection.readyState !== 1 && attempts < 30) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      attempts++
    }

    const firstReadyState = mongoose.connection.readyState
    const firstHost = mongoose.connection.host
    const firstName = mongoose.connection.name

    // Segunda conexión debería reutilizar la misma conexión
    await connectToDatabase()

    // Verificar que el estado y el host sean los mismos (misma conexión)
    expect(mongoose.connection.readyState).toBe(firstReadyState)
    expect(mongoose.connection.host).toBe(firstHost)
    expect(mongoose.connection.name).toBe(firstName)
    expect(mongoose.connection.readyState).toBe(1) // 1 = connected

    console.log(`✓ Conexión reutilizada correctamente`)
  }, 30000)
})

