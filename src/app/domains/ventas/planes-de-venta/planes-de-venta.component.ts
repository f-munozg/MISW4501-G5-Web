import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Vendedor } from '../../vendedores/vendedores.model';
import { Observable } from 'rxjs';
import { Producto } from '../ventas.model';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-planes-de-venta',
  standalone: false,
  templateUrl: './planes-de-venta.component.html',
  styleUrls: ['./planes-de-venta.component.css']
})
export class PlanesDeVentaComponent implements OnInit {
  definicionPlanDeVentasForm!: FormGroup;

  listaVendedores: Vendedor[] = [];
  listaProductos: Producto[] = [];

  vendedoresFiltrados!: Observable<string[]>; // Revisar si es string

  constructor(
    private formBuilder: FormBuilder,
    // private apiService: PlanDeVentasService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.initializeForm();
  }

  onSubmit() {

  }

  initializeForm(): void {
    this.definicionPlanDeVentasForm = this.formBuilder.group({
      fieldVendedor: ['', Validators.required],
      fieldMeta: ['', Validators.required],
      fieldProducto: ['', Validators.required],
      fieldPeriodo: ['', Validators.required]
    });
  }

}
