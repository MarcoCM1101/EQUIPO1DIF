//Equipo 1 
//Marco Antonio Caudillo Morales
//Adolfo Sebastián Gonzalez Mora
//Jorge Daniel Rea Prado
//Oswaldo Daniel

// Declaración de variables para el funcionaiento de nuetsra aplicación
const express = require('express');
const mssql = require('mssql');
const port = 8080;
const ipAddr = '54.164.8.30';

// Ingreso a la aplicación para cargar la página web directamente de la carpeta public
const app = express();
app.use(express.static(__dirname + '/public'));
app.use(express.json());

// Configuración de la base de datos
const dbConfig = {
  user: process.env.MSSQL_USER,
  password: process.env.MSSQL_PASSWORD,
  database: 'Proyecto_DIF',
  server: 'localhost',
  pool: { max: 10, min: 0, idleTimeoutMillis: 30000 },
  options: { trustServerCertificate: true }
};

// Conexión a la base de datos y confirmación de una conexión exitosa
async function connectDb() {
  try {
    await mssql.connect(dbConfig);
    console.log('Connected to the database.');
  } catch (err) {
    console.error('Unable to connect to the database.');
    throw err;
  }
}

// Llamada a la función de conectar con las base de datos
connectDb();

// CONFIGURACIÒN DE APIS

