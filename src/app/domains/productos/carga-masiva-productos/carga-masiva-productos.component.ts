import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CargaMasivaProductosService } from './carga-masiva-productos.service';
import { Fabricante, FabricantesResponse } from '../producto.model';

@Component({
  selector: 'app-carga-masiva-productos',
  standalone: false,
  templateUrl: './carga-masiva-productos.component.html',
  styleUrls: ['./carga-masiva-productos.component.css']
})
export class CargaMasivaProductosComponent implements OnInit {
  cargaMasivaProductosForm!: FormGroup;
  listaFabricantes: Fabricante[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private apiService: CargaMasivaProductosService
  ) { }

  ngOnInit() {
    this.cargaMasivaProductosForm = this.formBuilder.group({
      fieldFabricante: ['', Validators.required]
    })

    this.apiService.getListaFabricantes().subscribe({
      next: (response: FabricantesResponse) => {
        this.listaFabricantes = response.providers;
      },
      error: (err) => {
        console.error('Error loading providers:', err);
      }
    });
  }

}
