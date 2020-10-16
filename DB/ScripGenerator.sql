--USE master
--DROP DATABASE Proyecto1Bases2;
CREATE DATABASE Proyecto1Bases2;
GO
USE Proyecto1Bases2;
GO

CREATE TABLE personas (id INT, name VARCHAR(30));

CREATE TABLE personas2 (id INT, name VARCHAR(30));

GO
CREATE OR ALTER PROCEDURE generate_insert 
	@schema VARCHAR(50),
	@table VARCHAR (50)
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
		DECLARE cursor_columnas CURSOR FOR
			SELECT  COLUMN_NAME nombre,
					DATA_TYPE tipo,
					CHARACTER_MAXIMUM_LENGTH cp,
					NUMERIC_PRECISION np,
					DATETIME_PRECISION dp
			FROM INFORMATION_SCHEMA.COLUMNS
			WHERE TABLE_NAME=@table
		SET @sql='CREATE PROCEDURE '+@schema+'.insert_'+@table+'('

		OPEN cursor_columnas
		FETCH NEXT FROM cursor_columnas 
		INTO @procedureName,@type,@cp,@np,@dp
		WHILE @@FETCH_STATUS=0

			BEGIN
				SET @parameter_with_types=@parameter_with_types+'@'+@procedureName+ ' '+@type +', '
				SET @parameter_without_types=@parameter_without_types+'@'+@procedureName+ ', '
				SET @column_name=@column_name+@procedureName+ ', '
				FETCH NEXT FROM cursor_columnas 
				INTO    @procedureName,@type,@cp,@np,@dp
			END
		CLOSE cursor_columnas

		DEALLOCATE cursor_columnas
		SET @parameter_with_types=SUBSTRING(@parameter_with_types,1,LEN(@parameter_with_types)-1)
		SET @parameter_without_types=SUBSTRING(@parameter_without_types,1,LEN(@parameter_without_types)-1)
		SET @column_name=SUBSTRING(@column_name,1,LEN(@column_name)-1)
		set @nl=CHAR(13) + CHAR(10)
		SET @sql=@sql+@parameter_with_types+')'+ @nl +' AS ' +@nl
		SET @sql=@sql+'INSERT INTO personas('+@column_name+')'+@nl+'values'+@nl
		SET @sql=@sql+'('+@parameter_without_types+')'
		print @sql;
		exec sp_executeSQL @sql;
	END
GO

--EXEC generate_insert 'DBO','personas';