Use master;
GO

--Equipo 1 
--Marco Antonio Caudillo Morales
--Adolfo Sebastián Gonzalez Mora
--Jorge Daniel Rea Prado
--Oswaldo Daniel

--Creación de la base de datos

IF EXISTS (SELECT 1 FROM sys.databases WHERE [name] = 'Proyecto_DIF')
BEGIN
    ALTER DATABASE Proyecto_DIF SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE Proyecto_DIF;
    --Sólo si la base de datos marca error porque está siendo ocupada
END;

DROP DATABASE IF EXISTS Proyecto_DIF;
CREATE DATABASE Proyecto_DIF;
GO

Use Proyecto_DIF;

--Creación de Tablas
--Tabla Usuario
DROP TABLE IF EXISTS Usuario;
CREATE TABLE Usuario(
    idUsuario INT PRIMARY KEY IDENTITY(1,1), 
    nombre NVARCHAR(255) NOT NULL,
    apellido NVARCHAR(255) NOT NULL,
    curp NVARCHAR(255) UNIQUE,
    edad INT NOT NULL,
    genero NVARCHAR(2) NOT NULL
);

--Tabla Administrador
DROP TABLE IF EXISTS Administrador;
CREATE TABLE Administrador(
    idAdministrador INT PRIMARY KEY IDENTITY(1,1), 
    nombre NVARCHAR(255) NOT NULL,
    apellido NVARCHAR(255) NOT NULL,
    correo NVARCHAR(255) NOT NULL UNIQUE,
    contraseña NVARCHAR(255) NOT NULL
);


--Tabla Comedor
DROP TABLE IF EXISTS Comedor;
CREATE TABLE Comedor(
    idComedor INT PRIMARY KEY IDENTITY(1,1),
    idAdministrador INT NOT NULL,
    CONSTRAINT FK_Comedor_Administrador FOREIGN KEY (idAdministrador)
    REFERENCES Administrador(idAdministrador)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION,

    nombre NVARCHAR(255) NOT NULL,
    direccion NVARCHAR(255) NOT NULL,
    telefono NVARCHAR(255) NOT NULL,
    estatus NVARCHAR(255) NOT NULL
);

--Tabla Encargado
DROP TABLE IF EXISTS Encargado;
CREATE TABLE Encargado(
    idEncargado INT PRIMARY KEY IDENTITY(1,1), 
    nombre NVARCHAR(255) NOT NULL,
    telefono NVARCHAR(255) NOT NULL UNIQUE,
    contraseña NVARCHAR(255) NOT NULL,

    idComedor INT NOT NULL,
    CONSTRAINT FK_Encargado_Comedor FOREIGN KEY (idComedor)
    REFERENCES Comedor(idComedor)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
);



--Tabla Usuario Comedor
DROP TABLE IF EXISTS UsuarioComedor;
CREATE TABLE UsuarioComedor(
    idUsuario INT,
    CONSTRAINT FK_UsuarioComedor_Usuario FOREIGN KEY (idUsuario)
    REFERENCES Usuario(idUsuario)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION,

    idComedor INT,
    CONSTRAINT FK_UsuarioComedor_Comedor FOREIGN KEY (idComedor)
    REFERENCES Comedor(idComedor)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION,

    fecha DATETIME CONSTRAINT DF_Fecha DEFAULT GETDATE(),
    donativo BIT DEFAULT 0
);
GO

-- Creación de la tabla Anuncios
DROP TABLE IF EXISTS Anuncios;
CREATE TABLE Anuncios(
    idAnuncio INT PRIMARY KEY IDENTITY(1,1),
    idAdministrador INT NOT NULL,
    CONSTRAINT FK_Anuncios_Administrador FOREIGN KEY (idAdministrador)
    REFERENCES Administrador(idAdministrador)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION,

    titulo NVARCHAR(255) NOT NULL,
    descripcion NVARCHAR(MAX) NOT NULL,
    fechaPublicacion DATETIME CONSTRAINT DF_FechaPublicacion DEFAULT GETDATE(),
    estado NVARCHAR(255) NOT NULL
);
GO

--Tabla inventario
DROP TABLE IF EXISTS Inventario;
CREATE TABLE Inventario(
    idProducto INT PRIMARY KEY IDENTITY(1,1),
    idComedor INT NOT NULL,
    CONSTRAINT fk_Inventario_Comedor FOREIGN KEY (idComedor)
    REFERENCES Comedor(idComedor)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION,
    
    producto NVARCHAR(255) NOT NULL,
    cantidad INT NOT NULL,
    unidadmedida NVARCHAR(50) DEFAULT 'PIEZA(S)' NOT NULL
);
GO

--Tabla Encuesta
DROP TABLE IF EXISTS Encuesta;
CREATE TABLE Encuesta(
    idEncuesta INT PRIMARY KEY IDENTITY(1,1),
    idComedor INT NOT NULL,
    CONSTRAINT fk_Encuesta_Comedor FOREIGN KEY (idComedor)
    REFERENCES Comedor(idComedor)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION,
    
    higiene INT NOT NULL,
    atencion INT NOT NULL,
    comida INT NOT NULL,
    comentario NVARCHAR(255) DEFAULT 'Sin Comentarios'
);
GO


--Inicio de Triggers
--Trigger de Ingreso de Administradores
CREATE OR ALTER TRIGGER TRG_Administrador_INSERT
ON Administrador
INSTEAD OF INSERT
AS
BEGIN
    DECLARE @nombre AS NVARCHAR(255);
    DECLARE @apellido AS NVARCHAR(255);
    DECLARE @correo AS NVARCHAR(255); 
    DECLARE @contraseña AS NVARCHAR(255);

	SELECT @nombre = (SELECT nombre FROM inserted);
    SELECT @apellido = (SELECT apellido FROM inserted);
    SELECT @correo = (SELECT correo FROM inserted);
    SELECT @contraseña = (SELECT contraseña FROM inserted);

	DECLARE @Salt AS VARCHAR(16);
	SELECT @Salt = CONVERT(VARCHAR(16), CRYPT_GEN_RANDOM(8), 2);

	DECLARE @HashedPassword AS VARCHAR(80);
	SELECT @HashedPassword = @Salt + CONVERT(VARCHAR(64), HASHBYTES('SHA2_256', @Salt + @contraseña), 2);
	
	INSERT INTO Administrador (nombre,apellido, correo, contraseña) VALUES
	(@nombre, @apellido, @correo, @HashedPassword);
END;
GO

