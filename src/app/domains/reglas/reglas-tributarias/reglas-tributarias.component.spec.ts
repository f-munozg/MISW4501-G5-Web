/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ReglasTributariasComponent } from './reglas-tributarias.component';
import { ReglasModule } from '../reglas.module';
import { ReglasTributariasService } from './reglas-tributarias.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('ReglasTributariasComponent', () => {
  let component: ReglasTributariasComponent;
  let fixture: ComponentFixture<ReglasTributariasComponent>;
  let service: ReglasTributariasService;
  let httpMock: HttpTestingController;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReglasTributariasComponent ],
      imports: [ 
        ReglasModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]) 
      ],
      providers:[
        ReglasTributariasService
      ]
    })
    .compileComponents();

    service = TestBed.inject(ReglasTributariasService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReglasTributariasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*
  describe('ngOnInit', () => {
    it('should set idTributo and esModoEdicion if there are any and run initializeForm() and cargarReglas()', () => {
      // Test structure

      // 1. Assign
      // 2. Act
      // 3. Validate
    });
  });

  describe('filtrarReglas', () => {
    it('filtrar works and filters a value', () => {
      // Test structure

      // 1. Assign
      // 2. Act
      // 3. Validate   
    });

    it('filtrar does not filter any value', () => {
      // Test structure

      // 1. Assign
      // 2. Act
      // 3. Validate    
    });
  });
  
  describe('actualizarTabla', () => {
    it('map method brings back data and updates table', () => {
      // Test structure

      // 1. Assign
      // 2. Act
      // 3. Validate    
    });

    it('map method does not bring back data due to error', () => {
      // Test structure

      // 1. Assign
      // 2. Act
      // 3. Validate    
    });
  });

  describe('sonFiltrosValidos', () => {
    it('returns True', () => {
      // Test structure

      // 1. Assign
      // 2. Act
      // 3. Validate
    });

    it('returns False', () => {
      // Test structure

      // 1. Assign
      // 2. Act
      // 3. Validate
    });
  });

  describe('editarTributo', () => {
    it('sonFiltrosValidos returns true and regla returns true', () => {
      // Test structure

      // 1. Assign
      // 2. Act
      // 3. Validate
    });

    it('sonFiltrosValidos returns false', () => {
      // Test structure

      // 1. Assign
      // 2. Act
      // 3. Validate
    });

    it('sonFiltrosValidos returns true and regla returns false', () => {
      // Test structure

      // 1. Assign
      // 2. Act
      // 3. Validate
    });

  });

  describe('puedeEditar', () => {
    it('returns true', () => {
      // Test structure

      // 1. Assign
      // 2. Act
      // 3. Validate
    });

    it('returns false due to fieldPais', () => {
      // Test structure

      // 1. Assign
      // 2. Act
      // 3. Validate
    });

    it('returns false due to fieldTipoImpuesto', () => {
      // Test structure

      // 1. Assign
      // 2. Act
      // 3. Validate
    });
  });

  describe('eliminarTributo', () => {
    it('confirm returns false or cancel', () => {
      // Test structure

      // 1. Assign
      // 2. Act
      // 3. Validate
    });

    it('confirm returns true and record is deleted', () => {
      // Test structure

      // 1. Assign
      // 2. Act
      // 3. Validate
    });

    it('confirm returns true but record is not deleted due to server error', () => {
      // Test structure

      // 1. Assign
      // 2. Act
      // 3. Validate
    });
  });

  describe('onSubmit', () => {
    it('enviando is true so there is a return', () => {
      // Test structure

      // 1. Assign
      // 2. Act
      // 3. Validate
    });

    it('agregarReglaTributariaForm.valid is true and filtroPais and filtroTipoImpuesto as well', () => {
      // Test structure

      // 1. Assign
      // 2. Act
      // 3. Validate
    });

    it('agregarReglaTributariaForm.valid is true but filtroPais or filtroTipoImpuesto is false', () => {
      // Test structure

      // 1. Assign
      // 2. Act
      // 3. Validate
    });

    it('updateTributo is successful and message in mostrarMensajeExito is "Regla tributaria actualizada con éxito"', () => {
      // Test structure

      // 1. Assign
      // 2. Act
      // 3. Validate
    });

    it('updateTributo is unsuccessful and message in mostrarMensajeError is "Error al actualizar la regla tributaria"', () => {
      // Test structure

      // 1. Assign
      // 2. Act
      // 3. Validate
    });

    it('postData is successful and message in mostrarMensajeExito is "Regla tributaria creada exitosamente"', () => {
      // Test structure

      // 1. Assign
      // 2. Act
      // 3. Validate
    });

    it('postData is unsuccessful and message in mostrarMensajeError is "Error creando la regla tributaria"', () => {
      // Test structure

      // 1. Assign
      // 2. Act
      // 3. Validate
    });
  });

  */
});
