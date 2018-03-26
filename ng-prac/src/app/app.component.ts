import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '../environments/environment';

import { GridOptions } from 'ag-grid';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  gridOptionsSub = new BehaviorSubject<GridOptions>(undefined);
  gridOptionsObs = this.gridOptionsSub.asObservable();

  private rowData = [];
  private columnDefs = [];
  headerColms = [];

  col2 = [];


  rowDataSub = new BehaviorSubject<any[]>(undefined);
  rowDataObs = this.rowDataSub.asObservable();

  colmnSub = new BehaviorSubject<any[]>(undefined);
  colmnObs = this.colmnSub.asObservable();

  col2Sub = new BehaviorSubject<any[]>(undefined);
  col2Obs = this.col2Sub.asObservable();

  constructor(private httpc: HttpClient) {
  }

  ngOnInit() {

    this.httpc.get(`${env.url}/api/reportingtrans`).subscribe(res => {
      const resp: any = res;
      console.log(res);

      const headerStrArr = resp.result.headers;
      const dataArr = resp.result.records;

      headerStrArr.forEach(h => {
        this.columnDefs.push({
          headerName: h
          , field: h
          , width: 125
        });
      });

      /*
      dataArr.forEach(d => {
        const newData = {};
        headerStrArr.forEach(h => Object.defineProperty(newData, h, { value: d[h] }));
        this.rowData.push(newData);
      });
      */
      for (const d of dataArr) {
        const newData = {};
        headerStrArr.forEach(h => Object.defineProperty(newData, h, { value: d[h] }));
        this.rowData.push(newData);
      }

      const tmpGridOptions: GridOptions = {};
      tmpGridOptions.columnDefs = this.columnDefs;
      tmpGridOptions.rowData = this.rowData;

      this.colmnSub.next( this.columnDefs );
      this.rowDataSub.next( this.rowData );

      this.gridOptionsSub.next(tmpGridOptions);
    });

  }
}