--Trigger de Ingreso de Encargados
CREATE OR ALTER TRIGGER TRG_Encargado_INSERT
ON Encargado
INSTEAD OF INSERT
AS
BEGIN
    DECLARE @nombre AS NVARCHAR(255);
    DECLARE @telefono AS NVARCHAR(255); 
    DECLARE @contraseña AS NVARCHAR(255);
    DECLARE @idComedor AS INT;

    SELECT @nombre = (SELECT nombre FROM inserted);
    SELECT @telefono = (SELECT telefono FROM inserted);
    SELECT @contraseña = (SELECT contraseña FROM inserted);
    SELECT @idComedor = (SELECT idComedor FROM inserted);

	DECLARE @Salt AS VARCHAR(16);
	SELECT @Salt = CONVERT(VARCHAR(16), CRYPT_GEN_RANDOM(8), 2);

	DECLARE @HashedPassword AS VARCHAR(80);
	SELECT @HashedPassword = @Salt + CONVERT(VARCHAR(64), HASHBYTES('SHA2_256', @Salt + @contraseña), 2);
	
	INSERT INTO Encargado (nombre, telefono, contraseña, idComedor) VALUES
	(@nombre, @telefono, @HashedPassword, @idComedor);
END;
GO

--Trigger de eliminación de usuarios
CREATE OR ALTER TRIGGER TRG_Usuario_DELETE
ON Usuario
INSTEAD OF DELETE
AS
BEGIN
	DECLARE @variable AS INT;
	SELECT @variable = (SELECT idUsuario FROM deleted);
	DELETE FROM UsuarioComedor WHERE idUsuario = @variable;
	DELETE FROM [Usuario] WHERE idUsuario = @variable;
END;
GO

--Trigger de eliminación de Comedores
CREATE OR ALTER TRIGGER TRG_Comedor_DELETE
ON Comedor
INSTEAD OF DELETE
AS
BEGIN
	DECLARE @variable AS INT;
	SELECT @variable = (SELECT idComedor FROM deleted);
	DELETE FROM UsuarioComedor WHERE idComedor = @variable;
	DELETE FROM [Comedor] WHERE idComedor = @variable;
END;
GO

--Trigger de eliminación de Encargados
CREATE OR ALTER TRIGGER TRG_Encargado_DELETE
ON Encargado
INSTEAD OF DELETE
AS
BEGIN
	DECLARE @variable AS INT;
	SELECT @variable = (SELECT idEncargado FROM deleted);
	DELETE FROM Encargado WHERE idEncargado = @variable;
END;
GO

--Inicio de Stored Procedures
--Stored Procedure Insertar Usuario
CREATE OR ALTER PROCEDURE PROC_InsertUsuario
    @nombre AS NVARCHAR(255),
    @apellido AS NVARCHAR(255),
    @curp AS NVARCHAR(255),
    @edad AS INT,
    @genero AS NVARCHAR(2)
AS
BEGIN
	INSERT INTO Usuario (nombre,apellido,curp,edad, genero) 
    VALUES (@nombre, @apellido, @curp, @edad, @genero)
END;
GO

--Stored Procedure Insertar Administrador
CREATE OR ALTER PROCEDURE PROC_InsertAdministrador
    @nombre AS VARCHAR(255),
    @apellido AS VARCHAR(255),
    @correo AS VARCHAR(255),
    @contraseña AS INT
AS
BEGIN
	INSERT INTO Administrador (nombre,apellido,correo, contraseña) 
    VALUES (@nombre, @apellido, @correo, @contraseña)
END;
GO


--Stored Procedure Insertar Comedor
CREATE PROCEDURE PROC_InsertComedor
    @idAdministrador AS INT,
    @nombre AS NVARCHAR(255),
    @direccion AS NVARCHAR(255),
    @telefono AS NVARCHAR(255),
    @estatus AS NVARCHAR(255)
AS
BEGIN
    INSERT INTO Comedor (idAdministrador,nombre, direccion, telefono, estatus)
    VALUES (@idAdministrador,@nombre, @direccion, @telefono, @estatus)
END;
GO

--Stored Procedure Insertar Encargado
CREATE PROCEDURE PROC_InsertEncargado
    @nombre NVARCHAR(255),
    @telefono NVARCHAR(255),
    @contraseña NVARCHAR(255),
    @idComedor INT
AS
BEGIN
    INSERT INTO Encargado (nombre, telefono, contraseña, idComedor)
    VALUES (@nombre, @telefono, @contraseña, @idComedor)
END;
GO

--Stored Procedure Insertar UsuarioComedor
CREATE PROCEDURE PROC_InsertUsuarioComedor
    @idUsuario INT,
    @idComedor NVARCHAR(255),
    @donativo BIT
AS
BEGIN
    INSERT INTO UsuarioComedor (idUsuario, idComedor, donativo)
    VALUES (@idUsuario, @idComedor,@donativo)
END;
GO

--Stores Procedure para agregar anuncios
CREATE OR ALTER PROCEDURE PROC_InsertarAnuncio
    @idAdministrador INT,
    @titulo NVARCHAR(255),
    @descripcion NVARCHAR(1000),
    @estado NVARCHAR(255)
AS
BEGIN
    INSERT INTO Anuncios (idAdministrador, titulo, descripcion, estado)
    VALUES (@idAdministrador, @titulo, @descripcion, @estado);
END;
GO

CREATE PROCEDURE PROC_InsertarInventario
    @idComedor INT,
    @producto NVARCHAR(255),
    @cantidad INT,
    @unidadmedida NVARCHAR(50)
AS
BEGIN
    INSERT INTO Inventario (idComedor, producto, cantidad, unidadmedida)
    VALUES (@idComedor, @producto, @cantidad, @unidadmedida);
END;
GO

-- Stored procedure InsertarProductoInventario
CREATE OR ALTER PROCEDURE PROC_InsertarInventario
    @idComedor INT,
    @Producto NVARCHAR(255),
    @cantidad FLOAT,
    @unidadmedida NVARCHAR(50)
AS
BEGIN
    -- Convertir el producto a mayúsculas
    SET @Producto = UPPER(@Producto);

    -- Verificar si el producto ya existe en el inventario
    DECLARE @productoExistente INT;
    SELECT @productoExistente = COUNT(*) FROM Inventario WHERE producto = @Producto AND idComedor = @idComedor;

    IF @productoExistente > 0
    BEGIN
        -- Si el producto existe, sumar la cantidad
        UPDATE Inventario
        SET cantidad = cantidad + @cantidad
        WHERE producto = @Producto AND idComedor = @idComedor;
    END
    ELSE
    BEGIN
        -- Si el producto no existe, insertarlo
        INSERT INTO Inventario (idComedor, producto, cantidad, unidadmedida)
        VALUES (@idComedor, @Producto, @cantidad, @unidadmedida);
    END;
END;
GO

CREATE PROCEDURE PROC_InsertEncuesta
    @idComedor INT,
    @higiene INT,
    @atencion INT,
    @comida INT,
    @comentario NVARCHAR(MAX) = 'Sin Comentarios'
AS
BEGIN
    INSERT INTO Encuesta (idComedor, higiene, atencion, comida, comentario)
    VALUES (@idComedor, @higiene, @atencion, @comida, @comentario)
END
GO


--Stored procedure LLegoInventario
CREATE OR ALTER PROCEDURE PROC_LlegoInventario
    @idComedor INT 