// API para obtener a los Usuarios de los comedores
app.get('/usuarios', async (req, res) => {
  try {
    const rows = (await mssql.query`
      EXEC PROC_MostrarUsuarios;
    `).recordset;
    const result = [];
    for (let row of rows) {
      result.push({
        idUsuario: row.idUsuario,
        nombre: row.nombre,
        apellido: row.apellido,
        curp: row.curp,
        edad: row.edad,
        genero: row.genero
      });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// API para obtener los Comedores
app.get('/comedores', async (req, res) => {
  try {
    const rows = (await mssql.query`
      EXEC PROC_MostrarComedores;
    `).recordset;
    const result = [];
    for (let row of rows) {
      result.push({
        idComedor: row.idComedor,
        idAdministrador: row.idAdministrador,
        nombre: row.nombre,
        direccion: row.direccion,
        encargado: row.encargado,
        telefono: row.telefono,
        estatus: row.estatus
      });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// API para obtener los Comedores
app.get('/encuestas', async (req, res) => {
  try {
    const rows = (await mssql.query`
      EXEC PROC_MostrarEncuesta;
    `).recordset;
    const result = [];
    for (let row of rows) {
      result.push({
        idEncuesta: row.idEncuesta,
        idComedor: row.idComedor,
        higiene: row.higiene,
        atencion: row.atencion,
        comida: row.comida,
        comentario: row.comentario
      });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// API para obtener los Comedores
app.get('/encuestasComedor/:idComedor', async (req, res) => {
  try {
    const { idComedor } = req.params;
    const rows = (await mssql.query`
      EXEC PROC_MostrarEncuestaComedor ${ idComedor };
    `).recordset;
    const result = [];
    for (let row of rows) {
      result.push({
        idEncuesta: row.idEncuesta,
        idComedor: row.idComedor,
        higiene: row.higiene,
        atencion: row.atencion,
        comida: row.comida,
        comentario: row.comentario
      });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// API para obtener los encargados
app.get('/encargados', async (req, res) => {
  try {
    const rows = (await mssql.query`
      EXEC PROC_MostrarEncargados;
    `).recordset;
    const result = [];
    for (let row of rows) {
      result.push({
        idEncargado: row.idEncargado,
        Nombre: row.nombre,
        telefono: row.telefono,
        contraseña: row.contraseña,
        idComedor: row.idComedor
      });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// API para obtener los Anuncios
app.get('/anuncios', async (req, res) => {
  try {
    const rows = (await mssql.query`
      EXEC PROC_MostrarAnuncios;
    `).recordset;
    const result = [];
    for (let row of rows) {
      result.push({
        idAnuncio: row.idAnuncio,
        idAdministrador: row.idAdministrador,
        titulo: row.titulo,
        descripcion: row.descripcion,
        fechaPublicacion: row.fechaPublicacion,
        estado: row.estado
      });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// API para obtener los Anuncios Activos
app.get('/anunciosActivos', async (req, res) => {
  try {
    const rows = (await mssql.query`
      EXEC PROC_MostrarAnunciosActivos;
    `).recordset;
    const result = [];
    for (let row of rows) {
      result.push({
        idAnuncios: row.idAnuncios,
        idAdministrador: row.idAdministrador,
        titulo: row.titulo,
        descripcion: row.descripcion,
        fechaPublicacion: row.fechaPublicacion,
        estado: row.estado
      });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

//API para obtener el UsuarioComedor
app.get('/usuarioComedor', async (req, res) => {
   try {
     const rows = (await mssql.query`
       EXEC PROC_MostrarUsuarioComedor;
     `).recordset;
     const result = [];
     for (let row of rows) {
       result.push({
         idUsuario: row.idUsuario,
         idComedor: row.idComedor,
         fecha: row.fecha,
         donativo: row.donativo
       });
     }
     res.json(result);
   } catch (err) {
     res.status(500).json(err);
   }
});

// API para obtener los administradores
app.get('/administradores', async (req, res) => {
  try {
    const rows = (await mssql.query`
      EXEC PROC_MostrarAdministradores;
    `).recordset;
    const result = [];
    for (let row of rows) {
      result.push({
        idAdministrador: row.idAdministrador,
        nombre: row.nombre,
        apellido: row.apellido,
        correo: row.correo,
        contraseña: row.contraseña
      });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// API para obtener los administradores
app.get('/comedoresVentaDonativo', async (req, res) => {
  try {
    const rows = (await mssql.query`
      EXEC PROC_VentasDonativosPorComedor;
    `).recordset;
    const result = [];
    for (let row of rows) {
      result.push({
        nombre: row.nombre,
        idComedor:row.idComedor,
        normal: row.normal,
        donativo: row.donativo,
        estatus: row.estatus
      });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// API para obtener consumidores del día hoy 
app.get('/usuariosHoy', async (req, res) => {
  try {
    const rows = (await mssql.query`
      EXEC PROC_UsuariosHoy;
    `).recordset;
    const row =rows [0]; 
    res.json({
      TotalUsuariosHoy: row.TotalUsuariosHoy
      });
    }catch (err) {
    res.status(500).json(err);
  }
});

// API para obtener consumidores del día hoy 
app.get('/comedorUsuariosVentas/:idComedor', async (req, res) => {
  try {
    const { idComedor} = req.params
    const rows = (await mssql.query`
      EXEC PROC_ContarUsuariosPorComedor ${ idComedor };
    `).recordset;
    const row =rows [0]; 
    res.json({
      ventasTotales: row.ventasTotales
      });
    }catch (err) {
    res.status(500).json(err);
  }
});

app.get('/comedorUsuariosPromedio/:idComedor', async (req, res) => {
  try {
    const { idComedor} = req.params
    const rows = (await mssql.query`
      EXEC PROC_PromedioVentasPorDia ${ idComedor };
    `).recordset;
    const row =rows [0]; 
    res.json({
      ResultadoPromedioVentasPorUsuario: row.ResultadoPromedioVentasPorUsuario
      });
    }catch (err) {
    res.status(500).json(err);
  }
});

app.get('/totalVentasDonativos/:idComedor', async (req, res) => {
  try {
    const { idComedor} = req.params
    const rows = (await mssql.query`
      EXEC PROC_VentasYDonativosPorComedor ${ idComedor };
    `).recordset;
    const row =rows [0]; 
    res.json({
      VentasNormales: row.VentasNormales,
      Donativos: row.Donativos
      });
    }catch (err) {
    res.status(500).json(err);
  }
});

app.get('/usuariosAsistentes/:idComedor', async (req, res) => {
  try {
    const { idComedor} = req.params
    const rows = (await mssql.query`
      EXEC PROC_ContarUsuariosAsistentesComedor ${ idComedor };
    `).recordset;
    const row =rows [0]; 
    res.json({
      UsuariosAsistentes: row.UsuariosAsistentes
      });
    }catch (err) {
    res.status(500).json(err);
  }
});

app.get('/promedioUsuariosDia/:idComedor', async (req, res) => {
  try {
    const { idComedor} = req.params
    const rows = (await mssql.query`
      EXEC PROC_PromedioUsuariosPorDia ${ idComedor };
    `).recordset;
    const row =rows [0]; 
    res.json({
      PromedioUsuariosPorDia: row.PromedioUsuariosPorDia
      });
    }catch (err) {
    res.status(500).json(err);
  }
});

// API para obtener ventas o donativos
app.get('/ventaDonativos', async (req, res) => {
  try {
    const rows = (await mssql.query`
      EXEC PROC_CountDonativos;
    `).recordset;
    const row =rows [0]; 
    res.json({
      donativo: row.Donativo,
      normal: row.Normal
      });
    }catch (err) {
    res.status(500).json(err);
  }
});

// API para obtener comedores activos e inactivos
app.get('/comedoresActivosInactivos', async (req, res) => {
  try {
    const rows = (await mssql.query`
      EXEC PROC_SumComedoresActivosInactivos;
    `).recordset;
    const row =rows [0]; 
    res.json({
      activo: row.ComedoresActivos,
      inactivo: row.ComedoresInactivos
      });
    }catch (err) {
    res.status(500).json(err);
  }
});


// API para obtener ingresos Totales
app.get('/ingresoTotales', async (req, res) => {
  try {
    const rows = (await mssql.query`
      EXEC PROC_SumNormalTimes13;
    `).recordset;
    const row =rows [0]; 
    res.json({
      resultado: row.Resultado
      });
    }catch (err) {
    res.status(500).json(err);
  }
});


// API para validar contraseña administradores
app.get('/loginAdmin/:correo/:contrasena', async (req, res) => {
  try {
    const correo = req.params.correo;
    const contrasena = req.params.contrasena;
    const rows = (await mssql.query`
        EXECUTE PROC_LoginAdministrador ${correo},${contrasena};
    `).recordset;
    const row = rows[0];
    if (row) {
      res.json({
        idAdministrador: row.idAdministrador,
        correo: row.correo,
        login: row.Exitoso,
      });
    } else {
      res.type('text').status(401).send(
        `Invalid correo or password.\n`);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// API para validar contraseña encargado
app.get('/loginEncargado/:telefono/:contrasena', async (req, res) => {
  try {
    const telefono = req.params.telefono;
    const contrasena = req.params.contrasena;
    const rows = (await mssql.query`
        EXECUTE PROC_LoginEncargado ${telefono},${contrasena};
    `).recordset;
    const row = rows[0];
    if (row) {
      res.json({
        idEncargado: row.idEncargado,
        idComedor: row.idComedor,
        telefono: row.telefono,
        login: row.Exitoso,
      });
    } else {
      res.type('text').status(401).send(
        `Invalid correo or password.\n`);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// API para Mostrar datos administrador
app.get('/administrador/:idAdministrador', async (req, res) => {
  try {
    const idAdministrador = req.params.idAdministrador;
    const rows = (await mssql.query`
        EXECUTE PROC_MostrarDatosAdmin ${idAdministrador};
    `).recordset;
    const row = rows[0];
    if (row) {
      res.json({
        nombre: row.nombre,
        apellido: row.apellido,
        correo: row.correo
      });
    } else {
      res.type('text').status(401).send(
        `Invalid correo or password.\n`);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// API para Mostrar datos Encarcagso por ID
app.get('/encargado/:idEncargado', async (req, res) => {
  try {
    const idEncargado = req.params.idEncargado;
    const rows = (await mssql.query`
        EXECUTE PROC_EncargadoPorID ${idEncargado};
    `).recordset;
    const row = rows[0];
    if (row) {
      res.json({
        nombre: row.nombre,
        telefono: row.telefono,
        idComedor: row.idComedor
      });
    } else {
      res.type('text').status(401).send(
        `Invalid correo or password.\n`);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});



// Api para ingresar encargado
app.post('/InsertEncargado', async (req, res) => {
  try {
    const { idComedor, nombre, telefono, contraseña} = req.body;
    const result = await mssql.query`
      EXECUTE PROC_InsertEncargado  ${nombre}, ${telefono}, ${contraseña},${idComedor}; 
    `;
    
    res.type('text').status(201).send(
      `Resource created`);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Api para ingresar usuario
app.post('/InsertUsuario', async (req, res) => {
  try {
    const {nombre, apellido, curp, edad, genero} = req.body;
    const result = await mssql.query`
      EXECUTE PROC_InsertUsuario ${nombre}, ${apellido}, ${curp}, ${edad}, ${genero}; 
    `;
    
    res.type('text').status(201).send(
      `Resource created`);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Api para ingresar UsuarioComedor
app.post('/InsertUsuarioComedor', async (req, res) => {
  try {
    const {idUsuario, idComedor, donativo} = req.body;
    const result = await mssql.query`
      EXECUTE PROC_InsertUsuarioComedor ${idUsuario}, ${idComedor}, ${donativo}; 
    `;
    
    res.type('text').status(201).send(
      `Resource created`);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Api para insertar Anuncios
app.post('/insertarAnuncio', async (req, res) => {
  try {
    const {idAdministrador, titulo, descripcion, estado} = req.body;
    const result = await mssql.query`
      PROC_InsertarAnuncio ${idAdministrador}, ${titulo}, ${descripcion}, ${estado}; 
    `;
    
    res.type('text').status(201).send(
      `Resource created`);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Api para insertar Comedores
app.post('/insertarComedor', async (req, res) => {
  try {
    const {idAdministrador,nombre, direccion, telefono, estatus} = req.body;
    const result = await mssql.query`
      PROC_InsertComedor ${idAdministrador}, ${nombre}, ${direccion}, ${telefono}, ${estatus}; 
    `;
    
    res.type('text').status(201).send(
      `Resource created`);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Api para tener información de un comedor según su id
app.get('/comedor/:idComedor', async (req, res) => {
  try {
    const idComedor = req.params.idComedor;
    const rows = (await mssql.query`
        EXEC PROC_GetComedorById ${idComedor};
    `).recordset;
    const row = rows[0];
    if (row) {
      res.json({
        idComedor: row.idComedor,
        idAdministrador: row.idAdministrador,
        nombre: row.nombre,
        direccion: row.direccion,
        encargado: row.encargado,
        telefono: row.telefono,
        estatus: row.estatus
      });
    } else {
      res.type('text').status(401).send(
        `Invalid correo or password.\n`);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Api para tener usuario segun su curp
app.get('/usuarioCurp/:curp', async (req, res) => {
  try {
    const curp = req.params.curp;
    const rows = (await mssql.query`
        EXEC PROC_ObtenerUsuarioPorCURP ${curp};
    `).recordset;
    const row = rows[0];
    if (row) {
      res.json({
        idUsuario: row.idUsuario,
        nombre: row.nombre,
        apellido: row.apellido,
        curp: row.curp,
        edad: row.edad,
        genero: row.genero
      });
    } else {
      res.type('text').status(401).send(
        `Invalid correo or password.\n`);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// API para obtener los encargados por idComedor
app.get('/encargados/:idComedor', async (req, res) => {
  try {
    const idComedor = req.params.idComedor;
    const rows = (await mssql.query`
      EXEC PROC_GetEncargadosPorComedor ${idComedor};
    `).recordset;
    const result = [];
    for (let row of rows) {
      result.push({
        idEncargado: row.idEncargado,
        Nombre: row.nombre,
        telefono: row.telefono,
        contraseña: row.contraseña,
        idComedor: row.idComedor
      });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// API para obtener los usuarios por idComedor
app.get('/usuarios/:idComedor', async (req, res) => {
  try {
    const idComedor = req.params.idComedor;
    const rows = (await mssql.query`
      EXEC PROC_ObtenerUsuariosPorComedor ${idComedor};
    `).recordset;
    const result = [];
    for (let row of rows) {
      result.push({
        idUsuario: row.idUsuario,
        nombre: row.nombre,
        apellido: row.apellido,
        curp: row.curp,
        edad: row.edad,
        genero: row.genero
      });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// API para obtener los donativos y ventas normales por comedor
app.get('/donativoNormales/:idComedor', async (req, res) => {
  try {
    const idComedor = req.params.idComedor;
    const rows = (await mssql.query`
      EXEC PROC_CantidadDonativosPorComedor ${idComedor};
    `).recordset;
    const result = [];
    for (let row of rows) {
      result.push({
        idComedor: row.idComedor,
        NombreComedor: row.NombreComedor,
        TotalDonativos: row.TotalDonativos,
        TotalNormales: row.TotalNormales,
        Dia: row.Dia
      });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Api para insertar Comedores
app.post('/insertarProductoInventario', async (req, res) => {
  try {
    const {idComedor, producto, cantidad, unidadmedida} = req.body;
    const result = await mssql.query`
      EXEC PROC_InsertarInventario ${idComedor}, ${producto}, ${cantidad}, ${unidadmedida}; 
    `;
    
    res.type('text').status(201).send(
      'Resource created');
  } catch (err) {
    res.status(500).json(err);
  }
});

// API Para Insertar los productos del inventario que da el DIF
app.post('/LlegoInventario', async (req, res) => {
  try {
    const {idComedor} = req.body;
    const result = await mssql.query`
      EXEC PROC_LlegoInventario ${idComedor}; 
    `;
    
    res.type('text').status(201).send(
      'Resource created');
  } catch (err) {
    res.status(500).json(err);
  }
});


// API para obtener los datos de los inventarios
app.get('/obtenerInventario', async (req, res) => {
  try {
    const rows = (await mssql.query`
      EXEC PROC_MostrarInventario;
    `).recordset;
    const result = [];
    for (let row of rows) {
      result.push({
        idComedor: row.idComedor,
        idProducto: row.idProducto,
        producto: row.producto,
        cantidad: row.cantidad,
        unidadmedida: row.unidadmedida
      });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// API para obtener los datos de inventario por comedor
app.get('/inventarioByComedor/:idComedor', async (req, res) => {
  try {
    const idComedor = req.params.idComedor;
    const rows = (await mssql.query`
      EXEC PROC_GetInventarioPorComedor ${idComedor};
    `).recordset;
    const result = [];
    for (let row of rows) {
      result.push({
        idProducto: row.idProducto,
        idComedor: row.idComedor,
        producto: row.producto,
        cantidad: row.cantidad,
        unidadmedida: row.unidadmedida
      });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});


// Endpoint para actualizar el título, descripción y estado de un anuncio
app.put('/actualizarAnuncio/:idAnuncio', async (req, res) => {
    try {
        const { idAnuncio } = req.params;
        const { nuevoTitulo, nuevaDescripcion, nuevoEstatus } = req.body;

        // Verifica si se proporcionaron todos los campos necesarios
        if (!nuevoTitulo || !nuevaDescripcion || !nuevoEstatus) {
            return res.status(400).json({ error: 'Se requiere proporcionar un nuevo título, descripción y estado.' });
        }

        // Realiza la actualización en la base de datos
        await mssql.query`
            EXEC ActualizarAnuncio ${idAnuncio}, ${nuevoTitulo}, ${nuevaDescripcion}, ${nuevoEstatus};
        `;

        res.json({ message: 'Anuncio actualizado exitosamente.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// Endpoint para actualizar un Comedor
app.put('/actualizarComedor/:idComedor', async (req, res) => {
    try {
        const { idComedor } = req.params;
        const { nombre, direccion, telefono, estatus } = req.body;

        // Verifica si se proporcionaron todos los campos necesarios
        if ( !nombre || !direccion || !telefono || !estatus) {
            return res.status(400).json({ error: 'Se requiere proporcionar todos los campos para actualizar el comedor.' });
        }

        // Realiza la actualización en la base de datos
        await mssql.query`
            EXEC ActualizarComedor ${idComedor}, ${nombre}, ${direccion}, ${telefono}, ${estatus};
        `;

        res.json({ message: 'Comedor actualizado exitosamente.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// Endpoint para actualizar un Encargado
app.put('/actualizarEncargado/:idEncargado', async (req, res) => {
    try {
        const { idEncargado } = req.params;
        const { nuevoNombre, nuevoTelefono } = req.body;

        // Verifica si se proporcionaron todos los campos necesarios
        if ( !nuevoNombre || !nuevoTelefono) {
            return res.status(400).json({ error: 'Se requiere proporcionar todos los campos para actualizar el encargado.' });
        }

        // Realiza la actualización en la base de datos
        await mssql.query`
            EXEC PROC_ActualizarEncargado ${idEncargado}, ${nuevoNombre}, ${nuevoTelefono};
        `;

        res.json({ message: 'Encargado actualizado exitosamente.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

app.delete('/eliminarAnuncio/:idAnuncio', async (req, res) => {
  try {
    const {idAnuncio} = req.params;
    const result = await mssql.query`
      EXEC PROC_EliminarAnuncio ${idAnuncio};
    `;
    if (result.rowsAffected[0] === 1) {
      res.type('text').send(`Resource with ID = ${idAnuncio} deleted.\n`);
    } else {
      res.type('text').status(404).send(
        `Resource with ID = ${idAnuncio} not found. No resources deleted.\n`);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Endpoint para sumar producto
app.put('/inventario/sumar/:idProducto', async (req, res) => {
    try {
        const { idProducto } = req.params;

        await mssql.query`
            EXEC PROC_SumarCantidad ${idProducto};
        `;

        res.json({ message: 'Cantidad sumada exitosamente.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// Endpoint para restar producto
app.put('/inventario/restar/:idProducto', async (req, res) => {
    try {
        const { idProducto } = req.params;

        await mssql.query`
            EXEC PROC_RestarCantidad ${idProducto};
        `;

        res.json({ message: 'Cantidad restada exitosamente.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// Endpoint para eliminar producto
app.delete('/inventario/eliminar/:idProducto', async (req, res) => {
    try {
        const { idProducto } = req.params;

        const result = await mssql.query`
            EXEC PROC_EliminarProducto ${idProducto};
        `;

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }

        res.json({ message: 'Producto eliminado exitosamente.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// API para obtener consumidores del día hoy 
app.get('/cantidadUsuarioComedor/:idComedor', async (req, res) => {
  try {
    const { idComedor } = req.params;
    const rows = (await mssql.query`
      EXEC PROC_ContarUsuariosComedor ${idComedor};
    `).recordset;
    const row =rows [0]; 
    res.json({
      cantidadUsuarios: row.cantidadUsuarios
      });
    }catch (err) {
    res.status(500).json(err);
  }
});

// API para insertar Encuestas
app.post('/insertarEncuesta', async (req, res) => {
  try {
    const { idComedor, higiene, atencion, comida, comentario } = req.body;
    const result = await mssql.query`
      EXEC PROC_InsertEncuesta ${idComedor}, ${higiene}, ${atencion}, ${comida}, ${comentario}; 
    `;
    
    res.type('text').status(201).send('Encuesta creada');
  } catch (err) {
    res.status(500).json(err);
  }
});

// API para obtener promedio de encuesta
app.get('/promedios/:idComedor', async (req, res) => {
  try {
    const { idComedor } = req.params;
    const rows = (await mssql.query`
      EXEC PROC_PromedioEncuestaPorComedor ${idComedor};
    `).recordset;
    const row =rows [0]; 
    res.json({
      idComedor: row.idComedor,
      PromedioHigiene: row.PromedioHigiene,
      PromedioAtencion: row.PromedioAtencion,
      PromedioComida: row.PromedioComida,
      cantidadEncuestas: row.cantidadEncuestas
      });
    }catch (err) {
    res.status(500).json(err);
  }
});

// Endpoint para actualizar un estatus de Comedor
app.put('/actualizarEstatusComedor/:idComedor', async (req, res) => {
    try {
        const { idComedor } = req.params;
        const { newStatus} = req.body;

        // Verifica si se proporcionaron todos los campos necesarios
        if ( !newStatus) {
            return res.status(400).json({ error: 'Se requiere proporcionar todos los campos para actualizar el encargado.' });
        }

        // Realiza la actualización en la base de datos
        await mssql.query`
            EXEC PROC_ActualizarEstatusComedor ${idComedor}, ${newStatus};
        `;

        res.json({ message: 'Estatus del comedor actualizado exitosamente.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// custom 404 page
app.use((req, res) => {
  res.type('text/plain').status(404).send('404 - Not Found');
});

app.listen(port, () => console.log(
  `Express started on http://${ipAddr}:${port}`
  + '\nPress Ctrl-C to terminate.'));