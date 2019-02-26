import { Component } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  allItems: AngularFireObject<any>;
  itemOneChange: Observable<any>;
  itemTwoChange: Observable<any>;
  allItemChange: Observable<any>;
  itemOnePercent: any;
  itemTwoPercent: any;
  itemOneValue: string;
  itemTwoValue: string;
  total: any;
  data: any;

  constructor(
    private db: AngularFireDatabase
    ) {
    this.allItems = db.object('votes');
    this.allItems.valueChanges().subscribe(action => {
      this.itemOneValue = action[1].count;
    });
    this.allItems.valueChanges().subscribe(action => {
      this.itemTwoValue = action[2].count;
    });
  }
  // STATIC DATA FOR THE CHART IN JSON FORMAT.
  chartData = [
    {
      label: ['yes', 'no'],
      data: []
    }
  ];

  chartLabels = ['yes', 'no']

  colors = [
    {
      backgroundColor: ['rgba(172, 217, 182, 1)', 'rgba(248, 201, 193, 1)']
    }
  ]

  ngOnInit() {
    this.allItems.valueChanges().subscribe(action => {
      this.total = action[1].count + action[2].count;
      this.itemOnePercent = (action[1].count === 0) ? 0 : Math.ceil((action[1].count / this.total) * 100);
      this.itemTwoPercent = (action[2].count === 0) ? 0 : 100 - this.itemOnePercent;
      this.data = [
      {
        "label": ['yes', 'no'],
        "data": [action[1].count, action[2].count]  }
      ]
      this.chartData = this.data;
    });
  }

  delete() {
    this.allItems.set({
      1: {
        count: 0
      },
      2: {
        count: 0
      }
    })
  }
}
