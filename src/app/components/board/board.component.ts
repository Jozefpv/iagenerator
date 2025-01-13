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
  history: string[] = [];  // Historial de estados
  historyIndex: number = -1;  // Índice actual en el historial
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

    this.setupCanvasEvents();  // Configurar eventos del lienzo
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

    // Limpiar el historial al borrar el lienzo
    this.history = [];
    this.historyIndex = -1;

    // Asegurar que el historial se reinicie correctamente y permita el primer trazo
    console.log('Canvas cleared, history reset.');
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
  
      // Ajustar las dimensiones del lienzo al tamaño de la imagen
      this.canvasObject.setWidth(imgWidth);
      this.canvasObject.setHeight(imgHeight);
  
      // Ajustar la escala de la imagen para que encaje perfectamente
      this.canvasObject.setBackgroundImage(
        img,
        this.canvasObject.renderAll.bind(this.canvasObject),
        {
          originX: 'left',
          originY: 'top',
        }
      );
  
      // Renderizar el lienzo con las nuevas dimensiones
      this.canvasObject.renderAll();
    });
  }
  

  // Configurar eventos para guardar el estado cada vez que se modifica el lienzo
  setupCanvasEvents() {
    this.canvasObject.on('object:added', (e) => {
      console.log('Object added, updating history...');
      // Solo registrar si el objeto agregado es un trazo
      if (e.target && e.target.type === 'path') {
        this.updateHistory();
      }
    });

    this.canvasObject.on('object:modified', (e) => {
      console.log('Object modified, updating 2...');
      // Solo registrar si el objeto modificado es un trazo
      if (e.target && e.target.type === 'path') {
        this.updateHistory();
      }
    });

    this.canvasObject.on('object:removed', (e) => {
      console.log('Object removed, updating history...');
      // Solo registrar si el objeto eliminado es un trazo
      if (e.target && e.target.type === 'path') {
        this.updateHistory();
      }
    });
  }

  // Guardar el estado del lienzo en el historial
  updateHistory() {
    // Obtener el estado del lienzo en formato JSON
    const canvasState = this.canvasObject.toJSON();

    // Solo agregamos un nuevo estado si estamos fuera de un undo/redo
    if (this.historyIndex === this.history.length - 1 || this.historyIndex === -1) {
      // Si estamos en el último estado o si hemos limpiado el lienzo
      this.history.push(JSON.stringify(canvasState));
      this.historyIndex++; // Avanzamos el índice del historial
      console.log('History updated, index:', this.historyIndex); // Verificar el valor del índice
    }
  }

  // Deshacer el último cambio
  undo() {
    console.log('Undo action, history index:', this.historyIndex); // Verificar el índice antes de hacer undo
    if (this.historyIndex > 0) {
      this.historyIndex--; // Mover hacia atrás en el historial
      const lastState = this.history[this.historyIndex];
      this.canvasObject.loadFromJSON(lastState, this.canvasObject.renderAll.bind(this.canvasObject));
      console.log('Undo applied, history index:', this.historyIndex); // Verificar el índice después del undo
    } else if (this.historyIndex === 0) {
      // Si estamos en el primer estado, solo borrar el lienzo
      this.clearCanvas()
      console.log('Canvas cleared, history index reset to -1');
    } else {
      console.log('No more actions to undo.');
    }
  }
}