AS
BEGIN
    -- Actualizar o insertar productos en la tabla Inventario
    MERGE INTO Inventario AS Target
    USING (
        VALUES
            (@idComedor, 'ACEITE VEGETAL', 40, 'Lt'),
            (@idComedor, 'ARROZ SUPER EXTRA', 60, 'Kg'),
            (@idComedor, 'ATUN EN AGUA', 192, 'Pieza(s)'),
            (@idComedor, 'AZUCAR ESTANDAR', 50, 'Kg'),
            (@idComedor, 'CAFE MOLIDO', 6, 'Pieza(s)'),
            (@idComedor, 'CHICHAROS Y ZANAHORIAS', 72, 'Pieza(s)'),
            (@idComedor, 'CHILE CHIPOTLE ADOBADO', 5.6, 'Kg'),
            (@idComedor, 'CHILE GUAJILLO', 2, 'Pieza(s)'),
            (@idComedor, 'CHILE JALAPEÑO EN RAJAS', 12, 'Pieza(s)'),
            (@idComedor, 'CONCENTRADO PARA AGUA DE SABOR', 12, 'Pieza(s)'),
            (@idComedor, 'CONSOME DE POLLO', 7, 'Kg'),
            (@idComedor, 'ELOTE EN LATA', 72, 'Pieza(s)'),
            (@idComedor, 'FRIJOL REFRITO', 168, 'Pieza(s)'),
            (@idComedor, 'GALLETAS SALADAS', 1440, 'Paquete(s)'),
            (@idComedor, 'HARINA DE MAIZ', 10, 'Kg'),
            (@idComedor, 'HUEVO', 360, 'Pieza(s)'),
            (@idComedor, 'LECHE SEMIDESCREMADA DESLACTOSADA', 66, 'Lt'),
            (@idComedor, 'LENTEJA', 30, 'Pieza(s)'),
            (@idComedor, 'ADEREZO MAYONESA', 5.6, 'Kg'),
            (@idComedor, 'PASTA PARA SOPA CORTA', 200, 'Pieza(s)'),
            (@idComedor, 'PASTA TIPO SPAGUETTI', 100, 'Pieza(s)'),
            (@idComedor, 'SAL', 8, 'Kg'),
            (@idComedor, 'SARDINA EN TOMATE', 24, 'Pieza(s)'),
            (@idComedor, 'GARBANZO', 10, 'Pieza(s)'),
            (@idComedor, 'PURE DE TOMATE', 12, 'Kg')
    ) AS Source (idComedor, producto, cantidad, unidadmedida)
    ON Target.idComedor = Source.idComedor AND Target.producto = Source.producto
    WHEN MATCHED THEN
        UPDATE SET Target.cantidad = Target.cantidad + Source.cantidad
    WHEN NOT MATCHED THEN
        INSERT (idComedor, producto, cantidad, unidadmedida)
        VALUES (Source.idComedor, Source.producto, Source.cantidad, Source.unidadmedida);
END;
GO

--Stored procedure de mostrar inventario por comedor
CREATE PROCEDURE PROC_GetInventarioPorComedor
    @idComedor INT
AS
BEGIN
    -- Selecciona los productos del inventario para el comedor especificado
    SELECT idProducto,producto, cantidad, unidadmedida
    FROM Inventario
    WHERE idComedor = @idComedor;
END;
GO

--Stored procedure de login
CREATE OR ALTER PROCEDURE PROC_LoginAdministrador
    @correo NVARCHAR(255),
    @contraseña NVARCHAR(255)
AS
BEGIN
    DECLARE @StoredPassword AS VARCHAR(80);
    SELECT @StoredPassword = contraseña FROM Administrador WHERE correo = @correo;

    DECLARE @Salt AS VARCHAR(16);
    SELECT @Salt = SUBSTRING(@StoredPassword, 1, 16);

    DECLARE @HashedPassword AS VARCHAR(80);
    SELECT @HashedPassword = @Salt + CONVERT(VARCHAR(64), HASHBYTES('SHA2_256', @Salt + @contraseña), 2);

    SELECT a.idAdministrador,a.correo, @HashedPassword AS Contraseña_Login, @StoredPassword AS Contraseña_Guardada, 
    (CASE WHEN @HashedPassword = @StoredPassword THEN 'TRUE' ELSE 'FALSE' END) AS Exitoso
    FROM Administrador a
    WHERE a.contraseña = @StoredPassword;
END;
GO

--Login Encargado
CREATE OR ALTER PROCEDURE PROC_LoginEncargado
    @telefono NVARCHAR(255),
    @contraseña NVARCHAR(255)
AS
BEGIN
    DECLARE @StoredPassword AS VARCHAR(80);
    SELECT @StoredPassword = contraseña FROM Encargado WHERE telefono = @telefono;

    DECLARE @Salt AS VARCHAR(16);
    SELECT @Salt = SUBSTRING(@StoredPassword, 1, 16);

    DECLARE @HashedPassword AS VARCHAR(80);
    SELECT @HashedPassword = @Salt + CONVERT(VARCHAR(64), HASHBYTES('SHA2_256', @Salt + @contraseña), 2);

    SELECT e.idEncargado, e.idComedor,e.telefono, @HashedPassword AS Contraseña_Login, @StoredPassword AS Contraseña_Guardada, 
    (CASE WHEN @HashedPassword = @StoredPassword THEN 'TRUE' ELSE 'FALSE' END) AS Exitoso
    FROM Encargado e
    WHERE e.contraseña = @StoredPassword;
END;
GO

--Stored Procedure de Mostrar
CREATE OR ALTER PROCEDURE PROC_MostrarUsuarios
AS
BEGIN
    SELECT * FROM Usuario;
END;
GO

CREATE OR ALTER PROCEDURE PROC_MostrarEncargados
AS
BEGIN
    SELECT * FROM Encargado;
END;
GO

CREATE OR ALTER PROCEDURE PROC_MostrarAdministradores
AS
BEGIN
    SELECT * FROM Administrador;
END;
GO

CREATE OR ALTER PROCEDURE PROC_MostrarComedores
AS
BEGIN
    SELECT * FROM Comedor;
END;
GO


CREATE OR ALTER PROCEDURE PROC_MostrarUsuarioComedor
AS
BEGIN
    SELECT * FROM UsuarioComedor;
END;
GO

CREATE OR ALTER PROCEDURE PROC_MostrarAnuncios
AS
BEGIN
    SELECT * FROM Anuncios;
END;
GO

CREATE OR ALTER PROCEDURE PROC_MostrarEncuesta
AS
BEGIN
    SELECT * FROM Encuesta;
END;
GO

CREATE OR ALTER PROCEDURE PROC_MostrarDatosAdmin
    @idAdministrador INT
AS
BEGIN
    SELECT * FROM Administrador WHERE idAdministrador = @idAdministrador;
END;
GO

CREATE PROCEDURE PROC_UsuariosHoy 
AS
BEGIN
    SELECT COUNT(DISTINCT idUsuario) as TotalUsuariosHoy
    FROM UsuarioComedor
    WHERE CONVERT(DATE, Fecha) = CONVERT(DATE, GETDATE());
END;
GO

