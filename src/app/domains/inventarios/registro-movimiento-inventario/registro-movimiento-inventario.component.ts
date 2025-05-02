import { Component, OnInit } from '@angular/core';
import { Bodega, MovementType2LabelMapping, TipoMovimiento } from '../inventario.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Producto } from '../../ventas/ventas.model';
import { RegistroMovimientoInventarioService } from './registro-movimiento-inventario.service';
import { Router } from '@angular/router';

export interface TableRow{
  product_id: string,
  warehouse_id: string,
  quantity: number,
  user: string,
  movement_type: string,
  timestamp: string,
  alert_message: string,
}

@Component({
  selector: 'app-registro-movimiento-inventario',
  standalone: false,
  templateUrl: './registro-movimiento-inventario.component.html',
  styleUrls: ['./registro-movimiento-inventario.component.css']
})
export class RegistroMovimientoInventarioComponent implements OnInit {
  registroMovimientoInventarioForm!: FormGroup;

  listaUsuarios: any[] = [];
  listaProductos: Producto[] = [];
  listaBodegas: Bodega[] = [];

  public MovementType2LabelMapping = MovementType2LabelMapping;
  public tiposMovimiento = Object.values(TipoMovimiento);

  tableData: TableRow[] = [];

  tableColumns = [
    {
      name: 'timestamp', 
      header: 'Fecha', 
      cell: (item: any) => item.timestamp.toString() 
    },
    {
      name: 'product_id', 
      header: 'Producto', 
      cell: (item: any) => item.product_id.toString() 
    },
    {
      name: 'warehouse_id', 
      header: 'Bodega', 
      cell: (item: any) => item.warehouse_id.toString() 
    },
    {
      name: 'movement_type', 
      header: 'Movimiento', 
      cell: (item: any) => item.movement_type.toString() 
    },
    {
      name: 'number', 
      header: 'Cantidad', 
      cell: (item: any) => item.number.toString() 
    },
    {
      name: 'user', 
      header: 'Responsable', 
      cell: (item: any) => item.user.toString() 
    }
  ];

  visibleColumns = ['timestamp','product_id','warehouse_id','movement_type','number','user'];

  constructor(
    private formBuilder: FormBuilder,
    private apiService: RegistroMovimientoInventarioService,
    private router: Router,
  ) { }

  initializeForms(): void {
    this.registroMovimientoInventarioForm = this.formBuilder.group({
      fieldProducto: ['', Validators.required],
      fieldBodega: ['', Validators.required],
      fieldCantidad: ['', [Validators.required, Validators.min(1)]],
      fieldTipoMovimiento: ['', Validators.required],
      fieldResponsable: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.initializeForms();
  }

  onSubmit() {
    
  }

  clearAll() {

  }
}
