--USE master
--DROP DATABASE Proyecto1Bases2;
--CREATE DATABASE Proyecto1Bases2;
GO
USE Proyecto1Bases2;
GO

--CREATE TABLE personas2 (id INT PRIMARY KEY, name VARCHAR(30));
--CREATE TABLE personas (id INT PRIMARY KEY, name VARCHAR(30));


GO
CREATE OR ALTER PROCEDURE generate_insert
	@schema VARCHAR(50),
	@table VARCHAR (50),
	@state INT
	AS
	BEGIN

		DECLARE
		@sql nvarchar(500),
		@procedureName VARCHAR(100),
        @type VARCHAR(100),
        @cp int,
        @np int,
        @dp int,
        @nl varchar(2),
        @parameter_without_types VARCHAR(200),
        @parameter_with_types VARCHAR(200),
        @column_name VARCHAR(200)

		SET @parameter_with_types=''
		SET @parameter_without_types=''
		SET @column_name=''
		DECLARE cursor_columns CURSOR FOR
			SELECT  COLUMN_NAME name,
					DATA_TYPE type,
					CHARACTER_MAXIMUM_LENGTH cp,
					NUMERIC_PRECISION np,
					DATETIME_PRECISION dp
			FROM INFORMATION_SCHEMA.COLUMNS
			WHERE TABLE_NAME=@table
		SET @sql='CREATE OR ALTER PROCEDURE '+@schema+'.insert_'+@table+'('

		OPEN cursor_columns
		FETCH NEXT FROM cursor_columns
		INTO @procedureName,@type,@cp,@np,@dp
		WHILE @@FETCH_STATUS=0

			BEGIN
				SET @parameter_with_types=@parameter_with_types+'@'+@procedureName+ ' '+@type +', '
				SET @parameter_without_types=@parameter_without_types+'@'+@procedureName+ ', '
				SET @column_name=@column_name+@procedureName+ ', '
				FETCH NEXT FROM cursor_columns
				INTO    @procedureName,@type,@cp,@np,@dp
			END
		CLOSE cursor_columns

		DEALLOCATE cursor_columns
		SET @parameter_with_types=SUBSTRING(@parameter_with_types,1,LEN(@parameter_with_types)-1)
		SET @parameter_without_types=SUBSTRING(@parameter_without_types,1,LEN(@parameter_without_types)-1)
		SET @column_name=SUBSTRING(@column_name,1,LEN(@column_name)-1)
		set @nl=CHAR(13) + CHAR(10)
		SET @sql=@sql+@parameter_with_types+')'+ @nl +' AS ' +@nl
		SET @sql=@sql+'INSERT INTO '+@table+'('+@column_name+')'+@nl+'values'+@nl
		SET @sql=@sql+'('+@parameter_without_types+')'
		PRINT @sql;
		IF @state = 1
			BEGIN
				EXEC sp_executeSQL @sql;
				SELECT @sql AS sql_code;
			END
		ELSE
			BEGIN
				SELECT @sql AS sql_code;
			END
		SELECT 0
	END
GO

--EXEC generate_insert 'DBO','personas',1;

GO