CREATE OR ALTER PROCEDURE PROC_CountDonativos
AS
BEGIN
    SELECT 
        SUM(CASE WHEN donativo = 1 THEN 1 ELSE 0 END) AS Donativo,
        SUM(CASE WHEN donativo = 0 THEN 1 ELSE 0 END) AS Normal
    FROM UsuarioComedor;
END;
GO

CREATE OR ALTER PROCEDURE PROC_SumNormalTimes13
AS
BEGIN
    DECLARE @CountNormal INT;

    -- Contar registros donde donativo es 0 (normal)
    SELECT @CountNormal = COUNT(*)
    FROM UsuarioComedor
    WHERE donativo = 0;

    -- Multiplicar el conteo por 13 y desplegar el resultado
    SELECT @CountNormal * 13 AS Resultado;
END;
GO

CREATE OR ALTER PROCEDURE PROC_SumComedoresActivosInactivos
AS
BEGIN
    -- Declarar variables para contar
    DECLARE @CountActivos INT;
    DECLARE @CountInactivos INT;

    -- Contar registros donde estado es 'activo'
    SELECT @CountActivos = COUNT(*)
    FROM Comedor
    WHERE estatus = 'activo';

    -- Contar registros donde estado es 'inactivo'
    SELECT @CountInactivos = COUNT(*)
    FROM Comedor
    WHERE estatus = 'inactivo';

    -- Desplegar el resultado
    SELECT @CountActivos AS ComedoresActivos, @CountInactivos AS ComedoresInactivos;
END;
GO

CREATE OR ALTER PROCEDURE PROC_VentasDonativosPorComedor
AS
BEGIN
    SELECT 
        co.idComedor, 
        co.nombre AS nombre,
        co.estatus AS estatus, -- Aquí agregamos el estatus del comedor
        ISNULL(SUM(CASE WHEN uc.donativo = 0 THEN 1 ELSE 0 END), 0) AS normal,
        ISNULL(SUM(CASE WHEN uc.donativo = 1 THEN 1 ELSE 0 END), 0) AS donativo
    FROM 
        Comedor co
    LEFT JOIN 
        UsuarioComedor uc ON co.idComedor = uc.idComedor
    GROUP BY 
        co.idComedor, 
        co.nombre,
        co.estatus; -- Aquí agregamos el estatus en el GROUP BY
END;
GO



CREATE OR ALTER PROCEDURE PROC_MostrarAnunciosActivos
AS
BEGIN
    SELECT 
        idAnuncio,
        idAdministrador,
        titulo,
        descripcion,
        fechaPublicacion,
        estado
    FROM 
        Anuncios
    WHERE 
        estado = 'Activo';
END;
GO

CREATE OR ALTER PROCEDURE PROC_GetComedorById
    @IdComedor INT
AS
BEGIN
    SELECT *
    FROM Comedor
    WHERE idComedor = @IdComedor;
END;
GO

CREATE OR ALTER PROCEDURE PROC_GetEncargadosPorComedor
    @IdComedor INT
AS
BEGIN
    SELECT *
    FROM Encargado
    WHERE idComedor = @IdComedor;
END;
GO

-- Creación del Stored Procedure
CREATE OR ALTER PROCEDURE PROC_ObtenerUsuariosPorComedor
    @idComedor INT
AS
BEGIN
    -- Obtener información de los usuarios que pertenecen al comedor especificado, sin duplicados
    SELECT DISTINCT 
        U.idUsuario,
        U.nombre,
        U.apellido,
        U.curp,
        U.edad,
        U.genero
    FROM 
        UsuarioComedor UC
    JOIN 
        Usuario U ON UC.idUsuario = U.idUsuario
    WHERE 
        UC.idComedor = @idComedor;
END;
GO


-- Creación del Stored Procedure
CREATE OR ALTER PROCEDURE PROC_CantidadDonativosPorComedor
    @idComedor INT
AS
BEGIN
    -- Asegurándonos de que la consulta no esté bloqueada por otras operaciones
    SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

    -- Obteniendo el conteo de donativos y no donativos por comedor y por día
    SELECT 
        UC.idComedor,
        C.nombre AS NombreComedor,
        CAST(UC.fecha AS DATE) AS Dia,  -- Considerando solo la fecha, no la hora
        SUM(CASE WHEN UC.donativo = 1 THEN 1 ELSE 0 END) AS TotalDonativos,
        SUM(CASE WHEN UC.donativo = 0 THEN 1 ELSE 0 END) AS TotalNormales
    FROM 
        UsuarioComedor UC
    JOIN 
        Comedor C ON UC.idComedor = C.idComedor
    WHERE
        UC.idComedor = @idComedor  -- Filtrando por el idComedor proporcionado
    GROUP BY 
        UC.idComedor, C.nombre, CAST(UC.fecha AS DATE)  -- Agrupando también por fecha
    ORDER BY 
        Dia DESC;  -- Ordenando por fecha de manera descendente
END;
GO

CREATE PROCEDURE ActualizarAnuncio
    @idAnuncio INT,
    @nuevoTitulo NVARCHAR(255),
    @nuevaDescripcion NVARCHAR(255),
    @nuevoEstatus NVARCHAR(255)
AS
BEGIN
    UPDATE Anuncios
    SET 
        titulo = @nuevoTitulo,
        descripcion = @nuevaDescripcion,
        estado = @nuevoEstatus
    WHERE idAnuncio = @idAnuncio;
END;
GO

CREATE PROCEDURE ActualizarComedor
    @idComedor INT,
    @nombre NVARCHAR(255),
    @direccion NVARCHAR(255),
    @telefono NVARCHAR(255),
    @estatus NVARCHAR(255)
AS
BEGIN
    UPDATE Comedor
    SET 
        nombre = @nombre,
        direccion = @direccion,
        telefono = @telefono,
        estatus = @estatus
    WHERE idComedor = @idComedor;
END;
GO

CREATE PROCEDURE ActualizarEncargado
    @idEncargado INT,
    @nombre NVARCHAR(255),
    @telefono NVARCHAR(255)
AS
BEGIN
    UPDATE Encargado
    SET 
        nombre = @nombre,
        telefono = @telefono
    WHERE idEncargado = @idEncargado;
END;
GO

CREATE PROCEDURE PROC_ObtenerUsuarioPorCURP
    @curp NVARCHAR(255)
AS
BEGIN
    SELECT 
        idUsuario, 
        nombre, 
        apellido, 
        curp, 
        edad, 
        genero
    FROM 
        Usuario
    WHERE 
        curp = @curp;
END;
GO

CREATE PROCEDURE PROC_EncargadoPorID
    @idEncargado INT
AS
BEGIN
    SELECT * FROM Encargado WHERE idEncargado = @idEncargado
END;
GO

-- Creación del Stored Procedure para actualizar nombre y teléfono de encargado
CREATE OR ALTER PROCEDURE PROC_ActualizarEncargado
    @idEncargado INT,
    @nuevoNombre NVARCHAR(255),
    @nuevoTelefono NVARCHAR(50)
