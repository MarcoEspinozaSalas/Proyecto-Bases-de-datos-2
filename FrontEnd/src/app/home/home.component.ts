import { Component, OnInit } from '@angular/core';
//Services
import { MSSQLService } from '../services/mssql.service';
import { PGSQLService } from '../services/pgsql.service';
//Models
import { DataConnectMSSQL} from '../models/MSSQL/model-connectMSSQL';
import { DataGenerateSP} from '../models/MSSQL/model-generateSP';
import { DataSchemas} from '../models/MSSQL/model-dataSchemas';
import { DataSchemasPG } from '../models/PGSQL/model-dataSchemasPG';
import { DataTablesSchema} from '../models/MSSQL/model-tablesSchema';
import { DataTablesSchemaPG} from '../models/PGSQL/model-tablesSchemaPG';
import { GetDataTablesSchema} from '../models/MSSQL/model-getDataTablesSchema';
import { GetDataTablesSchemaPG} from '../models/PGSQL/model-dataTablesSchemaPG';
import { DataCrearSchemas} from '../models/MSSQL/model-crearSchema';
import { DataGenerateSPPG} from '../models/PGSQL/model-generateSP';
import { DataCrearSchemasPG} from '../models/PGSQL/model-crearSchemaPG';
import { DataConnectPGSQL} from '../models/PGSQL/model-connectPGSQL';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
 //Globals
  dataConnectMSSQL= new DataConnectMSSQL();
  dataConnectPGSQL= new DataConnectPGSQL();
  dataGenerateSP= new DataGenerateSP();
  dataGenerateSPPG= new DataGenerateSPPG();
  dataTablesSchema= new DataTablesSchema();
  dataTablesSchemaPG= new DataTablesSchemaPG();
  dataCrearSchema= new DataCrearSchemas();
  dataCrearSchemaPG= new DataCrearSchemasPG();
  tipoMotor : any;
  tipoCRUD: any;
  tipoCRUD2: any;
  dataResult: any;
  dataResult2: any;
  dataSchema: DataSchemas[] = [];
  dataSchemaPG: DataSchemasPG[] = [];
  getDataTablesSchema: GetDataTablesSchema[] = [];
  getDataTablesSchemaPG: GetDataTablesSchemaPG[] = [];
  connectedMSSQL: boolean;
  connectedPGSQL: boolean;
  constructor(public mssqlService: MSSQLService, public pgsqlService: PGSQLService) {
  }

  ngOnInit(): void {
  }

//Funciones
  //Obtiene schemas
  getSchemaAfterConnect(){
    this.dataSchema = [];
    if (this.connectedMSSQL) {
      this.mssqlService.getSchemas()
      .subscribe(
        (data: any) => {
          for (let i of data) {
            let temp: DataSchemas = new DataSchemas();
            temp.SCHEMA_NAME = i.SCHEMA_NAME;
            this.dataSchema.push(temp);
          }
        }, (err: any) => {
          console.error(err.error);
        }
      )
    }else{
        alert("No está conectado");
    }

  }
//Obtiene schemas
  getSchemaAfterConnect2(){
    this.dataSchemaPG = [];
    if (this.connectedPGSQL) {
      this.pgsqlService.getSchemas()
      .subscribe(
        (data: any) => {
          for (let i of data) {
            let temp: DataSchemasPG = new DataSchemasPG();
            temp.get_schemas = i.get_schemas;
            this.dataSchemaPG.push(temp);
          }
        }, (err: any) => {
          console.error(err.error);
        }
      )
    }else{
        alert("No está conectado");
    }

  }

//Obtiene las tablas de un schema
  getTablesSchema(){
    this.getDataTablesSchema = [];
    this.dataTablesSchema.schema = this.dataGenerateSP.schema;
    if (this.dataTablesSchema.schema != undefined) {
      this.mssqlService.postTablesSchema(this.dataTablesSchema)
      .subscribe(
        (data: any) => {
          for (let i of data.data) {
            let temp: GetDataTablesSchema = new GetDataTablesSchema();
            temp.TABLE_NAME = i.TABLE_NAME;
            this.getDataTablesSchema.push(temp);
          }
        }, (err: any) => {
          console.error(err.error);
        }
      )
    }
  }