CREATE OR ALTER PROCEDURE generate_select
	@schema VARCHAR(50),
	@table VARCHAR (50),
	@state INT
	--@parameters VARCHAR (100)
	AS
	BEGIN
		DECLARE @params_count INT;
		--SET @params_count = ((SELECT COUNT (value) FROM STRING_SPLIT(@parameters, ',')));
		DECLARE @colums_count INT;
		SET @colums_count = (SELECT COUNT(COLUMN_NAME) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = @table);
		SET @params_count = @colums_count;

		IF (  @params_count = @colums_count )
			BEGIN
				DECLARE
				@sql nvarchar(500),
				@procedureName VARCHAR(100),
				@type VARCHAR(100),	
				@cp int,
				@np int,
				@dp int,
				@nl varchar(2),
				@parameter_without_types VARCHAR(200),
				@parameter_with_types VARCHAR(200),
				@column_name VARCHAR(200)

				SET @parameter_with_types=''
				SET @parameter_without_types=''
				SET @column_name=''

				DECLARE cursor_columns CURSOR FOR
				SELECT  COLUMN_NAME name,
						DATA_TYPE type,
						CHARACTER_MAXIMUM_LENGTH cp,
						NUMERIC_PRECISION np,
						DATETIME_PRECISION dp
				FROM INFORMATION_SCHEMA.COLUMNS
				WHERE TABLE_NAME=@table

				SET @sql='CREATE OR ALTER PROCEDURE '+@schema+'.select_'+@table+'('

				OPEN cursor_columns
				FETCH NEXT FROM cursor_columns
				INTO @procedureName,@type,@cp,@np,@dp
				WHILE @@FETCH_STATUS=0

					BEGIN
						SET @parameter_with_types=@parameter_with_types+'@'+@procedureName+ ' '+@type +', '
						SET @parameter_without_types=@parameter_without_types+'@'+@procedureName+ ', '
						SET @column_name=@column_name+@procedureName+ ', '
						FETCH NEXT FROM cursor_columns
						INTO    @procedureName,@type,@cp,@np,@dp
					END
				CLOSE cursor_columns

				DEALLOCATE cursor_columns
				SET @parameter_with_types=SUBSTRING(@parameter_with_types,1,LEN(@parameter_with_types)-1)
				SET @parameter_without_types=SUBSTRING(@parameter_without_types,1,LEN(@parameter_without_types)-1)
				SET @column_name=SUBSTRING(@column_name,1,LEN(@column_name)-1)
				SET @nl=CHAR(13) + CHAR(10)
				SET @sql=@sql+@parameter_with_types+')'+ @nl +' AS ' +@nl

				SET @sql=@sql+'SELECT * FROM '+@table+' WHERE ';

				DECLARE @counter INT = 0;

				DECLARE @parameter VARCHAR(100);
				DECLARE @value VARCHAR (100);



				WHILE @counter < @params_count
					BEGIN
						SET @value = (SELECT value FROM STRING_SPLIT (@parameter_without_types,',') ORDER BY value DESC OFFSET @counter ROWS FETCH FIRST 1 ROWS ONLY );
						SET @parameter = (SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = @table ORDER BY TABLE_NAME OFFSET @counter ROWS FETCH FIRST 1 ROWS ONLY ) ;

						IF (@counter < @params_count-1)
							BEGIN
								SET @sql = @sql + ' ' + @parameter + ' = ' + @value + ' OR ';
							END
						ELSE
							BEGIN
								SET @sql = @sql + ' ' + @parameter + ' = ' + @value+';';
							END
						SET @counter = @counter + 1;
					END
				PRINT @sql;
				IF @state = 1
					BEGIN
						EXEC sp_executeSQL @sql;
						SELECT @sql AS sql_code;
					END
				ELSE
					BEGIN
						SELECT @sql AS sql_code;
					END
			END
		ELSE
			BEGIN
				SELECT 0 AS output_code;
			END
	END
GO
--EXEC generate_select 'DBO','personas',1;
GO

