import { Component, OnInit } from '@angular/core';
//Services
import { MSSQLService } from '../services/mssql.service';
import { PGSQLService } from '../services/pgsql.service';
//Models
import { DataConnectMSSQL} from '../models/MSSQL/model-connectMSSQL';
import { DataGenerateSP} from '../models/MSSQL/model-generateSP';
import { DataSchemas} from '../models/MSSQL/model-dataSchemas';
import { DataTablesSchema} from '../models/MSSQL/model-tablesSchema';
import { GetDataTablesSchema} from '../models/MSSQL/model-getDataTablesSchema';
import { DataCrearSchemas} from '../models/MSSQL/model-crearSchema';
import { DataGenerateSPPG} from '../models/PGSQL/model-generateSP';


import { DataConnectPGSQL} from '../models/PGSQL/model-connectPGSQL';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  dataConnectMSSQL= new DataConnectMSSQL();
  dataConnectPGSQL= new DataConnectPGSQL();
  dataGenerateSP= new DataGenerateSP();
  dataGenerateSPPG= new DataGenerateSPPG();
  dataTablesSchema= new DataTablesSchema();
  dataCrearSchema= new DataCrearSchemas();
  tipoMotor : any;
  tipoCRUD: any;
  dataResult: any;
  dataSchema: DataSchemas[] = [];
  getDataTablesSchema: GetDataTablesSchema[] = [];
  connected: boolean;
  constructor(public mssqlService: MSSQLService, public pgsqlService: PGSQLService) {
  }

  ngOnInit(): void {
  }


  getSchemaAfterConnect(){
    this.dataSchema = [];
    if (this.connected) {
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

  crearSchema(){
    this.mssqlService.postCrearSchema(this.dataCrearSchema)
        .subscribe(
          (data: any) =>{
            if(data.estado === 1){
              alert("Schema Creado");
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
    this.getTablesSchema();
    this.getSchemaAfterConnect();
  }


  onSubmit(form) {
    if (form.valid) {
      console.log(this.tipoMotor);
      if (this.tipoMotor == "MSSQL"){

        this.mssqlService.postConnect(this.dataConnectMSSQL)
            .subscribe(
              (data: any) =>{
                if(data.estado === 1){
                  alert("Base de datos MSSQL conectada");
                  this.connected = true;
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

            this.pgsqlService.getTest()
            .subscribe(
              (data: any) => {
                console.log("Data de PGSQL: ", data);
              }, (err: any) => {
                console.error(err.error);
              }
            )

      }


    }else{
      alert("Campos vacios")
    }
  }

}
