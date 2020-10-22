//Imports
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataConnectPGSQL } from '../models/PGSQL/model-connectPGSQL';
import { DataGenerateSPPG } from '../models/PGSQL/model-generateSP';
import { DataTablesSchemaPG } from '../models/PGSQL/model-tablesSchemaPG';
import { DataCrearSchemasPG } from '../models/PGSQL/model-crearSchemaPG';


@Injectable({
  providedIn: 'root'
})
export class PGSQLService {
//Globals
  ip: string = 'localhost';
  port: string = '3000';
  urlRoot: string = `http://${this.ip}:${this.port}/testConexionPGSQL`;
  urlRootConnect: string = `http://${this.ip}:${this.port}/connectPGSQL`;

  constructor(public http: HttpClient) { }
//Micro-servicios para usar los endpoints
  postConnect(
    data: DataConnectPGSQL
  ) {
    return this.http.post(`${this.urlRootConnect}/connect`, data);
  }

  getTest(
  ) {
    return this.http.get(`${this.urlRoot}/`);
  }

  postGenerateInsert(
    data: DataGenerateSPPG
  ) {
    return this.http.post(`${this.urlRoot}/insert`, data);
  }

  postGenerateSelect(
    data: DataGenerateSPPG
  ) {
    return this.http.post(`${this.urlRoot}/select`, data);
  }

  postGenerateUpdate(
    data: DataGenerateSPPG
  ) {
    return this.http.post(`${this.urlRoot}/update`, data);
  }

  postGenerateDelete(
    data: DataGenerateSPPG
  ) {
    return this.http.post(`${this.urlRoot}/delete`, data);
  }

  postTablesSchema(
    data: DataTablesSchemaPG
  ) {
    return this.http.post(`${this.urlRoot}/tablesSchema`, data);
  }

  getSchemas(
  ) {
    return this.http.get(`${this.urlRoot}/schemas`);
  }

  postCrearSchema(
    data: DataCrearSchemasPG
  ) {
    return this.http.post(`${this.urlRoot}/crearSchema`, data);
  }

}