GO
CREATE OR ALTER PROCEDURE generate_update
	@schema VARCHAR(50),
	@table VARCHAR (50),
	@filter VARCHAR(50),
	@state INT
	AS
	BEGIN
		DECLARE @params_count INT;
		--SET @params_count = ((SELECT COUNT (value) FROM STRING_SPLIT(@parameters, ',')));
		DECLARE @colums_count INT;
		SET @colums_count = (SELECT COUNT(COLUMN_NAME) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = @table);
		SET @params_count = @colums_count;

		IF (  @params_count = @colums_count )
			BEGIN
				DECLARE
				@sql nvarchar(500),
				@procedureName VARCHAR(100),
				@type VARCHAR(100),
				@cp int,
				@np int,
				@dp int,
				@nl varchar(2),
				@parameter_without_types VARCHAR(200),
				@parameter_with_types VARCHAR(200),
				@column_name VARCHAR(200)

				SET @parameter_with_types=''
				SET @parameter_without_types=''
				SET @column_name=''

				DECLARE cursor_columns CURSOR FOR
				SELECT  COLUMN_NAME name,
						DATA_TYPE type,
						CHARACTER_MAXIMUM_LENGTH cp,
						NUMERIC_PRECISION np,
						DATETIME_PRECISION dp
				FROM INFORMATION_SCHEMA.COLUMNS
				WHERE TABLE_NAME=@table

				SET @sql='CREATE OR ALTER PROCEDURE '+@schema+'.update_'+@table+'('

				OPEN cursor_columns
				FETCH NEXT FROM cursor_columns
				INTO @procedureName,@type,@cp,@np,@dp
				WHILE @@FETCH_STATUS=0

					BEGIN
						SET @parameter_with_types=@parameter_with_types+'@'+@procedureName+ ' '+@type +', '
						SET @parameter_without_types=@parameter_without_types+'@'+@procedureName+ ', '
						SET @column_name=@column_name+@procedureName+ ', '
						FETCH NEXT FROM cursor_columns
						INTO    @procedureName,@type,@cp,@np,@dp
					END
				CLOSE cursor_columns

				DEALLOCATE cursor_columns
				SET @parameter_with_types=SUBSTRING(@parameter_with_types,1,LEN(@parameter_with_types)-1)
				SET @parameter_without_types=SUBSTRING(@parameter_without_types,1,LEN(@parameter_without_types)-1)
				SET @column_name=SUBSTRING(@column_name,1,LEN(@column_name)-1)
				SET @nl=CHAR(13) + CHAR(10)
				SET @sql=@sql+@parameter_with_types+')'+ @nl +' AS ' +@nl

				SET @sql=@sql+'UPDATE '+@table+' SET ';

				DECLARE @counter INT = 0;

				DECLARE @parameter VARCHAR(100);
				DECLARE @value VARCHAR (100);

				DECLARE @firstParameter VARCHAR(100);
				DECLARE @firstValue VARCHAR (100);

				WHILE @counter < @params_count
					BEGIN
						SET @value = (SELECT value FROM STRING_SPLIT (@parameter_without_types,',') ORDER BY value DESC OFFSET @counter ROWS FETCH FIRST 1 ROWS ONLY );
						SET @parameter = (SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = @table ORDER BY TABLE_NAME OFFSET @counter ROWS FETCH FIRST 1 ROWS ONLY ) ;

						IF (@counter < @params_count-1)
							BEGIN
								SET @sql = @sql + ' ' + @parameter + ' = ' + @value + ' , ';
							END
						ELSE
							BEGIN
								SET @sql = @sql + ' ' + @parameter + ' = ' + @value+' ';
							END
						SET @counter = @counter + 1;
					END

				SET @sql=@sql+'WHERE '+ @filter +  ' = @' + @filter + ';'

				PRINT @sql;
				IF @state = 1
					BEGIN
						EXEC sp_executeSQL @sql;
						SELECT @sql AS sql_code;
					END
				ELSE
					BEGIN
						SELECT @sql AS sql_code;
					END
			END
		ELSE
			BEGIN
				SELECT 0 AS output_code;
			END
	END
GO

--EXEC generate_update  'DBO','personas','id',1;

GO

