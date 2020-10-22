import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataConnectPGSQL} from '../models/PGSQL/model-connectPGSQL';
import { DataGenerateSP} from '../models/PGSQL/model-generateSP';

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

  postSelect(
    data: DataGenerateSP
  ){
    return this.http.post(`${this.urlRootConnect}/connect`, data);
  }

}
