import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of, throwError, Observable } from 'rxjs';
import { CargaProductoService } from './carga-producto.service';
import { environment } from '../../../../environments/environment'
import { Producto, ProductosResponse } from '../producto.model';

describe('Service Tests', () => {
  let service: CargaProductoService; 
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let apiUrl = environment.apiUrlProducts + `/products/add`;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post', 'get', 'put']);
    service = new CargaProductoService(httpClientSpy);
  });

  describe('postData', () => {
    it('should convert file to base64 and make POST request with correct data', async () => {
      const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
      const mockFormData = {
        fieldCodigo: 'SKU-456',
        fieldFabricante: '1e1f9b23-8f78-4e02-9afa-0cd4d0e51680',
        fieldValor: '15000',
        fieldFechaVencimiento: '2025-04-02T00:00:00',
        fieldCondicionesAlmacenamiento: 'Probando',
        fieldCategoria: 'ALIMENTACIÓN',
        fieldCaracteristicas: 'Probando',
        fieldDescripcion: 'Probando',
        fieldNombre: 'Arroz',
        imageFile: mockFile
      };

      const mockBase64 = 'base64encodedstring';
      spyOn(service, 'fileToBase64').and.returnValue(Promise.resolve(mockBase64));

      const expectedResponse = { success: true };
      httpClientSpy.post.and.returnValue(of(expectedResponse));

      const result = await service.postData(mockFormData);

      expect(result).toBeInstanceOf(Observable);
      
      result.subscribe(response => {
        expect(response).toEqual(expectedResponse);
      });

      expect(service.fileToBase64).toHaveBeenCalledWith(mockFile);

      const postCallArgs = httpClientSpy.post.calls.first().args;
      const url = postCallArgs[0];
      const body = postCallArgs[1];
      const options = postCallArgs[2] as { headers?: HttpHeaders };

      expect(body).toEqual(jasmine.objectContaining({
        sku: "SKU-456",
        name: "Arroz",
        unit_value: '15000',
        storage_conditions: "Probando",
        product_features: "Probando",
        provider_id: "1e1f9b23-8f78-4e02-9afa-0cd4d0e51680",
        estimated_delivery_time: "2025-04-02T00:00:00",
        description: "Probando",
        category: "ALIMENTACIÓN",
        photo: mockBase64,
      }));

      expect(options?.headers).toBeDefined();
  
      if (!options?.headers) {
        fail('Headers should be defined');
        return;
      }

      const headers = options.headers;
      expect(headers.get('Content-Type')).toBe('application/json');
    });

    it('should handle case when imageFile is not provided', async () => {
      const mockFormData = {
        fieldCodigo: 'SKU-456',
        fieldFabricante: '1e1f9b23-8f78-4e02-9afa-0cd4d0e51680',
        fieldValor: '15000',
        fieldFechaVencimiento: '2025-04-02T00:00:00',
        fieldCondicionesAlmacenamiento: 'Probando',
        fieldCategoria: 'ALIMENTACIÓN',
        fieldCaracteristicas: 'Probando',
        fieldDescripcion: 'Probando',
        fieldNombre: 'Arroz',
      };

      httpClientSpy.post.and.returnValue(of({ success: true }));

      const result = await service.postData(mockFormData);

      result.subscribe(response => {
        expect(response).toEqual({ success: true });
      });

      expect(httpClientSpy.post).toHaveBeenCalledWith(
        jasmine.any(String),
        jasmine.objectContaining({ photo: null }),
        jasmine.any(Object)
      );
    });

    it('should reject when file conversion fails', async () => {
      const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
      const mockFormData = {
        fieldCodigo: 'SKU-456',
        fieldFabricante: '1e1f9b23-8f78-4e02-9afa-0cd4d0e51680',
        fieldValor: '15000',
        fieldFechaVencimiento: '2025-04-02T00:00:00',
        fieldCondicionesAlmacenamiento: 'Probando',
        fieldCategoria: 'ALIMENTACIÓN',
        fieldCaracteristicas: 'Probando',
        fieldDescripcion: 'Probando',
        fieldNombre: 'Arroz',
        imageFile: mockFile
      };

      const mockError = new Error('Conversion failed');
      spyOn(service, 'fileToBase64').and.returnValue(Promise.reject(mockError));

      try {
        await service.postData(mockFormData);
        fail('Expected promise to be rejected');
      } catch (error) {
        expect(error).toEqual(mockError);
      }
    });

    it('should reject when HTTP request fails', async () => {
      const mockFormData = {
        fieldCodigo: 'SKU-456',
        fieldFabricante: '1e1f9b23-8f78-4e02-9afa-0cd4d0e51680',
        fieldValor: '15000',
        fieldFechaVencimiento: '2025-04-02T00:00:00',
        fieldCondicionesAlmacenamiento: 'Probando',
        fieldCategoria: 'ALIMENTACIÓN',
        fieldCaracteristicas: 'Probando',
        fieldDescripcion: 'Probando',
        fieldNombre: 'Arroz',
      };

      const mockError = new Error('HTTP error');
      httpClientSpy.post.and.returnValue(throwError(mockError));

      try {
        const result = await service.postData(mockFormData);
        await result.toPromise(); 
        fail('Expected promise to be rejected');
      } catch (error) {
        expect(error).toEqual(mockError);
      }
    });
  });

  describe('getProductos', () => {
    it('should make GET request to products endpoint', () => {
      const mockResponse: ProductosResponse = { 
        products: [
          { 
            id: '1', 
            sku: 'SKU1',
            name: 'Producto 1',
            unit_value: 1000,
            storage_conditions: 'Seco',
            product_features: 'Probando',
            provider_id: 'provider-1',
            estimated_delivery_time: '2025-01-01',
            photo: 'photo1.jpg',
            description: 'Descripcion Prueba',
            category: 'LIMPIEZA'
          }
        ] 
      };
      
      httpClientSpy.get.and.returnValue(of(mockResponse));

      const result = service.getProductos();

      expect(result).toBeInstanceOf(Observable);
      result.subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.products[0].id).toBe('1');
        expect(response.products[0].sku).toBe('SKU1');
      });

      expect(httpClientSpy.get).toHaveBeenCalledWith(
        `${environment.apiUrlProducts}/products`
      );
    });

    it('should handle GET request errors', () => {
      const mockError = new Error('GET error');
      httpClientSpy.get.and.returnValue(throwError(mockError));

      service.getProductos().subscribe({
        next: () => fail('Expected error but got success'),
        error: (error) => {
          expect(error).toEqual(mockError);
        }
      });
    });
  });

  describe('updateProducto', () => {
    const mockProductId = '123';
    const baseMockFormData = {
      id: mockProductId,
      fieldCodigo: 'SKU-456',
      fieldFabricante: '1e1f9b23-8f78-4e02-9afa-0cd4d0e51680',
      fieldValor: 15000,
      fieldFechaVencimiento: '2025-04-02T00:00:00',
      fieldCondicionesAlmacenamiento: 'Probando',
      fieldCategoria: 'ALIMENTACIÓN',
      fieldCaracteristicas: 'Probando',
      fieldDescripcion: 'Probando',
      fieldNombre: 'Arroz'
    };

    it('should convert file to base64 and make PUT request with correct data', async () => {
      const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
      const mockFormData = { ...baseMockFormData, imageFile: mockFile };
      const mockBase64 = 'base64encodedstring';
      
      spyOn(service, 'fileToBase64').and.returnValue(Promise.resolve(mockBase64));
      const expectedResponse: Producto = { 
        ...baseMockFormData,
        id: mockProductId,
        sku: baseMockFormData.fieldCodigo,
        name: baseMockFormData.fieldNombre,
        unit_value: Number(baseMockFormData.fieldValor),
        storage_conditions: baseMockFormData.fieldCondicionesAlmacenamiento,
        product_features: baseMockFormData.fieldCaracteristicas,
        provider_id: baseMockFormData.fieldFabricante,
        estimated_delivery_time: baseMockFormData.fieldFechaVencimiento,
        photo: mockBase64,
        description: baseMockFormData.fieldDescripcion,
        category: baseMockFormData.fieldCategoria
      };
      
      httpClientSpy.put.and.returnValue(of(expectedResponse));

      const result = await service.updateProducto(mockFormData);

      expect(result).toBeInstanceOf(Observable);
      
      result.subscribe(response => {
        expect(response).toEqual(expectedResponse);
        expect((response as Producto).id).toBe(mockProductId);
      });

      expect(service.fileToBase64).toHaveBeenCalledWith(mockFile);

      expect(httpClientSpy.put).toHaveBeenCalledWith(
        `${environment.apiUrlProducts}/products/${mockProductId}`,
        jasmine.objectContaining({
          sku: baseMockFormData.fieldCodigo,
          name: baseMockFormData.fieldNombre,
          unit_value: Number(baseMockFormData.fieldValor),
          photo: mockBase64
        }),
        jasmine.objectContaining({
          headers: jasmine.any(HttpHeaders)
        })
      );
    });

    it('should handle case when imageFile is not provided but id exists', async () => {
      const expectedResponse: Producto = { 
        ...baseMockFormData,
        id: mockProductId,
        sku: baseMockFormData.fieldCodigo,
        name: baseMockFormData.fieldNombre,
        unit_value: Number(baseMockFormData.fieldValor),
        storage_conditions: baseMockFormData.fieldCondicionesAlmacenamiento,
        product_features: baseMockFormData.fieldCaracteristicas,
        provider_id: baseMockFormData.fieldFabricante,
        estimated_delivery_time: baseMockFormData.fieldFechaVencimiento,
        photo: '',
        description: baseMockFormData.fieldDescripcion,
        category: baseMockFormData.fieldCategoria
      };
      
      httpClientSpy.put.and.returnValue(of(expectedResponse));

      const result = await service.updateProducto(baseMockFormData);

      result.subscribe(response => {
        expect(response).toEqual(jasmine.objectContaining({
          id: mockProductId,
          photo: ''
        }));
      });

      expect(httpClientSpy.put).toHaveBeenCalledWith(
        jasmine.stringContaining(`/products/${mockProductId}`),
        jasmine.objectContaining({ photo: null }),
        jasmine.any(Object)
      );
    });

    it('should reject when file conversion fails', async () => {
      const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
      const mockFormData = { ...baseMockFormData, imageFile: mockFile };
      const mockError = new Error('Conversion failed');
      
      spyOn(service, 'fileToBase64').and.returnValue(Promise.reject(mockError));

      await expectAsync(service.updateProducto(mockFormData))
        .toBeRejectedWith(mockError);
    });

    it('should reject when HTTP request fails', async () => {
      const mockError = new Error('HTTP error');
      httpClientSpy.put.and.returnValue(throwError(mockError));

      try {
        const result = await service.updateProducto(baseMockFormData);
        await result.toPromise();
        fail('Expected promise to be rejected');
      } catch (error) {
        expect(error).toEqual(mockError);
      }
    });
  });

  describe('fileToBase64', () => {
    let originalFileReader: any;
  
    beforeEach(() => {
      originalFileReader = (window as any).FileReader;
    });
  
    afterEach(() => {
      (window as any).FileReader = originalFileReader;
    });
  
    it('should convert file to base64 string', async () => {
      const mockFile = new File(['test content'], 'test.png', { type: 'image/png' });
      const mockBase64Result = 'data:image/png;base64,dGVzdCBjb250ZW50';
  
      const mockReader = {
        result: mockBase64Result,
        readAsDataURL: jasmine.createSpy('readAsDataURL'),
        onload: null as any,
        onerror: null as any
      };

      (window as any).FileReader = jasmine.createSpy('FileReader').and.returnValue(mockReader);
  
      const conversionPromise = service.fileToBase64(mockFile);
  
      setTimeout(() => {
        if (mockReader.onload) {
          mockReader.onload({ target: { result: mockBase64Result } });
        }
      }, 10);
  
      const result = await conversionPromise;
  
      expect(result).toEqual('dGVzdCBjb250ZW50');
      expect(mockReader.readAsDataURL).toHaveBeenCalledWith(mockFile);
    });
  
    it('should reject when file reading fails', async () => {
      const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
      const mockError = new Error('File read error');
  
      const mockReader = {
        readAsDataURL: jasmine.createSpy('readAsDataURL'),
        onload: null as any,
        onerror: null as any
      };
  
      (window as any).FileReader = jasmine.createSpy('FileReader').and.returnValue(mockReader);

      const conversionPromise = service.fileToBase64(mockFile);
  
      setTimeout(() => {
        if (mockReader.onerror) {
          mockReader.onerror(mockError);
        }
      }, 10);
  
      await expectAsync(conversionPromise).toBeRejectedWith(mockError);
      expect(mockReader.readAsDataURL).toHaveBeenCalledWith(mockFile);
    });
  });
});