AS
BEGIN
    -- Actualiza el nombre y teléfono del encargado basado en el ID proporcionado
    UPDATE Encargado
    SET 
        nombre = @nuevoNombre,
        telefono = @nuevoTelefono
    WHERE 
        idEncargado = @idEncargado;
END;
GO

CREATE PROCEDURE PROC_EliminarAnuncio
    @idAnuncio INT
AS
BEGIN
    DELETE FROM Anuncios WHERE idAnuncio = @idAnuncio;
END
GO

CREATE PROCEDURE PROC_SumarCantidad
    @idProducto INT
AS
BEGIN
    UPDATE Inventario
    SET cantidad = cantidad + 1
    WHERE idProducto = @idProducto;
END;
GO

CREATE PROCEDURE PROC_RestarCantidad
    @idProducto INT
AS
BEGIN
    UPDATE Inventario
    SET cantidad = cantidad - 1
    WHERE idProducto = @idProducto
    AND cantidad > 0; -- Prevent Negative Inventory
END;
GO

CREATE PROCEDURE PROC_EliminarProducto
    @idProducto INT
AS
BEGIN
    DELETE FROM Inventario
    WHERE idProducto = @idProducto;
END;
GO

--Stored Procedure Contar UsuariosComedor por idComedor
CREATE PROCEDURE PROC_ContarUsuariosComedor
    @idComedor INT
AS
BEGIN
    SELECT COUNT(DISTINCT idUsuario) as cantidadUsuarios
    FROM UsuarioComedor
    WHERE idComedor = @idComedor;
END;
GO

CREATE PROCEDURE PROC_MostrarEncuestaComedor
    @idComedor INT
AS
BEGIN
    SELECT * FROM Encuesta WHERE idComedor = @idComedor
END;
GO

CREATE OR ALTER PROCEDURE PROC_PromedioEncuestaPorComedor
    @idComedor INT
AS
BEGIN
    SELECT 
        idComedor,
        AVG(higiene) * 20 AS PromedioHigiene,
        AVG(atencion) * 20 AS PromedioAtencion,
        AVG(comida) * 20 AS PromedioComida,
        COUNT(idEncuesta) AS cantidadEncuestas
    FROM 
        Encuesta
    WHERE
        idComedor = @idComedor
    GROUP BY 
        idComedor;
END;
GO

CREATE PROCEDURE PROC_ActualizarEstatusComedor
    -- Parámetros para el stored procedure
    @idComedor INT,
    @newStatus NVARCHAR(255)
AS
BEGIN
    -- Evita que se muestren mensajes no deseados
    SET NOCOUNT ON;

    -- Actualiza el estatus del comedor
    UPDATE Comedor
    SET estatus = @newStatus
    WHERE idComedor = @idComedor;

END
GO

CREATE PROCEDURE PROC_ContarUsuariosPorComedor
    @idComedor INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Contar las ventas normales y multiplicar por 13
    SELECT COUNT(*) * 13 AS ventasTotales
    FROM UsuarioComedor
    WHERE idComedor = @idComedor AND donativo = 0;

END;
GO

CREATE PROCEDURE PROC_PromedioVentasPorDia
    @idComedor INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Contar las ventas normales
    DECLARE @VentasNormales INT;
    SELECT @VentasNormales = COUNT(*)
    FROM UsuarioComedor
    WHERE idComedor = @idComedor AND donativo = 0;

    -- Contar el total de usuarios del comedor
    DECLARE @TotalUsuarios INT;
    SELECT @TotalUsuarios = COUNT(idUsuario)
    FROM UsuarioComedor
    WHERE idComedor = @idComedor;

    -- Calcular el promedio y multiplicarlo por 13
    SELECT ROUND(CAST(@VentasNormales AS FLOAT) / @TotalUsuarios * 13, 2) AS ResultadoPromedioVentasPorUsuario;


END;
GO

CREATE PROCEDURE PROC_VentasYDonativosPorComedor
    @idComedor INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Calcula las ventas normales (donativo = 0) multiplicadas por 13
    DECLARE @ventasNormales INT;
    SELECT @ventasNormales = COUNT(*) * 13 
    FROM UsuarioComedor 
    WHERE idComedor = @idComedor AND donativo = 0;

    -- Calcula los donativos (donativo = 1) multiplicados por 13
    DECLARE @donativos INT;
    SELECT @donativos = COUNT(*) * 13 
    FROM UsuarioComedor 
    WHERE idComedor = @idComedor AND donativo = 1;

    -- Devuelve los resultados en dos columnas
    SELECT @ventasNormales AS VentasNormales, @donativos AS Donativos;

END;
GO

CREATE PROCEDURE PROC_ContarUsuariosAsistentesComedor
    @idComedor INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Cuenta la cantidad de usuarios que han asistido al comedor
    SELECT COUNT(idUsuario) AS UsuariosAsistentes 
    FROM UsuarioComedor 
    WHERE idComedor = @idComedor;

END;
GO

CREATE PROCEDURE PROC_PromedioUsuariosPorDia
    @idComedor INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Cuenta la cantidad de usuarios que han asistido al comedor
    DECLARE @totalUsuarios INT;
    SELECT @totalUsuarios = COUNT( idUsuario) 
    FROM UsuarioComedor 
    WHERE idComedor = @idComedor;

    -- Cuenta la cantidad de días que ha estado operativo el comedor
    DECLARE @totalDias INT;
    SELECT @totalDias = COUNT(DISTINCT CONVERT(DATE, fecha))
    FROM UsuarioComedor
    WHERE idComedor = @idComedor;

    -- Calcula el promedio de usuarios por día
    DECLARE @promedio FLOAT;
    IF @totalDias = 0
        SET @promedio = 0;
    ELSE
        SET @promedio = CAST(@totalUsuarios AS FLOAT) / @totalDias;

    -- Devuelve el promedio
    SELECT @promedio AS PromedioUsuariosPorDia;

END;
GO


--Pruebas de Insertar Datos
EXEC PROC_InsertUsuario 
    @nombre = 'Juan',
    @apellido = 'Pérez',
    @curp = 'JUAN1234567890',
    @edad = 25,
    @genero = "M";
GO

-- Pruebas de Insertar Datos
EXEC PROC_InsertUsuario 
    @nombre = 'Ana',
    @apellido = 'Pérez',
    @curp = 'ANA1234567890',
    @edad = 28,
    @genero = 'F';
GO

-- Pruebas de Insertar Datos
EXEC PROC_InsertUsuario 
    @nombre = 'Pedro',
    @apellido = 'Sánchez',
    @curp = 'PEDRO9876543210',
    @edad = 35,
    @genero = 'M';
GO

-- Pruebas de Insertar Datos
EXEC PROC_InsertUsuario 
    @nombre = 'María',
    @apellido = 'Rodríguez',
    @curp = 'MARIA5678901234',
    @edad = 22,
    @genero = 'F';
GO

-- Pruebas de Insertar Datos
EXEC PROC_InsertUsuario 
    @nombre = 'Luis',
    @apellido = 'González',
    @curp = 'LUIS6789012345',
    @edad = 31,
    @genero = 'M';
