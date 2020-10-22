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
CREATE OR REPLACE FUNCTION generate_insert(p_schema VARCHAR,ptable_name VARCHAR)
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

  		return v_sql;
    end;
    $$;

    select generate_insert('public','personas')
  ---------------------------------------------------------------------------------------------------------------------------
   CREATE OR REPLACE FUNCTION generate_select(p_schema VARCHAR,ptable_name VARCHAR)
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
    BEGIN

        v_sql := 'CREATE OR REPLACE FUNCTION '|| p_schema ||'.select_' || ptable_name ||'(';

		OPEN v_columns FOR select column_name ,data_type from information_Schema."columns" as sc where sc.table_schema = p_schema and sc.table_name = ptable_name;

		  parameters_types:='';
		  v_parameter:='';
		  v_column:='';
		 select_parameters:='';

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
	     			select_parameters = select_parameters ||  'AND ( p_' || v_column_name || ' IS NULL OR p_' || v_column_name || ' = ' || v_column_name || ')';
	     		end if;

		    ELSE
		      EXIT;
		    END IF;
		    FETCH v_columns INTO v_column_name,data_types;

		   END LOOP ;
		close v_columns;

	 	v_sql:= v_sql || ' SELECT * FROM ' || p_schema ||'.'|| ptable_name || ' WHERE ' ||select_parameters || E'\n' || 'END' || E'\n' || E'\$\$' || E'\n' || 'LANGUAGE PLPGSQL;' || E'\n\n\n';

  		return v_sql;
    end;
    $$;

	select generate_select('public','personas')

   select * from information_Schema."columns" as c where c.table_name = 'personas';
