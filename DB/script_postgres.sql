select * from public.personas ;

create table personas(id int primary key, name varchar);



--lista las v_columnas de una tabla y las retorna en un string
CREATE OR REPLACE FUNCTION get_columns(schema VARCHAR, p_tableName VARCHAR)
    RETURNS varchar
    AS
    $$
    DECLARE
        registry	RECORD;
        v_columns	    REFCURSOR;
        list 		varchar;
    BEGIN
        list:= 'Select ';

        OPEN v_columns FOR SELECT pruebas.getv_columnNames(schema,p_tableName);
        FETCH v_columns INTO v_columns;
        LOOP
            FETCH v_columns INTO registry;
            IF FOUND THEN
                list := list || registry.v_column_name || ',';
            ELSE
                EXIT;
            END IF ;
        END LOOP ;
        CLOSE v_columns;
        list := substring(list from 1 for length(list)-1);
        list := list || 'from ' || schema || '.' || p_tableName||';';
        return list;
    END;
    $$
    LANGUAGE PLPGSQL ;
---------------------------------------------------------------------------------------------------------------------------
--Generate insert
CREATE OR REPLACE FUNCTION generate_insert(p_schema VARCHAR,ptable_name VARCHAR, state INT)
    RETURNS varchar
   	LANGUAGE PLPGSQL
    AS
    $$
    DECLARE
      v_columns 		REFCURSOR;
      v_sql				varchar;
      parameters_types 	varchar;
      v_parameter 		varchar;
      v_column 			varchar;
      vtable_name 		varchar;
      v_column_name 	varchar;
      data_types 		varchar;
    BEGIN

        v_sql := 'CREATE OR REPLACE FUNCTION '|| p_schema ||'.insert_' || ptable_name ||'(';

		OPEN v_columns FOR select column_name ,data_type from information_Schema."columns" as sc where sc.table_schema = p_schema and sc.table_name = ptable_name;

		  parameters_types:='';
		  v_parameter:='';
		  v_column:='';

		  FETCH v_columns INTO v_column_name,data_types;
		  loop
		    IF FOUND THEN
		      IF (parameters_types!='') THEN
				parameters_types=parameters_types || ', ';
				v_parameter=v_parameter || ', ';
				v_column = v_column || ', ';
  			END IF;
		  		parameters_types = parameters_types ||  'p_' || v_column_name|| ' ' || data_types;
		  		v_parameter = v_parameter ||  'p_' || v_column_name;
		      	v_column = v_column || v_column_name;
		    ELSE
		      EXIT;
		    END IF;
		    FETCH v_columns INTO v_column_name,data_types;

		   END LOOP ;
		close v_columns;

	 	v_sql:= v_sql || parameters_types || ')' || E'\n';
    	v_sql:= v_sql || 'RETURNS VOID' || E'\n' || 'AS' || E'\n' || E'\$\$' || E'\n' || 'BEGIN' || E'\n';
        v_sql:= v_sql || E'\t' || 'INSERT INTO ' || p_schema || '.' || ptable_name || '(' || v_column || ')' || E'\n';
        v_sql:= v_sql || E'\t' || 'VALUES (' || v_parameter || ');' ||  E'\n' || 'END' || E'\n' || E'\$\$' || E'\n' || 'LANGUAGE PLPGSQL;' || E'\n\n\n';

       	if state = 1 then
  			return v_sql;
  		else

  			EXECUTE format(v_sql);
			return v_sql;
  		end if;


    end;
    $$;

    select generate_insert('public','personas',0)
  ---------------------------------------------------------------------------------------------------------------------------