GO

-- Pruebas de Insertar Datos
EXEC PROC_InsertUsuario 
    @nombre = 'Laura',
    @apellido = 'Martínez',
    @curp = 'LAURA3456789012',
    @edad = 27,
    @genero = 'F';
GO

-- Pruebas de Insertar Datos
EXEC PROC_InsertUsuario 
    @nombre = 'Carlos',
    @apellido = 'López',
    @curp = 'CARLOS2345678901',
    @edad = 29,
    @genero = 'M';
GO

-- Pruebas de Insertar Datos
EXEC PROC_InsertUsuario 
    @nombre = 'Sofia',
    @apellido = 'Ramírez',
    @curp = 'SOFIA1234567890',
    @edad = 26,
    @genero = 'F';
GO

-- Pruebas de Insertar Datos
EXEC PROC_InsertUsuario 
    @nombre = 'Juan',
    @apellido = 'González',
    @curp = 'JUAN5678901234',
    @edad = 33,
    @genero = 'M';
GO

-- Pruebas de Insertar Datos
EXEC PROC_InsertUsuario 
    @nombre = 'Andrea',
    @apellido = 'Hernández',
    @curp = 'ANDREA9876543210',
    @edad = 24,
    @genero = 'F';
GO

-- Pruebas de Insertar Datos
EXEC PROC_InsertUsuario 
    @nombre = 'Diego',
    @apellido = 'Rodríguez',
    @curp = 'DIEGO3456789012',
    @edad = 30,
    @genero = 'M';
GO

-- Pruebas de Insertar Datos
EXEC PROC_InsertUsuario 
    @nombre = 'Gabriela',
    @apellido = 'Torres',
    @curp = 'GABRIELA2345678901',
    @edad = 29,
    @genero = 'F';
GO

-- Pruebas de Insertar Datos
EXEC PROC_InsertUsuario 
    @nombre = 'Miguel',
    @apellido = 'Sánchez',
    @curp = 'MIGUEL1234567890',
    @edad = 27,
    @genero = 'M';
GO

-- Pruebas de Insertar Datos
EXEC PROC_InsertUsuario 
    @nombre = 'Carmen',
    @apellido = 'López',
    @curp = 'CARMEN5678901234',
    @edad = 31,
    @genero = 'F';
GO

-- Pruebas de Insertar Datos
EXEC PROC_InsertUsuario 
    @nombre = 'Jorge',
    @apellido = 'Martínez',
    @curp = 'JORGE9876543210',
    @edad = 23,
    @genero = 'M';
GO

-- Pruebas de Insertar Datos
EXEC PROC_InsertUsuario 
    @nombre = 'Patricia',
    @apellido = 'Pérez',
    @curp = 'PATRICIA3456789012',
    @edad = 29,
    @genero = 'F';
GO

-- Pruebas de Insertar Datos
EXEC PROC_InsertUsuario 
    @nombre = 'Alejandro',
    @apellido = 'Rodríguez',
    @curp = 'ALEJANDRO2345678901',
    @edad = 34,
    @genero = 'M';
GO

-- Pruebas de Insertar Datos
EXEC PROC_InsertUsuario 
    @nombre = 'Paola',
    @apellido = 'Sánchez',
    @curp = 'PAOLA1234567890',
    @edad = 25,
    @genero = 'F';
GO

-- Pruebas de Insertar Datos
EXEC PROC_InsertUsuario 
    @nombre = 'Javier',
    @apellido = 'González',
    @curp = 'JAVIER5678901234',
    @edad = 32,
    @genero = 'M';
GO

-- Pruebas de Insertar Datos
EXEC PROC_InsertUsuario 
    @nombre = 'Valeria',
    @apellido = 'Torres',
    @curp = 'VALERIA9876543210',
    @edad = 26,
    @genero = 'F';
GO

-- Pruebas de Insertar Datos
EXEC PROC_InsertUsuario 
    @nombre = 'Eduardo',
    @apellido = 'Hernández',
    @curp = 'EDUARDO3456789012',
    @edad = 28,
    @genero = 'M';
GO


EXEC PROC_InsertAdministrador 
    @nombre = 'Juan',
    @apellido = 'Pérez',
    @correo = 'prueba@prueba.com',
    @contraseña = '12345'
GO

EXEC PROC_InsertAdministrador 
    @nombre = 'Marco',
    @apellido = 'Caudillo',
    @correo = 'marco@marco.com',
    @contraseña = '12345'
GO


