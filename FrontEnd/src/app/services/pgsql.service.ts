import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataConnectPGSQL} from '../models/PGSQL/model-connectPGSQL';
import { DataGenerateSPPG} from '../models/PGSQL/model-generateSP';

@Injectable({
  providedIn: 'root'
})
export class PGSQLService {

  ip: string = 'localhost';
  port: string = '3000';
  urlRoot: string = `http://${this.ip}:${this.port}/testConexionPGSQL`;
  urlRootConnect: string = `http://${this.ip}:${this.port}/connectPGSQL`;

  constructor(public http: HttpClient) { }

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

  

 /*
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
  */
}
