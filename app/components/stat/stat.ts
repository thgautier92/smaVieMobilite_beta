import { Component, ViewChild, ElementRef, Input, Output, AfterViewInit, OnChanges} from '@angular/core';
import {IONIC_DIRECTIVES} from 'ionic-angular';

declare var Chart: any;

/*
  Generated class for the Stat component.

  See https://angular.io/docs/ts/latest/api/core/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'stat',
  templateUrl: 'build/components/stat/stat.html',
  inputs: ['graphType', 'graphData', 'title'],
  outputs: [],
  
  directives: [IONIC_DIRECTIVES]
})
export class Stat implements AfterViewInit, OnChanges {
  @Input() graphType: any;
  @Input() graphData: any;
  @Input() title: any;
  @ViewChild('canvas') private _canvas: ElementRef;
  chartDiv: HTMLCanvasElement;
  displayChart:Boolean = false;
  constructor() {
  }
  ngAfterViewInit() {
    this.chartDiv = this._canvas.nativeElement;
    //this.render(this.graphData);
  }
  ngOnChanges(changes: any) {
    console.log(changes);
    this.render(changes['graphData'].currentValue);
  }
  render(data) {
    //var chart2d = this.chartDiv.getContext("2d");
    var myChart = new Chart(this.chartDiv, {
      type: 'bar',
      data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
          label: '# of Votes',
          data: data
        }]
      },
      options: {
        // Elements options apply to all of the options unless overridden in a dataset
        // In this case, we are setting the border of each bar to be 2px wide and green
        elements: {
          rectangle: {
            borderWidth: 2,
            borderColor: 'rgb(0, 255, 0)',
            borderSkipped: 'bottom'
          }
        },
        responsive: false,
        maintainAspectRatio: true,
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Chart.js Bar Chart'
        }
      }
    });
    console.log(myChart);
    this.displayChart = true;
  }
};