INSERT INTO Comedor (idAdministrador, nombre, direccion, telefono, estatus)
VALUES
(1, 'CINCO DE MAYO', 'Calle Porfirio Díaz # 27, Colonia 5 de Mayo', '1111111111', 'Activo'),
(1, 'MEXICO 86', 'Calle Italia # 53 Colonia México 86', '1111111112', 'Activo'),
(1, 'CARDENAS DEL RIO', ' Calle Gral. Cárdenas del Río Mz. 14 LT 10', '1111111113', 'Inactivo'),
(1, 'MONTE MARÍA', 'Calle Monte Real Mz 406 LT 11 Colonia Lomas de Monte María', '1111111114', 'Activo'),
(1, 'MARGARITA MAZA', 'Calle Francisco Javier Mina #12, Colonia Margarita Maza de Juárez', '1111111115', 'Activo'),
(1, 'CERRO GRANDE', 'Calle Teotihuacan #15 Col. Cerro Grande', '1111111116', 'Activo'),
(1, 'AMP. PEÑITAS', 'Cda. Gardenias #3 Col. Amp Peñitas', '1111111117', 'Activo'),
(1, 'SAN JOSE JARAL 2', 'Calle Jazmín #22 Col. San José el Jaral 2', '1111111118', 'Activo'),
(1, 'CAVELINAS', 'Calle Clavelinas #24 Col. San José el Jaral', '1111111119', 'Inactivo'),
(1, 'AMP. EMILIANO ZAPATA', 'Av. Ejército Mexicano s/n, Col. Ampl. Emiliano Zapata', '1111111120', 'Activo'),
(1, 'DIF CENTRAL', 'Av. Ruiz Cortines esq. Acambay Lomas de Atizapán', '1111111121', 'Activo'),
(1, 'LOS OLIVOS', 'Avenida Jalisco s/n Casa de la Juventud', '1111111122', 'Inactivo'),
(1, 'ADOLFO LOPEZ MATEOS', 'Adolfo López Mateos. Privada Zacatecas no. 6', '1111111123', 'Activo'),
(1, 'HOGARES', 'Retorno de la Tranquilidad No. 8A Hogares de Atizapán.', '1111111124', 'Activo'),
(1, 'RINCONADA BONFIL', 'Rinconada Bonfil. Calle Rosas MZ 4 Lt 15', '1111111125', 'Activo'),
(1, 'SAN JUAN BOSCO', 'San Juan Bosco. Calle Profesor Roberto Barrio No. 2', '1111111126', 'Activo'),
(1, 'Mexico Nuevo', 'Pioneros de Rochandell esquina con calle Veracruz S/N Col. México Nuevo (Deportivo )', '1111111127', 'Inactivo'),
(1, 'LAS PEÑITAS.', 'Peñitas. Mirador # 100 Col. Las Peñitas', '1111111128', 'Activo'),
(1, 'RANCHO CASTRO', 'Rancho Castro, Calle del Puerto s/n Rancho salón de usos múltiplos', '1111111129', 'Activo'),
(1, 'VILLAS DE LAS PALMAS', 'Villas de las palmas Calle avena Mz. 5 Lt. 12 col. Amp villa de las Palmas', '1111111130', 'Activo'),
(1, 'UAM', 'Calle Ingenieria Industrial Mz 24 Lt 45 Col. UAM', '1111111131', 'Activo'),
(1, 'BOSQUES DE IXTACALA', 'Cerrada  Sauces Mz 12 Lt 13- C #6 col.Bosques de Ixtacala', '1111111132', 'Activo'),
(1, 'LOMAS DE TEPALCAPA', 'Calle seis # 14 Colonia Lomas de Tepalcapa', '1111111133', 'Activo'),
(1, 'VILLA DE LAS TORRES', 'Calle Villa Alba Mza. 17 lote 9, esquina Bicentenario, Col. Villa de las Torres', '1111111134', 'Activo'),
(1, 'CRISTOBAL HIGUERA', 'Cristobal Higuera - Calle Sandía # 24. Col. Prof. Cristobal Higuera', '1111111135', 'Activo'),
(1, 'LOMAS DE GUADALUPE', 'Lomas de Guadalupe -  Calle Vicente Guerrero Número 2, Colonia Lomas de Guadalupe', '1111111136', 'Activo'),
(1, 'LAZARO CARDENAS', 'Lázaro Cardenas - Calle Chihuahua 151-A Col. Lázaro Cardenas', '1111111137', 'Activo'),
(1, 'EL CHAPARRAL', 'El Chaparral - Calle Túcan # 48. Colonia el Chaparral', '1111111138', 'Activo'),
(1, 'PRIMERO DE SEPTIEMBRE', 'Primero de Septiembre - Calle Belisario Dominguez Colonia 44 Primero de Septiembre', '1111111139', 'Activo'),
(1, 'LAS AGUILAS', 'Las Aguilas - Pavo Real # 18 Colonia Las Aguilas ', '1111111140', 'Activo'),
(1, 'EL CERRITO', 'El Cerrito. Paseo Buenavista #1 Col. El Cerrito', '1111111141', 'Activo'),
(1, 'VILLAS DE LA HACIENDA', 'Calle de las Chaparreras   #5 Col. Villas de la Hacienda', '1111111142', 'Activo'),
(1, 'SEGURIDAD PUBLICA', 'Sin Datos', '1111111142', 'Inactivo'),
(1, 'SAN JUAN IXTACALA PLANO NORTE 1', 'Loma San Juan 194.San Juan Ixtacala Plano Norte', '1111111142', 'Activo'),
(1, 'PRADOS DE IXTACALA 2DA. SECC.', 'Clavel no. 13 mz13 lt 17.Prados Ixtacala 2da. secc', '1111111142', 'Activo'),
(1, 'VILLA JARDIN ', 'Villa Jardin . Cda . Francisco Villa S/N. Col. Villa Jardin', '1111111142', 'Activo'),
(1, 'AMP. CRISTOBAL HIGUERA', 'Calle Aldama #17 Col Amp Cristobal Higuera', '1111111142', 'Activo'),
(1, 'AMP. ADOLFO LOPEZ MATEOS', 'Calle Leon  #1 esquina Coatzacoalcos Col Amp.Adolfo López Mateos', '1111111142', 'Activo'),
(1, 'LOMAS DE SAN MIGUEL', 'Jacarandas #5  Col. Lomas de San Miguel', '1111111142', 'Activo'),
(1, 'SAN JUAN IXTACALA PLANO NORTE 2', 'Boulevar Ignacio Zaragoza , Loma Alta #82. Col San Juan Ixtacala Plano Norte', '1111111142', 'Activo'),
(1, 'LOS OLIVOS 2 ', 'Calle Mérida numero 10, colonia los Olivos', '1111111142', 'Activo'),
(1, 'TIERRA DE EN MEDIO', 'Hacienda de la Flor #14 Col. Tierra de en medio', '1111111142', 'Activo');
GO



-- Insertar el primer anuncio
EXEC PROC_InsertarAnuncio @idAdministrador = 1, @titulo = 'Nuevo horario de atención', @descripcion = 'A partir del próximo lunes, el horario de atención será de 8:00 am a 6:00 pm.', @estado = 'Activo';

-- Insertar el segundo anuncio
EXEC PROC_InsertarAnuncio @idAdministrador = 1, @titulo = 'Solicitudes de apoyo', @descripcion = 'Estamos aceptando solicitudes de apoyo para la temporada invernal. Pasa al comedor más cercano para más información.', @estado = 'Activo';

-- Insertar el tercer anuncio
EXEC PROC_InsertarAnuncio @idAdministrador = 1, @titulo = 'Donaciones', @descripcion = 'Gracias a las generosas donaciones de la comunidad, este mes podremos ofrecer dos comidas al día.', @estado = 'Activo';

-- Insertar el cuarto anuncio
EXEC PROC_InsertarAnuncio @idAdministrador = 1, @titulo = 'Cierre temporal', @descripcion = 'Por motivos de mantenimiento, el comedor de la calle 5ta permanecerá cerrado este viernes.', @estado = 'Inactivo';

EXEC PROC_InsertEncargado
    @nombre = 'Juan González',
    @telefono = 'juan.gonzalez@example.com',
    @contraseña = '12345',
    @idComedor = 1
GO

EXEC PROC_InsertEncargado
    @nombre = 'María Rodríguez',
    @telefono = 'maria.rodriguez@example.com',
    @contraseña = '12345',
    @idComedor = 2
GO

EXEC PROC_InsertEncargado
    @nombre = 'Pedro Méndez',
    @telefono = 'pedro.mendez@example.com',
    @contraseña = '12345',
    @idComedor = 3
GO

EXEC PROC_InsertEncargado
    @nombre = 'Luisa Fernández',
    @telefono = 'luisa.fernandez@example.com',
    @contraseña = '12345',
    @idComedor = 4
GO

EXEC PROC_InsertEncargado
    @nombre = 'Carlos Soto',
    @telefono = 'carlos.soto@example.com',
    @contraseña = '12345',
    @idComedor = 5
GO

EXEC PROC_InsertEncargado
    @nombre = 'Elena Martínez',
    @telefono = 'elena.martinez@example.com',
    @contraseña = '12345',
    @idComedor = 6
GO

EXEC PROC_InsertEncargado
    @nombre = 'Sergio Ríos',
    @telefono = 'sergio.rios@example.com',
    @contraseña = '12345',
    @idComedor = 7
GO

