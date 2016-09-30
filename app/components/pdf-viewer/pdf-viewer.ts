import { Component, ViewChild, ElementRef, Input, Output, AfterViewInit, OnChanges} from '@angular/core';
import {IONIC_DIRECTIVES} from 'ionic-angular';
declare var PDFJS: any;
/*
  Generated class for the Record component.

  See https://angular.io/docs/ts/latest/api/core/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'pdfview',
  templateUrl: 'build/components/pdf-viewer/pdf-viewer.html',
  inputs: ['pdfSrc'],
  outputs: [],
  directives: [IONIC_DIRECTIVES]
})

export class PdfViewer implements OnChanges {
  pdfDiv: HTMLCanvasElement;
  @ViewChild('result') result: ElementRef;
  @Input() pdfSrc: any;
  rootDoc: any = 'data/docs/';
  pdfDoc: any;
  pageNum: any;
  pageCount: any;
  pageRendering: boolean;
  pageNumPending: any;
  scale: any;
  canvas: HTMLCanvasElement;
  ctx: any;
  zoomRef: any;
  zoom:any;
  constructor() {
    this.zoomRef = [
      //{ "code": "auto", "lib": "Zoom Automatique", "value": "auto" },
      //{ "code": "auto", "lib": "Actual Size", "value": "page-actual" },
      //{ "code": "auto", "lib": "Page entière", "value": "page-fit" },
      //{ "code": "auto", "lib": "Largeur max", "value": "page-width" },
      { "code": "50", "lib": "50%", "value": "0.5" },
      { "code": "80", "lib": "80%", "value": "0.8" },
      { "code": "100", "lib": "100%", "value": "1" },
      { "code": "125", "lib": "125%", "value": "1.25" },
      { "code": "150", "lib": "150%", "value": "1.50" },
      { "code": "200", "lib": "200%", "value": "2" },
      { "code": "300", "lib": "300%", "value": "3" },
      { "code": "400", "lib": "400%", "value": "4" }
    ];
  }
  ngOnInit() {
    this.pdfDiv = this.result.nativeElement;
    PDFJS.workerSrc = 'build/js/pdf.worker.js';
    this.pdfDoc = null;
    this.pageNum = 1;
    this.pageCount = 0;
    this.pageRendering = false;
    this.pageNumPending = null;
    this.scale = 0.8;
    this.canvas = this.pdfDiv;
    this.ctx = this.canvas.getContext('2d');
  }
  ngOnChanges(changes: any) {
    ////console.log(changes);
    var url = "data/docs/" + this.pdfSrc;
    // read Doc
    //console.log(url);
    PDFJS.getDocument(url).then(pdfDoc_ => {
      //console.log(pdfDoc_);
      if (pdfDoc_) {
        this.pdfDoc = pdfDoc_;
        this.pageCount = this.pdfDoc.numPages;
        this.renderPage(this.pageNum,this.scale);
      }
    }, error => {
      //console.log(error);
    });
  }
  renderPage(num,sc) {
    this.pageRendering = true;
    // Using promise to fetch the page
    this.pdfDoc.getPage(num).then(page => {
      var viewport = page.getViewport(sc);
      this.canvas.height = viewport.height;
      this.canvas.width = viewport.width;

      // Render PDF page into canvas context
      var renderContext = {
        canvasContext: this.ctx,
        viewport: viewport
      };
      var renderTask = page.render(renderContext);

      // Wait for rendering to finish
      renderTask.promise.then(response => {
        this.pageRendering = false;
        if (this.pageNumPending !== null) {
          // New page rendering is pending
          this.renderPage(this.pageNumPending,sc);
          this.pageNumPending = null;
        }
      });
    });
  }
  queueRenderPage(num) {
    if (this.pageRendering) {
      this.pageNumPending = num;
    } else {
      this.renderPage(num,this.scale);
    }
  }
  onPrevPage() {
    if (this.pageNum <= 1) {
      return;
    }
    this.pageNum--;
    this.queueRenderPage(this.pageNum);
  }
  onNextPage() {
    if (this.pageNum >= this.pdfDoc.numPages) {
      return;
    }
    this.pageNum++;
    this.queueRenderPage(this.pageNum);
  }
  onFirstPage() {
    this.pageNum = 1
    this.queueRenderPage(this.pageNum);
  }
  onLastPage() {
    this.pageNum = this.pdfDoc.numPages
    this.queueRenderPage(this.pageNum);
  }
  changeScale(){
    // ***** TODO : chnage scale method *****
    ////console.log("Change scale", this.scale);
    //this.pdfDoc.scale = this.scale;
    this.renderPage(this.pageNum,this.scale);
  }
}

