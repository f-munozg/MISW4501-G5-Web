import { Component, OnInit } from '@angular/core';
import { Paises, PaisesType2LabelMapping, TipoImpuesto, TipoImpuesto2LabelMapping } from '../reglas.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

export interface TableRow {
  id: string;
  pais: Paises;
  tipo_impuesto: TipoImpuesto;
  valor: number;
  descripcion: string;
}

@Component({
  selector: 'app-reglas-tributarias',
  standalone: false,
  templateUrl: './reglas-tributarias.component.html',
  styleUrls: ['./reglas-tributarias.component.css']
})
export class ReglasTributariasComponent implements OnInit {
  agregarReglaTributariaForm!: FormGroup;

  public PaisesType2LabelMapping = PaisesType2LabelMapping;
  public listaPaises = Object.values(Paises); 

  public TipoImpuesto2LabelMapping = TipoImpuesto2LabelMapping;
  public listaTiposImpuestos = Object.values(TipoImpuesto);

  tableData: TableRow[] = [];

  tableColumns = [
    {
      name: 'country',
      header: 'País',
      cell: (item: any) => item.pais.toString()
    },
    {
      name: 'tax_type',
      header: 'Tipo Impuesto',
      cell: (item: any) => item.tipo_impuesto.toString()
    },
    {
      name: 'tax_value',
      header: 'Valor',
      cell: (item: any) => item.valor.toString()
    },
  ];

  visibleColumns = ['country', 'tax_type', 'tax_value'];

  assignAction = [
    {
      icon: 'Editar',
      tooltip: 'Editar',
      action: (row: any) => {}
    },
    {
      icon: 'Eliminar',
      tooltip: 'Eliminar',
      action: (row: any) => {}
    }
  ]

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  initializeForm(): void {
    this.agregarReglaTributariaForm = this.formBuilder.group({
      fieldDescripcion: ['', Validators.required],
      fieldValor: ['', [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit() {
    this.initializeForm();
  }

  onSubmit(){

  }
}
