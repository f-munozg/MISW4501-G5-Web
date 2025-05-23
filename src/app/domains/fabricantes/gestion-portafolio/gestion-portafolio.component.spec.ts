/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { GestionPortafolioComponent, TableRow } from './gestion-portafolio.component';
import { GestionPortafolioService } from './gestion-portafolio.service';
import { FabricantesModule } from '../fabricantes.module';
import { of, throwError } from 'rxjs';
import { FabricantePortafolioResponse, FabricantesResponse } from '../fabricantes.model';
import { Producto } from '../../productos/producto.model';
import { TableTemplateComponent } from 'src/app/shared/table-template/table-template.component';

describe('GestionPortafolioComponent', () => {
  let component: GestionPortafolioComponent;
  let fixture: ComponentFixture<GestionPortafolioComponent>;
  let service: GestionPortafolioService;
  let httpMock: HttpTestingController;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(waitForAsync(async() => {
    await TestBed.configureTestingModule({
      declarations: [ GestionPortafolioComponent ],
      imports: [
        FabricantesModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([])
      ],
      providers:[
        GestionPortafolioService,
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ provider_id: 'test-provider' }),
            snapshot: {
              queryParams: { provider_id: 'test-provider' }
            }
          }
        }
      ]
    })
    .compileComponents();

    service = TestBed.inject(GestionPortafolioService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionPortafolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();

    const req1 = httpMock.expectOne(`${environment.apiUrlProviders}/providers`);
    req1.flush({});

    const req2 = httpMock.expectOne(`${environment.apiUrlProviders}/providers/${component.idFabricanteSeleccionado}`);
    req2.flush({});
  });

  describe('ngOnInit', () => {
    it('should load fabricantes and set idFabricanteSeleccionado from query params', () => {
      const mockFabricantes: FabricantesResponse = {
        providers: [
          { id: '1', name: 'Fabricante 1' },
          { id: '2', name: 'Fabricante 2' }
        ]
      };

      const req1 = httpMock.expectOne(`${environment.apiUrlProviders}/providers`);
      req1.flush(mockFabricantes);

      const req2 = httpMock.expectOne(`${environment.apiUrlProviders}/providers/test-provider`);
      req2.flush({ portfolio: [] });

      component.ngOnInit();

      const req3 = httpMock.expectOne(`${environment.apiUrlProviders}/providers`);
      req3.flush(mockFabricantes);

      const req4 = httpMock.expectOne(`${environment.apiUrlProviders}/providers/test-provider`);
      req4.flush({ portfolio: [] });

      expect(component.listaFabricantes).toEqual(mockFabricantes.providers);
      expect(component.idFabricanteSeleccionado).toBe('test-provider');
    });
  });

  describe('conFabricanteSeleccionado', () => {
    it('should get portafolio and update query params', () => {
      const providerId = 'test-provider';
      const mockPortafolio: FabricantePortafolioResponse = {
        provider: {
          id: '1',
          identification_number: '123',
          name: 'Test',
          address: 'Test Address',
          countries: ['CO'],
          identification_number_contact: '456',
          name_contact: 'Contact',
          phone_contact: '123456',
          address_contact: 'Contact Address'
        },
        portfolio: [
          {
            id: '1',
            sku: 'SKU1',
            name: 'Product 1',
            unit_value: 100,
            storage_conditions: 'Dry',
            product_features: 'Features',
            provider_id: '1',
            estimated_delivery_time: '1 day',
            photo: 'photo.jpg',
            description: 'Description',
            category: 'Category'
          }
        ]
      };

      const mockFabricantes: FabricantesResponse = {
        providers: [
          { id: '1', name: 'Fabricante 1' },
          { id: '2', name: 'Fabricante 2' }
        ]
      };

      const req1 = httpMock.expectOne(`${environment.apiUrlProviders}/providers`);
      req1.flush(mockFabricantes);

      const req2 = httpMock.expectOne(`${environment.apiUrlProviders}/providers/test-provider`);
      req2.flush({ portfolio: [] });

      spyOn(router, 'navigate');

      component.conFabricanteSeleccionado(providerId);

      const req = httpMock.expectOne(`${environment.apiUrlProviders}/providers/${providerId}`);
      req.flush(mockPortafolio);

      expect(component.tableData).toEqual(mockPortafolio.portfolio);
      expect(router.navigate).toHaveBeenCalledWith([], {
        queryParams: { provider_id: providerId },
        queryParamsHandling: 'merge'
      });
    });
  });

  describe('editarProducto', () => {
    it('should navigate to edit product page', () => {
      const productId = '123';
      spyOn(router, 'navigate');

      const mockFabricantes: FabricantesResponse = {
        providers: [
          { id: '1', name: 'Fabricante 1' },
          { id: '2', name: 'Fabricante 2' }
        ]
      };

      const req1 = httpMock.expectOne(`${environment.apiUrlProviders}/providers`);
      req1.flush(mockFabricantes);

      const req2 = httpMock.expectOne(`${environment.apiUrlProviders}/providers/test-provider`);
      req2.flush({ portfolio: [] });

      component.editarProducto(productId);

      expect(router.navigate).toHaveBeenCalledWith(['/productos/editar', productId]);
    });
  });

  describe('eliminarProducto', () => {
    it('should call delete service and refresh table data', () => {
      const productId = '123';
      const mockDeletedProduct: Producto = {
        id: '123',
        sku: 'DELETED-SKU',
        name: 'Deleted Product',
        unit_value: 0,
        storage_conditions: '',
        product_features: '',
        provider_id: '1',
        estimated_delivery_time: '',
        photo: '',
        description: '',
        category: ''
      };
      
      const mockFabricantes: FabricantesResponse = {
        providers: [
          { id: '1', name: 'Fabricante 1' },
          { id: '2', name: 'Fabricante 2' }
        ]
      };

      const req1 = httpMock.expectOne(`${environment.apiUrlProviders}/providers`);
      req1.flush(mockFabricantes);

      const req2 = httpMock.expectOne(`${environment.apiUrlProviders}/providers/test-provider`);
      req2.flush({ portfolio: [] });

      spyOn(service, 'eliminarProducto').and.returnValue(of(mockDeletedProduct));
      spyOn(component, 'refrescarTableData');
  
      component.eliminarProducto(productId);
  
      expect(service.eliminarProducto).toHaveBeenCalledWith(productId);
      expect(component.refrescarTableData).toHaveBeenCalled();
    });  
  });

  describe('refrescarTableData', () => {
    it('should refresh table data with current provider_id', () => {
      const currentId = 'test-provider';
      const mockPortafolio: FabricantePortafolioResponse = {
        provider: {
          id: '1',
          identification_number: '123',
          name: 'Test',
          address: 'Test Address',
          countries: ['CO'],
          identification_number_contact: '456',
          name_contact: 'Contact',
          phone_contact: '123456',
          address_contact: 'Contact Address'
        },
        portfolio: [
          {
            id: '1',
            sku: 'SKU1',
            name: 'Product 1',
            unit_value: 100,
            storage_conditions: 'Dry',
            product_features: 'Features',
            provider_id: '1',
            estimated_delivery_time: '1 day',
            photo: 'photo.jpg',
            description: 'Description',
            category: 'Category'
          }
        ]
      };

      spyOn(router, 'navigate');

      const mockFabricantes: FabricantesResponse = {
        providers: [
          { id: '1', name: 'Fabricante 1' },
          { id: '2', name: 'Fabricante 2' }
        ]
      };

      const req1 = httpMock.expectOne(`${environment.apiUrlProviders}/providers`);
      req1.flush(mockFabricantes);

      const req2 = httpMock.expectOne(`${environment.apiUrlProviders}/providers/test-provider`);
      req2.flush({ portfolio: [] });

      component.refrescarTableData();

      const req = httpMock.expectOne(`${environment.apiUrlProviders}/providers/${currentId}`);
      req.flush(mockPortafolio);

      expect(component.tableData).toEqual(mockPortafolio.portfolio);
      expect(router.navigate).toHaveBeenCalledWith([], {
        relativeTo: route,
        queryParams: { provider_id: currentId },
        queryParamsHandling: 'merge',
        replaceUrl: true
      });
    });
  });

  describe('table configuration', () => {
    it('should have correct table columns configuration', () => {
      const mockFabricantes: FabricantesResponse = {
        providers: [
          { id: '1', name: 'Fabricante 1' },
          { id: '2', name: 'Fabricante 2' }
        ]
      };

      const req1 = httpMock.expectOne(`${environment.apiUrlProviders}/providers`);
      req1.flush(mockFabricantes);

      const req2 = httpMock.expectOne(`${environment.apiUrlProviders}/providers/test-provider`);
      req2.flush({ portfolio: [] });

      expect(component.tableColumns).toBeDefined();
      expect(component.tableColumns.length).toBe(3);
  
      expect(component.tableColumns[0].name).toBe('name');
      expect(component.tableColumns[0].header).toBe('Producto');
      expect(component.tableColumns[0].cell({ name: 'Test Product' } as TableRow)).toBe('Test Product');
  
      expect(component.tableColumns[1].name).toBe('category');
      expect(component.tableColumns[1].header).toBe('Categoría');
      expect(component.tableColumns[1].cell({ category: 'Test Category' } as TableRow)).toBe('Test Category');
  
      expect(component.tableColumns[2].name).toBe('description');
      expect(component.tableColumns[2].header).toBe('Descripción');
      expect(component.tableColumns[2].cell({ description: 'Test Description' } as TableRow)).toBe('Test Description');
    });
  
    it('should have correct visible columns', () => {
      const mockFabricantes: FabricantesResponse = {
        providers: [
          { id: '1', name: 'Fabricante 1' },
          { id: '2', name: 'Fabricante 2' }
        ]
      };

      const req1 = httpMock.expectOne(`${environment.apiUrlProviders}/providers`);
      req1.flush(mockFabricantes);

      const req2 = httpMock.expectOne(`${environment.apiUrlProviders}/providers/test-provider`);
      req2.flush({ portfolio: [] });

      expect(component.visibleColumns).toEqual(['name', 'category', 'description']);
    });
  
    it('should render table columns correctly', () => {
      const mockTableData = [{
        id: '1',
        name: 'Test Product',
        category: 'Test Category',
        description: 'Test Description',
        sku: '',
        unit_value: 0,
        storage_conditions: '',
        product_features: '',
        provider_id: '',
        estimated_delivery_time: '',
        photo: '',
      }];

      const mockFabricantes: FabricantesResponse = {
        providers: [
          { id: '1', name: 'Fabricante 1' },
          { id: '2', name: 'Fabricante 2' }
        ]
      };
    
      const req1 = httpMock.expectOne(`${environment.apiUrlProviders}/providers`);
      req1.flush(mockFabricantes);
    
      const req2 = httpMock.expectOne(`${environment.apiUrlProviders}/providers/test-provider`);
      req2.flush({ portfolio: mockTableData });
    
      fixture.detectChanges();
    
      const tableTemplate = fixture.debugElement.query(By.directive(TableTemplateComponent));
      expect(tableTemplate).toBeTruthy();
    
      const tableComponent = tableTemplate.componentInstance;
      expect(tableComponent.data).toEqual(mockTableData);
      expect(tableComponent.columns).toEqual(component.tableColumns);
      expect(tableComponent.displayedColumns).toEqual(component.visibleColumns);
      expect(tableComponent.actions).toEqual(component.assignAction);
    });
  });

  describe('error handling', () => {
    it('should handle error when loading fabricantes fails', () => {
      spyOn(console, 'error');
      
      const mockFabricantes: FabricantesResponse = {
        providers: [
          { id: '1', name: 'Fabricante 1' },
          { id: '2', name: 'Fabricante 2' }
        ]
      };
    
      const req1 = httpMock.expectOne(`${environment.apiUrlProviders}/providers`);
      req1.flush(mockFabricantes);
    
      const req2 = httpMock.expectOne(`${environment.apiUrlProviders}/providers/test-provider`);
      req2.flush({ portfolio: [] });

      component.ngOnInit();
      
      const req3 = httpMock.expectOne(`${environment.apiUrlProviders}/providers`);
      req3.flush(null, { status: 500, statusText: 'Server Error' });

      const req4 = httpMock.expectOne(`${environment.apiUrlProviders}/providers/test-provider`);
      req4.flush(null, { status: 500, statusText: 'Server Error' });
      
      expect(console.error).toHaveBeenCalledWith('Error loading providers:', jasmine.any(Object));
    });
  
    it('should handle error when loading portafolio fails', () => {
      spyOn(console, 'log');

      const mockFabricantes: FabricantesResponse = {
        providers: [
          { id: '1', name: 'Fabricante 1' },
          { id: '2', name: 'Fabricante 2' }
        ]
      };
    
      const req1 = httpMock.expectOne(`${environment.apiUrlProviders}/providers`);
      req1.flush(mockFabricantes);
    
      const req2 = httpMock.expectOne(`${environment.apiUrlProviders}/providers/test-provider`);
      req2.flush({ portfolio: [] });
      
      const providerId = 'test-provider';
      component.conFabricanteSeleccionado(providerId);
      
      const req = httpMock.expectOne(`${environment.apiUrlProviders}/providers/${providerId}`);
      req.flush(null, { status: 404, statusText: 'Not Found' });
      
      expect(console.log).toHaveBeenCalledWith(jasmine.any(Object));
    });
  
    it('should handle error when deleting product fails', () => {
      const productId = '123';
      spyOn(console, 'error');
      spyOn(service, 'eliminarProducto').and.returnValue(
        throwError(() => new Error('Delete failed'))
      );

      const mockFabricantes: FabricantesResponse = {
        providers: [
          { id: '1', name: 'Fabricante 1' },
          { id: '2', name: 'Fabricante 2' }
        ]
      };
    
      const req1 = httpMock.expectOne(`${environment.apiUrlProviders}/providers`);
      req1.flush(mockFabricantes);
    
      const req2 = httpMock.expectOne(`${environment.apiUrlProviders}/providers/test-provider`);
      req2.flush({ portfolio: [] });
      
      component.eliminarProducto(productId);

      const req = httpMock.expectOne(`${environment.apiUrlProviders}/providers/test-provider`);
      req.flush({ portfolio: [] });
      
      expect(console.error).toHaveBeenCalledWith('Error during deletion', jasmine.any(Error));
    });
  
    it('should handle error when refreshing table data fails', () => {
      const currentId = 'test-provider';
      spyOn(console, 'error');
      
      const mockFabricantes: FabricantesResponse = {
        providers: [
          { id: '1', name: 'Fabricante 1' },
          { id: '2', name: 'Fabricante 2' }
        ]
      };
    
      const req1 = httpMock.expectOne(`${environment.apiUrlProviders}/providers`);
      req1.flush(mockFabricantes);
    
      const req2 = httpMock.expectOne(`${environment.apiUrlProviders}/providers/test-provider`);
      req2.flush({ portfolio: [] });

      component.refrescarTableData();
      
      const req = httpMock.expectOne(`${environment.apiUrlProviders}/providers/${currentId}`);
      req.flush(null, { status: 500, statusText: 'Server Error' });
      
      expect(console.error).toHaveBeenCalledWith(jasmine.any(Object));
    });
  });

  describe('table actions', () => {
    it('should call editarProducto when edit action is clicked', () => {
      const testRow: TableRow = {
        id: '1',
        sku: 'SKU1',
        name: 'Product 1',
        unit_value: 100,
        storage_conditions: 'Dry',
        product_features: 'Features',
        provider_id: '1',
        estimated_delivery_time: '1 day',
        photo: 'photo.jpg',
        description: 'Description',
        category: 'Category'
      };

      const mockFabricantes: FabricantesResponse = {
        providers: [
          { id: '1', name: 'Fabricante 1' },
          { id: '2', name: 'Fabricante 2' }
        ]
      };

      const req1 = httpMock.expectOne(`${environment.apiUrlProviders}/providers`);
      req1.flush(mockFabricantes);

      const req2 = httpMock.expectOne(`${environment.apiUrlProviders}/providers/test-provider`);
      req2.flush({ portfolio: [] });
      
      spyOn(component, 'editarProducto');
      
      const editAction = component.assignAction.find(a => a.tooltip === 'Editar');
      editAction?.action(testRow);
      
      expect(component.editarProducto).toHaveBeenCalledWith('1');
    });

    it('should call eliminarProducto when delete action is clicked', () => {
      const testRow: TableRow = {
        id: '1',
        sku: 'SKU1',
        name: 'Product 1',
        unit_value: 100,
        storage_conditions: 'Dry',
        product_features: 'Features',
        provider_id: '1',
        estimated_delivery_time: '1 day',
        photo: 'photo.jpg',
        description: 'Description',
        category: 'Category'
      };

      const mockFabricantes: FabricantesResponse = {
        providers: [
          { id: '1', name: 'Fabricante 1' },
          { id: '2', name: 'Fabricante 2' }
        ]
      };

      const req1 = httpMock.expectOne(`${environment.apiUrlProviders}/providers`);
      req1.flush(mockFabricantes);

      const req2 = httpMock.expectOne(`${environment.apiUrlProviders}/providers/test-provider`);
      req2.flush({ portfolio: [] });
      
      spyOn(component, 'eliminarProducto');
      
      const deleteAction = component.assignAction.find(a => a.tooltip === 'Eliminar');
      deleteAction?.action(testRow);
      
      expect(component.eliminarProducto).toHaveBeenCalledWith('1');
    });
  });
});