EXEC PROC_InsertEncargado
    @nombre = 'Liliana Ortega',
    @telefono = 'liliana.ortega@example.com',
    @contraseña = '12345',
    @idComedor = 8
GO

EXEC PROC_InsertEncargado
    @nombre = 'Roberto Castro',
    @telefono = 'roberto.castro@example.com',
    @contraseña = '12345',
    @idComedor = 9
GO

EXEC PROC_InsertEncargado
    @nombre = 'Diana Guerrero',
    @telefono = 'diana.guerrero@example.com',
    @contraseña = '12345',
    @idComedor = 10
GO

EXEC PROC_InsertEncargado
    @nombre = 'Esteban Morán',
    @telefono = 'esteban.moran@example.com',
    @contraseña = '12345',
    @idComedor = 11
GO

EXEC PROC_InsertEncargado
    @nombre = 'Valeria Ponce',
    @telefono = 'valeria.ponce@example.com',
    @contraseña = '12345',
    @idComedor = 12
GO

EXEC PROC_InsertEncargado
    @nombre = 'Oscar Urrutia',
    @telefono = 'oscar.urrutia@example.com',
    @contraseña = '12345',
    @idComedor = 13
GO

EXEC PROC_InsertEncargado
    @nombre = 'Lucía Vásquez',
    @telefono = 'lucia.vasquez@example.com',
    @contraseña = '12345',
    @idComedor = 14
GO

EXEC PROC_InsertEncargado
    @nombre = 'Alfredo Zúñiga',
    @telefono = 'alfredo.zuniga@example.com',
    @contraseña = '12345',
    @idComedor = 15
GO

-- ... (los primeros 15 ya proporcionados anteriormente)

EXEC PROC_InsertEncargado
    @nombre = 'Alejandro Durán',
    @telefono = 'alejandro.duran@example.com',
    @contraseña = '12345',
    @idComedor = 16
GO

EXEC PROC_InsertEncargado
    @nombre = 'Gabriela Fuentes',
    @telefono = 'gabriela.fuentes@example.com',
    @contraseña = '12345',
    @idComedor = 17
GO

EXEC PROC_InsertEncargado
    @nombre = 'Daniel Mora',
    @telefono = 'daniel.mora@example.com',
    @contraseña = '12345',
    @idComedor = 18
GO

EXEC PROC_InsertEncargado
    @nombre = 'Irene Parra',
    @telefono = 'irene.parra@example.com',
    @contraseña = '12345',
    @idComedor = 19
GO

EXEC PROC_InsertEncargado
    @nombre = 'Ricardo Quintana',
    @telefono = 'ricardo.quintana@example.com',
    @contraseña = '12345',
    @idComedor = 20
GO

EXEC PROC_InsertEncargado
    @nombre = 'Liliana Solís',
    @telefono = 'liliana.solis@example.com',
    @contraseña = '12345',
    @idComedor = 21
GO

EXEC PROC_InsertEncargado
    @nombre = 'Héctor Téllez',
    @telefono = 'hector.tellez@example.com',
    @contraseña = '12345',
    @idComedor = 22
GO

EXEC PROC_InsertEncargado
    @nombre = 'Patricia Urbina',
    @telefono = 'patricia.urbina@example.com',
    @contraseña = '12345',
    @idComedor = 23
GO

EXEC PROC_InsertEncargado
    @nombre = 'Tomás Vega',
    @telefono = 'tomas.vega@example.com',
    @contraseña = '12345',
    @idComedor = 24
GO

EXEC PROC_InsertEncargado
    @nombre = 'Susana Ximénez',
    @telefono = 'susana.ximenez@example.com',
    @contraseña = '12345',
    @idComedor = 25
GO

EXEC PROC_InsertEncargado
    @nombre = 'Rubén Yáñez',
    @telefono = 'ruben.yanez@example.com',
    @contraseña = '12345',
    @idComedor = 26
GO

EXEC PROC_InsertEncargado
    @nombre = 'Fernanda Zaragoza',
    @telefono = 'fernanda.zaragoza@example.com',
    @contraseña = '12345',
    @idComedor = 27
GO

EXEC PROC_InsertEncargado
    @nombre = 'Mario Andrade',
    @telefono = 'mario.andrade@example.com',
    @contraseña = '12345',
    @idComedor = 28
GO

EXEC PROC_InsertEncargado
    @nombre = 'Brenda Blanco',
    @telefono = 'brenda.blanco@example.com',
    @contraseña = '12345',
    @idComedor = 29
GO

EXEC PROC_InsertEncargado
    @nombre = 'Joaquín Cordero',
    @telefono = 'joaquin.cordero@example.com',
    @contraseña = '12345',
    @idComedor = 30
GO

EXEC PROC_InsertEncargado
    @nombre = 'Karina Delgado',
    @telefono = 'karina.delgado@example.com',
    @contraseña = '12345',
    @idComedor = 31
GO

EXEC PROC_InsertEncargado
    @nombre = 'Oscar Espinoza',
    @telefono = 'oscar.espinoza@example.com',
    @contraseña = '12345',
    @idComedor = 32
GO

EXEC PROC_InsertEncargado
    @nombre = 'Cecilia Figueroa',
    @telefono = 'cecilia.figueroa@example.com',
    @contraseña = '12345',
    @idComedor = 33
GO

EXEC PROC_InsertEncargado
    @nombre = 'Federico Gómez',
    @telefono = 'federico.gomez@example.com',
    @contraseña = '12345',
    @idComedor = 34
GO

EXEC PROC_InsertEncargado
    @nombre = 'Adriana Herrera',
    @telefono = 'adriana.herrera@example.com',
    @contraseña = '12345',
    @idComedor = 35
GO

EXEC PROC_InsertEncargado
    @nombre = 'Mauricio Ibarra',
    @telefono = 'mauricio.ibarra@example.com',
    @contraseña = '12345',
    @idComedor = 36
GO

EXEC PROC_InsertEncargado
    @nombre = 'Natalia Juárez',
    @telefono = 'natalia.juarez@example.com',
    @contraseña = '12345',
    @idComedor = 37
GO

EXEC PROC_InsertEncargado
    @nombre = 'Diego Lomelí',
    @telefono = 'diego.lomeli@example.com',
    @contraseña = '12345',
    @idComedor = 38
GO

EXEC PROC_InsertEncargado
    @nombre = 'Esther Mendoza',
    @telefono = 'esther.mendoza@example.com',
    @contraseña = '12345',
    @idComedor = 39
GO

EXEC PROC_InsertEncargado
    @nombre = 'Fernando Nuñez',
    @telefono = 'fernando.nunez@example.com',
    @contraseña = '12345',
    @idComedor = 40
GO

EXEC PROC_InsertEncargado
    @nombre = 'Gloria Olvera',
    @telefono = 'gloria.olvera@example.com',
    @contraseña = '12345',
    @idComedor = 41
GO

EXEC PROC_InsertEncargado
    @nombre = 'Pablo Peña',
    @telefono = 'pablo.pena@example.com',
    @contraseña = '12345',
    @idComedor = 42
GO