//Obtiene las tablas de un schema
  getTablesSchema2(){
    this.getDataTablesSchemaPG = [];
    this.dataTablesSchemaPG.schema = this.dataGenerateSPPG.schema;
    if (this.dataTablesSchemaPG.schema != undefined) {
      this.pgsqlService.postTablesSchema(this.dataTablesSchemaPG)
      .subscribe(
        (data: any) => {
          for (let i of data) {
            let temp: GetDataTablesSchemaPG = new GetDataTablesSchemaPG();
            temp.get_tables = i.get_tables;
            this.getDataTablesSchemaPG.push(temp);
          }
        }, (err: any) => {
          console.error(err.error);
        }
      )
    }
  }
//Crear schema
  crearSchema(){
    this.mssqlService.postCrearSchema(this.dataCrearSchema)
        .subscribe(
          (data: any) =>{
            if(data.estado === 1){
              alert("Schema Creado");
              this.getSchemaAfterConnect();
            }
            else{
               alert("No se conectó");
            }
          }, err => {
            if (err.error) {
              if (err.status === 400) {
                alert("Digite el nombre del schema")
              }else
              console.error(err);
              // servidor se cayó
            }
            // console.error(err.error);
          }

        );
    this.getTablesSchema();
    this.getSchemaAfterConnect();
  }
//Crear schema
  crearSchema2(){
    this.pgsqlService.postCrearSchema(this.dataCrearSchemaPG)
        .subscribe(
          (data: any) =>{
            if(data !== undefined){
              alert("Schema Creado");
            }
            else{
               alert("No se conectó");
            }
          }, err => {
            if (err.error) {
              if (err.status === 400) {
                alert("Digite el nombre del schema")
              }else
              console.error(err);
              // servidor se cayó
            }
            // console.error(err.error);
          }

        );
    this.getTablesSchema2();
    this.getSchemaAfterConnect2();
  }

