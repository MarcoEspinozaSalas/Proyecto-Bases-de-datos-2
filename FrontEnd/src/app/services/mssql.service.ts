import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataConnectMSSQL} from '../models/MSSQL/model-connectMSSQL';
import { DataGenerateInsert} from '../models/MSSQL/model-generateInsert';
@Injectable({
  providedIn: 'root'
})
export class MSSQLService {

  ip: string = 'localhost';
  port: string = '3000';
  urlRoot: string = `http://${this.ip}:${this.port}/testConexionMSSQL`;
  urlRootConnect: string = `http://${this.ip}:${this.port}/connectMSSQL`;


  constructor(public http: HttpClient) { }

  postConnect(
    data: DataConnectMSSQL
  ) {
    return this.http.post(`${this.urlRootConnect}/connect`, data);
  }

  postGenerateInsert(
    data: DataGenerateInsert
  ) {
    return this.http.post(`${this.urlRoot}/`, data);
  }


}