CREATE OR ALTER PROCEDURE generate_delete
	@schema VARCHAR(50),
	@table VARCHAR (50),
	@filter VARCHAR (50),
	@state INT
	AS
	BEGIN
		DECLARE @params_count INT;
		--SET @params_count = ((SELECT COUNT (value) FROM STRING_SPLIT(@parameters, ',')));
		DECLARE @colums_count INT;
		SET @colums_count = (SELECT COUNT(COLUMN_NAME) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = @table);
		SET @params_count = @colums_count;

		IF (  @params_count = @colums_count )
			BEGIN
				DECLARE
				@sql nvarchar(500),
				@procedureName VARCHAR(100),
				@type VARCHAR(100),
				@cp int,
				@np int,
				@dp int,
				@nl varchar(2),
				@parameter_without_types VARCHAR(200),
				@parameter_with_types VARCHAR(200),
				@column_name VARCHAR(200)

				SET @parameter_with_types=''
				SET @parameter_without_types=''
				SET @column_name=''

				DECLARE cursor_columns CURSOR FOR
				SELECT  COLUMN_NAME name,
						DATA_TYPE type,
						CHARACTER_MAXIMUM_LENGTH cp,
						NUMERIC_PRECISION np,
						DATETIME_PRECISION dp
				FROM INFORMATION_SCHEMA.COLUMNS
				WHERE TABLE_NAME=@table

				SET @sql='CREATE OR ALTER PROCEDURE '+@schema+'.delete_'+@table+'('

				OPEN cursor_columns
				FETCH NEXT FROM cursor_columns
				INTO @procedureName,@type,@cp,@np,@dp
				WHILE @@FETCH_STATUS=0

					BEGIN
						SET @parameter_with_types=@parameter_with_types+'@'+@procedureName+ ' '+@type +', '
						SET @parameter_without_types=@parameter_without_types+'@'+@procedureName+ ', '
						SET @column_name=@column_name+@procedureName+ ', '
						FETCH NEXT FROM cursor_columns
						INTO    @procedureName,@type,@cp,@np,@dp
					END
				CLOSE cursor_columns

				DEALLOCATE cursor_columns
				SET @parameter_with_types=SUBSTRING(@parameter_with_types,1,LEN(@parameter_with_types)-1)
				SET @parameter_without_types=SUBSTRING(@parameter_without_types,1,LEN(@parameter_without_types)-1)
				SET @column_name=SUBSTRING(@column_name,1,LEN(@column_name)-1)
				SET @nl=CHAR(13) + CHAR(10)
				SET @sql=@sql+@parameter_with_types+')'+ @nl +' AS ' +@nl

				SET @sql=@sql+'DELETE FROM '+@table+' WHERE '+@filter+ ' = @' + @filter + ';'  ;

				PRINT @sql;
				IF @state = 1
					BEGIN
						EXEC sp_executeSQL @sql;
						SELECT @sql AS sql_code;
					END
				ELSE
					BEGIN
						SELECT @sql AS sql_code;
					END
			END
		ELSE
			BEGIN
				SELECT 0 AS output_code;
			END
	END
GO
--EXEC generate_delete  'DBO','personas','id',1;
GO
CREATE OR ALTER PROCEDURE get_tables_schema
	@schema VARCHAR (50)
	AS
	BEGIN
		SELECT DISTINCT TABLE_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @schema;
	END
GO
CREATE OR ALTER PROCEDURE get_schemas
	AS
	BEGIN
		SELECT DISTINCT TABLE_SCHEMA FROM INFORMATION_SCHEMA.COLUMNS;
	END
GO
CREATE OR ALTER PROCEDURE get_table_columns
	@table_name VARCHAR(50)
	AS
	BEGIN
		SELECT COLUMN_NAME AS columns FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = @table_name;
	END
GO


CREATE OR ALTER PROCEDURE ObtenerLlave
@table_name nvarchar(150)
as
	SELECT [name]
	FROM syscolumns
	WHERE [id] IN (
	SELECT [id] FROM sysobjects
	WHERE [name] = @table_name )
	AND colid IN (
	SELECT sysindexkeys.colid
	FROM sysindexkeys JOIN sysobjects ON sysindexkeys.[id] = sysobjects.[id]
	WHERE sysindexkeys.indid = 1 AND sysobjects.[name] = @table_name )

GO

CREATE OR ALTER PROCEDURE crearSchema( @schema varchar( 50 ) )

AS 
    IF EXISTS ( SELECT * from INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_OWNER = 'dbo' AND SCHEMA_NAME = @schema )
        BEGIN
            SELECT 0
        END
    ELSE
        BEGIN
            DECLARE @sql nvarchar( 300 )
            SET @sql = 'CREATE SCHEMA ' + @schema
            EXEC sp_executeSQL @sql;
            SELECT 1
        END

--EXEC get_schemas;
--EXEC get_tables_schema 'dbo';
--EXEC get_table_columns 'personas';
--EXEC ObtenerLlave 'personas';
--EXEC crearSchema 'test';
--CREATE TABLE test.personas3 (id INT PRIMARY KEY, name VARCHAR(30));