//Enviar formulario
  onSubmit(form) {
    if (form.valid) {
      console.log(this.tipoMotor);
      if (this.tipoMotor == "MSSQL"){

        this.mssqlService.postConnect(this.dataConnectMSSQL)
            .subscribe(
              (data: any) =>{
                if(data.estado === 1){
                  alert("Base de datos MSSQL conectada");
                  this.connectedMSSQL = true;
                  this.getSchemaAfterConnect();
                }
                else{
                   alert("No se conectó");
                }
              }, err => {
                if (err.error) {
                  console.error(err);
                  // servidor se cayó
                }
                // console.error(err.error);
              }

            );

            if(this.tipoCRUD == "INSERT"){

              this.mssqlService.postGenerateInsert(this.dataGenerateSP)
                  .subscribe(
                    (data: any) =>{
                      if(data.estado === 1){
                        alert("Se generaron los procedimientos almacenados");
                        this.dataResult = data.data[0].sql_code;
                      }
                      else{
                         alert("No se generaron los procedimientos almacenados");
                      }
                    }, err => {
                      if (err.error) {
                        console.error(err);
                        // servidor se cayó
                      }
                      // console.error(err.error);
                    }

                  );

            }

            if(this.tipoCRUD == "SELECT"){

              this.mssqlService.postGenerateSelect(this.dataGenerateSP)
                  .subscribe(
                    (data: any) =>{
                      if(data.estado === 1){
                        alert("Se generaron los procedimientos almacenados");
                        this.dataResult = data.data[0].sql_code;
                      }
                      else{
                         alert("No se generaron los procedimientos almacenados");
                      }
                    }, err => {
                      if (err.error) {
                        console.error(err);
                        // servidor se cayó
                      }
                      // console.error(err.error);
                    }

                  );

            }

            if(this.tipoCRUD == "UPDATE"){

              this.mssqlService.postGenerateUpdate(this.dataGenerateSP)
                  .subscribe(
                    (data: any) =>{
                      if(data.estado === 1){
                        alert("Se generaron los procedimientos almacenados");
                        this.dataResult = data.data[0].sql_code;
                      }
                      else{
                         alert("No se generaron los procedimientos almacenados");
                      }
                    }, err => {
                      if (err.error) {
                        console.error(err);
                        // servidor se cayó
                      }
                      // console.error(err.error);
                    }

                  );

            }
            if(this.tipoCRUD == "DELETE"){

              this.mssqlService.postGenerateDelete(this.dataGenerateSP)
                  .subscribe(
                    (data: any) =>{
                      if(data.estado === 1){
                        alert("Se generaron los procedimientos almacenados");
                        this.dataResult = data.data[0].sql_code;
                      }
                      else{
                         alert("No se generaron los procedimientos almacenados");
                      }
                    }, err => {
                      if (err.error) {
                        console.error(err);
                        // servidor se cayó
                      }
                      // console.error(err.error);
                    }

                  );

            }

      } if (this.tipoMotor == "PGSQL"){

        this.pgsqlService.postConnect(this.dataConnectPGSQL)
            .subscribe(
              (data: any) =>{
                if(data.estado === 1){
                  alert("Base de datos PGSQL conectada");
                  this.connectedPGSQL = true;
                  this.getSchemaAfterConnect2();
                }
                else{
                   alert("No se conectó");
                }
              }, err => {
                if (err.error) {
                  console.error(err);
                  // servidor se cayó
                }
                // console.error(err.error);
              }

            );

            if(this.tipoCRUD2 == "INSERT"){

              this.pgsqlService.postGenerateInsert(this.dataGenerateSPPG)
                  .subscribe(
                    (data: any) =>{
                      if(data !== undefined){
                        alert("Se generaron los procedimientos almacenados");
                        this.dataResult2 = data[0].generate_insert;
                      }
                      else{
                         alert("No se generaron los procedimientos almacenados");
                      }
                    }, err => {
                      if (err.error) {
                        console.error(err);
                        // servidor se cayó
                      }
                      // console.error(err.error);
                    }

                  );

            }

            if(this.tipoCRUD2 == "SELECT"){

              this.pgsqlService.postGenerateSelect(this.dataGenerateSPPG)
                  .subscribe(
                    (data: any) =>{
                      if(data !== undefined){
                        alert("Se generaron los procedimientos almacenados");
                        this.dataResult2 = data[0].generate_select;
                      }
                      else{
                         alert("No se generaron los procedimientos almacenados");
                      }
                    }, err => {
                      if (err.error) {
                        console.error(err);
                        // servidor se cayó
                      }
                      // console.error(err.error);
                    }

                  );

            }

            if(this.tipoCRUD2 == "UPDATE"){

              this.pgsqlService.postGenerateUpdate(this.dataGenerateSPPG)
                  .subscribe(
                    (data: any) =>{
                      if(data !== undefined){
                        alert("Se generaron los procedimientos almacenados");
                        this.dataResult2 = data[0].generate_update  ;
                      }
                      else{
                         alert("No se generaron los procedimientos almacenados");
                      }
                    }, err => {
                      if (err.error) {
                        console.error(err);
                        // servidor se cayó
                      }
                      // console.error(err.error);
                    }

                  );

            }
            if(this.tipoCRUD2 == "DELETE"){

              this.pgsqlService.postGenerateDelete(this.dataGenerateSPPG)
                  .subscribe(
                    (data: any) =>{
                      if(data !== undefined){
                        alert("Se generaron los procedimientos almacenados");
                        this.dataResult2 = data[0].generate_delete;
                      }
                      else{
                         alert("No se generaron los procedimientos almacenados");
                      }
                    }, err => {
                      if (err.error) {
                        console.error(err);
                        // servidor se cayó
                      }
                      // console.error(err.error);
                    }

                  );

            }

      }


    }else{
      alert("Campos vacios")
    }
  }

}