--Generate select
   CREATE OR REPLACE FUNCTION generate_select(p_schema VARCHAR,ptable_name VARCHAR,state INT)
    RETURNS varchar
   	LANGUAGE PLPGSQL
    AS
    $$
    DECLARE
      v_columns 		REFCURSOR;
      v_sql				varchar;
      parameters_types 	varchar;
      v_parameter 		varchar;
      v_column 			varchar;
      vtable_name 		varchar;
      v_column_name 	varchar;
      data_types 		varchar;
     select_parameters 	varchar;
    	v_output 		varchar;
    BEGIN

        v_sql := 'CREATE OR REPLACE FUNCTION '|| p_schema ||'.select_' || ptable_name ||'(';

		OPEN v_columns FOR select column_name ,data_type from information_Schema."columns" as sc where sc.table_schema = p_schema and sc.table_name = ptable_name;

		  parameters_types:='';
		  v_parameter:='';
		  v_column:='';
		 select_parameters:='';
		 v_output := '';
		  FETCH v_columns INTO v_column_name,data_types;
		  loop IF FOUND THEN
		      	IF (parameters_types!='') THEN
					parameters_types=parameters_types || ', ';
					v_parameter=v_parameter || ', ';
					v_column = v_column || ', ';
					v_output = v_output || ', ';
  				END IF;
			  		parameters_types = parameters_types ||  'p_' || v_column_name|| ' ' || data_types;
			  		v_parameter = v_parameter ||  'p_' || v_column_name;
			      	v_column = v_column || v_column_name;
		      		v_output =  v_output ||  'o_' || v_column_name|| ' ' || data_types;
		     	IF select_parameters = '' then
		     		select_parameters = select_parameters || ' ( p_' || v_column_name || ' IS NULL OR p_' || v_column_name || ' = ' || v_column_name || ') ';
		     	else
	     			select_parameters = select_parameters ||  'AND ( p_' || v_column_name || ' IS NULL OR p_' || v_column_name || ' = ' || v_column_name || ')';
	     		end if;

		    ELSE
		      EXIT;
		    END IF;
		    FETCH v_columns INTO v_column_name,data_types;

		   END LOOP ;
		close v_columns;

		v_sql:= v_sql || parameters_types || ')' || E'\n';
		v_sql:= v_sql || 'RETURNS TABLE ('|| v_output || ') ' || E'\n' || 'AS' || E'\n' || E'\$\$' || E'\n' || 'BEGIN' || E'\n';
	 	v_sql:= v_sql || ' SELECT * FROM ' || p_schema ||'.'|| ptable_name || ' WHERE ' ||select_parameters ||';' || E'\n' || 'END' || E'\n' || E'\$\$' || E'\n' || 'LANGUAGE PLPGSQL;' || E'\n\n\n';

  		if state = 1 then
  			return v_sql;
  		else

  			EXECUTE format(v_sql);
			return v_sql;
  		end if;
    end;
    $$;

	select generate_select('public','personas',0)

 ---------------------------------------------------------------------------------------------------------------------------
--Generate update
CREATE OR REPLACE FUNCTION generate_update(p_schema VARCHAR,ptable_name VARCHAR, state INT)
    RETURNS varchar
   	LANGUAGE PLPGSQL
    AS
    $$
    DECLARE
      	v_columns 			REFCURSOR;
      	v_sql				varchar;
      	parameters_types 	varchar;
      	v_parameter 		varchar;
      	v_column 			varchar;
      	vtable_name 		varchar;
      	v_column_name 		varchar;
      	data_types 			varchar;
     	select_parameters 	varchar;
    	vtable_pk			varchar;
    BEGIN

        v_sql := 'CREATE OR REPLACE FUNCTION '|| p_schema ||'.update_' || ptable_name ||'(';

		OPEN v_columns FOR select column_name ,data_type from information_Schema."columns" as sc where sc.table_schema = p_schema and sc.table_name = ptable_name;

	  	parameters_types:='';
	  	v_parameter:='';
	  	v_column:='';
	 	select_parameters:='';
	 	vtable_pk := (SELECT a.attname FROM   pg_index i JOIN   pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)WHERE  i.indrelid = ptable_name::regclass AND    i.indisprimary);


		  FETCH v_columns INTO v_column_name,data_types;
		  loop IF FOUND THEN
		      	IF (parameters_types!='') THEN
					parameters_types=parameters_types || ', ';
					v_parameter=v_parameter || ', ';
					v_column = v_column || ', ';
  				END IF;
			  		parameters_types = parameters_types ||  'p_' || v_column_name|| ' ' || data_types;
			  		v_parameter = v_parameter ||  'p_' || v_column_name;
			      	v_column = v_column || v_column_name;

		     	IF select_parameters = '' then
		     		select_parameters = select_parameters || ' p_' || v_column_name ||' = ' || v_column_name || ' ';
		     	else
	     			select_parameters = select_parameters ||  ', p_' || v_column_name ||' = ' || v_column_name || ' ';
	     		end if;

		    ELSE
		      EXIT;
		    END IF;
		    FETCH v_columns INTO v_column_name,data_types;

		   END LOOP ;
		close v_columns;
		v_sql:= v_sql || parameters_types || ')' || E'\n';
		v_sql:= v_sql || 'RETURNS VOID' || E'\n' || 'AS' || E'\n' || E'\$\$' || E'\n' || 'BEGIN' || E'\n';
	 	v_sql:= v_sql || ' UPDATE ' || p_schema ||'.'|| ptable_name || ' SET ' ||select_parameters || ' WHERE ' || vtable_pk || ' = p_'|| vtable_pk || ';' || E'\n' || 'END' || E'\n' || E'\$\$' || E'\n' || 'LANGUAGE PLPGSQL;' || E'\n\n\n';

  		if state = 1 then
  			return v_sql;
  		else

  			EXECUTE format(v_sql);
			return v_sql;
  		end if;
    end;
    $$;
   select generate_update('public','personas',0)


 ---------------------------------------------------------------------------------------------------------------------------
