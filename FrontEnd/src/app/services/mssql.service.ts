//Imports
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataConnectMSSQL} from '../models/MSSQL/model-connectMSSQL';
import { DataGenerateSP} from '../models/MSSQL/model-generateSP';
import { DataTablesSchema} from '../models/MSSQL/model-tablesSchema';
import { DataCrearSchemas} from '../models/MSSQL/model-crearSchema';
@Injectable({
  providedIn: 'root'
})
export class MSSQLService {
//Globals
  ip: string = 'localhost';
  port: string = '3000';
  urlRoot: string = `http://${this.ip}:${this.port}/testConexionMSSQL`;
  urlRootConnect: string = `http://${this.ip}:${this.port}/connectMSSQL`;


  constructor(public http: HttpClient) { }
  //Micro servicios para usar los endpoints
  postConnect(
    data: DataConnectMSSQL
  ) {
    return this.http.post(`${this.urlRootConnect}/connect`, data);
  }

  postGenerateInsert(
    data: DataGenerateSP
  ) {
    return this.http.post(`${this.urlRoot}/insert`, data);
  }

  postGenerateSelect(
    data: DataGenerateSP
  ) {
    return this.http.post(`${this.urlRoot}/select`, data);
  }

  postGenerateUpdate(
    data: DataGenerateSP
  ) {
    return this.http.post(`${this.urlRoot}/update`, data);
  }

  postGenerateDelete(
    data: DataGenerateSP
  ) {
    return this.http.post(`${this.urlRoot}/delete`, data);
  }

  postTablesSchema(
    data: DataTablesSchema
  ) {
    return this.http.post(`${this.urlRoot}/tablesSchema`, data);
  }

  getSchemas(
  ) {
    return this.http.get(`${this.urlRoot}/Schemas`);
  }

  postCrearSchema(
    data: DataCrearSchemas
  ) {
    return this.http.post(`${this.urlRoot}/crearSchema`, data);
  }


}
