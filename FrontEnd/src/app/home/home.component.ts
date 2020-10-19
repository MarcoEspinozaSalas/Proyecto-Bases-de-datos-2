import { Component, OnInit } from '@angular/core';
//Services
import { MSSQLService } from '../services/mssql.service';
import { PGSQLService } from '../services/pgsql.service';
//Models
import { DataConnectMSSQL} from '../models/MSSQL/model-connectMSSQL';
import { DataGenerateInsert} from '../models/MSSQL/model-generateInsert';

import { DataConnectPGSQL} from '../models/PGSQL/model-connectPGSQL';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  dataConnectMSSQL= new DataConnectMSSQL();
  dataConnectPGSQL= new DataConnectPGSQL();
  dataGenerateInsert= new DataGenerateInsert();
  tipoMotor : any;

  constructor(public mssqlService: MSSQLService, public pgsqlService: PGSQLService) { }

  ngOnInit(): void {
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

        this.mssqlService.postGenerateInsert(this.dataGenerateInsert)
            .subscribe(
              (data: any) =>{
                if(data.estado === 1){
                  alert("Se generaron los procedimientos almacenados");
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