--Generate delete
CREATE OR REPLACE FUNCTION generate_delete(p_schema VARCHAR,ptable_name VARCHAR,state INT)
    RETURNS varchar
   	LANGUAGE PLPGSQL
    AS
    $$
    DECLARE
      	v_columns 			REFCURSOR;
      	v_sql				varchar;
      	parameters_types 	varchar;
      	v_parameter 		varchar;
      	v_column 			varchar;
      	vtable_name 		varchar;
      	v_column_name 		varchar;
      	data_types 			varchar;
     	select_parameters 	varchar;
    	vtable_pk			varchar;
    BEGIN

        v_sql := 'CREATE OR REPLACE FUNCTION '|| p_schema ||'.delete_' || ptable_name ||'(';

		OPEN v_columns FOR select column_name ,data_type from information_Schema."columns" as sc where sc.table_schema = p_schema and sc.table_name = ptable_name;

	  	parameters_types:='';
	  	v_parameter:='';
	  	v_column:='';
	 	select_parameters:='';
	 	vtable_pk := (SELECT a.attname FROM   pg_index i JOIN   pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)WHERE  i.indrelid = ptable_name::regclass AND    i.indisprimary);


		  FETCH v_columns INTO v_column_name,data_types;
		  loop IF FOUND THEN
		      	IF (parameters_types!='') THEN
					parameters_types=parameters_types || ', ';
					v_parameter=v_parameter || ', ';
					v_column = v_column || ', ';
  				END IF;
			  		parameters_types = parameters_types ||  'p_' || v_column_name|| ' ' || data_types;
			  		v_parameter = v_parameter ||  'p_' || v_column_name;
			      	v_column = v_column || v_column_name;

		     	IF select_parameters = '' then
		     		select_parameters = select_parameters || ' ( p_' || v_column_name || ' IS NULL OR p_' || v_column_name || ' = ' || v_column_name || ') ';
		     	else
	     			select_parameters = select_parameters ||  ', ( p_' || v_column_name || ' IS NULL OR p_' || v_column_name || ' = ' || v_column_name || ')';
	     		end if;

		    ELSE
		      EXIT;
		    END IF;
		    FETCH v_columns INTO v_column_name,data_types;

		   END LOOP ;
		close v_columns;
		v_sql:= v_sql || parameters_types || ')' || E'\n';
		v_sql:= v_sql || 'RETURNS VOID' || E'\n' || 'AS' || E'\n' || E'\$\$' || E'\n' || 'BEGIN' || E'\n';
	 	v_sql:= v_sql || ' DELETE FROM ' || p_schema ||'.'|| ptable_name || ' WHERE ' || vtable_pk || ' = p_'|| vtable_pk || ';' || E'\n' || 'END' || E'\n' || E'\$\$' || E'\n' || 'LANGUAGE PLPGSQL;' || E'\n\n\n';

  		if state = 1 then
  			return v_sql;
  		else

  			EXECUTE format(v_sql);
			return v_sql;
  		end if;
    end;
    $$;

   select generate_delete('public','personas',0);
 ---------------------------------------------------------------------------------------------------------------------------
--Procedure retorna los schemas
  CREATE OR REPLACE FUNCTION get_schemas()
    RETURNS TABLE(name information_schema.schemata.schema_name%TYPE)
    AS
    $$
   	begin
		 RETURN QUERY SELECT schema_name FROM information_schema.schemata ;

    end;
    $$ LANGUAGE plpgsql;

 select get_schemas();
 --------------------------------------------------------------------------------------------------------------------------
--Procedure retorna los tablas por schemas
  CREATE OR REPLACE FUNCTION get_tables(p_schema varchar)
    RETURNS TABLE(name information_schema.tables.table_name%TYPE)
    AS
    $$
   	begin
		 RETURN QUERY SELECT table_name FROM information_schema."tables" where table_schema  = p_schema;
    end;
    $$ LANGUAGE plpgsql;

 select get_tables('public');
  --------------------------------------------------------------------------------------------------------------------------
--Procedure crea schema
  CREATE OR REPLACE FUNCTION create_schema(p_schema varchar)
    RETURNS VOID
    AS
    $$
   	begin
		  EXECUTE FORMAT('CREATE SCHEMA %I;', p_schema);
    end;
    $$ LANGUAGE plpgsql;

 select create_schema('private');
