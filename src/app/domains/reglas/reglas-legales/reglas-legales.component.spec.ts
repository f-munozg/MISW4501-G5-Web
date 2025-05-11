/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelect } from '@angular/material/select';
import { FormBuilder } from '@angular/forms';

import { of, throwError } from 'rxjs';

import { ReglasLegalesComponent, TableRow } from './reglas-legales.component';
import { ReglasModule } from '../reglas.module';
import { ReglasLegalesService } from './reglas-legales.service';
import { Paises, ReglaLegal, ReglaLegalResponse } from '../reglas.model';
import { CategoriaProductos } from '../../productos/producto.model';



describe('ReglasLegalesComponent', () => {
  let component: ReglasLegalesComponent;
  let fixture: ComponentFixture<ReglasLegalesComponent>;
  let service: ReglasLegalesService;
  let httpMock: HttpTestingController;
  let router: Router;
  let route: ActivatedRoute;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let cdRefSpy: jasmine.SpyObj<ChangeDetectorRef>;
  let fb: FormBuilder;

  beforeEach(waitForAsync(() => {
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    cdRefSpy = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

    TestBed.configureTestingModule({
      declarations: [ ReglasLegalesComponent ],
      imports: [ 
        ReglasModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]) 
      ],
      providers:[
        ReglasLegalesService,
        FormBuilder,
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: ChangeDetectorRef, useValue: cdRefSpy, multi: false }
      ]
    })
    .compileComponents();

    service = TestBed.inject(ReglasLegalesService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    fb = TestBed.inject(FormBuilder);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReglasLegalesComponent);
    component = fixture.componentInstance;
    (component as any).cdRef = cdRefSpy;

    component.agregarReglaLegalForm = fb.group({
      fieldDescripcion: [''],
    });

    fixture.detectChanges();
  });

  /*
  afterEach(() => {
    httpMock.verify();
  })
  */

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set idReglaLegal and esModoEdicion if there are any and run initializeForm() and cargarReglas()', () => {
       // 1. Inicialización de datos de prueba
      spyOn(route.snapshot.paramMap, 'get').and.returnValue('123');
      spyOn(component, 'initializeForm');
      spyOn(component, 'cargarReglas');
      
      // 2. Ejecución de métodos/funciones
      component.ngOnInit();
      
      // 3. Validación
      expect(component.idReglaLegal).toBe('123');
      expect(component.esModoEdicion).toBeTrue();
      expect(component.initializeForm).toHaveBeenCalled();
      expect(component.cargarReglas).toHaveBeenCalled();
    });
  });

  describe('cargarReglas', () => {
    it('should load and filter rules successfully', fakeAsync(() => {
      const mockRules = {
        rules: [
          { id: '1', pais: Paises.COLOMBIA, categoria_producto: CategoriaProductos.ROPA, descripcion: 'Test' }
        ]
      };
    
      spyOn(service, 'getListaReglasLegales').and.returnValue(of(mockRules));
      spyOn(component, 'filtrarReglas').and.callThrough();
      spyOn(component, 'actualizarTabla');
      spyOn(router, 'navigate');
    
      component.cargarReglas();
      tick();
    
      expect(component.cargando).toBeFalse();
      expect(component.mensajeError).toBeNull();
      expect(service.getListaReglasLegales).toHaveBeenCalled();
      expect(component.filtrarReglas).toHaveBeenCalledWith(mockRules.rules);
      expect(component.actualizarTabla).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith([], {
        relativeTo: route,
        queryParams: {
          pais: component.filtroPais || null,
          categoria_producto: component.filtroCategoriaProducto || null
        },
        queryParamsHandling: 'merge'
      });
    }));

    it('should handle API errors properly', fakeAsync(() => {
      const mockError = new Error('API failed');
      spyOn(service, 'getListaReglasLegales').and.returnValue(throwError(() => mockError));
      spyOn(console, 'error');
      spyOn(router, 'navigate');
    
      component.cargarReglas();
      tick();
    
      expect(component.cargando).toBeFalse();
      expect(component.mensajeError).toBe('Error cargando las reglas legales');
      expect(console.error).toHaveBeenCalledWith('Error loading rules', mockError);
      expect(router.navigate).toHaveBeenCalled();
    }));
  });

  describe('filtrarReglas', () => {
    it('filtrar works and filters a value', () => {
      component.filtroPais = Paises.COLOMBIA;
      component.filtroCategoriaProducto = CategoriaProductos.ROPA;
      const reglas = [
        { id: '1', pais: Paises.COLOMBIA, categoria_producto: CategoriaProductos.ROPA, descripcion: 'Prueba 1' },
        { id: '2', pais: Paises.ARGENTINA, categoria_producto: CategoriaProductos.ROPA, descripcion: 'Prueba 2' }
      ];
      
      const result = component.filtrarReglas(reglas);
      
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('1');
    });

    it('filtrar does not filter any value', () => {
      component.filtroPais = '';
      component.filtroCategoriaProducto = '';
      const reglas = [
        { id: '1', pais: Paises.COLOMBIA, categoria_producto: CategoriaProductos.ROPA, descripcion: 'Prueba 1' },
        { id: '2', pais: Paises.ARGENTINA, categoria_producto: CategoriaProductos.ROPA, descripcion: 'Prueba 2' }
      ];
      
      const result = component.filtrarReglas(reglas);
      
      expect(result.length).toBe(2);
    });
  });
  
  describe('actualizarTabla', () => {
    it('map method brings back data and updates table', () => {
      const reglas = [
        { id: '1', pais: Paises.COLOMBIA, categoria_producto: CategoriaProductos.ROPA, descripcion: 'Prueba' }
      ];
      
      component.actualizarTabla(reglas);
      
      expect(component.tableData.length).toBe(1);
      expect(component.tableData[0].id).toBe('1');
    });

    it('map method does not bring back data due to error', () => {
      const reglas: any[] = [];
      
      component.actualizarTabla(reglas);
            
      expect(component.tableData.length).toBe(0);
    });
  });

  describe('sonFiltrosValidos', () => {
    it('returns True', () => {
      component.fieldPais = { value: Paises.COLOMBIA } as MatSelect;
      component.fieldCategoriaProducto = { value: CategoriaProductos.ROPA } as MatSelect;
            
      const result = component.sonFiltrosValidos();
            
      expect(result).toBeTrue();
    });

    it('returns False', () => {
      component.fieldPais = { value: null } as MatSelect;
      component.fieldCategoriaProducto = { value: null } as MatSelect;
            
      const result = component.sonFiltrosValidos();
            
      expect(result).toBeFalse();
    });
  });

});
