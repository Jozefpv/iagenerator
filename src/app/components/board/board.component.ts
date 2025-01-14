import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { fabric } from 'fabric';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent implements OnInit {
  @ViewChild('whiteboardCanvas', { static: true }) canvas!: ElementRef;

  private canvasObject!: fabric.Canvas;
  history: string[] = [];
  historyIndex: number = -1;
  selectedColor: string = '#000000';
  brushSize: number = 5;
  backgroundImage: string = '';

  constructor(private _snackBar: MatSnackBar, private route: ActivatedRoute) {}

  ngOnInit() {
    const encodedUrl = this.route.snapshot.paramMap.get('url') || '';
    this.backgroundImage = decodeURIComponent(encodedUrl);

    this.canvasObject = new fabric.Canvas(this.canvas.nativeElement, {
      isDrawingMode: true,
      defaultCursor: 'default',
      selection: false,
    });

    fabric.Object.prototype.cornerColor = 'blue';
    fabric.Object.prototype.cornerStyle = 'circle';

    this.updateBrushSettings();
    this.setBackgroundImage(this.backgroundImage);

    this.setupCanvasEvents();
  }

  updateBrushSettings() {
    this.canvasObject.freeDrawingBrush = new fabric.PencilBrush(this.canvasObject);
    this.canvasObject.freeDrawingBrush.color = this.selectedColor;
    this.canvasObject.freeDrawingBrush.width = this.brushSize;
  }

  updateBrushSize() {
    this.brushSize = Math.max(1, Math.min(this.brushSize, 50));
    this.canvasObject.freeDrawingBrush.width = this.brushSize;
  }

  updateBrushColor(color: string) {
    this.selectedColor = color;
    this.canvasObject.freeDrawingBrush.color = this.selectedColor;
  }

  clearCanvas() {
    if (this.canvasObject.backgroundImage) {
      const backgroundImage = this.canvasObject.backgroundImage as fabric.Image;

      const scaleX = backgroundImage.scaleX!;
      const scaleY = backgroundImage.scaleY!;
      const left = backgroundImage.left!;
      const top = backgroundImage.top!;

      this.canvasObject.clear();

      this.canvasObject.setBackgroundImage(
        backgroundImage,
        this.canvasObject.renderAll.bind(this.canvasObject),
        {
          scaleX: scaleX,
          scaleY: scaleY,
          left: left,
          top: top,
          originX: 'left',
          originY: 'top',
        }
      );
    } else {
      this.canvasObject.clear();
    }

    this.history = [];
    this.historyIndex = -1;
  }

  saveAsSVG() {
    const svg = this.canvasObject.toSVG();
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'canvas.svg';
    a.style.display = 'none';

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
    this.openSnackBar('🔥 Downloaded Successfully');
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, '', { duration: 2000 });
  }

  setBackgroundImage(imageUrl: string) {
    fabric.Image.fromURL(imageUrl, (img) => {
      const imgWidth = img.width!;
      const imgHeight = img.height!;
  
      this.canvasObject.setWidth(imgWidth);
      this.canvasObject.setHeight(imgHeight);
  
      this.canvasObject.setBackgroundImage(
        img,
        this.canvasObject.renderAll.bind(this.canvasObject),
        {
          originX: 'left',
          originY: 'top',
        }
      );
  
      this.canvasObject.renderAll();
    });
  }
  

  setupCanvasEvents() {
    this.canvasObject.on('object:added', (e) => {
      if (e.target && e.target.type === 'path') {
        this.updateHistory();
      }
    });

    this.canvasObject.on('object:modified', (e) => {
      if (e.target && e.target.type === 'path') {
        this.updateHistory();
      }
    });

    this.canvasObject.on('object:removed', (e) => {
      if (e.target && e.target.type === 'path') {
        this.updateHistory();
      }
    });
  }

  updateHistory() {
    const canvasState = this.canvasObject.toJSON();

    if (this.historyIndex === this.history.length - 1 || this.historyIndex === -1) {
      this.history.push(JSON.stringify(canvasState));
      this.historyIndex++;
    }
  }

  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      const lastState = this.history[this.historyIndex];
      this.canvasObject.loadFromJSON(lastState, this.canvasObject.renderAll.bind(this.canvasObject));
    } else if (this.historyIndex === 0) {
      this.clearCanvas()
    }
  }
}
